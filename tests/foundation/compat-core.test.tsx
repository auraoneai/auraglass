/** REQ-CMP-131: core and primitive compat adapters (src/compat/cmp/core/**).
    The adapter set is the gen-fragments report (every CMP meta migration row
    with compat: true, PRD-3 §7). Each core adapter renders its 5.0 target,
    calls warnDeprecated with its #313 DEP-C id once per page load in
    development, and never warns in production. */
import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, cleanup, render } from '@testing-library/react';

import * as cmp from '../../src/compat/cmp';

interface ReportRow { name: string; components: string[]; module: string | null }
interface Report {
  count: number; exports: number; modules: number; ok: boolean;
  missing: string[]; orphans: string[]; rows: ReportRow[];
}

const ROOT = join(__dirname, '..', '..');
const report = (): Report => JSON.parse(
  execFileSync(process.execPath, ['scripts/cmp/gen-fragments.mjs', '--report'], { cwd: ROOT, encoding: 'utf8' }),
) as Report;

/* DEP-C ids from the single CMP source, fragments/deprecations/cmp.ts on
   release/4.x (#313, re-homed as #524). They reach next through the REQ-FIN-13
   sync, so they are listed here rather than read from the generated table. */
const DEP: Record<string, string> = {
  GlassCard: 'DEP-C0231', GlowingCard: 'DEP-C0232', WidgetGlass: 'DEP-C0233', GlassWorkspacePanel: 'DEP-C0234',
  GlassBadge: 'DEP-C0235', GlassAvatar: 'DEP-C0239', GlassAvatarGroup: 'DEP-C0240', GlassAlert: 'DEP-C0241',
  GlassProgress: 'DEP-C0242', GlassSkeleton: 'DEP-C0244', GlassLoadingSkeleton: 'DEP-C0245',
  GlassSeparator: 'DEP-C0246', GlassDivider: 'DEP-C0247', GlassEmptyState: 'DEP-C0248',
  GlassErrorState: 'DEP-C0249', GlassLoadingState: 'DEP-C0250', GlassAccordion: 'DEP-C0251',
  GlassScrollArea: 'DEP-C0252', GlassRating: 'DEP-C0253', GlassInlineEdit: 'DEP-C0254',
  GlassFileUpload: 'DEP-C0255', GlassColorPicker: 'DEP-C0256', GlassColorWheel: 'DEP-C0257',
  GlassGradientPicker: 'DEP-C0258', GlassCoachmarks: 'DEP-C0263', GlassSpotlight: 'DEP-C0264',
  GlassStack: 'DEP-C0267', GlassContainer: 'DEP-C0273', GlassSlot: 'DEP-C0275', GlassPortal: 'DEP-C0276',
  GlassFocusScope: 'DEP-C0277', GlassDismissableLayer: 'DEP-C0278', GlassLabelPrimitive: 'DEP-C0279',
  LabelRoot: 'DEP-C0281', GlassStepper: 'DEP-C0282', GlassForm: 'DEP-C0283',
  GlassNotificationItem: 'DEP-C0284', GlassNotificationProvider: 'DEP-C0121', MobileGlassBottomSheet: 'DEP-C0132',
};

/* Minimal valid props per adapter (the 5.0 targets' required props). */
const PROPS: Record<string, Record<string, unknown>> = {
  GlassAvatar: { children: 'AB' },
  GlassBadge: { children: '3' },
  GlassCard: { children: 'Body' }, GlowingCard: { children: 'Body' }, WidgetGlass: { children: 'Body' },
  GlassWorkspacePanel: { children: 'Body' },
  GlassAlert: { children: 'Heads up' },
  GlassProgress: { value: 40, 'aria-label': 'Upload' },
  GlassRating: { 'aria-label': 'Rating' },
  GlassEmptyState: { title: 'Nothing here' },
  GlassErrorState: { title: 'Failed' },
  GlassLoadingState: { label: 'Loading' },
  GlassInlineEdit: { 'aria-label': 'Name', defaultValue: 'Ada' },
  GlassFileUpload: { label: 'Files' },
  GlassStack: { children: 'Row' },
  GlassContainer: { children: 'Wrap' },
  GlassForm: { children: <input aria-label="field" /> },
  GlassSlot: { children: <span>slot child</span> },
  GlassPortal: { children: <span>portal child</span> },
  GlassFocusScope: { children: <button type="button">in scope</button> },
  GlassDismissableLayer: { children: <div>layer</div> },
  GlassLabelPrimitive: { children: 'Label' },
  LabelRoot: { children: 'Label' },
  GlassStepper: { steps: ['Account', 'Billing', 'Done'], current: 1 },
  GlassNotificationItem: { title: 'Saved', message: 'All changes saved', type: 'success' },
  GlassNotificationProvider: { children: <span>app</span> },
  MobileGlassBottomSheet: { open: true, snap: 0.5, children: 'Sheet body' },
  GlassAccordion: { children: null },
};

/* Primitive aliases render the primitive directly (no provenance wrapper). */
const UNWRAPPED = new Set(['GlassSlot', 'GlassPortal', 'GlassFocusScope', 'GlassDismissableLayer',
  'GlassLabelPrimitive', 'LabelRoot']);

