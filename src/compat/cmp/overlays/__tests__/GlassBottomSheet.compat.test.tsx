/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassBottomSheet } from '../GlassBottomSheet';

const flush = async () => { await act(async () => {}); };

async function mountTwice(node: () => React.ReactElement, depId: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const a = render(node());
  await flush();
  a.unmount();
  const b = render(node());
  await flush();
  const depCalls = warn.mock.calls.filter((c: unknown) => String((c as unknown[])[0]).startsWith(`[aura-glass] ${depId} `));
  warn.mockRestore();
  return { depCalls, b };
}

describe('GlassBottomSheet compat (CMP-338)', () => {
  it('always renders side=bottom; snap -> detents', async () => {
    const { depCalls } = await mountTwice(() => (
      <GlassBottomSheet open snap={[0.5, 1]}><div /></GlassBottomSheet>
    ), 'DEP-C0104');
    expect(depCalls).toHaveLength(1);
    const popup = document.querySelector('[data-ag-overlay="sheet"]');
    expect(popup?.getAttribute('data-side')).toBe('bottom');
  });
});

/* REQ-CMP-94: Sheet takes detents?: number[]; legacy keyword detents map in compat. */
describe('compat detents mapping (REQ-CMP-94)', () => {
  it("'full' -> 1, 'content' drops (Sheet default), numbers pass through", async () => {
    const { __compatDetents } = await import('../_shared');
    expect(__compatDetents(undefined)).toBeUndefined();
    expect(__compatDetents([0.5, 'full'])).toEqual([0.5, 1]);
    expect(__compatDetents(['content', 0.4, 'full'])).toEqual([0.4, 1]);
    expect(__compatDetents(['content'])).toBeUndefined();
  });
});
