#!/usr/bin/env node
/* certification/run.mjs — QUAL lane runner (REQ-QUAL-05, -06; LANE_COMMAND, S-43).
   Usage: node certification/run.mjs --lane <L1..L12|all> --scope <pr|main|nightly|release> [--verdict <path>] [--line 4x]

   Registrations = QUAL built-ins (certification/lanes.config.ts) + every stream's fragments/lanes/<stream>.ts.
   Per registration state: pass | fail | pending | pre-existing (contract §6.1).
   Exit codes: 0 no blocking failure · 1 blocking failure (fail closed, REQ-QUAL-06) · 2 invoked outside a remote
   runner (machine policy; prints the remote command) · 64 usage error.
   Writes $AURAGLASS_EVIDENCE_DIR/qual/<job-slug>/lane-manifest.json (validated against
   certification/schemas/lane-manifest.schema.json before exit). */
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, globSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { cpus } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LANE_IDS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];
const SCOPES = ['pr', 'main', 'nightly', 'release'];
const KINDS = ['node-script', 'jest', 'playwright', 'story-subjects', 'manual-record'];
const BROWSER_KINDS = new Set(['playwright', 'story-subjects']);
const ROW_TIMEOUT_MS = 30 * 60 * 1000;
const GLOB_EXCLUDE = (p) => /(^|\/)(node_modules|dist|legacy|\.git|\.artifacts)(\/|$)/.test(p);

export const EXIT = { ok: 0, fail: 1, local: 2, usage: 64 };

export function parseArgs(argv) {
  const out = { lane: null, scope: null, verdict: null, line: '5x' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const v = argv[i + 1];
    if (a === '--lane') { out.lane = v; i++; }
    else if (a === '--scope') { out.scope = v; i++; }
    else if (a === '--verdict') { out.verdict = v; i++; }
    else if (a === '--line') { out.line = v; i++; }
    else throw new Error(`unknown argument ${a}`);
  }
  if (out.lane !== 'all' && !LANE_IDS.includes(out.lane)) throw new Error(`--lane must be one of ${LANE_IDS.join('|')}|all (got ${out.lane})`);
  if (!SCOPES.includes(out.scope)) throw new Error(`--scope must be one of ${SCOPES.join('|')} (got ${out.scope})`);
  if (!['4x', '5x'].includes(out.line)) throw new Error(`--line must be 4x|5x (got ${out.line})`);
  return out;
}

