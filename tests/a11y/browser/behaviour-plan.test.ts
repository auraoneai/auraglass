/** @jest-environment node */
/* G-17 (REQ-QUAL-19/-20) — unit tests for the parts of the L5 behaviour lane that need no browser: harness step
   messages and impact filtering, location discovery, axe cells, flagship APG coverage, lane-runner double-pass and
   coverage accounting. The browser behaviour itself is __selftest__/harness.selftest.spec.ts (remote). */
import { describe, expect, it } from '@jest/globals';
import { fileURLToPath } from 'node:url';
import {
  announcedMismatch, ApgStepError, blockingViolations, focusMismatch, stateMismatch, FLAGSHIP_BLOCKING_IMPACTS,
  type ActiveSnapshot, type AxeViolationSummary,
} from '../apg/harness';
import { apgCoverage, axeCells, kebab, locationProjects, PREFERENCE_CELLS } from '../../../certification/lanes/_fixtures/behaviour';
import { SCENES } from '../../../src/contracts/testing';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { BUILTINS, locationBuiltins } from '../../../certification/lanes.config';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const STEP_RE = /step \d+: expected .* actual/;

const snap = (over: Partial<ActiveSnapshot> = {}): ActiveSnapshot => ({
  tag: 'button', ownPart: 'trigger', part: 'trigger', role: 'button', name: 'Details', attrs: {}, announcements: [], announcer: true, ...over,
});

describe('harness step messages', () => {
  it('expectFocus by part: match and mismatch', () => {
    expect(focusMismatch('trigger', snap())).toBeNull();
    const m = focusMismatch('thumb', snap());
    expect(m).toBe('expected focus on part "thumb", actual <button> part=trigger role=button name="Details"');
    expect(new ApgStepError(3, m!).message).toMatch(STEP_RE);
    expect(new ApgStepError(3, m!).message.startsWith('step 3: ')).toBe(true);
  });

  it('expectFocus by role[name]', () => {
    expect(focusMismatch('role=button[name=Detail]', snap())).toBeNull();
    expect(focusMismatch('role=button', snap())).toBeNull();
    expect(focusMismatch('role=slider[name=Volume]', snap())).toBe('expected focus on role=slider name~"Volume", actual <button> part=trigger role=button name="Details"');
    expect(focusMismatch('role=', snap())).toMatch(/^expected a valid expectFocus selector/);
  });

  it('nothing focused never matches', () => {
    const body = snap({ tag: null, ownPart: null, part: null, role: null, name: '' });
    expect(focusMismatch('trigger', body)).toBe('expected focus on part "trigger", actual nothing focused (document.body)');
    expect(stateMismatch({ 'aria-expanded': 'true' }, body)).toMatch(/actual nothing focused/);
  });

  it('expectState names the actual value or absence', () => {
    expect(stateMismatch({ 'aria-expanded': 'true' }, snap({ attrs: { 'aria-expanded': 'true' } }))).toBeNull();
    expect(stateMismatch({ 'aria-expanded': 'true' }, snap({ attrs: { 'aria-expanded': 'false' } })))
      .toBe('expected aria-expanded="true" on the focused element, actual aria-expanded="false" on <button> part=trigger role=button name="Details"');
    expect(stateMismatch({ 'data-state': 'open' }, snap({ attrs: { 'data-state': null } }))).toContain('actual data-state=(absent)');
  });

  it('expectAnnounced reports the announcer text or a missing region', () => {
    expect(announcedMismatch('saved', snap({ announcements: ['Draft saved'] }))).toBeNull();
    expect(announcedMismatch('sent', snap({ announcements: ['Draft saved'] }))).toBe('expected announcement containing "sent", actual announcer text ["Draft saved"]');
    expect(announcedMismatch('sent', snap({ announcer: false }))).toBe('expected announcement containing "sent", actual no [data-ag-announcer] [aria-live] region in the page');
  });
});

