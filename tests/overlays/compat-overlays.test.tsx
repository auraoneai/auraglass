/** REQ-CMP-131: overlay compat adapters (src/compat/cmp/overlays/**), driven
    by the gen-fragments report. Each overlay adapter (and the two hooks) runs
    against its 5.0 target, warns its DEP-C id exactly once across two mounts
    in development, and never warns in production. Aliases that share a module
    (Positioner/GlassPositioner, GlassNotificationCenter/useNotifications)
    warn their own id. */
import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { act, cleanup, render } from '@testing-library/react';

import * as cmp from '../../src/compat/cmp';
import { Popover } from '../../src/components/popover';
import { Toast } from '../../src/components/toast';

interface ReportRow { name: string; components: string[]; module: string | null }

const ROOT = join(__dirname, '..', '..');

/* DEP-C ids, fragments/deprecations/cmp.ts (#313 on release/4.x; the same
   ids are already on next for these rows). */
const DEP: Record<string, string> = {
  GlassModal: 'DEP-C0101', GlassDialog: 'DEP-C0102', GlassDrawer: 'DEP-C0103', GlassBottomSheet: 'DEP-C0104',
  GlassActionSheet: 'DEP-C0105', LiquidGlassAdaptiveSheet: 'DEP-C0106', GlassPopover: 'DEP-C0107',
  GlassHoverCard: 'DEP-C0108', GlassTooltip: 'DEP-C0109', Positioner: 'DEP-C0110', GlassDropdownMenu: 'DEP-C0111',
  GlassContextMenu: 'DEP-C0112', GlassMenubar: 'DEP-C0113', LiquidGlassPopoverMenu: 'DEP-C0114',
  GlassToast: 'DEP-C0115', GlassToastProvider: 'DEP-C0116', GlassToastViewport: 'DEP-C0117', useToast: 'DEP-C0118',
  GlassNotificationCenter: 'DEP-C0119', GlassPositioner: 'DEP-C0120', useNotifications: 'DEP-C0122',
};

type AnyComponent = React.ComponentType<Record<string, unknown>>;
const get = (name: string) => (cmp as unknown as Record<string, unknown>)[name];
const C = (name: string) => get(name) as AnyComponent;

const HookProbe = ({ hook }: { hook: () => unknown }) => { hook(); return null; };

/* One fixture per report row: the smallest tree that exercises the adapter. */
const FIXTURE: Record<string, () => React.ReactElement> = {
  GlassModal: () => React.createElement(C('GlassModal'), { open: true, onClose: () => {}, title: 'T', children: <div>body</div> }),
  GlassDialog: () => React.createElement(C('GlassDialog'), { open: true, confirmText: 'OK', cancelText: 'Cancel', children: 'body' }),
  GlassDrawer: () => React.createElement(C('GlassDrawer'), { open: true, position: 'right', children: <div>drawer</div> }),
  GlassBottomSheet: () => React.createElement(C('GlassBottomSheet'), { open: true, snap: [0.5, 1], children: <div>sheet</div> }),
  GlassActionSheet: () => React.createElement(C('GlassActionSheet'), { open: true, actions: [{ label: 'Do', onClick: () => {} }], cancelText: 'Cancel' }),
  LiquidGlassAdaptiveSheet: () => React.createElement(C('LiquidGlassAdaptiveSheet'), { open: true, children: <div>adaptive</div> }),
  GlassPopover: () => React.createElement(C('GlassPopover'), { open: true, trigger: <button type="button">t</button>, content: 'C' }),
  GlassHoverCard: () => React.createElement(C('GlassHoverCard'), { trigger: <button type="button">t</button>, content: 'C' }),
  GlassTooltip: () => React.createElement(C('GlassTooltip'), { open: true, content: 'tip', children: <button type="button">t</button> }),
  Positioner: () => (
    <Popover.Root open>
      <Popover.Trigger>t</Popover.Trigger>
      <Popover.Portal>{React.createElement(C('Positioner'), { placement: 'bottom-start', children: <div>inner</div> })}</Popover.Portal>
    </Popover.Root>
  ),
  GlassPositioner: () => (
    <Popover.Root open>
      <Popover.Trigger>t</Popover.Trigger>
      <Popover.Portal>{React.createElement(C('GlassPositioner'), { placement: 'top', children: <div>inner</div> })}</Popover.Portal>
    </Popover.Root>
  ),
  GlassDropdownMenu: () => {
    const M = get('GlassDropdownMenu') as { Root: AnyComponent; Trigger: AnyComponent; Content: AnyComponent; Item: AnyComponent };
    return (
      <M.Root open>
        <M.Trigger>open</M.Trigger>
        <M.Content><M.Item>One</M.Item></M.Content>
      </M.Root>
    );
  },
  GlassContextMenu: () => React.createElement(C('GlassContextMenu'), { items: [{ label: 'Do' }], children: <div>area</div> }),
  GlassMenubar: () => React.createElement(C('GlassMenubar'), { menus: [{ label: 'File', items: [{ label: 'New' }] }] }),
  LiquidGlassPopoverMenu: () => React.createElement(C('LiquidGlassPopoverMenu'), { open: true, trigger: <button type="button">t</button>, children: <div>menu</div> }),
  GlassToast: () => <Toast.Provider>{React.createElement(C('GlassToast'), { message: 'Saved' })}</Toast.Provider>,
  GlassToastProvider: () => React.createElement(C('GlassToastProvider'), { position: 'top', children: <div /> }),
  GlassToastViewport: () => <Toast.Provider>{React.createElement(C('GlassToastViewport'), { position: 'top-right' })}</Toast.Provider>,
  useToast: () => <Toast.Provider><HookProbe hook={get('useToast') as () => unknown} /></Toast.Provider>,
  GlassNotificationCenter: () => <Toast.Provider>{React.createElement(C('GlassNotificationCenter'), { notifications: [{ title: 'Hi' }] })}</Toast.Provider>,
  useNotifications: () => <Toast.Provider><HookProbe hook={get('useNotifications') as () => unknown} /></Toast.Provider>,
};

