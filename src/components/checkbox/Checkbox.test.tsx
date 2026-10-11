import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Checkbox, CheckboxGroup } from './index';

beforeAll(() => {
  // jsdom lacks PointerEvent; BU dispatches it on activation.
  if (typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

describe('Checkbox (CMP-124)', () => {
  it('toggles on Space and reports details', async () => {
    const spy = jest.fn();
    render(<Checkbox onCheckedChange={spy} aria-label="agree" />);
    const box = screen.getByRole('checkbox', { name: 'agree' });
    box.focus();
    await userEvent.keyboard(' ');
    expect(spy).toHaveBeenCalledWith(true, expect.objectContaining({ reason: expect.any(String) }));
    expect(box).toHaveAttribute('data-checked');
  });

  it('indeterminate renders aria-checked=mixed and mixed icon', () => {
    render(<Checkbox indeterminate aria-label="partial" />);
    const box = screen.getByRole('checkbox', { name: 'partial' });
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    expect(box.querySelector('[data-ag-part="icon"]')).toBeTruthy();
  });

  it('parent checkbox cycles mixed -> checked -> unchecked in a group', async () => {
    render(
      <CheckboxGroup defaultValue={['a']} allValues={['a', 'b']}>
        <Checkbox parent value="all" aria-label="all" />
        <Checkbox value="a" aria-label="a" />
        <Checkbox value="b" aria-label="b" />
      </CheckboxGroup>,
    );
    const parent = screen.getByRole('checkbox', { name: 'all' });
    expect(parent).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(parent);
    expect(screen.getByRole('checkbox', { name: 'a' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'b' })).toBeChecked();
    await userEvent.click(parent);
    expect(screen.getByRole('checkbox', { name: 'a' })).not.toBeChecked();
  });

  it('emits parts root/indicator/icon/hit-area', () => {
    const { container } = render(<Checkbox aria-label="x" />);
    for (const p of ['root', 'indicator', 'icon', 'hit-area']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });
});
