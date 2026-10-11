/** @jest-environment node */
// tests/lint/qual/css-perf.test.ts — REQ-QUAL-44 (CSS perf gate), REQ-FIN-105, FIN-446.
// Valid and invalid CSS fixtures per stylelint-perf rule, plus the per-owner
// report and enforcement split of scripts/qual/verify-css-perf.mjs. stylelint is
// ESM-only, so the plugins run in a child Node process (outside Jest's CJS transform).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(__dirname, '../../..');
const INDEX = pathToFileURL(path.join(ROOT, 'scripts/qual/stylelint-perf/index.mjs')).href;
const SCRIPT = path.join(ROOT, 'scripts/qual/verify-css-perf.mjs');

type Case = { code: string; rule: string };

/** Lint each fixture with all five plugins; returns the rule ids reported per fixture. */
function lintAll(cases: Case[]): string[][] {
  const runner = `
    import stylelint from 'stylelint';
    import { config } from ${JSON.stringify(INDEX)};
    const cases = JSON.parse(await new Promise((r) => { let s = ''; process.stdin.on('data', (d) => (s += d)).on('end', () => r(s)); }));
    const out = [];
    for (const c of cases) {
      const { results } = await stylelint.lint({ code: c.code, config, codeFilename: 'fixture.css' });
      out.push(results.flatMap((r) => [...r.warnings.map((w) => w.rule), ...(r.parseErrors ?? []).map(() => 'CssSyntaxError')]));
    }
    process.stdout.write(JSON.stringify(out));
  `;
  const stdout = execFileSync(process.execPath, ['--input-type=module', '-e', runner], {
    cwd: ROOT,
    input: JSON.stringify(cases),
    encoding: 'utf8',
  });
  return JSON.parse(stdout);
}

const R = {
  blur: 'auraglass/perf-backdrop-blur-radius',
  shape: 'auraglass/perf-backdrop-filter-shape',
  hack: 'auraglass/perf-no-layer-hack',
  willChange: 'auraglass/perf-will-change-scope',
  transition: 'auraglass/perf-no-expensive-transition',
};

const valid: Case[] = [
  // blur radius / shape
  { rule: R.blur, code: '.a { backdrop-filter: blur(20px) saturate(1.8) brightness(1.05); }' },
  { rule: R.blur, code: '.a { -webkit-backdrop-filter: blur(0) saturate(1) brightness(1); }' },
  { rule: R.blur, code: ':root { --_ag-blur: 32px; } .a { backdrop-filter: blur(var(--_ag-blur)) saturate(1.5) brightness(1); }' },
  { rule: R.shape, code: '.a { backdrop-filter: none; }' },
  { rule: R.shape, code: '.a { backdrop-filter: url(#ag-lens-capsule-bar) blur(12px) saturate(1.4); }' },
  { rule: R.shape, code: '.a { backdrop-filter: url(#ag-lens-concentric-panel); }' },
  { rule: R.shape, code: '.a { backdrop-filter: blur(var(--_ag-blur)) saturate(var(--_ag-saturation)) brightness(calc(var(--_ag-brightness) * var(--_ag-env-brightness, 1))); }' },
  // layer hacks
  { rule: R.hack, code: '.a { transform: translate3d(0, 4px, 0); }' },
  { rule: R.hack, code: '.a { transform: translateZ(8px) rotateY(180deg); backface-visibility: visible; }' },
  { rule: R.hack, code: '@keyframes k { from { transform: translateX(0); } to { transform: translateX(10px); } }' },
  // will-change scope
  { rule: R.willChange, code: '.ag-surface[data-ag-animating] { will-change: opacity, transform; }' },
  { rule: R.willChange, code: '@layer ag.motion { [data-starting-style] { will-change: transform; } }' },
  { rule: R.willChange, code: '.x[data-ending-style], .x[data-starting-style] { will-change: opacity; }' },
  { rule: R.willChange, code: '.x { will-change: auto; }' },
  // transitions / keyframes
  { rule: R.transition, code: '.a { transition: opacity 200ms ease, transform 200ms var(--ag-ease-standard); }' },
  { rule: R.transition, code: '.a { transition-property: opacity, transform, translate, scale; }' },
  { rule: R.transition, code: '@keyframes fade { from { opacity: 0; transform: scale(.96); } to { opacity: 1; } }' },
  { rule: R.transition, code: '.a { transition: none; }' },
];

