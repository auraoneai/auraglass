#!/usr/bin/env node
/**
 * verify-labs-admission.mjs — @auraglass/labs admission gate
 * (REQ-SURF-167, REQ-SURF-168 rejection rule, REQ-SURF-169 promotion rules).
 *
 *   node scripts/surf/verify-labs-admission.mjs [--root <dir>] [--manifest <exports.manifest.json>]
 *
 * For every resident entry in <root>/package.json exports (excluding
 * ./package.json) checks, printing `<resident>: <rule> <message>` and exiting
 * 1 on any failure:
 *   (a) ledger      a capability-ledger row whose names contains it, form incl.
 *                   'labs', and an area set;
 *   rejected-spatial  the row's capability is not WebXR, AR preview or a 360
 *                   viewer (rejected for 5.x, REQ-SURF-168);
 *   (b) no-simulation  0 auraglass/no-simulation reports (repo ESLint over the resident);
 *   (c) deep-import every import specifier is react, react-dom, a peer, or a
 *                   public aura-glass entry — aura-glass/compat, /src/**, /dist/** fail;
 *   (d) side-effect no module-scope document/window/storage/navigator access,
 *                   listener or timer call — in expression statements, variable
 *                   initializers and other top-level statements (AST) — and an
 *                   actual `node --input-type=module` import of the entry, with
 *                   globalThis.document/window undefined, that neither throws nor
 *                   registers listeners, timers or rAF callbacks;
 *   (e) no-pause    rAF/timer-loop files also handle visibilitychange +
 *                   IntersectionObserver and the resident's test asserts
 *                   cancelAnimationFrame plus a static frame under reduced
 *                   motion / reduced transparency;
 *   promotion       (REQ-SURF-169) a row with form 'export' must: re-export the
 *                   core symbol from aura-glass[/subpath] with the one-time dev
 *                   warning; be exported by the --manifest entry for its subpath;
 *                   carry `promotedIn` and not outlive one labs minor (labs minor >
 *                   promotedIn minor + 1 fails); satisfy the REQ-SURF-184 demand
 *                   rules (exportDelta > 0, subpath, >= 10 distinct demand links).
 * With zero residents prints `labs admission: 0 residents` and exits 0.
 * `--manifest` that does not exist is a usage error (exit 1), never skipped.
 * No new dependencies — uses the repo's eslint and typescript devDeps.
 */
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve, relative, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const require = createRequire(join(REPO_ROOT, 'package.json'));

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
};
const PKG_ROOT = resolve(argValue('--root') ?? join(REPO_ROOT, 'packages/labs'));
const LEDGER_PATH = join(REPO_ROOT, 'docs/auraglass-5/capability-ledger.json');
const IS_FIXTURE = PKG_ROOT !== join(REPO_ROOT, 'packages/labs');

const MANIFEST_ARG = argValue('--manifest');
const MANIFEST_PATH = MANIFEST_ARG ? resolve(REPO_ROOT, MANIFEST_ARG) : null;
if (args.includes('--manifest') && (!MANIFEST_PATH || !existsSync(MANIFEST_PATH))) {
  console.error(`labs admission: --manifest ${MANIFEST_ARG ?? '<missing value>'} does not exist`);
  process.exit(1);
}

const errors = [];
const fail = (resident, rule, msg) => errors.push(`${resident}: ${rule} ${msg}`);

/* ---------- load ts ---------- */
let ts;
try {
  ts = (await import('typescript')).default;
} catch {
  try { ts = require('typescript'); } catch {
    console.error('labs admission: typescript module unavailable');
    process.exit(1);
  }
}

/* ---------- helpers ---------- */
const SRC_EXT = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const TEST_FILE = /\.(test|spec)\.(ts|tsx|mts|js|jsx|mjs)$/;
function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (SRC_EXT.test(name)) yield p;
  }
}
const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const parse = (file, text = readFileSync(file, 'utf8')) =>
  ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true,
    /\.[jt]sx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

// Public aura-glass entries per contract S-35 (frozen list; compat is never public).
const PUBLIC_AURA = new Set([
  'aura-glass', 'aura-glass/app-shell', 'aura-glass/data', 'aura-glass/date',
  'aura-glass/ai', 'aura-glass/media', 'aura-glass/backdrops', 'aura-glass/three',
  'aura-glass/charts',
]);

