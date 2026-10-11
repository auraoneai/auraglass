#!/usr/bin/env node
/* scripts/release/verify-codemods-gate.mjs — REQ-PLAT-62 / REQ-FIN-45 (FIN-C
   C.3-15, v4.3.0). The v4.3.0 tag ships `@auraglass/cli@0.x`; this gate is the
   step the tag pipeline runs before that publish.

     node scripts/release/verify-codemods-gate.mjs [--tag vX.Y.Z]
          [--cli packages/cli/dist/bin.js] [--fixture tests/fixtures/consumer-4x]
          [--out .artifacts/plat/codemods-gate.json]

   Checks (all must pass; the report lists every check, not only the first):
     1. fragments — `loadFragments('codemods')` (the same loader the CLI's
        gen-mappings uses) yields at least one mapping row for each of mat,
        cmp and surf. Rows arrive through the next -> release/4.x codemods
        sync (REQ-FIN-13). The value is evaluated, not grepped.
     2. qual — `fragments/codemods/qual.ts` has no rows (QUAL declares no
        codemods) and the operator record
        `docs/release/decisions/operator-codemods-qual.md` exists.
     3. cli-version — `packages/cli/package.json` is a 0.x version.
     4. migrate-dry-run — the built CLI runs
        `migrate 4to5 --dry-run --json --allow-todo` on a temporary copy of the
        consumer fixture: exit 0, a JSON report with `dryRun: true`, at least
        one file that would change, and the copy byte-identical afterwards.

   Without --tag the version is package.json's. A tag or version outside 4.3.x
   is not gated: the script says so and exits 0. Exit 1 on any failed check,
   2 on usage errors. */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export const REQUIRED_STREAMS = ['mat', 'cmp', 'surf'];
export const QUAL_RECORD = 'docs/release/decisions/operator-codemods-qual.md';
const ROW_KEYS = ['renames', 'props', 'cssVars', 'removed', 'deps', 'areaTransforms'];

/** Number of mapping rows in a CodemodMappingFragment value. `fixtures` is a
 *  list of fixture dirs, not a mapping, so it does not count. */
export function countRows(value) {
  const v = Array.isArray(value) ? value[0] : value;
  if (!v || typeof v !== 'object') return 0;
  let n = 0;
  for (const k of ROW_KEYS) {
    const x = v[k];
    if (Array.isArray(x)) n += x.length;
    else if (x && typeof x === 'object') n += Object.keys(x).length;
  }
  return n;
}

/** Applies to 4.3.x only (the minor that ships `@auraglass/cli@0.x`). */
export function gated(version) {
  return /^4\.3\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(String(version).replace(/^v/, ''));
}

export function checkFragments(fragments) {
  const byStream = new Map();
  for (const { stream, value } of fragments) byStream.set(stream, (byStream.get(stream) ?? 0) + countRows(value));
  const rows = Object.fromEntries(REQUIRED_STREAMS.map((s) => [s, byStream.get(s) ?? 0]));
  const empty = REQUIRED_STREAMS.filter((s) => rows[s] === 0);
  return {
    id: 'fragments',
    ok: empty.length === 0,
    rows,
    message: empty.length
      ? `empty codemod fragment(s): ${empty.map((s) => `fragments/codemods/${s}.ts`).join(', ')} — they reach release/4.x only through the next -> release/4.x codemods sync (REQ-FIN-13)`
      : `mat ${rows.mat}, cmp ${rows.cmp}, surf ${rows.surf} mapping rows`,
  };
}

export function checkQual(fragments, root) {
  const rows = fragments.filter((f) => f.stream === 'qual').reduce((n, f) => n + countRows(f.value), 0);
  const record = existsSync(join(root, QUAL_RECORD));
  const problems = [];
  if (rows) problems.push(`fragments/codemods/qual.ts has ${rows} row(s); QUAL declares no codemods`);
  if (!record) problems.push(`${QUAL_RECORD} is missing (operator record that qual.ts stays {})`);
  return { id: 'qual', ok: problems.length === 0, rows, record, message: problems.join('; ') || 'qual.ts has no rows; operator record present' };
}

