/**
 * @jest-environment node
 */
/* REQ-QUAL-47 (REQ-FIN-105, FIN-446): unit tests for scripts/qual/lib/cold-import.cjs and the fail-on-missing-runner-tag
   behaviour of tests/perf/qual/node-cold-import.test.mjs. Runs on L1 (local-safe); the measurement itself is remote L2. */
import { describe, expect, test } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  evaluate, jsEntries, measureEntry, median, parseRunnerTags, percentile, specifierOf, THRESHOLDS, RUNS,
} from '../../../scripts/qual/lib/cold-import.cjs';

const ROOT = resolve(__dirname, '../../..');
const ok = (m: number, p90 = m) => ({ samples: Array(RUNS).fill(m), median: m, p90 });
const nodes = [{ bin: 'a', version: 'v20.19.0' }, { bin: 'b', version: 'v22.21.1' }];
const fullResults = (over: Record<string, unknown> = {}) => Object.fromEntries(nodes.map(({ version }) => [version, {
  '.': ok(120, 180), './material': ok(12), './tokens': ok(8), './primitives': ok(20), './data': ok(400), ...over,
}]));
const report = (extra = {}) => ({ runnerTags: ['saas-linux-medium-amd64'], runs: RUNS, nodes, results: fullResults(), ...extra });
const kinds = (r: Parameters<typeof evaluate>[0]) => evaluate(r).map((f: { kind: string }) => f.kind);

describe('statistics', () => {
  test('median and nearest-rank p90 over 11 samples', () => {
    const xs = [10, 1, 9, 2, 8, 3, 7, 4, 6, 5, 11];
    expect(median(xs)).toBe(6);
    expect(percentile(xs, 90)).toBe(10);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(percentile([], 90)).toBeNull();
  });
});

describe('inputs', () => {
  test('CI_RUNNER_TAGS parsing (GitLab JSON array or comma list); unset/empty → no tag', () => {
    expect(parseRunnerTags('["saas-linux-medium-amd64", "x"]')).toEqual(['saas-linux-medium-amd64', 'x']);
    expect(parseRunnerTags('a, b')).toEqual(['a', 'b']);
    expect(parseRunnerTags(undefined)).toEqual([]);
    expect(parseRunnerTags('')).toEqual([]);
    expect(parseRunnerTags('[]')).toEqual([]);
  });

  test('JS entries come from the exports map of the real package.json (CSS/JSON excluded), gated entries included', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const entries = jsEntries(pkg);
    for (const e of Object.keys(THRESHOLDS)) expect(entries).toContain(e);
    expect(entries.some((e: string) => /\.(css|json)$/.test(e))).toBe(false);
    expect(specifierOf('aura-glass', '.')).toBe('aura-glass');
    expect(specifierOf('aura-glass', './material')).toBe('aura-glass/material');
  });
});

describe('evaluate (thresholds from REQ-QUAL-47)', () => {
  test('within ceilings on both Node lines passes; ungated entries are recorded, not gated', () => {
    expect(evaluate(report())).toEqual([]);
  });
  test('missing runner tag fails', () => {
    expect(kinds(report({ runnerTags: [] }))).toEqual(['missing-runner-tag']);
  });
  test('a missing Node line fails', () => {
    const r = report({ nodes: [nodes[1]] });
    expect(kinds(r)).toEqual(['missing-node-line']);
    expect(evaluate(r)[0]?.detail).toBe('node-20.19.0');
  });
  test("'.' median > 150 ms or p90 > 200 ms fails", () => {
    expect(kinds(report({ results: fullResults({ '.': ok(151, 160) }) }))).toEqual(['median-over', 'median-over']);
    expect(kinds(report({ results: fullResults({ '.': ok(140, 201) }) }))).toEqual(['p90-over', 'p90-over']);
    expect(kinds(report({ results: fullResults({ '.': ok(150, 200) }) }))).toEqual([]);
  });
  test.each(['./material', './tokens', './primitives'])('%s median > 30 ms fails', (entry) => {
    expect(kinds(report({ results: fullResults({ [entry]: ok(31) }) }))).toEqual(['median-over', 'median-over']);
  });
  test('a failed import or a missing gated entry fails', () => {
    expect(kinds(report({ results: fullResults({ './tokens': { samples: [], error: 'ERR_MODULE_NOT_FOUND' } }) }))).toEqual(['import-failed', 'import-failed']);
    const r = report();
    delete (r.results['v22.21.1'] as Record<string, unknown>)['./primitives'];
    expect(kinds(r)).toEqual(['missing-entry']);
  });
});

describe('measurement', () => {
  test('measureEntry times real fresh processes and reports a page-cache method', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-cold-eval-'));
    mkdirSync(join(dir, 'node_modules', 'ag-cold-fixture'), { recursive: true });
    writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
    writeFileSync(join(dir, 'node_modules', 'ag-cold-fixture', 'package.json'), '{"name":"ag-cold-fixture","type":"module","exports":{".":"./index.js"}}');
    writeFileSync(join(dir, 'node_modules', 'ag-cold-fixture', 'index.js'), 'export const x = 1;\n');
    const r = measureEntry(process.execPath, dir, 'ag-cold-fixture', { runs: 3 });
    expect(r.error).toBeUndefined();
    expect(r.samples).toHaveLength(3);
    for (const s of r.samples) expect(s).toBeGreaterThan(0);
    expect(r.median).toBe(median(r.samples));
    expect(['drop_caches', 'none']).toContain(r.pageCache.method);
    const bad = measureEntry(process.execPath, dir, 'ag-cold-missing', { runs: 3 });
    expect(bad.error).toMatch(/ag-cold-missing|ERR_MODULE_NOT_FOUND/);
  });

  test('node-cold-import.test.mjs fails when CI_RUNNER_TAGS is unset', () => {
    const env: NodeJS.ProcessEnv = { ...process.env, CI_JOB_NAME_SLUG: 'cold-import-eval-selftest', AURAGLASS_EVIDENCE_DIR: mkdtempSync(join(tmpdir(), 'ag-cold-ev-')) };
    delete env.CI_RUNNER_TAGS;
    const r = spawnSync(process.execPath, ['--experimental-vm-modules', 'node_modules/jest/bin/jest.js', '--ci', 'tests/perf/qual/node-cold-import.test.mjs'],
      { cwd: ROOT, env, encoding: 'utf8', timeout: 120_000 });
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toContain('CI_RUNNER_TAGS is unset or empty');
    const written = JSON.parse(readFileSync(join(String(env.AURAGLASS_EVIDENCE_DIR), 'qual', 'cold-import-eval-selftest', 'node-cold-import.json'), 'utf8'));
    expect(written.failures).toEqual(expect.arrayContaining([expect.objectContaining({ kind: 'missing-runner-tag' })]));
  }, 150_000);
});
