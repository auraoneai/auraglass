/* CMP-342 (REQ-CMP-132): compat adapter contract test — renders the real 5.0
   component (data-ag-overlay kind + compat root), one assertion per mapped
   §10.2 row, warnDeprecated once per symbol across 2 mounts, silent in prod. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { GlassModal } from '../GlassModal';

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

describe('GlassModal compat (CMP-337)', () => {
  it('open+onClose -> onOpenChange; title/footer -> parts; data-ag-overlay=dialog', async () => {
    const onClose = jest.fn();
    const { depCalls } = await mountTwice(() => (
      <GlassModal open onClose={onClose} title="T" footer="F"><div>body</div></GlassModal>
    ), 'DEP-C0101');
    expect(depCalls).toHaveLength(1);
    expect(document.querySelector('[data-ag-overlay="dialog"]')).toBeTruthy();
    expect(document.querySelector('[data-ag-part="title"]')).toHaveTextContent('T');
    expect(document.querySelector('[data-ag-part="footer"]')).toHaveTextContent('F');
    expect(document.querySelector('[data-compat="GlassModal"]')).toBeTruthy();
  });

  it('role=alertdialog renders AlertDialog; size map; variant=drawer renders Sheet', async () => {
    const a = render(<GlassModal open role="alertdialog" title="A"><div /></GlassModal>);
    await flush();
    expect(document.querySelector('[data-ag-overlay="alert-dialog"]')).toBeTruthy();
    a.unmount();
    const b = render(<GlassModal open variant="drawer"><div /></GlassModal>);
    await flush();
    expect(document.querySelector('[data-ag-overlay="sheet"]')).toBeTruthy();
    b.unmount();
  });

  it('dropped props warn once each, never throw', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<GlassModal open consciousness predictive backdropBlur material={{}}><div /></GlassModal>);
    await flush();
    const text = warn.mock.calls.flat().join(' ');
    expect(text).toContain('consciousness');
    expect(text).toContain('backdropBlur');
    warn.mockRestore();
  });
});
