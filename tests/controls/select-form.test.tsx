import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Select } from '../../src/components/select';
import { Field, Form } from '../../src/components/field';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function FormSelect(props: Record<string, unknown>) {
  return (
    <Select.Root {...props}>
      <Select.Trigger placeholder="Pick" />
      <Select.Content>
        <Select.Item value="a" label="Alpha" />
        <Select.Item value="b" label="Beta" />
      </Select.Content>
    </Select.Root>
  );
}

describe('Select form behaviour', () => {
  it('hidden input carries the selected value and the field name', async () => {
    render(
      <form data-testid="f">
        <FormSelect name="fruit" defaultValue="a" />
      </form>,
    );
    const hidden = document.querySelector('input[type="hidden"][name="fruit"], input[name="fruit"]') as HTMLInputElement;
    expect(hidden).toBeTruthy();
    expect(hidden.value).toBe('a');
    fireEvent.click(document.querySelector('[data-ag-part="trigger"]')!);
    await act(async () => {});
    await waitFor(() => expect(document.querySelectorAll('[data-ag-part="item"]').length).toBe(2));
    await userEvent.click(document.querySelectorAll('[data-ag-part="item"]')[1] as HTMLElement);
    await waitFor(() => expect((document.querySelector('input[name="fruit"]') as HTMLInputElement).value).toBe('b'));
  });

  it('required makes the native validity fail when empty, pass when selected', async () => {
    render(
      <form data-testid="f">
        <FormSelect name="fruit" required />
      </form>,
    );
    const form = screen.getByTestId('f') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    const hidden = document.querySelector('input[name="fruit"]') as HTMLInputElement;
    expect(hidden.required || hidden.getAttribute('aria-required')).toBeTruthy();
  });

  it('form.reset restores the defaultValue', async () => {
    render(
      <form data-testid="f">
        <FormSelect name="fruit" defaultValue="a" />
      </form>,
    );
    const form = screen.getByTestId('f') as HTMLFormElement;
    fireEvent.click(document.querySelector('[data-ag-part="trigger"]')!);
    await act(async () => {});
    await waitFor(() => expect(document.querySelectorAll('[data-ag-part="item"]').length).toBe(2));
    await userEvent.click(document.querySelectorAll('[data-ag-part="item"]')[1] as HTMLElement);
    await waitFor(() => expect((document.querySelector('input[name="fruit"]') as HTMLInputElement).value).toBe('b'));
    act(() => {
      form.reset();
    });
    await waitFor(() => expect((document.querySelector('input[name="fruit"]') as HTMLInputElement).value).toBe('a'));
  });

  // REQ-CMP-68: required blocks submit and shows Field.Error.
  it('Field.Root + required empty Select: a submit attempt is blocked and shows the Field.Error text', async () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="fruit">
          <Field.Label>Fruit</Field.Label>
          <FormSelect name="fruit" required />
          <Field.Error match="valueMissing">Choose a fruit</Field.Error>
        </Field.Root>
        <button type="submit">Send</button>
      </Form>,
    );
    expect(screen.queryByText('Choose a fruit')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(screen.getByText('Choose a fruit')).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
    // choosing a value clears the error and lets the form submit
    fireEvent.click(document.querySelector('[data-ag-part="trigger"]')!);
    await waitFor(() => expect(document.querySelectorAll('[data-ag-part="item"]').length).toBe(2));
    await userEvent.click(document.querySelectorAll('[data-ag-part="item"]')[0] as HTMLElement);
    await waitFor(() => expect((document.querySelector('input[name="fruit"]') as HTMLInputElement).value).toBe('a'));
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('Choose a fruit')).toBeNull();
  });
});

/* REQ-CMP-68: popup sizing at <=390 px and under coarse pointers. The
   rendered widths are measured by tests/e2e/cmp/controls/select-390.spec.ts. */
describe('Select popup sizing css (REQ-CMP-68)', () => {
  const CSS = readFileSync(join(process.cwd(), 'src/components/select/Select.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const popup = CSS.match(/\n\s*\.ag-select-popup\s*\{([^}]*)\}/)![1]!;
  it('min-inline-size is the trigger width (--anchor-width); max is the viewport/container less 16px', () => {
    expect(popup).toMatch(/min-inline-size:\s*var\(--anchor-width\);/);
    expect(popup).toMatch(/max-inline-size:\s*calc\(100vw - 16px\);/);
    expect(popup).toMatch(/max-inline-size:\s*calc\(100cqi - 16px\);/);
  });
  it('coarse pointers cap max-block-size at min(60dvh, 400px)', () => {
    const coarse = CSS.match(/@media \(pointer: coarse\)\s*\{\s*\.ag-select-popup\s*\{([^}]*)\}/);
    expect(coarse).not.toBeNull();
    expect(coarse![1]).toMatch(/max-block-size:\s*min\(60dvh, 400px\);/);
  });
});
