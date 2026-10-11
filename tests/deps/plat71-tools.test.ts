/**
 * @jest-environment node
 */
/* REQ-PLAT-71: unit coverage for the canary singleton check and the D-26
   transitive-ceiling calibration tool (pure parts; the pack/install legs run
   in GitLab CI only). */
import { describe, expect, it } from '@jest/globals';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/* The tools are plain ESM scripts and this jest transform cannot load .mjs
   in-process, so each call runs the real module in a child node process. */
const ROOT = process.cwd();
const SINGLE = pathToFileURL(join(ROOT, 'scripts/ci/single-instance-check.mjs')).href;
const CALIB = pathToFileURL(join(ROOT, 'scripts/build/calibrate-transitive.mjs')).href;
function call(moduleUrl: string, fn: string, ...args: unknown[]): any {
  const code = `const m = await import(${JSON.stringify(moduleUrl)});
const v = typeof m[${JSON.stringify(fn)}] === 'function' ? m[${JSON.stringify(fn)}](...${JSON.stringify(args)}) : m[${JSON.stringify(fn)}];
process.stdout.write(JSON.stringify(v === undefined ? null : v));`;
  return JSON.parse(execFileSync('node', ['--input-type=module', '-e', code], { cwd: ROOT, encoding: 'utf8' }));
}
const singletonVersions = (t: unknown) => call(SINGLE, 'singletonVersions', t);
const treeProblems = (t: unknown) => call(SINGLE, 'treeProblems', t);
const readRecord = (t: string) => call(CALIB, 'readRecord', t);
const countTree = (t: unknown) => call(CALIB, 'countTree', t);
const applyMeasurement = (t: string, n: number, u?: string) => call(CALIB, 'applyMeasurement', t, n, u ?? null);
const triggerState = (root: string) => call(CALIB, 'triggerState', root);
const CHANGELOG: string = call(CALIB, 'CHANGELOG');
const TRIGGER_ENTRIES: string[] = call(CALIB, 'TRIGGER_ENTRIES');

const tree = (deps: Record<string, unknown>) => ({ name: 'canary', dependencies: deps });

describe('single-instance-check (REQ-PLAT-71)', () => {
  it('accepts one version each, including deduped nested references', () => {
    const t = tree({
      react: { version: '19.2.0' },
      'react-dom': { version: '19.2.0', dependencies: { react: { version: '19.2.0' } } },
      'aura-glass': { version: '5.0.0', dependencies: { '@base-ui/react': { version: '1.8.0', dependencies: { react: { version: '19.2.0' } } } } },
    });
    expect(singletonVersions(t)).toEqual({ react: ['19.2.0'], 'react-dom': ['19.2.0'], '@base-ui/react': ['1.8.0'] });
    expect(treeProblems(t)).toEqual([]);
  });

  it('flags a second react copy nested under a dependency', () => {
    const t = tree({
      react: { version: '19.2.0' },
      'react-dom': { version: '19.2.0' },
      'aura-glass': { version: '5.0.0', dependencies: { '@base-ui/react': { version: '1.8.0' }, react: { version: '19.0.0' } } },
    });
    expect(treeProblems(t)).toEqual(['react resolved to 2 versions: 19.0.0, 19.2.0']);
  });

  it('flags a singleton that is not installed at all', () => {
    const t = tree({ react: { version: '19.2.0' }, 'react-dom': { version: '19.2.0' } });
    expect(treeProblems(t)).toEqual(['@base-ui/react is not installed']);
  });
});

describe('calibrate-transitive (D-26, REQ-PLAT-71)', () => {
  const provisional = 'intro\n\ntransitiveCeiling: 64\ntransitiveCeilingStatus: provisional\n';

  it('the committed changelog carries a machine-readable record', () => {
    const rec = readRecord(readFileSync(CHANGELOG, 'utf8'));
    expect(Number.isInteger(rec.ceiling)).toBe(true);
    expect(['provisional', 'calibrated']).toContain(rec.status);
  });

  it('readRecord returns nulls when the record lines are absent (test fails closed)', () => {
    expect(readRecord('transitiveCeiling is 47 somewhere in prose')).toEqual({ ceiling: null, status: null });
  });

  it('countTree counts every node below the root', () => {
    expect(countTree(tree({ a: { dependencies: { b: {}, c: { dependencies: { d: {} } } } }, e: {} }))).toBe(5);
    expect(countTree({ name: 'empty' })).toBe(0);
  });

  it('records the measured count with job evidence on the first calibration', () => {
    const { text, problem } = applyMeasurement(provisional, 41, 'https://gitlab.com/x/-/jobs/1');
    expect(problem).toBeNull();
    expect(readRecord(text)).toEqual({ ceiling: 41, status: 'calibrated' });
    expect(text).toContain('transitiveCeilingEvidence: https://gitlab.com/x/-/jobs/1');
  });

  it('refuses a measurement above the ceiling (no silent raise)', () => {
    const { text, problem } = applyMeasurement(provisional, 65, 'https://gitlab.com/x/-/jobs/1');
    expect(problem).toMatch(/exceeds recorded ceiling 64/);
    expect(text).toBe(provisional);
  });

  it('refuses to calibrate without CI job evidence', () => {
    expect(applyMeasurement(provisional, 40, undefined).problem).toMatch(/CI_JOB_URL/);
  });

  it('never rewrites a calibrated record', () => {
    const calibrated = 'transitiveCeiling: 41\ntransitiveCeilingStatus: calibrated\ntransitiveCeilingEvidence: u\n';
    expect(applyMeasurement(calibrated, 30, 'v')).toEqual({ text: calibrated, problem: null });
    expect(applyMeasurement(calibrated, 42, 'v').problem).toMatch(/exceeds recorded ceiling 41/);
  });

  it('reports pending while a trigger entry is seeded or missing', () => {
    const root = mkdtempSync(join(tmpdir(), 'ag-d26-test-'));
    try {
      const [button, dialog] = TRIGGER_ENTRIES;
      mkdirSync(join(root, button, '..'), { recursive: true });
      writeFileSync(join(root, button), "export * from './Button';\n");
      writeFileSync(join(root, button, '..', 'Button.ts'), '/** @ag-contract-seed */\nexport const Button = 1;\n');
      const state = triggerState(root);
      expect(state.ready).toBe(false);
      expect(state.blocking).toEqual([`${button} (@ag-contract-seed in closure)`, `${dialog} (missing)`]);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