export function checkCliVersion(root) {
  const p = join(root, 'packages/cli/package.json');
  if (!existsSync(p)) return { id: 'cli-version', ok: false, message: 'packages/cli/package.json is missing' };
  const { name, version } = JSON.parse(readFileSync(p, 'utf8'));
  const ok = /^0\.\d+\.\d+/.test(String(version));
  return { id: 'cli-version', ok, name, version, message: ok ? `${name}@${version}` : `${name}@${version} is not a 0.x version` };
}

/** sha256 over every file path and its bytes under dir (sorted). */
export function treeHash(dir) {
  const h = createHash('sha256');
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      const abs = join(d, name);
      if (statSync(abs).isDirectory()) walk(abs);
      else h.update(relative(dir, abs)).update('\0').update(readFileSync(abs)).update('\0');
    }
  };
  walk(dir);
  return h.digest('hex');
}

export function checkMigrateDryRun({ cli, fixture }) {
  const base = { id: 'migrate-dry-run', cli, fixture };
  if (!existsSync(cli)) return { ...base, ok: false, message: `${cli} is missing; build the CLI first (npm run build -w packages/cli)` };
  if (!existsSync(fixture)) return { ...base, ok: false, message: `consumer fixture ${fixture} is missing` };
  const tmp = mkdtempSync(join(tmpdir(), 'ag-codemods-gate-'));
  const work = join(tmp, 'consumer');
  try {
    cpSync(fixture, work, { recursive: true });
    const before = treeHash(work);
    const res = spawnSync(process.execPath,
      [cli, 'migrate', '4to5', '--dry-run', '--json', '--allow-todo', '--cwd', work],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const after = treeHash(work);
    const problems = [];
    if (res.status !== 0) problems.push(`exit ${res.status ?? res.signal}${res.stderr ? `: ${res.stderr.trim().split('\n').slice(-3).join(' | ')}` : ''}`);
    let report = null;
    try { report = JSON.parse(res.stdout); } catch { problems.push('stdout is not a JSON report'); }
    if (report) {
      if (report.dryRun !== true) problems.push('report.dryRun is not true');
      if (!(report.summary?.filesChanged >= 1)) problems.push(`report.summary.filesChanged is ${report.summary?.filesChanged} (the 4.x consumer fixture must have something to migrate)`);
    }
    if (before !== after) problems.push('the fixture copy changed during --dry-run');
    const summary = report?.summary ?? null;
    return {
      ...base,
      ok: problems.length === 0,
      exit: res.status,
      summary,
      unchanged: before === after,
      message: problems.join('; ') || `${summary.filesChanged} file(s) would change, ${summary.changes} change(s), ${summary.todos} TODO(s); fixture unchanged`,
    };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const tag = arg('--tag');
  if (tag !== undefined && !/^v\d+\.\d+\.\d+/.test(String(tag))) {
    console.error(`usage: verify-codemods-gate.mjs [--tag vX.Y.Z] (got '${tag}')`);
    return 2;
  }
  const version = tag ? tag.replace(/^v/, '') : JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
  if (!gated(version)) {
    console.log(`codemods-gate: ${version} is not a 4.3.x release; not gated`);
    return 0;
  }
  const cli = resolve(root, arg('--cli', 'packages/cli/dist/bin.js'));
  const fixture = resolve(root, arg('--fixture', 'tests/fixtures/consumer-4x'));
  const out = resolve(root, arg('--out', '.artifacts/plat/codemods-gate.json'));
  const { loadFragments } = await import(pathToFileURL(join(root, 'src/contracts/load-fragments.mjs')).href);
  const fragments = await loadFragments('codemods', root);
  const checks = [
    checkFragments(fragments),
    checkQual(fragments, root),
    checkCliVersion(root),
    checkMigrateDryRun({ cli, fixture }),
  ];
  const ok = checks.every((c) => c.ok);
  const report = { version, tag: tag ?? null, sha: process.env.CI_COMMIT_SHA ?? null, ok, checks };
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  for (const c of checks) console[c.ok ? 'log' : 'error'](`${c.ok ? 'ok  ' : 'FAIL'} ${c.id}: ${c.message}`);
  console.log(`codemods-gate: wrote ${relative(root, out)}`);
  return ok ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
}
