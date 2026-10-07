import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { RadioGroup } from './index';

beforeAll(() => {
  if (typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

describe('RadioGroup (CMP-129)', () => {
  it('one tab stop; arrows move and select, wrapping', async () => {
    render(
      <RadioGroup.Root defaultValue="a" aria-label="opts">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const group = screen.getByRole('radiogroup', { name: 'opts' });
    const radios = screen.getAllByRole('radio');
    const tabbable = radios.filter((r) => r.getAttribute('tabindex') !== '-1');
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]!).toBe(radios[0]);
    tabbable[0]!.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'B' })).toBeChecked();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'A' })).toBeChecked();
    expect(group).toBeTruthy();
  });

  it('emits parts root/item/indicator/label/hit-area', () => {
    const { container } = render(
      <RadioGroup.Root defaultValue="a" aria-label="x">
        <RadioGroup.Item value="a">Alpha</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    for (const p of ['root', 'item', 'indicator', 'label', 'hit-area']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });

  it('forwards onValueChange with details', async () => {
    const spy = jest.fn();
    render(
      <RadioGroup.Root onValueChange={spy} aria-label="x">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'B' }));
    expect(spy).toHaveBeenCalledWith('b', expect.objectContaining({ reason: expect.any(String) }));
  });
});
