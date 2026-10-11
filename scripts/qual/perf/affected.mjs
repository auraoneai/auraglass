#!/usr/bin/env node
/* scripts/qual/perf/affected.mjs — REQ-QUAL-40 (QUAL). Affected flagships of a PR for qual:certify:l10-gpu: files changed
   between the merge base and HEAD, reverse-reachable over the src/** import graph, mapped to each flagship ComponentMeta's
   directory, plus the sentinel subject (thresholds.json#perf.ratchet.sentinel). With --shard <i>/<n> (CI_NODE_INDEX /
   CI_NODE_TOTAL) it prints only this job's round-robin share. Prints the comma-separated subject list on stdout (the
   run-perf.mjs --subjects value) and writes <out> (affected.json) with the full set, the shard and the pool size.

   Usage: node scripts/qual/perf/affected.mjs --base <ref> [--shard i/n] [--out <file>] [--all] */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { ROOT, git, importGraph, loadQa, readMetas } from './lib.mjs';

export function parseArgs(argv) {
  const o = { base: null, shard: null, out: null, all: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') { o.all = true; continue; }
    const v = argv[++i];
    if (v === undefined) throw new Error(`${a} needs a value`);
    if (a === '--base') o.base = v;
    else if (a === '--shard') { const m = /^(\d+)\/(\d+)$/.exec(v); if (!m) throw new Error('--shard must be i/n'); o.shard = { index: Number(m[1]), total: Number(m[2]) }; }
    else if (a === '--out') o.out = resolve(v);
    else throw new Error(`unknown argument ${a}`);
  }
  if (!o.all && !o.base) throw new Error('--base <ref> (or --all) is required');
  return o;
}

export async function affectedCli(argv = process.argv.slice(2)) {
  const o = parseArgs(argv);
  const budgets = await loadQa('budgets'); const ratchet = await loadQa('ratchet');
  const { perf } = budgets.loadPerfThresholds(ROOT);
  const metas = await readMetas(ROOT);
  const flagships = metas.filter((m) => typeof m.flagship === 'number').map((m) => ({ subject: m.name, dir: m.dir }));
  let changed = []; let mergeBase = null; let subjects;
  if (o.all) subjects = [...new Set(flagships.map((f) => f.subject))].sort();
  else {
    mergeBase = git(['merge-base', o.base, 'HEAD']);
    changed = git(['diff', '--name-only', `${mergeBase}..HEAD`]).split('\n').filter(Boolean);
    subjects = ratchet.affectedFlagships(importGraph(ROOT), changed.filter((f) => f.startsWith('src/')), flagships, perf.ratchet.sentinel);
  }
  const pool = ratchet.poolSize(new Set(flagships.map((f) => f.subject)).size, perf.ratchet);
  const mine = o.shard ? ratchet.shardOf(subjects, o.shard.index, o.shard.total) : subjects;
  const doc = { version: 1, mergeBase, changed, affected: subjects, shard: o.shard, shardSubjects: mine, flagships: flagships.length, poolSize: pool,
    perSubjectSeconds: perf.ratchet.perSubjectSeconds, perSubjectSecondsSource: perf.ratchet.perSubjectSecondsSource };
  const out = o.out ?? join(process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10-gpu', 'affected.json');
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(resolve(out), `${JSON.stringify(doc, null, 2)}\n`);
  process.stdout.write(`${mine.join(',')}\n`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  affectedCli().then((c) => { process.exitCode = c; }, (e) => { process.stderr.write(`${e?.stack ?? e}\n`); process.exitCode = 1; });
}
