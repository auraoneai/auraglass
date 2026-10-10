/* tests/controls/forms.test.tsx — REQ-CMP-31 (REQ-FIN-71). The './forms'
   entry (FormField/useFormField) binds every listed control to
   react-hook-form:
   - native-input controls (TextField, NumberField, SearchField) register
     their inner <input> by ref;
   - hidden-input controls (Switch, Checkbox, Select, Combobox) bind through
     an RHF Controller, and their hidden <input name> carries the value too;
   - RHF errors are shown through Field.Root invalid + Field.Error.
   RHF must not leak outside src/forms/** (last test). */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { FormField } from '../../src/forms/FormField';
import * as formsEntry from '../../src/forms/index';
import { TextField } from '../../src/components/text-field/index';
import { NumberField } from '../../src/components/number-field/index';
import { SearchField } from '../../src/components/search-field/index';
import { Switch } from '../../src/components/switch/index';
import { Checkbox } from '../../src/components/checkbox/index';
import { Select } from '../../src/components/select/index';
import { Combobox } from '../../src/components/combobox/index';

if (typeof window !== 'undefined' && typeof window.PointerEvent !== 'function') {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
}

type Values = Record<string, unknown>;
type SubmitFn = (values: Values) => void;

function Harness({ children, onSubmit, defaultValues = {} }: {
  children: React.ReactNode;
  onSubmit: SubmitFn;
  defaultValues?: Values;
}) {
  const methods = useForm<Values>({ defaultValues, mode: 'onSubmit' });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((v) => onSubmit(v))} data-testid="form">
        {children}
        <button type="submit">go</button>
      </form>
    </FormProvider>
  );
}

async function submitAndGet(got: jest.Mock<SubmitFn>): Promise<Values> {
  fireEvent.submit(screen.getByTestId('form'));
  await waitFor(() => expect(got).toHaveBeenCalledTimes(1));
  return got.mock.calls[0]![0];
}

function hiddenInput(name: string): HTMLInputElement {
  const el = screen.getByTestId('form').querySelector<HTMLInputElement>(`input[name="${name}"]`);
  expect(el).not.toBeNull();
  return el!;
}