async function loadTs(file) {
  const res = await build({ entryPoints: [file], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
  const url = `data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`;
  return import(url);
}

/** Built-ins + stream fragments, each tagged with its registering stream. */
export async function loadRegistrations(root = ROOT) {
  const cfg = await loadTs(join(root, 'certification/lanes.config.ts'));
  const { loadFragments } = await import(pathToFileURL(join(root, 'src/contracts/load-fragments.mjs')).href);
  const builtins = [...(cfg.BUILTINS ?? []), ...(cfg.locationBuiltins?.(root) ?? [])];
  const rows = builtins.map(({ owner, ...r }) => ({ ...r, stream: owner ?? 'qual', source: 'certification/lanes.config.ts' }));
  for (const f of await loadFragments('lanes', root)) {
    if (!Array.isArray(f.value)) throw new Error(`${f.file}: default export is not an array`);
    for (const r of f.value) rows.push({ ...r, stream: f.stream, source: f.file.slice(root.length + 1) });
  }
  return { rows, pendingBuiltins: cfg.PENDING_BUILTINS ?? [] };
}

/** Exact scope match: each registration names the scope it runs at (fragments list one row per scope). */
export function selectRows(rows, lane, scope) {
  return rows.filter((r) => (lane === 'all' || r.lane === lane) && r.scope === scope);
}

/** Stream owning the PR branch (contract §6.1 pre-existing attribution); null on main/next/tags (every failure blocks). */
export function branchStream(branch, scope) {
  if (scope !== 'pr' || !branch) return null;
  let m = branch.match(/^(?:next|4x|4x11)-(plat|mat|cmp|surf|qual)\//);
  if (m) return m[1];
  m = branch.match(/^(?:next|4x|4x11)-fin\/([a-h])-/);
  if (m) return { b: 'plat', c: 'plat', d: 'mat', e: 'cmp', f: 'surf', g: 'qual' }[m[1]] ?? null;
  return null;
}

function jestTestMatch(root) {
  // Mirror of jest.config.js testMatch / testPathIgnorePatterns (contract-v1.1 verbatim config).
  const isTest = (p) => /^(src|tests|registry|showcase)\/.*\.test\.(ts|tsx|mjs)$/.test(p) && !/^(src|registry|showcase)\/.*\.test\.mjs$/.test(p)
    || /^fragments\/.*\.test\.ts$/.test(p) || /^scripts\/.*\.test\.(ts|mjs)$/.test(p);
  return (p) => isTest(p) && !GLOB_EXCLUDE(p) && !/^(packages|apps)\//.test(p) && existsSync(join(root, p));
}

function expand(pattern, root) {
  const out = globSync(pattern, { cwd: root, exclude: GLOB_EXCLUDE });
  return out.flatMap((p) => {
    const full = join(root, p);
    if (statSync(full).isDirectory()) return globSync(`${p}/**/*`, { cwd: root, exclude: GLOB_EXCLUDE }).filter((q) => statSync(join(root, q)).isFile());
    return [p];
  }).sort();
}

function run(cmd, args, opts = {}) {
  const t0 = Date.now();
  const r = spawnSync(cmd, args, { cwd: opts.cwd ?? ROOT, encoding: 'utf8', env: { ...process.env, ...opts.env }, timeout: ROW_TIMEOUT_MS, maxBuffer: 256 * 1024 * 1024 });
  const output = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  if (output) process.stdout.write(output.endsWith('\n') ? output : `${output}\n`);
  return { status: r.status, signal: r.signal, error: r.error?.message, output, durationMs: Date.now() - t0 };
}

function runJest(row, root, evidenceDir, idx) {
  const files = expand(row.path, root);
  if (!files.length) return { state: 'fail', reason: `registered path matches nothing: ${row.path}`, tests: 0 };
  const isTest = jestTestMatch(root);
  const tests = files.filter(isTest);
  const sources = files.filter((f) => !isTest(f));
  const outFile = join(evidenceDir, `jest-${idx}.json`);
  const workers = String(Math.max(1, Math.min(cpus().length, 4)));
  const base = ['--experimental-vm-modules', 'node_modules/jest/bin/jest.js', '--ci', '--json', `--outputFile=${outFile}`, `--maxWorkers=${workers}`];
  // Test files run directly; non-test paths (e.g. rule sources) run the tests that import them.
  const args = tests.length ? [...base, '--runTestsByPath', ...tests] : [...base, '--findRelatedTests', ...sources];
  const r = run(process.execPath, args, { cwd: root });
  let report = null;
  try { report = JSON.parse(readFileSync(outFile, 'utf8')); } catch { /* crash: no report */ }
  if (!report) return { state: 'fail', reason: `jest wrote no report (exit ${r.status}${r.signal ? `, ${r.signal}` : ''})`, tests: 0, durationMs: r.durationMs };
  const total = report.numTotalTests ?? 0;
  if (total === 0) return { state: 'fail', reason: `0 tests for ${files.length} subject file(s)`, tests: 0, durationMs: r.durationMs };
  const failedSuites = (report.testResults ?? []).filter((s) => s.status !== 'passed').map((s) => s.name.slice(root.length + 1));
  const ok = r.status === 0 && report.success === true;
  return { state: ok ? 'pass' : 'fail', reason: ok ? undefined : `jest: ${report.numFailedTests} failed test(s), ${report.numRuntimeErrorTestSuites ?? 0} suite error(s)`,
    tests: total, failed: report.numFailedTests ?? 0, failedSuites, durationMs: r.durationMs };
}

function runNodeScript(row, root) {
  const [script, ...args] = row.path.trim().split(/\s+/);
  if (!existsSync(join(root, script))) return { state: 'fail', reason: `registered path missing: ${script}` };
  const r = run(process.execPath, [script, ...args], { cwd: root });
  if (r.error || r.signal) return { state: 'fail', reason: `crashed: ${r.error ?? r.signal}`, durationMs: r.durationMs };
  return { state: r.status === 0 ? 'pass' : 'fail', reason: r.status === 0 ? undefined : `exit ${r.status}`, durationMs: r.durationMs };
}

/** Playwright JSON report → counts. A failing test whose error starts with `pending:` is a producer that has not landed
    (PRD-F §4.3 rule 2; lanes throw it only below release scope). */
export function classifyPlaywrightReport(report) {
  const tests = [];
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) tests.push({ title: spec.title, ...t });
    for (const s of suite.suites ?? []) walk(s);
  };
  for (const s of report.suites ?? []) walk(s);
  const failed = tests.filter((t) => t.status === 'unexpected');
  const pendingRe = /(^|[\s:])pending: /;
  const reasons = failed.map((t) => {
    const last = (t.results ?? []).at(-1);
    return String(last?.error?.message ?? last?.errors?.[0]?.message ?? '');
  });
  const pending = reasons.filter((m) => pendingRe.test(m));
  // Tests annotated `double-pass` run against a contract double (contract §5.2 rule 4): reported apart, never as `pass`.
  const isDouble = (t) => [...(t.annotations ?? []), ...((t.results ?? []).at(-1)?.annotations ?? [])].some((a) => a?.type === 'double-pass');
  const doubles = tests.filter(isDouble).length;
  return { total: tests.length, failed: failed.length, pendingOnly: failed.length > 0 && pending.length === failed.length,
    pendingReasons: [...new Set(pending.map((m) => m.slice(m.search(pendingRe)).trim().split('\n')[0]))], doubles };
}

/** Spec files the cert config cannot run: outside certification/lanes and outside every `<stream>:cert-*` fragment project
    (REQ-QUAL-12: the cert config lists only those). Reported with the fix instead of Playwright's bare "No tests found". */
export function uncoveredSpecs(files, root, certTestDirs) {
  // certTestDirs = fragment cert projects + location-discovered projects (REQ-QUAL-19, lanes/_fixtures/behaviour.ts)
  const dirs = [join(root, 'certification/lanes'), ...certTestDirs].map((d) => (d.endsWith('/') ? d : `${d}/`));
  return files.filter((f) => !dirs.some((d) => join(root, f).startsWith(d)));
}

async function runPlaywright(row, root, evidenceDir, idx, scope) {
  const files = expand(row.path, root).filter((f) => /\.spec\.(ts|tsx|js|mjs)$/.test(f));
  if (!files.length) return { state: 'fail', reason: `registered path matches no spec: ${row.path}` };
  const { loadCertProjects } = await loadTs(join(root, 'certification/lanes/_fixtures/fragments.ts'));
  const { locationProjects } = await loadTs(join(root, 'certification/lanes/_fixtures/behaviour.ts'));
  const projectDirs = [...loadCertProjects(root).projects, ...locationProjects(root)].map((p) => p.testDir);
  const uncovered = uncoveredSpecs(files, root, projectDirs);
  if (uncovered.length) {
    return { state: 'fail', reason: `${uncovered.length} spec(s) outside certification/lanes and every ${row.stream}:cert-* project — register a `
      + `'${row.stream}:cert-<id>' project in fragments/playwright/${row.stream}.json covering: ${uncovered.slice(0, 5).join(', ')}${uncovered.length > 5 ? ', …' : ''}` };
  }
  const outFile = join(evidenceDir, `playwright-${idx}.json`);
  const r = run(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '-c', 'certification/playwright.cert.config.ts', ...files],
    { cwd: root, env: { PLAYWRIGHT_JSON_OUTPUT_NAME: outFile, AG_SCOPE: scope, AG_LANE_EVIDENCE_DIR: evidenceDir } });
  if (r.error || r.signal) return { state: 'fail', reason: `crashed: ${r.error ?? r.signal}`, durationMs: r.durationMs };
  let report = null;
  try { report = JSON.parse(readFileSync(outFile, 'utf8')); } catch { /* no report */ }
  if (!report) return { state: 'fail', reason: `playwright wrote no report (exit ${r.status})`, durationMs: r.durationMs };
  const c = classifyPlaywrightReport(report);
  if (c.total === 0) return { state: 'fail', reason: '0 tests', tests: 0, durationMs: r.durationMs };
  if (r.status === 0) {
    if (c.doubles === c.total) return { state: 'double-pass', tests: c.total, durationMs: r.durationMs };
    return { state: 'pass', tests: c.total - c.doubles, ...(c.doubles ? { doublePass: c.doubles } : {}), durationMs: r.durationMs };
  }
  if (c.pendingOnly && scope !== 'release') return { state: 'pending', reason: c.pendingReasons.join(' | '), tests: c.total, durationMs: r.durationMs };
  return { state: 'fail', reason: `exit ${r.status}: ${c.failed} failed test(s)`, tests: c.total, durationMs: r.durationMs };
}

