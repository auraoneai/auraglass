/** REQ-CMP-135: 4.x prop surface the frozen consumer-4x cmp cases use
    (tests/fixtures/consumer-4x/cases/cmp/settings-form.tsx) — the compat
    adapters must honour these props instead of dropping them, so the cases
    behave the same after `migrate 4to5` routes them through aura-glass/compat. */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  GlassCheckbox,
  GlassInput,
  GlassSelectCompound,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassSelectContent,
  GlassSelectItem,
} from '../../src/compat/cmp';

// jsdom lacks PointerEvent; Base UI dispatches it on activation.
if (typeof window.PointerEvent !== 'function') {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
}

let warn: ReturnType<typeof jest.spyOn>;
beforeEach(() => { warn = jest.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { warn.mockRestore(); });

describe('GlassCheckbox onCheckedChange (4.x direct-value handler)', () => {
  it('calls onCheckedChange with the boolean and onChange with the 4.x event shape', () => {
    const onCheckedChange = jest.fn();
    const onChange = jest.fn();
    render(<GlassCheckbox label="Updates" onCheckedChange={onCheckedChange} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledWith({ target: { checked: true } });
  });

  it('onCheckedChange alone is enough to observe changes', () => {
    const onCheckedChange = jest.fn();
    render(<GlassCheckbox label="Updates" defaultChecked onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});

describe('GlassInput state (4.x validation state)', () => {
  it.each(['error', 'invalid'])('state=%s marks the field invalid', (state) => {
    render(<GlassInput label="Email" state={state} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('state=default leaves the field valid', () => {
    render(<GlassInput label="Email" state="default" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid', 'true');
  });
});

describe('GlassSelectCompound root + GlassSelectValue placeholder', () => {
  const ROLES = ['admin', 'editor', 'viewer'];
  function Form({ value }: { value?: string }) {
    return (
      <GlassSelectCompound {...(value !== undefined ? { value } : {})} name="role">
        <GlassSelectTrigger>
          <GlassSelectValue placeholder="Choose a role" />
        </GlassSelectTrigger>
        <GlassSelectContent>
          {ROLES.map((r) => <GlassSelectItem key={r} value={r}>{r}</GlassSelectItem>)}
        </GlassSelectContent>
      </GlassSelectCompound>
    );
  }

  it('renders <GlassSelectCompound> itself as the select root', async () => {
    render(<Form />);
    await act(async () => {});
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('shows the placeholder while nothing is selected', async () => {
    render(<Form />);
    await act(async () => {});
    expect(screen.getByRole('combobox')).toHaveTextContent('Choose a role');
  });

  it('shows the selected value, not the placeholder, once a value is set', async () => {
    render(<Form value="editor" />);
    await act(async () => {});
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('editor');
    expect(trigger).not.toHaveTextContent('Choose a role');
  });
});
