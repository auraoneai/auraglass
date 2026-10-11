/** @jest-environment node */
// REQ-SURF-08 — cross-TZ hydration. Every fixture in tests/data/hydration/
// fixtures.tsx (StatCard, Sparkline, ChartFrame, Timeline, ActivityFeed,
// Message, formatMediaTime, a useMediaElement probe, DateField/TimeField/DatePicker/Calendar, and an
// AppShell restored from a persisted 'sidebar:rail' cookie) renders to a
// string in a spawned node child at TZ=Pacific/Kiritimati (UTC+14), then
// hydrates in jsdom inside a second child at TZ=Pacific/Pago_Pago (UTC−11).
// Any TZ/locale-dependent markup diverges and React reports it. A negative
// control (host-local hour of a fixed instant) must produce a hydration
// error, so a clean run cannot be vacuous.
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import * as React from 'react';
import { renderAgServer } from '../helpers';
import { ChartFrame } from '../../src/data/chart-frame/ChartFrame';

const ROOT = join(__dirname, '../..');
const HARNESS = join(ROOT, 'tests/data/hydration');
const SERVER_TZ = 'Pacific/Kiritimati';
const CLIENT_TZ = 'Pacific/Pago_Pago';
const FIXTURE_NAMES = [
  'statcard', 'sparkline', 'chartframe', 'timeline', 'activityfeed', 'message', 'mediatime', 'media-element',
  'datefield', 'datefield-zoned', 'timefield', 'datepicker', 'calendar', 'appshell-rail',
];

interface FixtureResult { recoverable: string[]; consoleErrors: string[] }
interface HydrateOut {
  timeZone?: string;
  cookie?: string;
  results?: Record<string, FixtureResult>;
  appShell?: { sidebar: string | null; toggleLabel: string | null } | null;
  fatal?: string;
}

let work = '';
let server: { timeZone: string; rendered: string[] };
let client: HydrateOut;
let control: HydrateOut;

function bundle(entry: string, outfile: string) {
  // Bundled in-process; react/react-dom/jsdom stay external so both legs use
  // the repo's single React copy. outfile sits under ROOT so they resolve.
  const esbuild = require('esbuild') as typeof import('esbuild');
  esbuild.buildSync({
    entryPoints: [entry], bundle: true, format: 'cjs', platform: 'node', outfile,
    external: ['react', 'react-dom', 'react-dom/*', 'react/*', 'jsdom'],
    jsx: 'automatic', logLevel: 'silent', absWorkingDir: ROOT,
    define: { 'process.env.NODE_ENV': '"development"' },
  });
}

function run(tz: string, script: string, ...args: string[]): string {
  return execFileSync(process.execPath, [script, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, TZ: tz, NODE_ENV: 'development' },
    maxBuffer: 16 * 1024 * 1024,
  });
}

describe('cross-TZ hydration (REQ-SURF-08)', () => {
  beforeAll(() => {
    // Under the git-ignored .cache/ so a crashed run leaves nothing tracked;
    // still inside ROOT so the bundles resolve react/jsdom from node_modules.
    mkdirSync(join(ROOT, '.cache'), { recursive: true });
    work = mkdtempSync(join(ROOT, '.cache', 'ag-hydration-'));
    bundle(join(HARNESS, 'render.tsx'), join(work, 'render.cjs'));
    bundle(join(HARNESS, 'hydrate.tsx'), join(work, 'hydrate.cjs'));
    server = JSON.parse(run(SERVER_TZ, join(work, 'render.cjs'), work));
    client = JSON.parse(run(CLIENT_TZ, join(work, 'hydrate.cjs'), work, 'fixtures'));
    control = JSON.parse(run(CLIENT_TZ, join(work, 'hydrate.cjs'), work, 'control'));
  }, 180_000);

  afterAll(() => { if (work && existsSync(work)) rmSync(work, { recursive: true, force: true }); });

  it('server leg ran at UTC+14 and rendered every fixture', () => {
    const html = readdirSync(work).filter((f) => f.endsWith('.html')).sort();
    expect({ timeZone: server.timeZone, html }).toEqual({
      timeZone: SERVER_TZ,
      html: [...FIXTURE_NAMES, 'control-host-clock'].map((n) => `${n}.html`).sort(),
    });
  });

  it('client leg at UTC−11 hydrates every fixture with 0 hydration errors and 0 console errors', () => {
    const expected = Object.fromEntries(FIXTURE_NAMES.map((n) => [n, { recoverable: [], consoleErrors: [] }]));
    expect({ fatal: client.fatal, timeZone: client.timeZone, results: client.results }).toEqual({
      fatal: undefined,
      timeZone: CLIENT_TZ,
      results: expected,
    });
  });

  it('AppShell restored from the persisted sidebar:rail cookie stays rail after hydration', () => {
    expect({
      cookie: client.cookie,
      appShell: client.appShell,
    }).toEqual({
      cookie: 'ag-shell-main=sidebar:rail',
      appShell: { sidebar: 'rail', toggleLabel: 'Expand sidebar' },
    });
  });

  it('negative control: a host-TZ dependent render fails hydration (harness is not vacuous)', () => {
    const r = control.results?.['control-host-clock'];
    const messages = [...(r?.recoverable ?? []), ...(r?.consoleErrors ?? [])];
    expect({
      fatal: control.fatal,
      detected: messages.some((m) => /hydrat|did not match|server rendered/i.test(m)),
    }).toEqual({ fatal: undefined, detected: true });
  });
});