describe('axe impact filtering', () => {
  const v = (id: string, impact: AxeViolationSummary['impact']): AxeViolationSummary => ({ id, impact, help: id, targets: ['#x'] });
  const all = [v('image-alt', 'critical'), v('color-contrast', 'serious'), v('region', 'moderate'), v('x', 'minor'), v('y', null)];
  it('default blocks serious/critical only', () => {
    expect(blockingViolations(all).map((x) => x.id)).toEqual(['image-alt', 'color-contrast']);
  });
  it('flagships also block moderate', () => {
    expect(blockingViolations(all, FLAGSHIP_BLOCKING_IMPACTS).map((x) => x.id)).toEqual(['image-alt', 'color-contrast', 'region']);
  });
});

describe('location discovery (REQ-QUAL-19)', () => {
  const projects = locationProjects(ROOT);
  it.each(['cmp', 'mat', 'surf'])('tests/a11y/apg/%s and tests/e2e/%s are projects in 3 engines', (stream) => {
    for (const kind of ['apg', 'e2e']) {
      const ps = projects.filter((p) => p.name.startsWith(`${stream}:loc-${kind}-`));
      expect(ps.map((p) => p.engine).sort()).toEqual(['chromium', 'firefox', 'webkit']);
      expect(ps.every((p) => p.testDir.endsWith(kind === 'apg' ? `tests/a11y/apg/${stream}` : `tests/e2e/${stream}`))).toBe(true);
    }
  });
  it('QUAL tests/a11y/browser runs in 3 engines', () => {
    expect(projects.filter((p) => p.name.startsWith('qual:a11y-browser-')).length).toBe(3);
  });
  it('apg projects match only *.apg.spec.ts', () => {
    expect(projects.filter((p) => p.name.includes(':loc-apg-')).every((p) => p.testMatch === '**/*.apg.spec.ts')).toBe(true);
  });
});

describe('axe cells', () => {
  it('pr/main: photo + flat-white × light/dark in every engine', () => {
    for (const engine of ['chromium', 'webkit', 'firefox'] as const) {
      expect(axeCells('pr', engine).map((c) => `${c.scene}/${c.scheme}`)).toEqual(['photo/light', 'photo/dark', 'flat-white/light', 'flat-white/dark']);
      expect(axeCells('main', engine)).toHaveLength(4);
    }
  });
  it('nightly/release: all 8 scenes in chromium and webkit', () => {
    for (const scope of ['nightly', 'release'] as const) {
      expect(new Set(axeCells(scope, 'chromium').map((c) => c.scene))).toEqual(new Set(SCENES));
      expect(axeCells(scope, 'webkit')).toHaveLength(SCENES.length * 2);
      expect(axeCells(scope, 'firefox')).toHaveLength(4);
    }
  });
  it('preference cells cover forced colors, contrast, reduced motion and solid transparency', () => {
    expect(PREFERENCE_CELLS.map((c) => c.id)).toEqual(['forced-colors', 'contrast-more', 'reduced-motion', 'transparency-solid']);
    expect(PREFERENCE_CELLS.filter((c) => c.media && Object.keys(c.media).length).every((c) => typeof c.readBack === 'string')).toBe(true);
    expect(PREFERENCE_CELLS.find((c) => c.id === 'transparency-solid')?.html).toEqual({ 'data-ag-transparency': 'solid' });
  });
});

describe('flagship APG coverage', () => {
  const metas = [
    { name: 'AlertDialog', owner: 'CMP' as const, flagship: 3 },
    { name: 'Breadcrumbs', owner: 'SURF' as const, flagship: 9 },
    { name: 'Command', owner: 'SURF' as const, flagship: 12 },
    { name: 'CommandPalette', owner: 'SURF' as const, flagship: 11 },
    { name: 'Surface', owner: 'MAT' as const, flagship: 1 },
    { name: 'Badge', owner: 'CMP' as const },
  ];
  const files = ['tests/a11y/apg/cmp/alert-dialog.apg.spec.ts', 'tests/a11y/apg/surf/breadcrumbs-overflow.apg.spec.ts',
    'tests/a11y/apg/surf/command-palette.apg.spec.ts', 'tests/a11y/apg/cmp/surface.apg.spec.ts'];
  const rows = apgCoverage(metas, files);
  it('lists flagships only, by number', () => {
    expect(rows.map((r) => r.name)).toEqual(['Surface', 'AlertDialog', 'Breadcrumbs', 'CommandPalette', 'Command']);
  });
  it('matches exact and suffixed specs in the owner directory only', () => {
    const by = Object.fromEntries(rows.map((r) => [r.name, r.spec]));
    expect(by.AlertDialog).toBe('tests/a11y/apg/cmp/alert-dialog.apg.spec.ts');
    expect(by.Breadcrumbs).toBe('tests/a11y/apg/surf/breadcrumbs-overflow.apg.spec.ts');
    expect(by.CommandPalette).toBe('tests/a11y/apg/surf/command-palette.apg.spec.ts');
    expect(by.Command).toBeNull(); // command-palette is another meta's exact name
    expect(by.Surface).toBeNull(); // the spec is in cmp/, Surface is MAT's
    expect(rows.find((r) => r.name === 'Surface')?.expected).toBe('tests/a11y/apg/mat/surface.apg.spec.ts');
  });
  it('kebab', () => {
    expect(kebab('AlertDialog')).toBe('alert-dialog');
    expect(kebab('Table.Column')).toBe('table-column');
    expect(kebab('HTMLViewer')).toBe('html-viewer');
  });
});

