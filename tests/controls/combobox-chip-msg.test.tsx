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
      <Combobox.Root defaultValue={['a']} items={[{ value: 'a', label: 'Alpha' }]} multiple>
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
      <Combobox.Root defaultValue="a" items={[{ value: 'a', label: 'Alpha' }]}>
        <Combobox.Input />
      </Combobox.Root>,
    );
    expect(container.querySelector("[data-ag-part='clear']")?.getAttribute('aria-label')).toBe('Clear search');
  });
});
