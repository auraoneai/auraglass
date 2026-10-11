#!/usr/bin/env node
/* plat:test:canaries runner (FIN-B B3-10; REQ-FIN-38 wiring for REQ-FIN-22;
   REQ-PLAT-05 item 9, REQ-PLAT-72, REQ-PLAT-77).

     node ci/plat/canaries.mjs --scope <pr|main> --base <git-ref> --out <dir> [--root <repo>]

   1. Canaries: vite-compiler (REQ-PLAT-72's React Compiler canary),
      types-strict and jest-cjs, each from the packed tarball through its own
      playwright config. Each Playwright JSON report is classified by the lane
      runner's classifyPlaywrightReport (certification/run.mjs): pass | fail |
      pending (a failure whose message starts with `pending: `, below release
      scope only).
   2. scripts/ci/verify-compiler.mjs, after the vite-compiler canary install
      (it resolves babel-plugin-react-compiler from that canary first).
   3. Seed exclusions (REQ-PLAT-77, REQ-FIN-06): while generate-exports'
      exclusion report lists an entry whose import graph holds an
      @ag-contract-seed file, the job verdict is `pending`, never `pass`: a
      canary cannot certify an entry that the tarball does not ship.
   4. Base UI latest leg (REQ-PLAT-05 item 9; PRD-1 REQ-PLAT-77 "reporting;
      blocks only a pin bump"): runs FIN-C's scripts/ci/base-ui-latest.mjs
      version report, then copies the types-strict and vite-compiler canaries
      to a temp dir and installs them against the same tarball with
      `npm i --no-save @base-ui/react@<latest>`. An `overrides` row makes the
      tarball's own @base-ui/react dependency resolve to that version too, and
      `npm ls` must show only that version (otherwise the leg would still test
      the pin). Then it runs `tsc --noEmit` (types-strict) and `vite build`
      (vite-compiler). The result goes to <out>/base-ui-latest.json. A failing
      leg fails the job only when this change bumps the @base-ui/react pin in
      package.json against the merge base with --base. A leg that cannot
      produce its report (producer missing or failing, registry unreachable, no
      tarball, unreadable base) fails the job. It never passes silently.

   Writes <out>/canaries.json and <out>/base-ui-latest.json. Exit 0 only when
   the verdict is `pass`. A `pending` or `fail` verdict exits 1. Exit 2 means
   it was invoked outside CI / the remote runner (it prints the remote command),
   or the arguments were wrong. */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CANARIES = ['canaries/vite-compiler', 'canaries/types-strict', 'canaries/jest-cjs'];
const BASE_UI = '@base-ui/react';
const PRODUCER = 'scripts/ci/base-ui-latest.mjs';
const COMPILER = 'scripts/ci/verify-compiler.mjs';
// Base UI latest legs: the strict type check of every entry's .d.ts (Base UI
// types are re-exported) and a production bundle of the flagship imports.
const LATEST_LEGS = [
  { canary: 'canaries/types-strict', check: ['node_modules/typescript/bin/tsc', '--noEmit', '-p', 'tsconfig.json'], quiet: true },
  { canary: 'canaries/vite-compiler', check: ['node_modules/vite/bin/vite.js', 'build'], quiet: false },
];

function parseArgs(argv) {
  const out = { scope: null, base: null, out: null, root: process.cwd() };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--scope') out.scope = v;
    else if (k === '--base') out.base = v;
    else if (k === '--out') out.out = v;
    else if (k === '--root') out.root = v;
    else throw new Error(`unknown argument ${k}`);
    i++;
  }
  if (!out.scope || !out.base || !out.out) throw new Error('--scope, --base and --out are required');
  out.root = resolve(out.root);
  out.out = resolve(out.root, out.out);
  return out;
}

const sh = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...opts });
  return { status: r.error ? null : r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '', error: r.error ? String(r.error) : null };
};
const tail = (s, n = 600) => (s.length > n ? `…${s.slice(-n)}` : s).trim();

/** Entries generate-exports excludes because their import graph holds a seed. */
async function seedExclusions(root) {
  const { exclusionReport } = await import(pathToFileURL(join(HERE, 'scripts/build/generate-exports.mjs')).href);
  return exclusionReport(root).filter((x) => x.seedFiles?.length).map((x) => ({ subpath: x.subpath, seedFiles: x.seedFiles }));
}

