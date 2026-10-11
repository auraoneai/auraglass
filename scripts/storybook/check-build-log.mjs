#!/usr/bin/env node
/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): fail a Storybook build that silently dropped stories.
   Usage: node scripts/storybook/check-build-log.mjs [--dir storybook-static] [--report <dir>]

   Reads <report>/storybook-build.log, <report>/storybook-build.json and <report>/resolution.json
   (written by build.mjs; <report> defaults like build.mjs) plus <dir>/index.json, and fails on:
   - unresolved imports in the log (Vite/Rollup "Failed to resolve import", "Could not resolve", …);
   - duplicate story ids reported by the indexer, or story files the indexer could not index;
   - missing story ids: a file matched by the .storybook/main.ts globs with no index.json entry;
   - a non-zero build exit, a build over 6 min, or storybook-static over 60 MB excluding *.map.
   Source modules loaded from src/ in the dist-backed build (no dist twin) are reported, not failed. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUDGET, parseArgs, readIndex, sizeExcludingMaps, storyFiles } from './lib/storybook-build.mjs';
import { defaultReportDir } from './build.mjs';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

/** Log lines that mean an import did not resolve or a story file was not indexed. */
export const LOG_RULES = [
  { id: 'unresolved-import', re: /Failed to resolve import|Could not resolve ["']|Rollup failed to resolve import|Cannot find module ['"]|Module not found|is not exported by /i },
  { id: 'duplicate-story-id', re: /Duplicate stories with id|duplicate story id/i },
  { id: 'unindexed-story-file', re: /Unable to index|Error indexing|Failed to index|CSF: .*(?:missing default export|could not)/i },
];

const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

export function logProblems(logText) {
  const out = [];
  for (const line of strip(logText).split('\n')) {
    for (const rule of LOG_RULES) if (rule.re.test(line)) out.push(`${rule.id}: ${line.trim().slice(0, 400)}`);
  }
  return out;
}

/** Story/docs files matched by the main.ts globs that have no index.json entry with that importPath. */
export function missingStoryFiles(root, index) {
  const indexed = new Set(Object.values(index.entries).map((e) => e.importPath));
  return [...storyFiles(root).keys()].filter((f) => !indexed.has(f)).sort();
}

export function budgetProblems({ durationMs, bytes }) {
  const out = [];
  if (bytes > BUDGET.maxBytesExcludingMaps) out.push(`storybook-static is ${(bytes / 2 ** 20).toFixed(1)} MB excluding maps (budget ${BUDGET.maxBytesExcludingMaps / 2 ** 20} MB)`);
  if (durationMs > BUDGET.maxBuildMs) out.push(`storybook build took ${(durationMs / 60000).toFixed(2)} min (budget ${BUDGET.maxBuildMs / 60000} min)`);
  return out;
}

export function checkBuild({ root, dir, reportDir }) {
  const problems = [];
  const logPath = join(reportDir, 'storybook-build.log');
  const buildPath = join(reportDir, 'storybook-build.json');
  if (!existsSync(logPath) || !existsSync(buildPath)) {
    return { problems: [`missing ${!existsSync(logPath) ? logPath : buildPath}; run scripts/storybook/build.mjs first`], summary: null };
  }
  const build = JSON.parse(readFileSync(buildPath, 'utf8'));
  if (build.exitCode !== 0) problems.push(`storybook build exited ${build.exitCode}`);
  problems.push(...logProblems(readFileSync(logPath, 'utf8')));
  let missing = [];
  let bytes = 0;
  if (!existsSync(join(dir, 'index.json'))) problems.push(`${join(dir, 'index.json')} missing`);
  else {
    missing = missingStoryFiles(root, readIndex(dir).index);
    for (const f of missing) problems.push(`missing-story-id: ${f} matches a main.ts glob but has no index.json entry`);
    bytes = sizeExcludingMaps(dir);
  }
  problems.push(...budgetProblems({ durationMs: build.durationMs, bytes }));
  const resolutionPath = join(reportDir, 'resolution.json');
  const resolution = existsSync(resolutionPath) ? JSON.parse(readFileSync(resolutionPath, 'utf8')) : null;
  const summary = {
    version: 1,
    durationMs: build.durationMs,
    distSource: build.distSource,
    bytesExcludingMaps: bytes,
    missingStoryFiles: missing,
    sourceFallbacks: resolution?.sourceFallbacks ?? null,
    redirectedToDist: resolution?.redirectedToDist ?? null,
    problems,
  };
  return { problems, summary };
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const dir = resolve(String(args.dir ?? 'storybook-static'));
  const reportDir = resolve(String(args.report ?? defaultReportDir(env)));
  const { problems, summary } = checkBuild({ root: ROOT, dir, reportDir });
  if (summary) writeFileSync(join(reportDir, 'check-build-log.json'), JSON.stringify(summary, null, 2) + '\n');
  if (summary?.sourceFallbacks?.length) {
    console.log(`check-build-log: ${summary.sourceFallbacks.length} src/ module(s) without a dist twin loaded from source (report only): ${summary.sourceFallbacks.slice(0, 10).join(', ')}`);
  }
  if (problems.length) {
    for (const p of problems) console.error(`check-build-log: ${p}`);
    return 1;
  }
  console.log(`check-build-log: OK (${(summary.bytesExcludingMaps / 2 ** 20).toFixed(1)} MB, ${(summary.durationMs / 1000).toFixed(0)} s)`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());
