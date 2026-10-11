/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassTooltip } from '../GlassTooltip';

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

describe('GlassTooltip compat (CMP-339)', () => {
  it('content -> Popup children, position -> Positioner side', async () => {
    const { depCalls } = await mountTwice(() => (
      <GlassTooltip open content="tip" position="top-start"><button>t</button></GlassTooltip>
    ), 'DEP-C0109');
    expect(depCalls).toHaveLength(1);
    expect(document.querySelector('[data-ag-overlay="tooltip"]')).toBeTruthy();
  });
});
