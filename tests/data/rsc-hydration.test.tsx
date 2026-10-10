/** @jest-environment node */
// REQ-SURF-08 — cross-TZ hydration: each fixture renders to a string in a
// spawned node child at TZ=Pacific/Kiritimati (+14), then hydrates in jsdom
// inside a second child at TZ=Pacific/Pago_Pago (-11). Any TZ/locale-dependent
// markup diverges → React emits hydration warnings → the test fails.
// The AppShell fixture additionally hydrates under a seeded
// 'ag-app-shell=sidebar:rail' cookie.
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const HARNESS = join(ROOT, 'tests/data/hydration');
let work = '';

const bundle = (entry: string, out: string) => {
  execFileSync(
    'node',
    [
      '-e',
      `require('esbuild').buildSync({entryPoints:['${entry}'],bundle:true,format:'cjs',platform:'node',outfile:'${out}',external:['react','react-dom','react-dom/*','react/*','jsdom'],logLevel:'silent',absWorkingDir:'${ROOT.replace(/\\/g, '/')}'})`,
    ],
    { cwd: ROOT },
  );
};

const run = (tz: string, script: string, arg: string) =>
  execFileSync('node', [script, arg], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, TZ: tz },
  });

describe('cross-TZ hydration (REQ-SURF-08)', () => {
  beforeAll(() => {
    work = mkdtempSync(join(ROOT, '.ag-hydration-'));
    bundle(join(HARNESS, 'render.tsx'), join(work, 'render.cjs'));
    bundle(join(HARNESS, 'hydrate.tsx'), join(work, 'hydrate.cjs'));
    run('Pacific/Kiritimati', join(work, 'render.cjs'), work);
  }, 120_000);

  afterAll(() => { if (work && existsSync(work)) rmSync(work, { recursive: true, force: true }); });

  it('server render produced every fixture', () => {
    const html = readdirSync(work).filter((f) => f.endsWith('.html'));
    expect({ html: html.sort() }).toEqual({
      html: ['activityfeed.html', 'appshell.html', 'chartframe.html', 'mediatime.html', 'message.html', 'sparkline.html', 'statcard.html', 'timeline.html'].sort(),
    });
  });

  it('hydration at Pago_Pago reports zero warnings', () => {
    const out = JSON.parse(run('Pacific/Pago_Pago', join(work, 'hydrate.cjs'), work));
    const warnings = [
      ...Object.values(out.results ?? {}).flat() as string[],
      ...((out.consoleErrors ?? []) as string[]).filter((e) => /hydrat|mismatch/i.test(e)),
      ...(out.fatal ? [out.fatal] : []),
    ];
    expect({ warnings, fixtureCount: Object.keys(out.results ?? {}).length }).toEqual({ warnings: [], fixtureCount: 8 });
  });

  it('appshell fixture hydrates against the rail cookie without warnings', () => {
    const out = JSON.parse(run('Pacific/Pago_Pago', join(work, 'hydrate.cjs'), work));
    expect({ errors: out.results?.appshell ?? ['missing'] }).toEqual({ errors: [] });
  });
});