/** run.mjs is real Node ESM (it imports esbuild and data: URLs); call its exports in a child process so the test works
    with and without --experimental-vm-modules. */
function runMjs(expr: string, args: unknown): unknown {
  const href = pathToFileURL(join(ROOT, 'certification/run.mjs')).href;
  const script = `const m = await import(${JSON.stringify(href)}); const a = JSON.parse(process.argv[1]); process.stdout.write(JSON.stringify(${expr}));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', script, JSON.stringify(args)], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`run.mjs child failed: ${r.stderr}`);
  return JSON.parse(r.stdout);
}

describe('lane runner accounting (run.mjs)', () => {
  it('double-pass tests are counted apart from pass', () => {
    const t = (status: string, annotations: Array<{ type: string }> = []) => ({ status, annotations, results: [{ status: 'passed' }] });
    const report = { suites: [{ specs: [{ title: 'a', tests: [t('expected'), t('expected', [{ type: 'double-pass' }])] }] }] };
    const c = runMjs('m.classifyPlaywrightReport(a)', report) as { total: number; doubles: number; failed: number };
    expect(c.total).toBe(2);
    expect(c.doubles).toBe(1);
    expect(c.failed).toBe(0);
  });

  it('location-discovered specs are covered; unknown dirs are not', () => {
    const dirs = locationProjects(ROOT).map((p) => p.testDir);
    const covered = ['tests/a11y/apg/cmp/dialog.apg.spec.ts', 'tests/e2e/surf/x.spec.ts', 'tests/a11y/browser/axe.spec.ts'];
    expect(runMjs('m.uncoveredSpecs(a.files, a.root, a.dirs)', { files: covered, root: ROOT, dirs })).toEqual([]);
    const foreign = ['tests/e2e/layout/grid-masonry.spec.ts', 'tests/a11y/apg/accordion.apg.spec.ts'];
    expect(runMjs('m.uncoveredSpecs(a.files, a.root, a.dirs)', { files: foreign, root: ROOT, dirs })).toEqual(foreign);
  });

  it('lanes.config registers the L5 QUAL specs and one location row per stream directory and scope', () => {
    const l5 = BUILTINS.filter((r) => r.lane === 'L5');
    expect(new Set(l5.map((r) => r.path))).toEqual(new Set(['certification/lanes/behaviour.spec.ts', 'tests/a11y/browser/axe.spec.ts',
      'tests/a11y/browser/__selftest__/harness.selftest.spec.ts']));
    expect(l5.every((r) => r.kind === 'playwright' && r.remote === true && r.failClosed === true)).toBe(true);
    const loc = locationBuiltins(ROOT);
    const cmp = loc.filter((r) => r.path === 'tests/a11y/apg/cmp/**/*.apg.spec.ts');
    expect(cmp.map((r) => r.scope).sort()).toEqual(['main', 'nightly', 'pr', 'release']);
    expect(cmp.every((r) => r.owner === 'cmp' && r.lane === 'L5')).toBe(true);
    expect(loc.some((r) => r.path === 'tests/e2e/surf/**/*.spec.ts' && r.owner === 'surf')).toBe(true);
  });
});
