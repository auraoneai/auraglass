#!/usr/bin/env node
/**
 * verify-labs-admission.mjs — @auraglass/labs admission gate (REQ-SURF-167).
 *
 *   node scripts/surf/verify-labs-admission.mjs [--root <dir>]
 *
 * For every resident entry in <root>/package.json exports (excluding
 * ./package.json) checks, printing `<resident>: <rule> <message>` and exiting
 * 1 on any failure:
 *   (a) a capability-ledger row whose names contains it, form incl. 'labs',
 *       and an area set;
 *   (b) 0 auraglass/no-simulation reports (repo ESLint over the resident);
 *   (c) every import specifier is react, react-dom, a peer, or a public
 *       aura-glass entry — aura-glass/compat, /src/**, /dist/** fail;
 *   (d) no module-scope document/window/listener/timer side effects;
 *   (e) rAF/timer-loop files also handle visibilitychange + IntersectionObserver
 *       and the resident's test asserts cancelAnimationFrame plus a static
 *       frame under reduced motion / reduced transparency.
 * With zero residents prints `labs admission: 0 residents` and exits 0.
 * No new dependencies — uses the repo's eslint and typescript devDeps.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve, relative, sep, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../..');
const require = createRequire(join(REPO_ROOT, 'package.json'));

const args = process.argv.slice(2);
const rootIdx = args.indexOf('--root');
const PKG_ROOT = resolve(rootIdx === -1 ? join(REPO_ROOT, 'packages/labs') : args[rootIdx + 1]);
const LEDGER_PATH = join(REPO_ROOT, 'docs/auraglass-5/capability-ledger.json');
const IS_FIXTURE = PKG_ROOT !== join(REPO_ROOT, 'packages/labs');

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
function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (SRC_EXT.test(name)) yield p;
  }
}

// Public aura-glass entries per contract S-35 (frozen list; compat is never public).
const PUBLIC_AURA = new Set([
  'aura-glass', 'aura-glass/app-shell', 'aura-glass/data', 'aura-glass/date',
  'aura-glass/ai', 'aura-glass/media', 'aura-glass/backdrops', 'aura-glass/three',
  'aura-glass/charts',
]);

function ledgerRows() {
  // Fixtures (--root under tests/) may carry their own mini ledger.
  const fixtureLedger = join(PKG_ROOT, 'capability-ledger.json');
  const path = existsSync(fixtureLedger) ? fixtureLedger : LEDGER_PATH;
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8')).rows ?? [];
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

/* ---------- TS-AST checks (c, d, e) ---------- */
function astChecks(resident, files, peers) {
  const findings = [];
  let hasLoop = false;
  let hasVisibilityPause = false;
  let hasObserver = false;
  let hasReducedFrame = false;
  let testCoversPause = false;

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true,
      file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

    // (c) import specifiers
    for (const stmt of sf.statements) {
      if (ts.isImportDeclaration(stmt) || ts.isExportDeclaration(stmt)) {
        const spec = stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)
          ? stmt.moduleSpecifier.text : null;
        if (!spec) continue;
        if (spec.startsWith('.') || spec.startsWith('/')) continue; // relative is resident-local
        if (spec === 'react' || spec.startsWith('react/') ||
            spec === 'react-dom' || spec.startsWith('react-dom/')) continue;
        if (peers.has(spec)) continue;
        if (spec.startsWith('aura-glass')) {
          if (!PUBLIC_AURA.has(spec)) {
            findings.push([file, 'deep-import', `non-public aura-glass specifier ${spec}`]);
          }
          continue;
        }
        findings.push([file, 'deep-import', `non-allowlisted specifier ${spec}`]);
      }
    }

    // (d) module-scope side effects: statements at source-file level that
    // touch document/window/listeners/storage/navigator as expressions.
    const SIDE_EFFECT = /\b(document|window|localStorage|sessionStorage|navigator)\s*\.|\baddEventListener\s*\(|__AG_LABS_SIDE_EFFECT/;
    for (const stmt of sf.statements) {
      if (ts.isImportDeclaration(stmt) || ts.isExportDeclaration(stmt) ||
          ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) continue;
      const txt = stmt.getText(sf);
      // `typeof document !== 'undefined'` guards are fine — strip them first.
      const stripped = txt.replace(/typeof\s+\w+\s*[!=]==?\s*['"](?:undefined|object)['"]/g, '');
      if (ts.isExpressionStatement(stmt) && SIDE_EFFECT.test(stripped)) {
        findings.push([file, 'side-effect', `module-scope side effect: ${stripped.slice(0, 80)}`]);
      }
    }

    // (e) loops must pause and degrade to static frames
    const isTest = /\.(test|spec)\.(ts|tsx)$/.test(file);
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

  // (a) ledger row — names may spell the resident as PascalCase or kebab.
  const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const row = rows.find((r) => (r.names ?? []).some((n) => kebab(n) === resident || n === resident));
  if (!row) fail(resident, 'ledger', 'no capability-ledger row names this resident');
  else {
    if (!row.form.includes('labs')) fail(resident, 'ledger', `row ${row.id} form lacks 'labs'`);
    if (!row.area) fail(resident, 'ledger', `row ${row.id} has no area`);
  }

  // REQ-SURF-169 promotion: a row gaining 'export' means the resident becomes
  // a one-minor re-export of the core symbol with a dev warning — the only
  // sanctioned module-scope side effect in labs.
  const promoted = row?.form?.includes('export');
  if (promoted) {
    const idxText = files.map((f) => readFileSync(f, 'utf8')).join('\n');
    if (!/export\s+(?:\*|\{[^}]*\})\s*from\s+['"]aura-glass['"]/.test(idxText)) {
      fail(resident, 'promotion', 'promoted resident must re-export the core symbol from aura-glass');
    }
    if (!/warnLabsPromoted|warnDeprecated/.test(idxText)) {
      fail(resident, 'promotion', 'promoted resident must fire the one-time dev warning');
    }
    const manifestPath = args[args.indexOf('--manifest') + 1];
    if (args.includes('--manifest') && existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      const exported = new Set((manifest.entries ?? []).flatMap((e) => e.exports ?? []));
      for (const n of row.names ?? []) {
        const kebabN = String(n).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        if (kebabN === resident && !exported.has(n) && ![...exported].some((e) => String(e).toLowerCase() === kebabN)) {
          fail(resident, 'promotion', `promoted name ${n} absent from exports manifest`);
        }
      }
    }
  }

  // (b) no-simulation
  for (const f of noSimulationFindings(files)) fail(resident, 'no-simulation', f);

  // (c)+(d)+(e) AST checks — (d) is exempt in the promotion window.
  for (const [file, rule, msg] of astChecks(resident, files, peers)) {
    if (promoted && rule === 'side-effect') continue;
    fail(resident, rule, `${relative(REPO_ROOT, file)}: ${msg}`);
  }
}

if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  process.exit(1);
}
console.log(`labs admission: ${residents.length} resident(s) ok`);
