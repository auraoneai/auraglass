/* REQ-CMP-65: selected item labels resolve before the popup opens; the
   positioner takes side=bottom / align=start with the shared 8/8 collision
   contract, and aligns the selected item with the trigger only at a fine
   pointer (alignItemWithTrigger=false at a coarse pointer). jsdom has no
   layout, so Base UI's item-alignment cannot be observed from geometry; the
   Positioner is wrapped (pass-through to the real Base UI part) to capture
   the props CMP hands it. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { act, render } from '@testing-library/react';

const positionerProps: Array<Record<string, unknown>> = [];

jest.mock('@base-ui/react/select', () => {
  const R = require('react');
  const actual = jest.requireActual('@base-ui/react/select') as { Select: Record<string, unknown> };
  const RealPositioner = actual.Select.Positioner as React.ElementType;
  const Positioner = R.forwardRef((p: Record<string, unknown>, ref: unknown) => {
    positionerProps.push(p);
    return R.createElement(RealPositioner, { ...p, ref });
  });
  return { ...actual, Select: { ...actual.Select, Positioner } };
});

import { Select } from '../../src/components/select';

const realMatchMedia = window.matchMedia;
function pointer(kind: 'fine' | 'coarse') {
  window.matchMedia = ((query: string) => ({
    matches: query === '(pointer: fine)' ? kind === 'fine' : query === '(pointer: coarse)' ? kind === 'coarse' : false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

async function openSelect() {
  positionerProps.length = 0;
  render(
    <Select.Root defaultOpen defaultValue="a" items={{ a: 'Alpha', b: 'Beta' }}>
      <Select.Trigger aria-label="Fruit" />
      <Select.Content>
        <Select.Item value="a">Alpha</Select.Item>
        <Select.Item value="b">Beta</Select.Item>
      </Select.Content>
    </Select.Root>,
  );
  await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
  expect(positionerProps.length).toBeGreaterThan(0);
  return positionerProps[positionerProps.length - 1]!;
}

describe('Select selected label', () => {
  it('shows the item label before opening', () => {
    const { getByRole } = render(
      <Select.Root defaultValue="b" items={{ b: 'Beta' }}>
        <Select.Trigger />
      </Select.Root>,
    );
    expect(getByRole('combobox')).toHaveTextContent('Beta');
  });
});

describe('Select positioner (REQ-CMP-65)', () => {
  afterEach(() => { window.matchMedia = realMatchMedia; });

  it('coarse pointer: alignItemWithTrigger=false; side bottom / align start; sideOffset 8, collisionPadding 8', async () => {
    pointer('coarse');
    const p = await openSelect();
    expect(p.alignItemWithTrigger).toBe(false);
    expect(p.side).toBe('bottom');
    expect(p.align).toBe('start');
    expect(p.sideOffset).toBe(8);
    expect(p.collisionPadding).toBe(8);
    expect(p.collisionAvoidance).toEqual({ side: 'flip', align: 'shift' });
    // Base UI received and applied the 8px main-axis offset
    const el = document.querySelector<HTMLElement>('[data-ag-part="positioner"]')!;
    expect(el.getAttribute('data-side')).toBe('bottom');
    expect(el.style.transform).toContain('8px');
  });

  it('fine pointer: alignItemWithTrigger=true', async () => {
    pointer('fine');
    const p = await openSelect();
    expect(p.alignItemWithTrigger).toBe(true);
    expect(p.sideOffset).toBe(8);
    expect(p.collisionPadding).toBe(8);
  });
});
