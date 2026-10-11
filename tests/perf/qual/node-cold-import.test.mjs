/**
 * @jest-environment node
 */
/* REQ-QUAL-47 Node cold import (REQ-FIN-105, FIN-446) — remote L2 only (GitLab qual:test:cold-import; the lane
   runner's L2 row once G-03 lands). Installs the packed tarball into a scratch project and runs 11 fresh `node`
   processes per JS entry on Node 20.19.0 and Node 22 LTS, timing `await import(<entry>)` after dropping the OS page
   cache (or recording the fallback). Fails if '.' median > 150 ms (DEFAULT_CEILINGS.nodeColdImportMs) or p90 > 200 ms,
   if './material', './tokens' or './primitives' median > 30 ms, if a Node line is missing, or if the runner tag
   (CI_RUNNER_TAGS) is missing. Writes $AURAGLASS_EVIDENCE_DIR/qual/<CI_JOB_NAME_SLUG>/node-cold-import.json
   (Node versions, runner tag, per-entry medians/p90/samples) for the L2 lane manifest.

   Inputs: AURAGLASS_TARBALL or .artifacts/pack/aura-glass-*.tgz; AG_COLD_IMPORT_NODE_BINS = comma-separated Node
   executables (CI fetches them with scripts/qual/fetch-node.mjs; the current `node` is used when unset).

   The file deliberately has no import/export statements and no import.meta: the contract jest.config.js transforms
   .mjs to CommonJS while Jest may load it as ESM, so it uses Jest's injected globals and process.getBuiltinModule
   (Node >= 20.16) and therefore loads identically in both module modes. */
/* global describe, expect, test */
const { createRequire } = process.getBuiltinModule('node:module');
const { existsSync, mkdirSync, readFileSync, writeFileSync } = process.getBuiltinModule('node:fs');
const { dirname, join } = process.getBuiltinModule('node:path');

function repoRoot() {
  for (let d = process.cwd(); ; d = dirname(d)) {
    const p = join(d, 'package.json');
    if (existsSync(p) && JSON.parse(readFileSync(p, 'utf8')).name === 'aura-glass') return d;
    if (dirname(d) === d) throw new Error('node-cold-import: run from inside the aura-glass repository');
  }
}
const ci = createRequire(join(repoRoot(), 'package.json'))('./scripts/qual/lib/cold-import.cjs');

const REMOTE = 'remote L2 only: runs in the GitLab job qual:test:cold-import (needs plat:build:dist; '
  + 'AG_COLD_IMPORT_NODE_BINS from scripts/qual/fetch-node.mjs 20.19.0 22)';

function reportPath() {
  const base = process.env.AURAGLASS_EVIDENCE_DIR ?? join(ci.ROOT, '.artifacts');
  return join(base, 'qual', process.env.CI_JOB_NAME_SLUG || 'local', 'node-cold-import.json');
}
function writeReport(report) {
  const file = reportPath();
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, JSON.stringify(report, null, 2) + '\n');
  return file;
}

describe('REQ-QUAL-47 node cold import', () => {
  test('cold import of every entry on Node 20.19.0 and Node 22 LTS stays within the ceilings', () => {
    const runnerTags = ci.parseRunnerTags(process.env.CI_RUNNER_TAGS);
    const report = {
      version: 1, req: 'REQ-QUAL-47', sha: process.env.CI_COMMIT_SHA ?? null, runnerTags, runnerTag: runnerTags[0] ?? null,
      runs: ci.RUNS, thresholds: ci.THRESHOLDS, nodes: [], results: {}, pageCache: null, tarball: null, failures: [], status: 'fail',
    };
    if (!runnerTags.length) {
      report.failures = ci.evaluate(report);
      writeReport(report);
      throw new Error(`CI_RUNNER_TAGS is unset or empty — the runner tag is required (${REMOTE})`);
    }
    const tarball = ci.findTarball();
    if (!tarball) {
      report.failures = [{ kind: 'missing-tarball', detail: 'AURAGLASS_TARBALL unset and no .artifacts/pack/aura-glass-*.tgz' }];
      writeReport(report);
      throw new Error(`no tarball (${REMOTE})`);
    }
    report.tarball = { path: tarball, sha256: ci.sha256(tarball) };
    const bins = (process.env.AG_COLD_IMPORT_NODE_BINS ?? process.execPath).split(',').map((s) => s.trim()).filter(Boolean);
    const scratch = ci.setupScratch(tarball);
    report.peers = scratch.peers;
    const entries = ci.jsEntries(scratch.pkgJson);
    report.entries = entries;
    for (const bin of bins) {
      const version = ci.nodeVersion(bin);
      report.nodes.push({ bin, version });
      report.results[version] = {};
      for (const entry of entries) {
        const r = ci.measureEntry(bin, scratch.dir, ci.specifierOf(scratch.pkgJson.name, entry));
        report.pageCache = report.pageCache?.ok === false ? report.pageCache : r.pageCache;
        report.results[version][entry] = { samples: r.samples, median: r.median ?? null, p90: r.p90 ?? null, ...(r.error ? { error: r.error } : {}) };
      }
    }
    report.failures = ci.evaluate(report);
    report.status = report.failures.length ? 'fail' : 'pass';
    const file = writeReport(report);
    const medians = Object.fromEntries(report.nodes.map(({ version }) => [version,
      Object.fromEntries(Object.entries(report.results[version]).map(([e, r]) => [e, r.error ? 'error' : r.median]))]));
    console.log(`node-cold-import: ${file}\n${JSON.stringify({ runnerTag: report.runnerTag, pageCache: report.pageCache, medians }, null, 2)}`);
    expect(report.failures).toEqual([]);
  }, 30 * 60_000);
});