// REQ-SURF-168: spatial capabilities rejected for 5.x.
const REJECTED_SPATIAL = /webxr|ar preview|360/i;

// REQ-SURF-184 demand link shape — same pattern as scripts/surf/verify-capability-ledger.mjs.
const DEMAND_URL = /^https:\/\/github\.com\/.+\/issues\/[0-9]+|^https:\/\/.+\/doctor\/reports\/.+/;

function ledgerRows() {
  // Fixtures (--root under tests/) may carry their own mini ledger.
  const fixtureLedger = join(PKG_ROOT, 'capability-ledger.json');
  const path = existsSync(fixtureLedger) ? fixtureLedger : LEDGER_PATH;
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8')).rows ?? [];
}

/** Resolves a relative TS/JS module specifier to a file on disk (bundler resolution). */
function resolveRelative(fromFile, spec) {
  const base = resolve(dirname(fromFile), spec);
  const stem = base.replace(/\.(m?js|jsx)$/, '');
  const candidates = [base];
  for (const ext of ['.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs']) candidates.push(stem + ext);
  for (const ext of ['.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs']) candidates.push(join(base, `index${ext}`));
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

/* ---------- rule (b): auraglass/no-simulation ---------- */
function noSimulationFindings(files) {
  const eslintBin = join(REPO_ROOT, 'node_modules/.bin/eslint');
  if (!existsSync(eslintBin)) {
    return ['<env>: eslint binary missing — cannot run auraglass/no-simulation'];
  }
  const configArg = IS_FIXTURE && existsSync(join(PKG_ROOT, 'eslint.config.js'))
    ? ['--config', join(PKG_ROOT, 'eslint.config.js'), '--no-config-lookup']
    : [];
  const r = spawnSync(eslintBin, [...configArg, '--format', 'json', ...files],
    { encoding: 'utf8', cwd: REPO_ROOT });
  let out;
  try { out = JSON.parse(r.stdout || '[]'); } catch {
    return [`<env>: eslint did not return JSON: ${(r.stderr || r.stdout || '').slice(0, 200)}`];
  }
  const findings = [];
  for (const f of out) {
    for (const m of f.messages ?? []) {
      if (m.ruleId === 'auraglass/no-simulation') findings.push(`${f.filePath}:${m.line}: ${m.message}`);
    }
  }
  return findings;
}

/* ---------- rule (d), static: module-scope DOM access / listener / timer calls ---------- */
// Identifiers whose evaluation at module scope touches the host environment.
const DOM_GLOBALS = new Set(['document', 'window', 'localStorage', 'sessionStorage', 'navigator']);
// Calls that register work at import time (listeners, timers, frames, observers).
const SIDE_EFFECT_CALLS = new Set([
  'addEventListener', 'setInterval', 'setTimeout', 'setImmediate', 'requestAnimationFrame',
  'requestIdleCallback', 'queueMicrotask', 'matchMedia',
]);
const SIDE_EFFECT_MARKER = /__AG_LABS_SIDE_EFFECT/;

/**
 * Returns the first module-scope side effect evaluated by `node` (code that runs
 * when the module is imported). Function and class bodies are deferred and
 * skipped; `typeof X` operands are not evaluations of X.
 */
function moduleScopeEffect(node, sf) {
  let found = null;
  const visit = (n) => {
    if (found) return;
    if (ts.isFunctionLike(n) || ts.isClassLike(n)) return;
    if (ts.isTypeOfExpression(n)) return;
    if (ts.isTypeNode(n)) return;
    if (ts.isIdentifier(n)) {
      const p = n.parent;
      const isPropertyName = p && (ts.isPropertyAccessExpression(p) && p.name === n);
      const isDeclName = p && (ts.isVariableDeclaration(p) || ts.isBindingElement(p) ||
        ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) && p.name === n &&
        !ts.isShorthandPropertyAssignment(p);
      if (!isPropertyName && !isDeclName && DOM_GLOBALS.has(n.text)) {
        found = `module-scope ${n.text} access: ${node.getText(sf).slice(0, 80)}`;
        return;
      }
    }
    if (ts.isCallExpression(n)) {
      const callee = n.expression;
      const name = ts.isIdentifier(callee) ? callee.text
        : ts.isPropertyAccessExpression(callee) ? callee.name.text : null;
      if (name && SIDE_EFFECT_CALLS.has(name)) {
        found = `module-scope ${name}() call: ${node.getText(sf).slice(0, 80)}`;
        return;
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
}

function staticSideEffects(file, sf) {
  const findings = [];
  for (const stmt of sf.statements) {
    if (ts.isImportDeclaration(stmt) || ts.isExportDeclaration(stmt) ||
        ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt) ||
        ts.isFunctionDeclaration(stmt) || ts.isClassDeclaration(stmt) ||
        ts.isModuleDeclaration(stmt) || ts.isEnumDeclaration(stmt)) continue;
    if (SIDE_EFFECT_MARKER.test(stmt.getText(sf))) {
      findings.push([file, 'side-effect', `module-scope side effect marker: ${stmt.getText(sf).slice(0, 80)}`]);
      continue;
    }
    const hit = moduleScopeEffect(stmt, sf);
    if (hit) findings.push([file, 'side-effect', hit]);
  }
  return findings;
}

/* ---------- TS-AST checks (c, d-static, e) ---------- */
function astChecks(resident, files, peers) {
  const findings = [];
  let hasLoop = false;
  let hasVisibilityPause = false;
  let hasObserver = false;
  let hasReducedFrame = false;
  let testCoversPause = false;

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const sf = parse(file, text);
    const isTest = TEST_FILE.test(file);

    // (c) import specifiers
    for (const stmt of sf.statements) {
      if (ts.isImportDeclaration(stmt) || ts.isExportDeclaration(stmt)) {
        const spec = stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)
          ? stmt.moduleSpecifier.text : null;
        if (!spec) continue;
        if (spec.startsWith('.') || spec.startsWith('/')) continue; // relative is resident-local
        if (spec === 'react' || spec.startsWith('react/') ||
            spec === 'react-dom' || spec.startsWith('react-dom/')) continue;
        if (spec.startsWith('aura-glass')) {
          if (!PUBLIC_AURA.has(spec)) {
            findings.push([file, 'deep-import', `non-public aura-glass specifier ${spec}`]);
          }
          continue;
        }
        if (peers.has(spec)) continue;
        if (isTest && (spec.startsWith('@jest/') || spec.startsWith('@testing-library/'))) continue;
        findings.push([file, 'deep-import', `non-allowlisted specifier ${spec}`]);
      }
    }

    // (d) static module-scope side effects (tests are not part of the entry).
    if (!isTest) findings.push(...staticSideEffects(file, sf));

    // (e) loops must pause and degrade to static frames
    if (/\brequestAnimationFrame\b|\bsetInterval\s*\(/.test(text)) hasLoop = true;
    if (/visibilitychange/.test(text)) hasVisibilityPause = true;
    if (/IntersectionObserver/.test(text)) hasObserver = true;
    if (/prefers-reduced-motion|reducedTransparency|forcedColors/.test(text)) hasReducedFrame = true;
    if (isTest && /cancelAnimationFrame/.test(text) &&
        /prefers-reduced-motion|reducedTransparency|matchMedia/.test(text)) {
      testCoversPause = true;
    }
  }

  if (hasLoop) {
    if (!hasVisibilityPause) findings.push([files[0], 'no-pause', 'rAF/timer loop never pauses on visibilitychange']);
    if (!hasObserver) findings.push([files[0], 'no-pause', 'rAF/timer loop never pauses offscreen (no IntersectionObserver)']);
    if (!hasReducedFrame) findings.push([files[0], 'no-pause', 'loop does not render a static frame under reduced motion/transparency']);
    if (!testCoversPause) findings.push([files[0], 'no-pause', 'no resident test asserts cancelAnimationFrame + static frame']);
  }
  return findings;
}

/* ---------- rule (d), runtime: import the entry in Node ---------- */
// The resident sources are transpiled (typescript, already a devDep) into a
// scratch dir under <repo>/.artifacts/surf/labs-admission/, so bare specifiers
// resolve exactly as in the repo (react from node_modules, aura-glass through
// the root package's self-reference and exports), then the entry is imported by
// a child `node --input-type=module` with document/window undefined and the
// listener/timer/rAF registration functions instrumented. Calls made from
// third-party modules (react, aura-glass) are not attributed to the resident:
// only calls whose stack includes the scratch dir count. A resident importing
// `aura-glass` therefore needs the root dist/ (the release lane runs after the
// build); an unresolvable import fails closed, never skips.
const IMPORT_PROBE = `
const { writeSync } = await import('node:fs');
const scratch = process.env.AG_LABS_SCRATCH;
const entry = process.env.AG_LABS_ENTRY;
const calls = [];
const fromResident = () => (new Error().stack ?? '').includes(scratch);
const wrap = (obj, key, label) => {
  const orig = obj && obj[key];
  if (typeof orig !== 'function') return;
  obj[key] = function (...a) {
    if (fromResident()) calls.push(label);
    return orig.apply(this, a);
  };
};
globalThis.document = undefined;
globalThis.window = undefined;
wrap(EventTarget.prototype, 'addEventListener', 'addEventListener');
wrap(process, 'on', 'process.on');
wrap(process, 'addListener', 'process.addListener');
wrap(globalThis, 'setTimeout', 'setTimeout');
wrap(globalThis, 'setInterval', 'setInterval');
wrap(globalThis, 'setImmediate', 'setImmediate');
wrap(globalThis, 'queueMicrotask', 'queueMicrotask');
globalThis.requestAnimationFrame = () => { if (fromResident()) calls.push('requestAnimationFrame'); return 0; };
globalThis.requestIdleCallback = () => { if (fromResident()) calls.push('requestIdleCallback'); return 0; };
try {
  await import(entry);
} catch (e) {
  writeSync(1, JSON.stringify({ threw: String(e && e.stack || e).split('\\n').slice(0, 3).join(' | ') }));
  process.exit(3);
}
writeSync(1, JSON.stringify({ calls }));
// Exit explicitly: a leaked timer must not keep the probe alive until the timeout.
process.exit(0);
`;

function transpileTree(srcRoot, outRoot) {
  for (const file of walk(srcRoot)) {
    if (TEST_FILE.test(file) || file.endsWith('.d.ts')) continue;
    const text = readFileSync(file, 'utf8');
    const out = ts.transpileModule(text, {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    // Rewrite resident-local specifiers to the transpiled .mjs siblings.
    const rewrite = (spec) => {
      if (!spec.startsWith('.')) return spec;
      const target = resolveRelative(file, spec);
      if (!target || relative(srcRoot, target).startsWith('..')) return spec;
      let rel = relative(dirname(file), target).replace(SRC_EXT, '.mjs').split('\\').join('/');
      if (!rel.startsWith('.')) rel = `./${rel}`;
      return rel;
    };
    const code = out
      .replace(/(\bfrom\s*)(['"])([^'"]+)\2/g, (_, a, q, s) => `${a}${q}${rewrite(s)}${q}`)
      .replace(/(\bimport\s*\(\s*)(['"])([^'"]+)\2/g, (_, a, q, s) => `${a}${q}${rewrite(s)}${q}`)
      .replace(/(\bimport\s+)(['"])([^'"]+)\2/g, (_, a, q, s) => `${a}${q}${rewrite(s)}${q}`);
    const dest = join(outRoot, relative(srcRoot, file)).replace(SRC_EXT, '.mjs');
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, code);
  }
}

function runtimeImportCheck(resident, entryFile) {
  const scratch = join(REPO_ROOT, '.artifacts/surf/labs-admission', `${process.pid}-${randomBytes(4).toString('hex')}`);
  try {
    const srcRoot = join(PKG_ROOT, 'src');
    transpileTree(srcRoot, scratch);
    const entry = join(scratch, relative(srcRoot, entryFile)).replace(SRC_EXT, '.mjs');
    if (!existsSync(entry)) return [`entry ${relative(REPO_ROOT, entryFile)} did not transpile`];
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', IMPORT_PROBE], {
      encoding: 'utf8',
      cwd: REPO_ROOT,
      env: { ...process.env, AG_LABS_SCRATCH: scratch, AG_LABS_ENTRY: pathToFileURL(entry).href },
      timeout: 60_000,
    });
    let report = null;
    try { report = JSON.parse(r.stdout || 'null'); } catch { /* reported below */ }
    if (report?.threw) return [`importing the entry in Node threw: ${report.threw}`];
    if (r.status !== 0 || !report) {
      return [`importing the entry in Node failed (exit ${r.status}${r.signal ? `, ${r.signal}` : ''}): ${(r.stderr || '').trim().slice(0, 300)}`];
    }
    if (report.calls.length) {
      return [`importing the entry in Node registered ${[...new Set(report.calls)].join(', ')}`];
    }
    return [];
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

/* ---------- REQ-SURF-169 promotion ---------- */
/** Value-export names of a module, following `export *` / `export {…} from` re-exports. */
function exportedNames(file, seen = new Set()) {
  const names = new Set();
  if (!file || seen.has(file) || !existsSync(file)) return names;
  seen.add(file);
  const sf = parse(file);
  const hasExport = (n) => ts.canHaveModifiers(n) &&
    (ts.getModifiers(n) ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
  for (const stmt of sf.statements) {
    if (ts.isExportDeclaration(stmt)) {
      if (stmt.isTypeOnly) continue;
      const spec = stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier) ? stmt.moduleSpecifier.text : null;
      if (!stmt.exportClause) {
        if (spec?.startsWith('.')) for (const n of exportedNames(resolveRelative(file, spec), seen)) names.add(n);
      } else if (ts.isNamedExports(stmt.exportClause)) {
        for (const el of stmt.exportClause.elements) if (!el.isTypeOnly) names.add(el.name.text);
      } else if (ts.isNamespaceExport(stmt.exportClause)) {
        names.add(stmt.exportClause.name.text);
      }
    } else if (hasExport(stmt)) {
      if (ts.isVariableStatement(stmt)) {
        for (const d of stmt.declarationList.declarations) if (ts.isIdentifier(d.name)) names.add(d.name.text);
      } else if ((ts.isFunctionDeclaration(stmt) || ts.isClassDeclaration(stmt) || ts.isEnumDeclaration(stmt)) && stmt.name) {
        names.add(stmt.name.text);
      }
    }
  }
  return names;
}

function manifestExports(subpath) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  const entry = (manifest.entries ?? []).find((e) => e.subpath === subpath);
  if (!entry) return null;
  // Fixture manifests list names; the real build/exports.manifest.json names the
  // entry source, whose value exports are enumerated from the AST.
  if (Array.isArray(entry.exports)) return new Set(entry.exports);
  return exportedNames(entry.source ? join(REPO_ROOT, entry.source) : null);
}

const minorOf = (v) => {
  const m = /^(\d+)\.(\d+)/.exec(String(v ?? ''));
  return m ? { major: Number(m[1]), minor: Number(m[2]) } : null;
};

function promotionChecks(resident, row, files, labsVersion) {
  const subpath = row.subpath ?? '.';
  const core = subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.replace(/^\.\//, '')}`;
  const idxText = files.map((f) => readFileSync(f, 'utf8')).join('\n');
  const reexport = new RegExp(`export\\s+(?:\\*|\\{[^}]*\\})\\s*from\\s+['"]${core.replace(/[/.]/g, '\\$&')}['"]`);
  if (!reexport.test(idxText)) {
    fail(resident, 'promotion', `promoted resident must re-export the core symbol from ${core}`);
  }
  if (!/warnLabsPromoted|warnDeprecated/.test(idxText)) {
    fail(resident, 'promotion', 'promoted resident must fire the one-time dev warning');
  }

  // Core export present in the packed exports manifest.
  if (!MANIFEST_PATH) {
    fail(resident, 'promotion', 'promoted resident needs --manifest to verify the core export');
  } else {
    const exported = manifestExports(subpath);
    if (!exported) fail(resident, 'promotion', `exports manifest has no entry for ${subpath}`);
    else {
      const lower = new Set([...exported].map((e) => String(e).toLowerCase()));
      for (const n of row.names ?? []) {
        if (kebab(n) !== resident && n !== resident) continue;
        if (!exported.has(n) && !lower.has(kebab(n)) && !lower.has(String(n).toLowerCase())) {
          fail(resident, 'promotion', `promoted name ${n} absent from exports manifest entry ${subpath}`);
        }
      }
    }
  }

  // Exactly one labs minor: still present when labs minor > promotedIn minor + 1 fails.
  const at = minorOf(row.promotedIn);
  const now = minorOf(labsVersion);
  if (!at) {
    fail(resident, 'promotion', `row ${row.id} has form 'export' but no promotedIn labs version`);
  } else if (now && (now.major > at.major || now.minor > at.minor + 1)) {
    fail(resident, 'promotion',
      `stale promoted re-export: promoted in labs ${row.promotedIn}, labs is ${labsVersion} — remove it after one labs minor`);
  }

  // REQ-SURF-184 demand rules.
  const delta = (row.exportDelta?.root ?? 0) + (row.exportDelta?.subpath ?? 0);
  if (delta <= 0) fail(resident, 'promotion', `row ${row.id} promoted to export but exportDelta is 0`);
  if (!row.subpath) fail(resident, 'promotion', `row ${row.id} promoted to export but subpath is unset`);
  const urls = new Set((row.demand ?? []).filter((u) => DEMAND_URL.test(u)));
  if (urls.size < 10) fail(resident, 'promotion', `row ${row.id} promotion needs >=10 distinct demand links, has ${urls.size}`);
}

/* ---------- driver ---------- */
const pkgPath = join(PKG_ROOT, 'package.json');
if (!existsSync(pkgPath)) {
  console.error(`labs admission: ${pkgPath} missing`);
  process.exit(1);
}
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const residents = Object.keys(pkg.exports ?? {}).filter((k) => k !== './package.json');
const peers = new Set(Object.keys(pkg.peerDependencies ?? {}).concat(['aura-glass']));

if (!residents.length) {
  console.log('labs admission: 0 residents');
  process.exit(0);
}

const rows = ledgerRows();
for (const entry of residents) {
  const resident = entry.replace(/^\.\//, '');
  const dir = join(PKG_ROOT, 'src', resident);
  const files = [...walk(dir)];
  if (!files.length) { fail(resident, 'missing', `no sources under src/${resident}/`); continue; }
  const entryFile = resolveRelative(join(dir, '_'), './index');

  // (a) ledger row — names may spell the resident as PascalCase or kebab.
  const row = rows.find((r) => (r.names ?? []).some((n) => kebab(n) === resident || n === resident));
  if (!row) fail(resident, 'ledger', 'no capability-ledger row names this resident');
  else {
    if (!(row.form ?? []).includes('labs')) fail(resident, 'ledger', `row ${row.id} form lacks 'labs'`);
    if (!row.area) fail(resident, 'ledger', `row ${row.id} has no area`);
    if (REJECTED_SPATIAL.test(String(row.capability ?? ''))) {
      fail(resident, 'rejected-spatial', `row ${row.id} capability "${row.capability}" is WebXR/AR preview/360 — rejected for 5.x`);
    }
  }

  // REQ-SURF-169: a promoted resident is a one-minor re-export of the core
  // symbol with a dev warning — the only sanctioned module-scope side effect.
  const promoted = Boolean(row?.form?.includes('export'));
  if (promoted) promotionChecks(resident, row, files, pkg.version);

  // (b) no-simulation
  for (const f of noSimulationFindings(files)) fail(resident, 'no-simulation', f);

  // (c)+(d)+(e) AST checks — (d) is exempt in the promotion window.
  for (const [file, rule, msg] of astChecks(resident, files, peers)) {
    if (promoted && rule === 'side-effect') continue;
    fail(resident, rule, `${relative(REPO_ROOT, file)}: ${msg}`);
  }

  // (d) runtime import of the entry.
  if (!promoted) {
    if (!entryFile) fail(resident, 'side-effect', `no src/${resident}/index entry to import`);
    else for (const msg of runtimeImportCheck(resident, entryFile)) fail(resident, 'side-effect', msg);
  }
}

if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  process.exit(1);
}
console.log(`labs admission: ${residents.length} resident(s) ok`);
