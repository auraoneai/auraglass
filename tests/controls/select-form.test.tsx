import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Select } from '../../src/components/select';

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
});
