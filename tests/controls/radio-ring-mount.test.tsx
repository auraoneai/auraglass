/* REQ-CMP-55: unchecked radio item still renders the ring part. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { RadioGroup } from '../../src/components/radio-group';

describe('radio ring always mounted (REQ-CMP-55)', () => {
  it('unchecked item renders [data-ag-part=indicator]', () => {
    const { container } = render(
      <RadioGroup.Root defaultValue="b" aria-label="x">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const items = container.querySelectorAll("[data-ag-part='item']");
    expect(items).toHaveLength(2);
    for (const it of items) {
      expect(it.querySelector("[data-ag-part='indicator']")).not.toBeNull();
    }
    const [uncheckedItem, checkedItem] = items;
    if (!uncheckedItem || !checkedItem) throw new Error('Expected both radio items');
    expect(uncheckedItem.getAttribute('aria-checked')).toBe('false');
    expect(checkedItem.getAttribute('aria-checked')).toBe('true');
  });
});
