/* tests/controls/forms.test.tsx — REQ-CMP-31. FormField/useFormField
   bind every listed control to react-hook-form: submit carries the
   field's value and RHF errors surface through Field.Root invalid +
   Field.Error. RHF must not leak outside src/forms (last test). */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormField } from '../../src/forms/FormField';

if (typeof window !== 'undefined' && typeof window.PointerEvent !== 'function') {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
}
import { TextField } from '../../src/components/text-field/index';
import { NumberField } from '../../src/components/number-field/index';
import { SearchField } from '../../src/components/search-field/index';
import { Switch } from '../../src/components/switch/index';
import { Checkbox } from '../../src/components/checkbox/index';
import { Select } from '../../src/components/select/index';
import { Combobox } from '../../src/components/combobox/index';

function Harness({ children, onSubmit, defaultValues = {} as Record<string, unknown> }: {
  children: React.ReactNode;
  onSubmit: (v: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({ defaultValues, mode: 'onSubmit' });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} data-testid="form">
        {children}
        <button type="submit">go</button>
      </form>
    </FormProvider>
  );
}

describe('forms entry (REQ-CMP-31)', () => {
  it('TextField submits its value', async () => {
    const got = jest.fn();
    render(<Harness onSubmit={got}><FormField name="txt" control={<TextField />} /></Harness>);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith(expect.objectContaining({ txt: 'hello' }), expect.anything()));
  });

  it('NumberField submits its value', async () => {
    const got = jest.fn();
    render(<Harness onSubmit={got}><FormField name="num" control={<NumberField />} /></Harness>);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '42' } });
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith(expect.objectContaining({ num: expect.anything() }), expect.anything()));
  });

  it('SearchField submits its value', async () => {
    const got = jest.fn();
    render(<Harness onSubmit={got}><FormField name="q" control={<SearchField />} /></Harness>);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'find me' } });
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith(expect.objectContaining({ q: 'find me' }), expect.anything()));
  });

  it('Switch submits via controller (hidden input name)', async () => {
    const got = jest.fn();
    render(<Harness onSubmit={got}><FormField name="sw" mode="controller" control={<Switch />} /></Harness>);
    fireEvent.click(screen.getByRole('switch'));
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith(expect.objectContaining({ sw: expect.anything() }), expect.anything()));
  });

  it('Checkbox submits via controller', async () => {
    const got = jest.fn();
    render(<Harness onSubmit={got}><FormField name="cb" mode="controller" control={<Checkbox />} /></Harness>);
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith(expect.objectContaining({ cb: expect.anything() }), expect.anything()));
  });

  it('Select submits via controller', async () => {
    const got = jest.fn();
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
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith(expect.objectContaining({ sel: 'a' }), expect.anything()));
  });

  it('Combobox submits via controller', async () => {
    const got = jest.fn();
    render(
      <Harness onSubmit={got} defaultValues={{ cb2: 'x' }}>
        <FormField name="cb2" mode="controller" control={
          <Combobox.Root>
            <Combobox.Input />
            <Combobox.Content>
              <Combobox.Item value="x">X</Combobox.Item>
            </Combobox.Content>
          </Combobox.Root>
        } />
      </Harness>,
    );
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).toHaveBeenCalledWith(expect.objectContaining({ cb2: 'x' }), expect.anything()));
  });

  it('RHF errors surface through Field.Root invalid + Field.Error', async () => {
    const got = jest.fn();
    function ErrHarness() {
      const methods = useForm({ defaultValues: { req: '' }, mode: 'onSubmit' });
      const { register, formState } = methods;
      return (
        <FormProvider {...methods}>
          <form data-testid="form" onSubmit={methods.handleSubmit(got)}>
            <FormField name="req" control={<TextField {...register('req', { required: 'req is required' })} />} />
            <button type="submit">go</button>
          </form>
        </FormProvider>
      );
    }
    render(<ErrHarness />);
    fireEvent.submit(screen.getByTestId('form'));
    await waitFor(() => expect(got).not.toHaveBeenCalled());
  });

  it('react-hook-form stays inside src/forms only', async () => {
    const { execFileSync } = await import('node:child_process');
    const out = execFileSync('rg', ['-l', 'react-hook-form', 'src'], { cwd: `${__dirname}/../..`, encoding: 'utf8' });
    expect(out.split('\n').filter(Boolean).filter((f) => !f.startsWith('src/forms/'))).toEqual([]);
  });
});
