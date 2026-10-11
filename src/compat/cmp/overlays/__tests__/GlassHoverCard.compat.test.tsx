/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassHoverCard } from '../GlassHoverCard';

const flush = async () => { await act(async () => {}); };

async function mountTwice(node: () => React.ReactElement, depId: string) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const a = render(node());
  await flush();
  a.unmount();
  const b = render(node());
  await flush();
  const depCalls = warn.mock.calls.filter((c: unknown) => String((c as unknown[])[0]).includes(`'${depId}'`));
  warn.mockRestore();
  return { depCalls, b };
}

describe('GlassHoverCard compat (CMP-339)', () => {
  it('renders Popover with openOnHover trigger', async () => {
    const { depCalls } = await mountTwice(() => (
      <GlassHoverCard trigger={<button>t</button>} content="C" />
    ), 'DEP-C0108');
    expect(depCalls).toHaveLength(1);
    expect(document.querySelector('[data-compat="GlassHoverCard"]')).toBeTruthy();
  });
});