async function runCanary(root, rel, out, scope, classify) {
  const dir = join(root, rel);
  if (!existsSync(dir)) return { canary: rel, state: 'fail', reason: `PENDING: ${rel} missing (lane 1d)` };
  const name = rel.split('/').pop();
  const report = join(out, `playwright-${name}.json`);
  rmSync(report, { force: true });
  console.log(`\n=== ${rel}: npx playwright test`);
  const r = spawnSync('npx', ['playwright', 'test', '--reporter=list,json'], {
    cwd: dir, stdio: 'inherit', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: report },
  });
  if (r.error) return { canary: rel, state: 'fail', reason: `could not start playwright: ${r.error}` };
  let json;
  try { json = JSON.parse(readFileSync(report, 'utf8')); } catch {
    return { canary: rel, state: 'fail', reason: `playwright wrote no JSON report (exit ${r.status})` };
  }
  const c = classify(json);
  if (c.total === 0) return { canary: rel, state: 'fail', reason: '0 tests', tests: 0 };
  if (r.status === 0) return { canary: rel, state: 'pass', tests: c.total };
  if (c.pendingOnly && scope !== 'release') return { canary: rel, state: 'pending', reason: c.pendingReasons.join(' | '), tests: c.total };
  return { canary: rel, state: 'fail', reason: `exit ${r.status}: ${c.failed} failed test(s)`, tests: c.total };
}

function runCompiler(root) {
  if (!existsSync(join(root, COMPILER))) return { state: 'fail', reason: `PENDING: ${COMPILER} (lane 1d)` };
  console.log(`\n=== node ${COMPILER}`);
  const r = spawnSync(process.execPath, [COMPILER], { cwd: root, stdio: 'inherit' });
  return r.status === 0 ? { state: 'pass' } : { state: 'fail', reason: `exit ${r.status ?? r.error}` };
}

const pinOf = (pkg) => pkg?.dependencies?.[BASE_UI] ?? null;

/** Every resolved @base-ui/react version in an `npm ls --all --json` tree. */
export function resolvedVersions(tree) {
  const out = [];
  const walk = (node) => {
    for (const [name, dep] of Object.entries(node?.dependencies ?? {})) {
      if (name === BASE_UI) out.push(dep?.version ?? null);
      walk(dep);
    }
  };
  walk(tree);
  return out;
}

