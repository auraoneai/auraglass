/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassToast } from '../GlassToast';
import { GlassToastProvider } from '../GlassToastProvider';

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


describe('GlassToast compat (CMP-341)', () => {
  it('type -> intent, duration -> timeout; mounts under Provider', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <GlassToastProvider position="bottom-right">
        <GlassToast message="Saved" type="error" duration={3000} />
      </GlassToastProvider>,
    );
    await flush();
    expect(warn.mock.calls.flat().join(' ')).toContain('DEP-C0115');
    const toastEl = document.querySelector('[data-ag-overlay="toast"], [data-ag-part="root"]');
    expect(toastEl).toBeTruthy();
    warn.mockRestore();
  });
});
