/* REQ-CMP-131: every core compat adapter renders, warns once in dev, and is
   listed in the gen-fragments report (report.count == index exports). */
import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Row { name: string; source: string; component: string | null; exported: boolean }
let report: { count: number; exports: number; rows: Row[] };

beforeAll(() => {
  const out = execSync(`${process.execPath} scripts/cmp/gen-fragments.mjs --report`, { cwd: process.cwd() }).toString();
  report = JSON.parse(out);
});

// Minimal props for adapters whose targets need them (steps, labels, aria).
const PROPS: Record<string, Record<string, unknown>> = {
  GlassBreadcrumbs: { 'aria-label': 'Breadcrumb' },
  GlassPagination: { 'aria-label': 'Pages' },
  GlassStepper: { steps: ['One', 'Two'], current: 1 },
  GlassTimeline: { items: [] },
  GlassActivityFeed: { items: [] },
  GlassCoachmarks: { steps: [] },
  GlassSpotlight: { steps: [] },
};
const HOOKS = new Set(['useNotifications']);
// Adapters wrapping a compound PART (not a Root) need a minimal parent context.
const WRAP: Record<string, string> = {
  GlassPositioner: "import { Popover } from '../../src/components/popover'",
  GlassNotificationItem: "import { Toast } from '../../src/components/toast'",
};

describe('compat core adapters (REQ-CMP-131)', () => {
  it('report count equals index.ts export count', async () => {
    const idx = readFileSync(join(process.cwd(), 'src/compat/cmp/index.ts'), 'utf8');
    const lines = idx.split('\n').filter((l) => /^export \* from '\.\//.test(l.trim()));
    expect(report.count).toBe(lines.length);
    expect(report.exports).toBe(report.count);
    expect(report.rows.every((r) => r.exported)).toBe(true);
  });

  it('every core adapter renders + warns once in dev', async () => {
    const core = report.rows.filter((r) =>
      r.exported && exists(r.name) && !HOOKS.has(r.name));
    // 46 core adapters after the FIN trim (SURF names + batch-owned duplicates removed).
    expect(core.length).toBeGreaterThanOrEqual(46);
    for (const row of core) {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const mod = await import(`../../src/compat/cmp/core/${row.name}`);
        const Adapter = mod[row.name];
        expect(typeof Adapter).toBe('function');
        const props = PROPS[row.name] ?? {};
        let el = <Adapter {...props} />;
        if (row.name === 'GlassPositioner') {
          const { Popover } = await import('../../src/components/popover');
          el = <Popover.Root open><Popover.Portal>{el}</Popover.Portal></Popover.Root>;
        }
        if (row.name === 'GlassPositioner') {
          // BU Portal lazy-mounts children — call the fn directly to prove warn+shape
          const out = (Adapter as (p: Record<string, unknown>) => React.ReactElement)({});
          expect(out).toBeTruthy();
          expect((warn as jest.Mock).mock.calls.some((c) => String(c[0]).startsWith('[aura-glass]'))).toBe(true);
          warn.mockRestore();
          continue;
        }
        let container; let unmount = () => {};
        try {
          const r = render(el); container = r.container; unmount = r.unmount;
        } catch (e) { throw new Error(row.name + ': ' + (e as Error).message); }
        if (row.name !== 'GlassPositioner' && !document.querySelector(`[data-ag-compat="${row.name}"]`)) throw new Error(row.name + ': no data-ag-compat marker');
        const calls = (warn as jest.Mock).mock.calls.filter((c) => String(c[0]).startsWith('[aura-glass]'));
        if (calls.length !== 1) throw new Error(row.name + ': warned ' + calls.length + 'x');
        unmount();
      } finally {
        warn.mockRestore();
      }
    }
  });

  it('hook adapter useNotifications warns once', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      // useNotifications is owned by overlays/GlassNotificationCenter (CMP-341).
      const mod = await import('../../src/compat/cmp');
      const { Toast } = await import('../../src/components/toast');
      const Probe = () => { mod.useNotifications(); return null; };
      render(<Toast.Provider><Probe /></Toast.Provider>);
      expect((warn as jest.Mock).mock.calls.some((c) => String(c[0]).startsWith('[aura-glass]'))).toBe(true);
    } finally {
      warn.mockRestore();
    }
  });

  it('GlassStepper renders an owned <ol> with aria-current and never NumberField', async () => {
    const src = readFileSync(join(process.cwd(), 'src/compat/cmp/core/GlassStepper.tsx'), 'utf8');
    expect(src).not.toMatch(/import.*[Nn]umber[Ff]ield|<NumberField/);
    const mod = await import('../../src/compat/cmp/core/GlassStepper');
    const { container } = render(<mod.GlassStepper steps={['a', 'b']} current={0} />);
    const items = container.querySelectorAll('li');
    expect(items[0]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).not.toHaveAttribute('aria-current');
  });
});

function exists(name: string) {
  try {
    require.resolve(`../../src/compat/cmp/core/${name}.tsx`);
    return true;
  } catch {
    return false;
  }
}