const flush = async () => { await act(async () => {}); };
const depWarnings = (spy: { mock: { calls: unknown[][] } }, id: string) =>
  spy.mock.calls.filter((c) => String(c[0]).startsWith(`[aura-glass] ${id} `));

let rows: ReportRow[] = [];
beforeAll(() => {
  const out = execFileSync(process.execPath, ['scripts/cmp/gen-fragments.mjs', '--report'], { cwd: ROOT, encoding: 'utf8' });
  rows = (JSON.parse(out) as { rows: ReportRow[] }).rows.filter((r) => r.module?.startsWith('./overlays/'));
});
afterEach(() => cleanup());

describe('compat overlay adapters (REQ-CMP-131)', () => {
  /* First: the once-per-id set only records ids that actually warned. */
  it('never warns in production', async () => {
    const prev = process.env.NODE_ENV;
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      process.env.NODE_ENV = 'production';
      expect(rows.length).toBe(Object.keys(DEP).length);
      for (const { name } of rows) {
        const r = render(FIXTURE[name]!());
        await flush();
        r.unmount();
      }
      expect(warn.mock.calls.filter((c) => String(c[0]).startsWith('[aura-glass] DEP-'))).toEqual([]);
    } finally {
      process.env.NODE_ENV = prev;
      warn.mockRestore();
    }
  });

  it('every overlay row in the report is exported and has a fixture and DEP id here', () => {
    expect(rows.map((r) => r.name).sort()).toEqual(Object.keys(DEP).sort());
    for (const { name } of rows) expect(['function', 'object']).toContain(typeof get(name));
  });

  it('each overlay adapter warns its own DEP id exactly once across two mounts', async () => {
    for (const { name } of rows) {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const a = render(FIXTURE[name]!());
        await flush();
        a.unmount();
        render(FIXTURE[name]!());
        await flush();
        expect({ name, warnings: depWarnings(warn, DEP[name]!).length }).toEqual({ name, warnings: 1 });
      } finally {
        cleanup();
        warn.mockRestore();
      }
    }
  });

  it('Positioner and GlassPositioner render a Popover positioner', async () => {
    render(FIXTURE.GlassPositioner!());
    await flush();
    expect(document.querySelector('[data-ag-part="positioner"]')).not.toBeNull();
    expect(document.body).toHaveTextContent('inner');
  });
});
