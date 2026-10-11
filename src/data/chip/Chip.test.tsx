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

  it.each([
    ['static', <Chip key="s">Alpha</Chip>],
    ['selectable', <Chip key="t" selectable>Beta</Chip>],
  ])('%s chip is a MAT content (content-raised) surface', (_kind, ui) => {
    const { container } = render(ui);
    const chip = container.querySelector('[data-ag-part="chip"]')!;
    expect(chip.classList.contains('ag-surface')).toBe(true);
    expect(chip.getAttribute('data-ag-surface')).toBe('');
    expect(chip.getAttribute('data-ag-layer')).toBe('content');
    expect(chip.getAttribute('data-ag-content')).toBe('content-raised');
    expect(chip.hasAttribute('data-ag-material')).toBe(false);
  });

  it('selectable chip composes the CMP ChipToggle seam (Base UI Toggle state attrs)', () => {
    const { container } = render(<Chip selectable defaultSelected>Delta</Chip>);
    const chip = container.querySelector('[data-ag-part="chip"]')!;
    expect(chip.tagName).toBe('BUTTON');
    expect(chip.hasAttribute('data-pressed')).toBe(true);
  });

  it('label names the remove button when children is a ReactNode', () => {
    const { container } = render(
      <Chip label="Revenue" onRemove={() => {}}>
        <strong>Revenue</strong> <span>$12k</span>
      </Chip>,
    );
    const btn = container.querySelector('[data-ag-part="chip-remove"]')!;
    expect(btn.getAttribute('aria-label')).toBe('Remove Revenue');
  });

  it('labels.remove localises the remove verb', () => {
    const { container } = render(
      <Chip onRemove={() => {}} labels={{ remove: 'Entfernen' }}>
        Umsatz
      </Chip>,
    );
    expect(container.querySelector('[data-ag-part="chip-remove"]')!.getAttribute('aria-label')).toBe('Entfernen Umsatz');
  });

  it('dev-warns when a removable chip has no plain-text name', () => {
    const prev = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'development';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      render(
        <Chip onRemove={() => {}}>
          <em>x</em>
        </Chip>,
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Chip: pass `label`'));
    } finally {
      warn.mockRestore();
      process.env['NODE_ENV'] = prev;
    }
  });

  it('intent + size become data attributes', () => {
    const { container } = render(<Chip intent="danger" size="sm">D</Chip>);
    const chip = container.querySelector('[data-ag-part="chip"]')!;
    expect(chip.getAttribute('data-ag-intent')).toBe('danger');
    expect(chip.getAttribute('data-ag-size')).toBe('sm');
  });
});