/** L6 capture evidence written by certification/lanes/environment-visual.spec.ts (plan + per-worker capture rows). */
export function readCaptureEvidence(evidenceDir) {
  const dir = join(evidenceDir, 'environment-visual');
  if (!existsSync(join(dir, 'plan.json'))) return null;
  const plan = JSON.parse(readFileSync(join(dir, 'plan.json'), 'utf8'));
  const rows = globSync('captures-*.jsonl', { cwd: dir })
    .flatMap((f) => readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)));
  const captures = rows.reduce((n, r) => n + (r.captures ?? 0), 0);
  const seconds = rows.reduce((n, r) => n + (r.durationMs ?? 0), 0) / 1000;
  return { plan, captures, captureRate: captures && seconds ? captures / seconds : null };
}

function runManualRecord(row, root) {
  const files = expand(row.path, root);
  return files.length ? { state: 'pass', records: files.length } : { state: 'pending', reason: `no record at ${row.path}` };
}

export async function executeRow(row, ctx) {
  if (!KINDS.includes(row.kind)) return { state: 'fail', reason: `unknown kind ${row.kind}` };
  if (row.failClosed !== true) return { state: 'fail', reason: 'registration must set failClosed: true (S-43)' };
  if (BROWSER_KINDS.has(row.kind) && row.remote !== true) return { state: 'fail', reason: `remote:false is not allowed for browser kind ${row.kind}` };
  switch (row.kind) {
    case 'node-script': return runNodeScript(row, ctx.root);
    case 'jest': return runJest(row, ctx.root, ctx.evidenceDir, ctx.idx);
    case 'playwright': return runPlaywright(row, ctx.root, ctx.evidenceDir, ctx.idx, ctx.scope ?? 'pr');
    case 'manual-record': return runManualRecord(row, ctx.root);
    case 'story-subjects': {
      if (!existsSync(join(ctx.root, 'storybook-static/cert-manifest.json'))) return { state: 'pending', reason: 'storybook-static/cert-manifest.json not built (G-01 write-cert-manifest)' };
      return { state: 'pending', reason: 'story-subjects execution lands with the subject resolver (G-01)' };
    }
  }
}

