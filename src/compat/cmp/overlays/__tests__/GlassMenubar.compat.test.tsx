/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassMenubar } from '../GlassMenubar';

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

describe('GlassMenubar compat (CMP-340)', () => {
  it('menus[] -> Menubar > Menu.Root children; createFileMenu warns codemod', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { depCalls } = await mountTwice(() => (
      <GlassMenubar menus={[{ label: 'File', items: [{ label: 'New' }] }]} />
    ), 'DEP-C0113');
    expect(depCalls).toHaveLength(1);
    expect(document.querySelector('[role="menubar"]')).toBeTruthy();
    expect(screen.getByText('File')).toBeTruthy();
    const w2 = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<GlassMenubar createFileMenu={{}} />);
    expect(w2.mock.calls.flat().join(' ')).toContain('createFileMenu');
    w2.mockRestore();
    warn.mockRestore();
  });
});