const invalid: Case[] = [
  { rule: R.blur, code: '.a { backdrop-filter: blur(16px) saturate(1.8) brightness(1); }' },
  { rule: R.blur, code: '.a { -webkit-backdrop-filter: blur(6px) saturate(1.6) brightness(1); }' },
  { rule: R.blur, code: ':root { --_ag-blur: 40px; } .a { backdrop-filter: blur(var(--_ag-blur)) saturate(1.5) brightness(1); }' },
  { rule: R.blur, code: '.a { backdrop-filter: url(#ag-lens-fixed-control) blur(var(--missing, 1rem)) saturate(1); }' },
  { rule: R.shape, code: '.a { backdrop-filter: blur(20px) saturate(1.8) contrast(1.1); }' },
  { rule: R.shape, code: '.a { backdrop-filter: blur(20px) saturate(1.8); }' },
  { rule: R.shape, code: '.a { backdrop-filter: saturate(1.8) blur(20px) brightness(1); }' },
  { rule: R.shape, code: '.a { backdrop-filter: url(#ag-lens-round-control) blur(12px) saturate(1); }' },
  { rule: R.shape, code: '.a { -webkit-backdrop-filter: var(--_ag-backdrop); }' },
  { rule: R.hack, code: '.a { transform: translateZ(0); }' },
  { rule: R.hack, code: '.a { transform: scale(1) translate3d(0px, 0, 0.0px); }' },
  { rule: R.hack, code: '.a { backface-visibility: hidden; }' },
  { rule: R.hack, code: '.a { -webkit-backface-visibility: hidden; }' },
  { rule: R.hack, code: '@keyframes k { from { transform: translate3d(0, 0, 0); } }' },
  { rule: R.willChange, code: '.panel { will-change: transform; }' },
  { rule: R.willChange, code: '.a[data-ag-animating], .b { will-change: opacity; }' },
  { rule: R.willChange, code: '@media (hover: hover) { .card:hover { will-change: transform, opacity; } }' },
  { rule: R.transition, code: '.a { transition: backdrop-filter 300ms ease; }' },
  { rule: R.transition, code: '.a { transition: opacity 200ms, width 200ms; }' },
  { rule: R.transition, code: '.a { transition-property: filter; }' },
  { rule: R.transition, code: '.a { transition: --_ag-blur 200ms linear; }' },
  { rule: R.transition, code: '.a { transition: all 150ms; }' },
  { rule: R.transition, code: '.a { -webkit-transition: margin-inline-start 1s; }' },
  { rule: R.transition, code: '@keyframes grow { to { height: 200px; } }' },
  { rule: R.transition, code: '@keyframes blur-in { from { --_ag-blur: 0px; } to { --_ag-blur: 20px; } }' },
  { rule: R.transition, code: '@keyframes slide { to { inset-inline-start: 0; padding-top: 4px; } }' },
];

describe('scripts/qual/stylelint-perf plugins (REQ-QUAL-44)', () => {
  const validOut = lintAll(valid);
  const invalidOut = lintAll(invalid);

  it.each(valid.map((c, i) => [i, c.rule, c.code] as const))('valid #%i %s: %s', (i) => {
    expect(validOut[i]).toEqual([]);
  });

  it.each(invalid.map((c, i) => [i, c.rule, c.code] as const))('invalid #%i %s: %s', (i, rule) => {
    expect(invalidOut[i]).toContain(rule);
  });

  it('has at least one invalid and one valid fixture for every rule', () => {
    for (const rule of Object.values(R)) {
      expect(invalid.filter((c) => c.rule === rule).length).toBeGreaterThanOrEqual(3);
      expect(valid.filter((c) => c.rule === rule).length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('scripts/qual/verify-css-perf.mjs (REQ-QUAL-44 per-owner report)', () => {
  let tmp: string;
  const write = (rel: string, text: string) => {
    const f = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, text);
  };
  const run = (...args: string[]) => {
    const r = spawnSync(process.execPath, [SCRIPT, '--root', tmp, '--json', '--out', 'report.json', ...args], { cwd: ROOT, encoding: 'utf8' });
    return { status: r.status, report: JSON.parse(fs.readFileSync(path.join(tmp, 'report.json'), 'utf8')), stderr: r.stderr };
  };

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-css-perf-'));
    write('package.json', JSON.stringify({ name: 'fixture', version: '5.0.0-alpha.0' }));
    // MAT-owned source path with a violation → report-only before RC-1
    write('src/material/css/bad.css', '.a { backdrop-filter: blur(16px) saturate(1) brightness(1); }\n');
    // CMP-owned clean file
    write('src/components/card/Card.css', '.c { transition: opacity 120ms; }\n');
  });
  afterEach(() => fs.rmSync(tmp, { recursive: true, force: true }));

  it('reports per owner and stays report-only for stream paths before RC-1', () => {
    const { status, report } = run();
    expect(status).toBe(0);
    expect(report.owners.MAT).toMatchObject({ files: 1, violations: 1, enforced: false });
    expect(report.owners.MAT.byRule).toEqual({ [R.blur]: 1 });
    expect(report.owners.CMP).toMatchObject({ files: 1, violations: 0 });
    expect(report.inputs.dist.status).toBe('missing');
    expect(report.enforcedViolations).toBe(0);
    expect(report.reportOnlyViolations).toBe(1);
  });

  it('errors on QUAL-owned paths', () => {
    write('showcase/ops-console/ops-console.module.css', '.s { will-change: transform; }\n');
    const { status, report } = run();
    expect(status).toBe(1);
    expect(report.owners.QUAL).toMatchObject({ files: 1, violations: 1, enforced: true });
  });

  it('skips seeded negative fixtures under QUAL paths', () => {
    write('stories/qual/fixtures/perf/layer-hack.css', '.f { transform: translateZ(0); }\n');
    const { status, report } = run();
    expect(status).toBe(0);
    expect(report.owners.QUAL).toBeUndefined();
  });

  it('errors on dist/ findings', () => {
    write('dist/styles.css', ':root{--_ag-blur:24px}.a{backdrop-filter:blur(var(--_ag-blur)) saturate(1) brightness(1)}\n');
    const { status, report } = run();
    expect(status).toBe(1);
    expect(report.inputs.dist).toMatchObject({ status: 'present', files: 1 });
    expect(report.owners.dist).toMatchObject({ violations: 1, enforced: true });
  });

  it('fails a missing dist only with --require-dist', () => {
    expect(run().status).toBe(0);
    expect(run('--require-dist').status).toBe(1);
  });

  it('enforces every stream at RC-1 (version) and with --enforce-all', () => {
    expect(run('--enforce-all').status).toBe(1);
    write('package.json', JSON.stringify({ name: 'fixture', version: '5.0.0-rc.1' }));
    const { status, report } = run();
    expect(status).toBe(1);
    expect(report.mode).toBe('enforce-all');
    expect(report.owners.MAT.enforced).toBe(true);
  });
});
