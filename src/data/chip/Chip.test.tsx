/** @jest-environment jsdom */
// SURF-260: selectable toggle, remove button, intents.
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Chip } from './Chip';

describe('Chip (SURF-257, REQ-SURF-88)', () => {
  it('static chip renders a span', () => {
    const { container } = render(<Chip>Alpha</Chip>);
    const chip = container.querySelector('[data-ag-part="chip"]')!;
    expect(chip.tagName).toBe('SPAN');
    expect(chip.getAttribute('aria-pressed')).toBeNull();
  });

  it('selectable chip is a pressed-state button', () => {
    const onSel = jest.fn();
    const { container } = render(
      <Chip selectable defaultSelected onSelectedChange={onSel}>
        Beta
      </Chip>,
    );
    const chip = container.querySelector('[data-ag-part="chip"]')! as HTMLElement;
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(chip);
    expect(onSel).toHaveBeenCalledWith(false);
  });

  it('onRemove renders a named remove button', () => {
    const onRemove = jest.fn();
    const { container } = render(<Chip onRemove={onRemove}>Gamma</Chip>);
    const btn = container.querySelector('[data-ag-part="chip-remove"]')! as HTMLElement;
    expect(btn.getAttribute('aria-label')).toBe('Remove Gamma');
    fireEvent.click(btn);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('intent + size become data attributes', () => {
    const { container } = render(<Chip intent="danger" size="sm">D</Chip>);
    const chip = container.querySelector('[data-ag-part="chip"]')!;
    expect(chip.getAttribute('data-ag-intent')).toBe('danger');
    expect(chip.getAttribute('data-ag-size')).toBe('sm');
  });
});