// REQ-SURF-92 / REQ-SURF-07 — ChartFrame across the RSC boundary.
type ChartRow = { m: string; a: number };
const CHART = {
  title: 'Revenue',
  data: [{ m: 'Jan', a: 3 }, { m: 'Feb', a: 5 }] as ChartRow[],
  series: [{ key: 'a', label: 'A' }],
  x: { key: 'm', label: 'Month' },
  height: 200,
};
const CLIENT_REF = Symbol.for('react.client.reference');

/** Every client-island element in a server element tree, with the props it receives. */
function islands(node: unknown, out: { name: string; props: Record<string, unknown> }[] = []) {
  if (Array.isArray(node)) { node.forEach((n) => islands(n, out)); return out; }
  if (node === null || typeof node !== 'object' || !('props' in node)) return out;
  const el = node as { type: unknown; props: Record<string, unknown> };
  if (typeof el.type === 'object' && el.type !== null && (el.type as { $$typeof?: symbol }).$$typeof === CLIENT_REF) {
    out.push({ name: (el.type as { name: string }).name, props: el.props });
  }
  islands(el.props['children'], out);
  return out;
}
const functionProps = (props: Record<string, unknown>): string[] =>
  Object.entries(props).filter(([, v]) => typeof v === 'function').map(([k]) => k);

/** ChartFrame's server module evaluated the way an RSC bundler does: React
    under the react-server condition (no client hooks) and the 'use client'
    module replaced by client references. */
function serverChartFrame(): typeof ChartFrame {
  let mod: { ChartFrame: typeof ChartFrame } | undefined;
  jest.isolateModules(() => {
    // package "exports" hide these files; load them by path (the builds the
    // react-server condition resolves to).
    const rs = (f: string) => jest.requireActual(join(ROOT, 'node_modules/react', f));
    jest.doMock('react', () => rs('react.react-server.js'));
    jest.doMock('react/jsx-runtime', () => rs('jsx-runtime.react-server.js'));
    jest.doMock('react/jsx-dev-runtime', () => rs('jsx-dev-runtime.react-server.js'));
    jest.doMock('../../src/data/chart-frame/ChartFrame.Interactive', () => {
      const ref = (name: string) => ({ $$typeof: CLIENT_REF, $$id: `ChartFrame.Interactive#${name}`, name });
      return {
        ChartFrameRoot: ref('ChartFrameRoot'), ChartLegend: ref('ChartLegend'), ChartPlot: ref('ChartPlot'),
        ChartTableToggle: ref('ChartTableToggle'), ChartTable: ref('ChartTable'), useChartContext: ref('useChartContext'),
      };
    });
    mod = require('../../src/data/chart-frame/ChartFrame') as { ChartFrame: typeof ChartFrame };
  });
  jest.dontMock('react');
  return mod!.ChartFrame;
}

describe('ChartFrame RSC pattern (REQ-SURF-92)', () => {
  it('renderAgServer: the element-adapter pattern renders figure, caption, height placeholder and table; the adapter waits for a width', () => {
    function Adapter() {
      const ctx = ChartFrame.useContext<ChartRow>();
      return React.createElement('svg', { 'data-testid': 'adapter', width: ctx.width });
    }
    const { html } = renderAgServer(React.createElement(ChartFrame<ChartRow>, { ...CHART, children: React.createElement(Adapter) }));
    expect(html).toContain('<figure data-ag-part="chart-frame"');
    expect(html).toMatch(/<figcaption[^>]*><span data-ag-part="chart-title">Revenue<\/span>/);
    expect(html).toContain('class="ag-chart-frame__placeholder" style="block-size:200px"');
    expect(html).toContain('<caption>Revenue</caption>');
    expect(html).not.toContain('data-testid="adapter"');
  });

  it('renderAgServer: function children (client-component callers) render without invoking the adapter', () => {
    const adapter = jest.fn(() => null);
    const { html } = renderAgServer(React.createElement(ChartFrame<ChartRow>, { ...CHART, children: adapter }));
    expect(adapter).not.toHaveBeenCalled();
    expect(html).toContain('ag-chart-frame__placeholder');
    expect(html).toContain('data-ag-part="chart-table-toggle"');
  });

  it('server component render: only serializable props reach the client islands (element adapter)', () => {
    const ServerChartFrame = serverChartFrame();
    const adapter = { $$typeof: CLIENT_REF, $$id: 'app#Adapter', name: 'Adapter' };
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const tree = (ServerChartFrame as unknown as (p: object) => unknown)({
        ...CHART,
        legend: 'top',
        children: { $$typeof: Symbol.for('react.transitional.element'), type: adapter, key: null, props: {} },
      });
      const found = islands(tree);
      expect(found.map((i) => i.name)).toEqual(['ChartFrameRoot', 'ChartLegend', 'ChartPlot', 'Adapter', 'ChartTableToggle', 'ChartTable', 'ChartLegend']);
      expect(found.map((i) => ({ name: i.name, fns: functionProps(i.props) })).filter((i) => i.fns.length > 0)).toEqual([]);
      // the figure and caption are server markup, not part of an island
      expect((tree as { type: unknown }).type).toBe('figure');
      expect(err).not.toHaveBeenCalled();
    } finally {
      err.mockRestore();
    }
  });

  it('server component render: a function child is a dev error and never crosses to the Plot island', () => {
    const ServerChartFrame = serverChartFrame();
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const tree = (ServerChartFrame as unknown as (p: object) => unknown)({ ...CHART, children: () => null });
      const plot = islands(tree).find((i) => i.name === 'ChartPlot')!;
      expect(plot.props['children']).toBeNull();
      expect(islands(tree).flatMap((i) => functionProps(i.props))).toEqual([]);
      expect(err).toHaveBeenCalledTimes(1);
      expect(String(err.mock.calls[0]![0])).toContain('a function child cannot cross the RSC boundary');
    } finally {
      err.mockRestore();
    }
  });
});
