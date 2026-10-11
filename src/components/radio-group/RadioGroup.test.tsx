/* REQ-CMP-56: ChoiceCards — one role=radio per Card, no nested glass,
   first-enabled is the sole tab stop when uncontrolled. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { RadioGroup } from './index';
import { Card } from '../card';

describe('ChoiceCards (REQ-CMP-56)', () => {
  it('Item render=<Card/> yields exactly one role=radio, Card root IS the radio', () => {
    const { getByRole, container } = render(
      <RadioGroup.Root defaultValue="b" aria-label="p">
        <RadioGroup.Item value="a" render={<Card>Alpha</Card>} />
        <RadioGroup.Item value="b" render={<Card>Beta</Card>} />
      </RadioGroup.Root>,
    );
    const radios = container.querySelectorAll('[role="radio"]');
    expect(radios).toHaveLength(2);
    const radio = getByRole('radio', { name: 'Alpha' });
    /* Card root = the radio element itself (BU render replaces the node) */
    expect(radio.className).toContain('ag-card');
    expect(radio.getAttribute('role')).toBe('radio');
  });

  it('no nested glass: only the Card-level surface inside an item', () => {
    const { container } = render(
      <RadioGroup.Root defaultValue="a" aria-label="p">
        <RadioGroup.Item value="a" render={<Card>Alpha</Card>} />
      </RadioGroup.Root>,
    );
    const item = container.querySelector('[role="radio"]')!;
    const surfaces = item.querySelectorAll('[data-ag-surface]');
    /* the item itself may carry the card surface, but nothing inside may */
    for (const s of surfaces) {
      expect(s).toBe(item);
    }
    expect(item.querySelectorAll('[data-ag-surface]')).toHaveLength(0);
  });

  it('unchecked group: first enabled item is the single tab stop', () => {
    const { container } = render(
      <RadioGroup.Root aria-label="p">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b" disabled>B</RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const radios = [...container.querySelectorAll('[role="radio"]')];
    const tabStops = radios.filter((r) => r.getAttribute('tabindex') !== '-1' && !r.hasAttribute('disabled'));
    expect(tabStops).toHaveLength(1);
    expect(tabStops[0]).toBe(radios[0]);
  });
});
