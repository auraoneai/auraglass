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
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

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