let rows: ReportRow[] = [];
beforeAll(() => {
  rows = report().rows.filter((r) => r.module?.startsWith('./core/'));
});
afterEach(() => cleanup());

const Adapter = (name: string): React.ComponentType<Record<string, unknown>> => {
  const C = (cmp as unknown as Record<string, React.ComponentType<Record<string, unknown>> | undefined>)[name];
  if (!C) throw new Error(`src/compat/cmp does not export ${name}`);
  return C;
};
const depWarnings = (spy: { mock: { calls: unknown[][] } }, id: string | undefined) =>
  spy.mock.calls.filter((c) => String(c[0]).startsWith(`[aura-glass] ${id} `));

describe('compat core adapters (REQ-CMP-131)', () => {
  /* Runs first: warnDeprecated records an id only after it warns, so a
     production pass before any development render is not masked by the
     once-per-page-load set. */
  it('never warns in production', () => {
    const prev = process.env.NODE_ENV;
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      process.env.NODE_ENV = 'production';
      expect(rows.length).toBe(Object.keys(DEP).length);
      for (const { name } of rows) {
        const C = Adapter(name);
        render(<C {...(PROPS[name] ?? {})} />).unmount();
      }
      expect(warn.mock.calls.filter((c) => String(c[0]).startsWith('[aura-glass] DEP-'))).toEqual([]);
    } finally {
      process.env.NODE_ENV = prev;
      warn.mockRestore();
    }
  });

  it('gen-fragments --report count equals the compat exports of src/compat/cmp/index.ts', () => {
    const r = report();
    expect(r.missing).toEqual([]);
    expect(r.orphans).toEqual([]);
    expect(r.count).toBe(r.exports);
    expect(r.ok).toBe(true);
  });

  it('every core module in the report has a DEP id and fixture coverage here', () => {
    expect(rows.map((r) => r.name).sort()).toEqual(Object.keys(DEP).sort());
  });

  it('each core adapter renders, warns its DEP id exactly once across two renders', () => {
    for (const { name } of rows) {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const C = Adapter(name);
        expect(typeof C).toBe('function');
        const first = render(<C {...(PROPS[name] ?? {})} />);
        if (!UNWRAPPED.has(name)) {
          expect(document.querySelector(`[data-ag-compat="${name}"]`)).not.toBeNull();
        }
        first.unmount();
        render(<C {...(PROPS[name] ?? {})} />);
        expect({ name, warnings: depWarnings(warn, DEP[name]).length }).toEqual({ name, warnings: 1 });
      } finally {
        cleanup();
        warn.mockRestore();
      }
    }
  });

  it('primitive aliases render their primitive output', () => {
    const { getByText } = render(
      <>
        {React.createElement(Adapter('GlassSlot'), { children: <span>slot child</span> })}
        {React.createElement(Adapter('GlassLabelPrimitive'), { children: 'Email' })}
      </>,
    );
    expect(getByText('slot child').tagName).toBe('SPAN');
    expect(getByText('Email').tagName).toBe('LABEL');
  });

  it('MobileGlassBottomSheet renders a bottom Sheet and maps snap to its detent height', async () => {
    const RO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class { observe() {} disconnect() {} unobserve() {} };
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    try {
      render(React.createElement(Adapter('MobileGlassBottomSheet'), { open: true, snap: 0.5, children: 'Sheet body' }));
      await act(async () => {});
      const popup = document.querySelector<HTMLElement>('[data-ag-overlay="sheet"]');
      expect(popup).not.toBeNull();
      expect(popup).toHaveAttribute('data-ag-side', 'bottom');
      expect(popup).toHaveTextContent('Sheet body');
      // snap 0.5 of an 800px viewport -> a 400px detent
      expect(popup!.style.getPropertyValue('--_ag-sheet-detent-h')).toBe('400px');
    } finally {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RO;
    }
  });

  it('GlassStepper renders an owned <ol> with aria-current="step" and never NumberField', () => {
    const src = readFileSync(join(ROOT, 'src/compat/cmp/core/GlassStepper.tsx'), 'utf8');
    expect(src).not.toMatch(/^import[^;]*(NumberField|number-field)/m);
    expect(src).not.toMatch(/<NumberField/);
    const { container } = render(React.createElement(Adapter('GlassStepper'), { steps: ['a', 'b', 'c'], current: 1 }));
    const ol = container.querySelector('ol');
    expect(ol).not.toBeNull();
    const items = container.querySelectorAll('ol > li');
    expect(items).toHaveLength(3);
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).toHaveAttribute('data-ag-status', 'complete');
    expect(items[2]).toHaveAttribute('data-ag-status', 'upcoming');
    expect(container.querySelector('input')).toBeNull();
  });

  it('GlassNotificationItem maps type="error" to the danger intent', () => {
    const { container } = render(React.createElement(Adapter('GlassNotificationItem'), { title: 'Oops', message: 'Failed', type: 'error' }));
    const root = container.querySelector('[data-ag-compat="GlassNotificationItem"]');
    expect(root).toHaveAttribute('data-ag-intent', 'danger');
    expect(root).toHaveAttribute('role', 'status');
    expect(root).toHaveTextContent('Oops');
    expect(root).toHaveTextContent('Failed');
  });
});