describe('forms entry (REQ-CMP-31)', () => {
  it('exports FormField and useFormField', () => {
    expect(typeof formsEntry.FormField).toBe('function');
    expect(typeof formsEntry.useFormField).toBe('function');
  });

  it('TextField (native input) submits the typed value', async () => {
    const got = jest.fn<SubmitFn>();
    render(<Harness onSubmit={got}><FormField name="txt" control={<TextField />} /></Harness>);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(await submitAndGet(got)).toEqual({ txt: 'hello' });
  });

  it('NumberField (native input) submits the typed value', async () => {
    const got = jest.fn<SubmitFn>();
    render(<Harness onSubmit={got}><FormField name="num" control={<NumberField />} /></Harness>);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '42' } });
    expect(await submitAndGet(got)).toEqual({ num: '42' });
  });

  it('SearchField (native input) submits the typed value', async () => {
    const got = jest.fn<SubmitFn>();
    render(<Harness onSubmit={got}><FormField name="q" control={<SearchField />} /></Harness>);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'find me' } });
    expect(await submitAndGet(got)).toEqual({ q: 'find me' });
  });

  it('Switch (hidden input) submits its toggled state', async () => {
    const user = userEvent.setup();
    const got = jest.fn<SubmitFn>();
    render(
      <Harness onSubmit={got} defaultValues={{ sw: false }}>
        <FormField name="sw" mode="controller" control={<Switch />} />
      </Harness>,
    );
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    expect(hiddenInput('sw').checked).toBe(true);
    expect(await submitAndGet(got)).toEqual({ sw: true });
  });

  it('Checkbox (hidden input) submits its toggled state', async () => {
    const user = userEvent.setup();
    const got = jest.fn<SubmitFn>();
    render(
      <Harness onSubmit={got} defaultValues={{ cb: false }}>
        <FormField name="cb" mode="controller" control={<Checkbox />} />
      </Harness>,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    expect(hiddenInput('cb').checked).toBe(true);
    expect(await submitAndGet(got)).toEqual({ cb: true });
  });

  it('Select (hidden input) submits the picked option', async () => {
    const user = userEvent.setup();
    const got = jest.fn<SubmitFn>();
    render(
      <Harness onSubmit={got} defaultValues={{ sel: 'a' }}>
        <FormField name="sel" mode="controller" control={
          <Select.Root>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="a">A</Select.Item>
              <Select.Item value="b">B</Select.Item>
            </Select.Content>
          </Select.Root>
        } />
      </Harness>,
    );
    fireEvent.click(screen.getByRole('combobox'));
    await act(async () => {});
    const b = Array.from(document.querySelectorAll<HTMLElement>('[data-ag-part="item"]'))
      .find((el) => el.textContent === 'B');
    expect(b).toBeDefined();
    await user.click(b!);
    await waitFor(() => expect(hiddenInput('sel').value).toBe('b'));
    expect(await submitAndGet(got)).toEqual({ sel: 'b' });
  });

  it('Combobox (hidden input) submits the picked option', async () => {
    const user = userEvent.setup();
    const got = jest.fn<SubmitFn>();
    render(
      <Harness onSubmit={got} defaultValues={{ cb2: null }}>
        <FormField name="cb2" mode="controller" control={
          <Combobox.Root>
            <Combobox.Input aria-label="fruit" />
            <Combobox.Content>
              <Combobox.Item value="x">Xenia</Combobox.Item>
              <Combobox.Item value="y">Yuzu</Combobox.Item>
            </Combobox.Content>
          </Combobox.Root>
        } />
      </Harness>,
    );
    await user.type(screen.getByLabelText('fruit'), 'Y');
    const yuzu = await screen.findByRole('option', { name: 'Yuzu' });
    await user.click(yuzu);
    await waitFor(() => expect(hiddenInput('cb2').value).toBe('y'));
    expect(await submitAndGet(got)).toEqual({ cb2: 'y' });
  });

  it('RHF errors are shown through Field.Root invalid + Field.Error and block submit (native)', async () => {
    const got = jest.fn<SubmitFn>();
    render(
      <Harness onSubmit={got} defaultValues={{ req: '' }}>
        <FormField name="req" label="Required" rules={{ required: 'req is required' }} control={<TextField />} />
      </Harness>,
    );
    expect(screen.queryByText('req is required')).toBeNull();
    fireEvent.submit(screen.getByTestId('form'));
    const err = await screen.findByText('req is required');
    expect(got).not.toHaveBeenCalled();
    expect(err).toHaveAttribute('data-ag-part', 'error');
    expect(err.closest('[data-invalid]')).not.toBeNull();
    // Fixing the value clears the error and lets the submit through.
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ok' } });
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith({ req: 'ok' }));
    expect(screen.queryByText('req is required')).toBeNull();
  });

  it('RHF errors are shown for a controller-bound control (Checkbox) and block submit', async () => {
    const user = userEvent.setup();
    const got = jest.fn<SubmitFn>();
    render(
      <Harness onSubmit={got} defaultValues={{ terms: false }}>
        <FormField
          name="terms"
          mode="controller"
          rules={{ validate: (v) => v === true || 'accept the terms' }}
          control={<Checkbox />}
        />
      </Harness>,
    );
    fireEvent.submit(screen.getByTestId('form'));
    const err = await screen.findByText('accept the terms');
    expect(got).not.toHaveBeenCalled();
    expect(err.closest('[data-invalid]')).not.toBeNull();
    await user.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith({ terms: true }));
    expect(screen.queryByText('accept the terms')).toBeNull();
  });

  it('react-hook-form is imported only under src/forms/**', () => {
    const root = path.resolve(__dirname, '../..');
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p);
        else if (fs.readFileSync(p, 'utf8').includes('react-hook-form')) offenders.push(path.relative(root, p));
      }
    };
    walk(path.join(root, 'src'));
    const outside = offenders.filter((f) => !f.split(path.sep).join('/').startsWith('src/forms/'));
    expect(offenders.length).toBeGreaterThan(0);
    expect(outside).toEqual([]);
  });
});