function runLatestLeg(root, leg, latest, tgz) {
  const src = join(root, leg.canary);
  if (!existsSync(src)) return { canary: leg.canary, state: 'fail', reason: `${leg.canary} missing` };
  const tmp = mkdtempSync(join(tmpdir(), 'ag-base-ui-latest-'));
  const dir = join(tmp, leg.canary.split('/').pop());
  try {
    cpSync(src, dir, { recursive: true, filter: (p) => !/(^|\/)(node_modules|dist|test-results)(\/|$)/.test(p.slice(src.length)) });
    const pkgFile = join(dir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
    pkg.dependencies = { ...pkg.dependencies, 'aura-glass': `file:${tgz}` };
    pkg.overrides = { ...pkg.overrides, [BASE_UI]: latest };
    writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`\n=== base-ui latest: ${leg.canary}: npm i --no-save ${BASE_UI}@${latest} (tarball ${tgz})`);
    const inst = sh('npm', ['i', '--no-save', '--no-package-lock', '--no-audit', '--no-fund', '--ignore-scripts', `${BASE_UI}@${latest}`], { cwd: dir });
    if (inst.status !== 0) return { canary: leg.canary, state: 'fail', reason: `npm i exit ${inst.status ?? inst.error}: ${tail(inst.stderr)}` };
    const ls = sh('npm', ['ls', BASE_UI, '--all', '--json'], { cwd: dir });
    let versions;
    try { versions = resolvedVersions(JSON.parse(ls.stdout)); } catch {
      return { canary: leg.canary, state: 'fail', reason: `npm ls ${BASE_UI} printed no JSON (exit ${ls.status})` };
    }
    if (!versions.length || versions.some((v) => v !== latest)) {
      return { canary: leg.canary, state: 'fail', resolved: versions, reason: `${BASE_UI} resolved to [${versions.join(', ')}], expected only ${latest}` };
    }
    const chk = sh(process.execPath, leg.check, { cwd: dir });
    process.stdout.write(chk.stdout);
    process.stderr.write(chk.stderr);
    const output = `${chk.stdout}${chk.stderr}`.trim();
    if (chk.status !== 0) return { canary: leg.canary, state: 'fail', resolved: versions, reason: `${leg.check.join(' ')} exit ${chk.status ?? chk.error}: ${tail(output)}` };
    if (leg.quiet && output) return { canary: leg.canary, state: 'fail', resolved: versions, reason: `${leg.check.join(' ')} printed diagnostics: ${tail(output)}` };
    return { canary: leg.canary, state: 'pass', resolved: versions };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function baseUiLatest(root, base) {
  const res = { pinned: null, base, basePin: null, pinBump: null, latest: null, behind: null, producer: null, legs: [], state: 'error', blocking: true };
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  res.pinned = pinOf(pkg);
  if (!res.pinned) return { ...res, reason: `${BASE_UI} is not a dependency in package.json` };

  if (!existsSync(join(root, PRODUCER))) return { ...res, reason: `PENDING: ${PRODUCER} (REQ-PLAT-77 producer, FIN-C #566)` };
  const p = sh(process.execPath, [PRODUCER], { cwd: root });
  process.stdout.write(p.stdout);
  process.stderr.write(p.stderr);
  res.producer = { exit: p.status, report: p.stdout.trim() };
  if (p.status !== 0) return { ...res, reason: `${PRODUCER} could not produce the version report (exit ${p.status ?? p.error})` };

  const mb = sh('git', ['merge-base', base, 'HEAD'], { cwd: root });
  if (mb.status !== 0) return { ...res, reason: `git merge-base ${base} HEAD failed: ${tail(mb.stderr)}` };
  const mergeBase = mb.stdout.trim();
  const show = sh('git', ['show', `${mergeBase}:package.json`], { cwd: root });
  if (show.status !== 0) return { ...res, reason: `git show ${mergeBase}:package.json failed: ${tail(show.stderr)}` };
  res.mergeBase = mergeBase;
  res.basePin = pinOf(JSON.parse(show.stdout));
  res.pinBump = res.basePin !== res.pinned;
  res.blocking = res.pinBump;

  const view = sh('npm', ['view', `${BASE_UI}@latest`, 'version', '--json'], { cwd: root });
  try { res.latest = JSON.parse(view.stdout); } catch { /* handled below */ }
  if (view.status !== 0 || typeof res.latest !== 'string' || !res.latest) {
    return { ...res, latest: null, reason: `npm view ${BASE_UI}@latest version failed (exit ${view.status ?? view.error}): ${tail(view.stderr)}` };
  }
  res.behind = res.pinned !== res.latest;

  const tgz = join(root, 'aura-glass.tgz');
  if (!existsSync(tgz)) return { ...res, reason: 'aura-glass.tgz missing: no canary packed the tarball (canaries/_shared/consumer-install.mjs)' };
  res.legs = LATEST_LEGS.map((leg) => runLatestLeg(root, leg, res.latest, tgz));
  res.state = res.legs.every((l) => l.state === 'pass') ? 'pass' : 'fail';
  return res;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  let args;
  try { args = parseArgs(argv); } catch (e) {
    console.error(`canaries: ${e.message}\nusage: node ci/plat/canaries.mjs --scope <pr|main> --base <git-ref> --out <dir> [--root <repo>]`);
    return 2;
  }
  if (!(env.CI === 'true' || env.AG_REMOTE_RUNNER === '1')) {
    // PRD-F §12 rule 6: browsers, canary installs and the registry leg run only in GitLab CI / the remote runner.
    console.error(`canaries: plat:test:canaries runs only on GitLab CI or the gated remote runner (machine policy).\nRemote command: node ci/plat/canaries.mjs ${argv.join(' ')}`);
    return 2;
  }
  mkdirSync(args.out, { recursive: true });
  const { classifyPlaywrightReport } = await import(pathToFileURL(join(HERE, 'certification/run.mjs')).href);

  const seeds = await seedExclusions(args.root);
  const canaries = [];
  for (const rel of CANARIES) canaries.push(await runCanary(args.root, rel, args.out, args.scope, classifyPlaywrightReport));
  const compiler = runCompiler(args.root);
  const latest = baseUiLatest(args.root, args.base);
  writeFileSync(join(args.out, 'base-ui-latest.json'), `${JSON.stringify(latest, null, 2)}\n`);

  const reasons = [];
  for (const c of canaries) if (c.state === 'fail') reasons.push(`${c.canary}: ${c.reason}`);
  if (compiler.state === 'fail') reasons.push(`${COMPILER}: ${compiler.reason}`);
  if (latest.state === 'error') reasons.push(`base-ui latest leg: ${latest.reason}`);
  if (latest.state === 'fail' && latest.pinBump) reasons.push(`base-ui latest leg failed and this change bumps the ${BASE_UI} pin ${latest.basePin} -> ${latest.pinned}`);
  const pendings = [
    ...canaries.filter((c) => c.state === 'pending').map((c) => `${c.canary}: ${c.reason}`),
    ...seeds.map((s) => `${s.subpath} is seed-excluded (${s.seedFiles.map((f) => `${f.file}, removed by ${f.removingReqFin}`).join('; ')})`),
  ];
  const verdict = reasons.length ? 'fail' : pendings.length ? 'pending' : 'pass';
  const record = { scope: args.scope, verdict, seedExcluded: seeds, canaries, compiler, baseUiLatest: { state: latest.state, blocking: latest.blocking }, reasons, pending: pendings };
  writeFileSync(join(args.out, 'canaries.json'), `${JSON.stringify(record, null, 2)}\n`);

  if (latest.state === 'fail' && !latest.pinBump) {
    console.log(`\nbase-ui latest leg: fail (reporting; ${BASE_UI} pin ${latest.pinned} unchanged, latest ${latest.latest}):`);
    for (const l of latest.legs.filter((x) => x.state !== 'pass')) console.log(`  ${l.canary}: ${l.reason}`);
  } else if (latest.state === 'pass') {
    console.log(`\nbase-ui latest leg: pass (${BASE_UI}@${latest.latest}, pin ${latest.pinned})`);
  }
  console.log(`\nplat:test:canaries: ${verdict}`);
  for (const r of reasons) console.error(`  fail: ${r}`);
  for (const p of pendings) console.log(`  pending: ${p}`);
  return verdict === 'pass' ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
}