function sha256(file) {
  return existsSync(file) ? createHash('sha256').update(readFileSync(file)).digest('hex') : null;
}

function gitSha(root) {
  if (process.env.CI_COMMIT_SHA) return process.env.CI_COMMIT_SHA;
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); } catch { return null; }
}

/** Minimal JSON-schema check for the manifest (types, required keys, enums) — no extra dependency. */
export function validateManifest(manifest, schema) {
  const errors = [];
  const check = (value, s, path) => {
    if (s.enum && !s.enum.includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in enum`);
    const types = s.type ? [].concat(s.type) : null;
    if (types) {
      const t = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;
      if (!types.includes(t) && !(t === 'integer' && types.includes('number'))) { errors.push(`${path}: type ${t}, expected ${types.join('|')}`); return; }
    }
    if (s.required) for (const k of s.required) if (!(k in (value ?? {}))) errors.push(`${path}.${k}: required`);
    if (s.properties && value && typeof value === 'object') for (const [k, sub] of Object.entries(s.properties)) if (k in value) check(value[k], sub, `${path}.${k}`);
    if (s.items && Array.isArray(value)) value.forEach((v, i) => check(v, s.items, `${path}[${i}]`));
  };
  check(manifest, schema, '$');
  return errors;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  let args;
  try { args = parseArgs(argv); } catch (e) { console.error(`run.mjs: ${e.message}`); return EXIT.usage; }
  const command = `node certification/run.mjs ${argv.join(' ')}`;
  if (!(env.CI === 'true' || env.AG_REMOTE_RUNNER === '1' || env.AG_CERT_ALLOW_LOCAL === '1')) {
    console.error(`run.mjs: certification lanes run only on GitLab CI or the gated remote runner (machine policy).\nRemote command: ${command}`);
    return EXIT.local;
  }
  const t0 = Date.now();
  const root = ROOT;
  const jobSlug = env.CI_JOB_NAME_SLUG || `qual-certify-${args.lane.toLowerCase()}`;
  const evidenceDir = join(root, env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', jobSlug);
  mkdirSync(evidenceDir, { recursive: true });
  const manifestPath = join(evidenceDir, 'lane-manifest.json');

  let regs;
  try { regs = await loadRegistrations(root); } catch (e) {
    console.error(`run.mjs: failed to load lane registrations: ${e.stack ?? e.message}`);
    return EXIT.fail;
  }
  const rows = selectRows(regs.rows, args.lane, args.scope);
  const prStream = branchStream(env.CI_COMMIT_BRANCH || env.CI_COMMIT_REF_NAME, args.scope);
  const results = [];
  for (const [idx, row] of rows.entries()) {
    console.log(`\n=== [${row.lane}] ${row.stream} ${row.kind} ${row.path} (${row.source})`);
    let res;
    try { res = await executeRow(row, { root, evidenceDir, idx, scope: args.scope }); } catch (e) { res = { state: 'fail', reason: `runner crash: ${e.message}` }; }
    if (res.state === 'fail' && prStream && row.stream !== prStream) res = { ...res, state: 'pre-existing', blockingFor: row.stream };
    console.log(`=== [${row.lane}] ${res.state}${res.reason ? ` — ${res.reason}` : ''}`);
    const entry = { lane: row.lane, stream: row.stream, kind: row.kind, path: row.path, scope: row.scope, source: row.source, ...res };
    results.push(Object.fromEntries(Object.entries(entry).filter(([, v]) => v !== undefined)));
    if (res.state === 'pass' && res.doublePass) {
      // the contract-double tests of a passing row are their own `double-pass` result (never counted as pass)
      results.push({ lane: row.lane, stream: row.stream, kind: row.kind, path: `${row.path} (contract doubles)`, scope: row.scope, source: row.source,
        state: 'double-pass', tests: res.doublePass });
    }
  }
  for (const p of regs.pendingBuiltins.filter((p) => args.lane === 'all' || p.lane === args.lane)) {
    results.push({ lane: p.lane, stream: 'qual', kind: 'node-script', path: p.path, scope: args.scope, source: 'certification/lanes.config.ts', state: 'pending', reason: `producer ${p.producer} not merged` });
  }
  const lanes = args.lane === 'all' ? LANE_IDS : [args.lane];
  const emptyLanes = lanes.filter((l) => !results.some((r) => r.lane === l && r.state !== 'pending'));
  for (const l of emptyLanes) {
    // REQ-QUAL-06: 0 subjects → pending at pr/main/nightly, fail at release.
    if (!results.some((r) => r.lane === l)) results.push({ lane: l, stream: 'qual', kind: 'node-script', path: '(no registrations)', scope: args.scope, source: null,
      state: args.scope === 'release' ? 'fail' : 'pending', reason: '0 subjects registered for this lane at this scope' });
  }
  const tests = results.reduce((n, r) => n + (r.tests ?? 0), 0);
  // L6 (REQ-QUAL-04/-12): planned cells, live subjects, the packed tarball's sha256 and the measured capture rate.
  const capture = readCaptureEvidence(evidenceDir);
  const manifest = {
    version: 1, lane: args.lane, line: args.line, sha: gitSha(root), scope: args.scope,
    branch: env.CI_COMMIT_BRANCH || env.CI_COMMIT_REF_NAME || null, prStream,
    runnerTag: env.CI_RUNNER_TAGS || null, imageDigest: env.CI_JOB_IMAGE || null, browserVersions: {},
    subjects: [...new Set([...results.map((r) => r.path), ...(capture?.plan.subjects ?? [])])], cells: capture?.plan.cells ?? [], results,
    thresholdsSha256: sha256(join(root, 'certification/thresholds.json')),
    scenesSha256: sha256(join(root, 'certification/scenes/scenes.manifest.json')),
    inventorySha256: sha256(join(root, 'storybook-static/cert-manifest.json')),
    durationMs: Date.now() - t0, captureRate: capture?.captureRate ?? null,
    ...(capture ? { tarballSha256: capture.plan.tarball?.sha256 ?? null, storybookIndexSha256: capture.plan.storybookIndexSha256 ?? null, captures: capture.captures } : {}),
    summary: Object.fromEntries(['pass', 'fail', 'pending', 'pre-existing', 'double-pass'].map((s) => [s, results.filter((r) => r.state === s).length])),
    tests,
  };
  const schema = JSON.parse(readFileSync(join(root, 'certification/schemas/lane-manifest.schema.json'), 'utf8'));
  const errors = validateManifest(manifest, schema);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  if (args.verdict) console.error('run.mjs: --verdict is produced by the release-verdict work item (G-16); no verdict written.');
  console.log(`\nlane-manifest: ${manifestPath.slice(root.length + 1)}  ${JSON.stringify(manifest.summary)}`);
  if (errors.length) { console.error(`run.mjs: lane manifest invalid:\n${errors.join('\n')}`); return EXIT.fail; }
  const blocking = results.filter((r) => r.state === 'fail');
  if (args.verdict && args.scope === 'release') return EXIT.fail;
  if (blocking.length) {
    console.error(`run.mjs: ${blocking.length} blocking failure(s):\n${blocking.map((r) => `  [${r.lane}] ${r.stream} ${r.path}: ${r.reason}`).join('\n')}`);
    return EXIT.fail;
  }
  return EXIT.ok;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(EXIT.fail); });
}
