/* REQ-CMP-69: chip-remove aria-label carries the item label; inline Clear
   uses controlMessage('clearSearch'). */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { Combobox } from '../../src/components/combobox';

describe('combobox messages (REQ-CMP-69)', () => {
  it('chip remove aria-label includes the chip label (prop or children)', () => {
    const { container } = render(
      <Combobox.Root defaultValue={['a']} items={['a']} multiple>
        <Combobox.Chips>
          <Combobox.Chip>Alpha</Combobox.Chip>
          <Combobox.Chip label="Beta">B</Combobox.Chip>
        </Combobox.Chips>
      </Combobox.Root>,
    );
    const removes = [...container.querySelectorAll("[data-ag-part='chip-remove']")];
    const labels = removes.map((r) => r.getAttribute('aria-label'));
    expect(labels).toContain('Remove Alpha');
    expect(labels).toContain('Remove Beta');
  });

  it('inline Clear uses the clearSearch message', () => {
    const { container } = render(
      <Combobox.Root defaultValue="a" items={['a']}>
        <Combobox.Input />
      </Combobox.Root>,
    );
    expect(container.querySelector("[data-ag-part='clear']")?.getAttribute('aria-label')).toBe('Clear search');
  });

  it('standalone Combobox.ChipRemove inside a Chip reads the chip label (REQ-CMP-69/74)', () => {
    const { container } = render(
      <Combobox.Root defaultValue={['Banana', 'Cherry']} items={['Banana', 'Cherry']} multiple>
        <Combobox.Chips>
          <Combobox.Chip>
            Banana
            <Combobox.ChipRemove />
          </Combobox.Chip>
          <Combobox.Chip>
            <span>Cherry</span>
            <Combobox.ChipRemove label="Drop cherry" />
          </Combobox.Chip>
        </Combobox.Chips>
      </Combobox.Root>,
    );
    const chips = [...container.querySelectorAll("[data-ag-part='chip']")];
    /* the composed remove replaces the built-in one: exactly one per chip */
    expect(chips.map((c) => c.querySelectorAll("[data-ag-part='chip-remove']").length)).toEqual([1, 1]);
    const labels = chips.map((c) => c.querySelector("[data-ag-part='chip-remove']")?.getAttribute('aria-label'));
    expect(labels).toEqual(['Remove Banana', 'Remove Drop cherry']);
  });

  it('chip label falls back to nested element text', () => {
    const { container } = render(
      <Combobox.Root defaultValue={['a']} items={['a']} multiple>
        <Combobox.Chips>
          <Combobox.Chip><strong>Alpha</strong> team</Combobox.Chip>
        </Combobox.Chips>
      </Combobox.Root>,
    );
    expect(container.querySelector("[data-ag-part='chip-remove']")?.getAttribute('aria-label')).toBe('Remove Alpha team');
  });
});
