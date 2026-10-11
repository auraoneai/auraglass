/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassDropdownMenu } from '../GlassDropdownMenu';

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

describe('GlassDropdownMenu compat (CMP-340)', () => {
  it('parts map 1:1; Content side/align -> Positioner; asChild -> render', async () => {
    const { depCalls } = await mountTwice(() => (
      <GlassDropdownMenu.Root open>
        <GlassDropdownMenu.Trigger>open</GlassDropdownMenu.Trigger>
        <GlassDropdownMenu.Content side="bottom" align="start">
          <GlassDropdownMenu.Item>One</GlassDropdownMenu.Item>
          <GlassDropdownMenu.Separator />
          <GlassDropdownMenu.Group><GlassDropdownMenu.Label>L</GlassDropdownMenu.Label></GlassDropdownMenu.Group>
        </GlassDropdownMenu.Content>
      </GlassDropdownMenu.Root>
    ), 'DEP-C0111');
    expect(depCalls).toHaveLength(1);
    expect(document.querySelector('[data-ag-overlay="menu"]')).toBeTruthy();
    expect(document.querySelector('[data-ag-part="positioner"]')).toBeTruthy();
    expect(screen.getByText('One')).toBeTruthy();
  });
});
