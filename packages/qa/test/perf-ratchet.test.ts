/** @jest-environment node */
/* packages/qa/test/perf-ratchet.test.ts — REQ-QUAL-40 ratchet rules (head 15 % slower fails), pool size, sharding and
   affected-flagship selection from the import graph. The live PR comparison is tests/perf/qual/pr-ratchet.spec.ts (remote). */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { parsePerfThresholds } from '../src/perf/budgets';
import { affectedFlagships, compareRatchet, dependents, p95Limit, poolSize, shardOf } from '../src/perf/ratchet';
import type { PerfReport } from '../../../src/contracts/testing';

const ROOT = join(__dirname, '../../..');
const t = parsePerfThresholds(JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8'))).ratchet;
const report = (rows: Array<[string, Record<string, number>]>): PerfReport => ({ version: 1, sha: 'x',
  subjects: rows.map(([subject, metrics]) => ({ subject, profile: 'desktop-120hz' as const, metrics, grade: 'A' as const })) });
const base = report([['Dialog', { frameP95Ms: 20, transitionFrameP95Ms: 9, blurredSurfaces: 2, bci: 1.1 }], ['Button', { frameP95Ms: 4, blurredSurfaces: 1, bci: 0.2 }]]);

describe('compareRatchet', () => {
  it('head 15 % slower fails; 9 % slower passes (10 % rule)', () => {
    const slow = report([['Dialog', { frameP95Ms: 23, transitionFrameP95Ms: 9, blurredSurfaces: 2, bci: 1.1 }]]);
    expect(compareRatchet(base, slow, ['Dialog'], t).regressions.map((r) => r.metric)).toEqual(['frameP95Ms']);
    const ok = report([['Dialog', { frameP95Ms: 21.8, transitionFrameP95Ms: 9, blurredSurfaces: 2, bci: 1.1 }]]);
    expect(compareRatchet(base, ok, ['Dialog'], t).regressions).toEqual([]);
  });
  it('small bases use the 1 ms floor', () => {
    expect(p95Limit(4, t)).toBe(5);
    expect(compareRatchet(base, report([['Button', { frameP95Ms: 4.9, blurredSurfaces: 1, bci: 0.2 }]]), ['Button'], t).regressions).toEqual([]);
    expect(compareRatchet(base, report([['Button', { frameP95Ms: 5.1, blurredSurfaces: 1, bci: 0.2 }]]), ['Button'], t).regressions).toHaveLength(1);
  });
  it('like windows only: a transition window on one side is not compared', () => {
    const head = report([['Button', { frameP95Ms: 4, transitionFrameP95Ms: 50, blurredSurfaces: 1, bci: 0.2 }]]);
    expect(compareRatchet(base, head, ['Button'], t).regressions).toEqual([]);
    const both = report([['Dialog', { frameP95Ms: 20, transitionFrameP95Ms: 11, blurredSurfaces: 2, bci: 1.1 }]]);
    expect(compareRatchet(base, both, ['Dialog'], t).regressions.map((r) => r.metric)).toEqual(['transitionFrameP95Ms']);
  });
  it('any blurred-surface or BCI increase fails', () => {
    const head = report([['Dialog', { frameP95Ms: 20, transitionFrameP95Ms: 9, blurredSurfaces: 3, bci: 1.15 }]]);
    expect(compareRatchet(base, head, ['Dialog'], t).regressions.map((r) => r.metric)).toEqual(['blurredSurfaces', 'bci']);
  });
  it('new subjects are not compared; affected subjects missing at head are reported', () => {
    const r = compareRatchet(base, report([['Toast', { frameP95Ms: 3 }]]), ['Toast', 'Dialog'], t);
    expect(r.newSubjects).toEqual(['Toast']);
    expect(r.missingInHead).toEqual(['Dialog']);
  });
});

describe('pool and shards', () => {
  it('pool = ceil(subjects × perSubjectSeconds ÷ 600)', () => {
    expect(poolSize(44, { ...t, perSubjectSeconds: 60 })).toBe(5);
    expect(poolSize(10, { ...t, perSubjectSeconds: 60 })).toBe(1);
    expect(poolSize(0, t)).toBe(1);
  });
  it('round-robin shards cover every subject exactly once', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const all = [1, 2, 3].flatMap((i) => shardOf(items, i, 3));
    expect(all.sort()).toEqual(items);
    expect(() => shardOf(items, 0, 3)).toThrow(/invalid shard/);
  });
});

describe('affected flagships', () => {
  const graph = { edges: new Map<string, string[]>([
    ['src/components/dialog/Dialog.client.tsx', ['src/material/index.ts', 'src/components/dialog/Dialog.types.ts']],
    ['src/components/button/Button.client.tsx', ['src/internal/index.ts']],
    ['src/material/index.ts', ['src/material/surface.ts']],
  ]) };
  const flagships = [{ subject: 'Dialog', dir: 'src/components/dialog' }, { subject: 'Button', dir: 'src/components/button' }, { subject: 'Menu', dir: 'src/components/menu' }];
  it('reverse import reachability + component directory, plus the sentinel', () => {
    expect([...dependents(graph, ['src/material/surface.ts'])].sort()).toEqual(['src/components/dialog/Dialog.client.tsx', 'src/material/index.ts', 'src/material/surface.ts']);
    expect(affectedFlagships(graph, ['src/material/surface.ts'], flagships, 'Button')).toEqual(['Button', 'Dialog']);
    expect(affectedFlagships(graph, ['src/components/menu/Menu.css'], flagships, 'Button')).toEqual(['Button', 'Menu']);
    expect(affectedFlagships(graph, [], flagships, 'Button')).toEqual(['Button']);
  });
});

describe('qual:certify:l10-gpu pool in ci/qual.gitlab-ci.yml', () => {
  it('parallel: covers every flagship within targetMinutes', async () => {
    const yml = readFileSync(join(ROOT, 'ci/qual.gitlab-ci.yml'), 'utf8');
    const job = yml.slice(yml.indexOf('\nqual:certify:l10-gpu:'));
    const parallel = Number(/\n {2}parallel: (\d+)/.exec(job.slice(0, job.indexOf('\nqual:', 1)))?.[1]);
    const { readMetas } = await import('../../../scripts/qual/perf/lib.mjs');
    const metas = (await readMetas(ROOT)) as Array<{ name: string; flagship?: number }>;
    const flagships = new Set(metas.filter((m) => typeof m.flagship === 'number').map((m) => m.name)).size;
    expect(parallel).toBeGreaterThanOrEqual(poolSize(flagships, t));
  });
});
