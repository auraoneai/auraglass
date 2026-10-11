/* scripts/qual/lib/dist-perf.cjs — implementation of REQ-QUAL-46 (see scripts/qual/verify-dist-perf.mjs for the CLI and
   the rule list). CommonJS so Jest (contract jest.config.js: .mjs is transformed to CJS but loaded as ESM) can load it
   in-process; the CLI imports it through createRequire. QUAL-owned. */
'use strict';
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { existsSync, mkdtempSync, readdirSync, readFileSync, statSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, relative, resolve, sep } = require('node:path');
const { gzipSync } = require('node:zlib');
const ts = require('typescript');
const picomatch = require('picomatch');

const ROOT = resolve(__dirname, '..', '..', '..');
const DEFAULT_BASELINE = join(ROOT, 'scripts', 'qual', 'baselines', 'dist-perf.json');

const BANNED_MODULE_RE = /^(?:chart\.js|react-chartjs-2|date-fns|three|@react-three\/[^/]+|motion|framer-motion|d3-[^/]+)(?:\/|$)/;
const BANNED_PACKAGES = ['chart.js', 'chart.js/*', 'react-chartjs-2', 'react-chartjs-2/*', 'date-fns', 'date-fns/*', 'three', 'three/*',
  '@react-three/*', 'motion', 'motion/*', 'framer-motion', 'framer-motion/*', 'd3-*'];
const REACT_EXTERNALS = ['react', 'react/*', 'react-dom', 'react-dom/*'];

/** MutationObserver is allowed only here (REQ-QUAL-46): CMP's DismissableLayer primitive and Base UI internals. */
const MUTATION_OBSERVER_ALLOW = ['**/primitives/DismissableLayer*', '**/@base-ui/**', '**/node_modules/@base-ui/**'];

const LAYOUT_CAMEL = ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'inlineSize', 'blockSize',
  'minInlineSize', 'maxInlineSize', 'minBlockSize', 'maxBlockSize', 'top', 'right', 'bottom', 'left', 'inset', 'insetInline',
  'insetBlock', 'insetInlineStart', 'insetInlineEnd', 'insetBlockStart', 'insetBlockEnd', 'margin', 'marginTop', 'marginRight',
  'marginBottom', 'marginLeft', 'marginInline', 'marginBlock', 'marginInlineStart', 'marginInlineEnd', 'marginBlockStart',
  'marginBlockEnd', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingInline', 'paddingBlock',
  'paddingInlineStart', 'paddingInlineEnd', 'paddingBlockStart', 'paddingBlockEnd', 'borderWidth', 'borderTopWidth',
  'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'fontSize', 'lineHeight', 'flexBasis', 'flexGrow', 'flexShrink',
  'gridTemplateColumns', 'gridTemplateRows', 'gap', 'rowGap', 'columnGap'];
const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const BANNED_KEYFRAME_KEYS = new Set(['backdropFilter', 'WebkitBackdropFilter', 'webkitBackdropFilter', 'filter', '--_ag-blur',
  'backdrop-filter', '-webkit-backdrop-filter', ...LAYOUT_CAMEL, ...LAYOUT_CAMEL.map(kebab)]);
const BANNED_TRANSITION_PROPS = new Set(['backdrop-filter', '-webkit-backdrop-filter', 'filter', '--_ag-blur', ...LAYOUT_CAMEL.map(kebab)]);
const STYLE_TRANSITION_KEYS = new Set(['transition', 'transitionProperty', 'webkitTransition', 'WebkitTransition']);
const STYLE_TRANSITION_CSS = new Set(['transition', 'transition-property', '-webkit-transition']);

const RULES = ['chartjs-register', 'chart-defaults', 'defaults-plugins', 'window-global-write', 'animate-banned-prop',
  'transition-banned-prop', 'elements-from-point', 'mutation-observer', 'fe-turbulence', 'banned-module', 'bundle-failed'];

// ------------------------------------------------------------------------------------------------ static scan

const nameOf = (n) => (n && (ts.isIdentifier(n) || ts.isPrivateIdentifier(n)) ? n.text : n && ts.isStringLiteralLike(n) ? n.text : null);
const accessName = (n) => (ts.isPropertyAccessExpression(n) ? n.name.text
  : ts.isElementAccessExpression(n) && ts.isStringLiteralLike(n.argumentExpression) ? n.argumentExpression.text : null);
const isAccess = (n) => ts.isPropertyAccessExpression(n) || ts.isElementAccessExpression(n);
const unparen = (n) => { while (n && (ts.isParenthesizedExpression(n) || ts.isAsExpression?.(n) || ts.isNonNullExpression(n))) n = n.expression; return n; };
const rootIdentifier = (n) => { n = unparen(n); while (n && isAccess(n)) n = unparen(n.expression); return n && ts.isIdentifier(n) ? n.text : null; };
const isAssignOp = (k) => k >= ts.SyntaxKind.FirstAssignment && k <= ts.SyntaxKind.LastAssignment;
const insideFunction = (n) => {
  for (let p = n.parent; p; p = p.parent) {
    if (ts.isFunctionLike(p) || ts.isClassStaticBlockDeclaration(p) || ts.isPropertyDeclaration(p)) return true;
  }
  return false;
};

/** Every string fragment an expression can evaluate to, as far as literals tell (concatenation, templates, conditionals). */
function stringPieces(expr, consts) {
  const out = [];
  const visit = (n, depth) => {
    if (!n || depth > 8) return;
    n = unparen(n);
    if (ts.isStringLiteralLike(n)) out.push(n.text);
    else if (ts.isTemplateExpression(n)) { out.push(n.head.text); for (const s of n.templateSpans) { visit(s.expression, depth + 1); out.push(s.literal.text); } }
    else if (ts.isBinaryExpression(n)) { visit(n.left, depth + 1); visit(n.right, depth + 1); }
    else if (ts.isConditionalExpression(n)) { visit(n.whenTrue, depth + 1); visit(n.whenFalse, depth + 1); }
    else if (ts.isArrayLiteralExpression(n)) n.elements.forEach((e) => visit(e, depth + 1));
    else if (ts.isCallExpression(n) && accessName(n.expression) === 'join' && isAccess(n.expression)) visit(n.expression.expression, depth + 1);
    else if (ts.isIdentifier(n) && consts.has(n.text)) visit(consts.get(n.text), depth + 1);
  };
  visit(expr, 0);
  return out;
}

/** CSS property names a transition / transition-property value names: the first token of every comma segment. */
function transitionProperties(text) {
  return text.split(',').map((seg) => seg.trim().split(/\s+/)[0]).filter(Boolean).map((p) => p.toLowerCase() === p ? p : kebab(p));
}
const bannedInTransition = (pieces) => {
  const hits = new Set();
  for (const piece of pieces) for (const p of transitionProperties(piece)) if (BANNED_TRANSITION_PROPS.has(p)) hits.add(p);
  return [...hits];
};

function keyframeKeys(expr, consts, depth = 0) {
  const keys = [];
  expr = unparen(expr);
  if (!expr || depth > 6) return keys;
  if (ts.isIdentifier(expr) && consts.has(expr.text)) return keyframeKeys(consts.get(expr.text), consts, depth + 1);
  if (ts.isArrayLiteralExpression(expr)) for (const e of expr.elements) keys.push(...keyframeKeys(e, consts, depth + 1));
  if (ts.isObjectLiteralExpression(expr)) {
    for (const p of expr.properties) {
      if (ts.isSpreadAssignment(p)) { keys.push(...keyframeKeys(p.expression, consts, depth + 1)); continue; }
      const k = p.name && (nameOf(p.name) ?? (ts.isComputedPropertyName(p.name) && ts.isStringLiteralLike(p.name.expression) ? p.name.expression.text : null));
      if (k) keys.push(k);
    }
  }
  return keys;
}

/** Scans one JS source text; returns [{rule, line, snippet}] (line is 1-based). */
function scanSource(text, fileName = 'file.js') {
  const sf = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const consts = new Map();
  const found = [];
  const hit = (rule, node, detail) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    found.push({ rule, line: line + 1, snippet: node.getText(sf).replace(/\s+/g, ' ').slice(0, 160), ...(detail ? { detail } : {}) });
  };
  const collect = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer
      && (ts.getCombinedNodeFlags(n) & ts.NodeFlags.Const)) consts.set(n.name.text, n.initializer);
    ts.forEachChild(n, collect);
  };
  collect(sf);
  const allowedMo = picomatch(MUTATION_OBSERVER_ALLOW, { dot: true });
  const moAllowed = allowedMo(fileName.split(sep).join('/'));

  const visit = (n) => {
    // --- Chart.js global registration / mutation
    if (ts.isPropertyAccessExpression(n)) {
      const obj = unparen(n.expression);
      const objName = ts.isIdentifier(obj) ? obj.text : isAccess(obj) ? accessName(obj) : null;
      if (n.name.text === 'register' && objName === 'ChartJS') hit('chartjs-register', n);
      if (n.name.text === 'defaults' && ts.isIdentifier(obj) && obj.text === 'Chart') hit('chart-defaults', n);
      if (n.name.text === 'plugins' && objName === 'defaults') hit('defaults-plugins', n);
    }
    // --- module-scope window.<x> = …
    if (ts.isBinaryExpression(n) && isAssignOp(n.operatorToken.kind) && isAccess(unparen(n.left))
      && rootIdentifier(n.left) === 'window' && !insideFunction(n)) hit('window-global-write', n);
    // --- .animate(keyframes)
    if (ts.isCallExpression(n) && isAccess(n.expression) && accessName(n.expression) === 'animate' && n.arguments.length) {
      const bad = [...new Set(keyframeKeys(n.arguments[0], consts).filter((k) => BANNED_KEYFRAME_KEYS.has(k)))];
      if (bad.length) hit('animate-banned-prop', n, bad.join(','));
    }
    // --- style.transition = … / style.setProperty('transition', …)
    if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.EqualsToken && isAccess(unparen(n.left))) {
      const left = unparen(n.left);
      const key = accessName(left);
      const holder = unparen(left.expression);
      if (key && STYLE_TRANSITION_KEYS.has(key) && (isAccess(holder) ? accessName(holder) === 'style' : ts.isIdentifier(holder) && /style$/i.test(holder.text))) {
        const bad = bannedInTransition(stringPieces(n.right, consts));
        if (bad.length) hit('transition-banned-prop', n, bad.join(','));
      }
    }
    if (ts.isCallExpression(n) && isAccess(n.expression) && accessName(n.expression) === 'setProperty' && n.arguments.length >= 2) {
      const prop = stringPieces(n.arguments[0], consts)[0];
      if (prop && STYLE_TRANSITION_CSS.has(prop)) {
        const bad = bannedInTransition(stringPieces(n.arguments[1], consts));
        if (bad.length) hit('transition-banned-prop', n, bad.join(','));
      }
    }
    // --- style: { transition: … } (compiled JSX / createElement / cloneElement props)
    if (ts.isPropertyAssignment(n) && STYLE_TRANSITION_KEYS.has(nameOf(n.name) ?? '')
      && ts.isObjectLiteralExpression(n.parent) && ts.isPropertyAssignment(n.parent.parent) && nameOf(n.parent.parent.name) === 'style') {
      const bad = bannedInTransition(stringPieces(n.initializer, consts));
      if (bad.length) hit('transition-banned-prop', n, bad.join(','));
    }
    // --- elementsFromPoint (identifier, member or computed string)
    if ((ts.isIdentifier(n) && n.text === 'elementsFromPoint') || (ts.isStringLiteralLike(n) && n.text === 'elementsFromPoint')) hit('elements-from-point', n);
    // --- new MutationObserver(
    if (ts.isNewExpression(n) && !moAllowed) {
      const e = unparen(n.expression);
      if ((ts.isIdentifier(e) && e.text === 'MutationObserver') || (isAccess(e) && accessName(e) === 'MutationObserver')) hit('mutation-observer', n);
    }
    // --- feTurbulence anywhere in code (comments are not tokens and are ignored)
    if ((ts.isStringLiteralLike(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n) || ts.isIdentifier(n) || ts.isJsxText?.(n))
      && /feturbulence/i.test(n.text)) hit('fe-turbulence', n);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
}

// ------------------------------------------------------------------------------------------------ inputs

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(?:m|c)?js$/.test(name)) out.push(p);
  }
  return out;
}

function extractTarball(tgz) {
  const dir = mkdtempSync(join(tmpdir(), 'ag-dist-perf-'));
  execFileSync('tar', ['-xzf', tgz, '-C', dir], { stdio: 'inherit' });
  const pkg = join(dir, 'package');
  if (!existsSync(join(pkg, 'package.json'))) throw new Error(`verify-dist-perf: ${tgz} has no package/package.json`);
  return pkg;
}

function resolveInput({ pkg, tarball } = {}) {
  if (pkg) return { kind: 'dir', pkgDir: resolve(pkg), path: resolve(pkg) };
  const tgz = tarball ?? process.env.AURAGLASS_TARBALL;
  if (tgz) {
    const abs = resolve(tgz);
    const sha256 = createHash('sha256').update(readFileSync(abs)).digest('hex');
    return { kind: 'tarball', pkgDir: extractTarball(abs), path: abs, sha256 };
  }
  return { kind: 'repo', pkgDir: ROOT, path: ROOT };
}

// ------------------------------------------------------------------------------------------------ ownership

let ownership;
function loadOwnership() {
  if (ownership) return ownership;
  const rows = JSON.parse(readFileSync(join(ROOT, 'contracts', 'ownership.json'), 'utf8')).rows
    .filter((r) => !r.lines || r.lines.includes('5x')).map((r) => ({ ...r, test: picomatch(r.glob, { dot: true }) }));
  const fin = JSON.parse(readFileSync(join(ROOT, 'scripts', 'ci', 'fin-ownership.json'), 'utf8'));
  ownership = { rows, fin: fin.rows.map((r) => ({ ...r, test: picomatch(r.glob, { dot: true }) })), streamToWp: fin.streamToWp };
  return ownership;
}
/** REQ-FIN that owns fixing a perf offender in a source path (PRD-F §5; coarse, by stream area). */
function reqFinFor(src, wp) {
  if (wp === 'FIN-E') {
    if (src.startsWith('src/components/overlays/') || /src\/components\/(dialog|alert-dialog|sheet|popover|tooltip|menu|toast|select|combobox)\//.test(src)) return 'REQ-FIN-74';
    if (src.startsWith('src/primitives/') || src.startsWith('src/icons/') || src.startsWith('src/forms/')) return 'REQ-FIN-71';
    return 'REQ-FIN-70';
  }
  if (wp === 'FIN-D') {
    if (src.startsWith('src/motion/')) return 'REQ-FIN-58';
    if (src.startsWith('src/theme/') || src.startsWith('src/a11y/')) return 'REQ-FIN-59';
    if (src.startsWith('src/tokens/')) return 'REQ-FIN-50';
    return 'REQ-FIN-55';
  }
  if (wp === 'FIN-F') {
    if (src.startsWith('src/charts/') || src.startsWith('src/three/')) return 'REQ-FIN-87';
    return 'REQ-FIN-90';
  }
  if (wp === 'FIN-G') return 'REQ-FIN-105';
  return 'REQ-FIN-37';
}
function ownerOf(src) {
  const o = loadOwnership();
  const c = o.rows.find((r) => r.test(src)) ?? { owner: 'PLAT' };
  const f = o.fin.find((r) => r.test(src));
  const wp = f && (c.owner !== 'NONE' || f.allowNoneLocation) ? f.wp : (o.streamToWp[c.owner] ?? c.owner);
  return { owner: c.owner, wp, reqFin: reqFinFor(src, wp) };
}

/** Maps a dist file to its source: the bundler's `//#region src/...` marker, else the 1:1 unbundle path. */
function sourceOf(distRel, text) {
  const m = /\/\/#region (src\/[^\s]+)/.exec(text);
  if (m) return m[1];
  const stem = distRel.replace(/^dist\//, 'src/').replace(/\.(?:m|c)?js$/, '');
  for (const ext of ['.ts', '.tsx', '.js', '.mjs', '.jsx']) if (existsSync(join(ROOT, stem + ext))) return stem + ext;
  return distRel;
}

// ------------------------------------------------------------------------------------------------ bytes

function exportTarget(pkgJson, sub) {
  const e = pkgJson.exports?.[sub];
  if (typeof e === 'string') return e;
  return e?.import ?? e?.default ?? null;
}

const auraGlassPlugin = (pkgDir, pkgJson) => ({
  name: 'aura-glass-self',
  setup(build) {
    build.onResolve({ filter: /^aura-glass(\/.*)?$/ }, (args) => {
      const sub = args.path === 'aura-glass' ? '.' : `.${args.path.slice('aura-glass'.length)}`;
      const t = exportTarget(pkgJson, sub);
      if (!t) return { errors: [{ text: `aura-glass: no export ${sub}` }] };
      return { path: join(pkgDir, t) };
    });
  },
});

/** Value exports of the package root, read from the built entry's esbuild metafile. */
async function rootExports(pkgDir) {
  const esbuild = require('esbuild');
  const pkgJson = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
  const entry = exportTarget(pkgJson, '.');
  if (!entry) throw new Error('verify-dist-perf: package.json has no "." export');
  const res = await esbuild.build({ entryPoints: [join(pkgDir, entry)], bundle: true, write: false, format: 'esm', platform: 'browser',
    packages: 'external', metafile: true, logLevel: 'silent', outdir: join(pkgDir, '.ag-dist-perf-out') });
  const out = Object.values(res.metafile.outputs).find((o) => o.entryPoint);
  return [...out.exports].filter((x) => x !== 'default').sort();
}

async function measureExport(pkgDir, name, { nodePaths = [] } = {}) {
  const esbuild = require('esbuild');
  const pkgJson = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
  const peers = Object.keys(pkgJson.peerDependencies ?? {}).flatMap((p) => [p, `${p}/*`]);
  const res = await esbuild.build({
    stdin: { contents: `export { ${name} } from 'aura-glass';\n`, loader: 'js', resolveDir: pkgDir, sourcefile: `ag-export-${name}.js` },
    bundle: true, write: false, minify: true, format: 'esm', platform: 'browser', treeShaking: true, metafile: true, logLevel: 'silent',
    external: [...new Set([...REACT_EXTERNALS, ...peers, ...BANNED_PACKAGES])], nodePaths,
    plugins: [auraGlassPlugin(pkgDir, pkgJson)], define: { 'process.env.NODE_ENV': '"production"' },
  });
  const banned = new Set();
  for (const input of Object.keys(res.metafile.inputs)) {
    const m = /(?:^|\/)node_modules\/((?:@[^/]+\/)?[^/]+)/.exec(input);
    if (m && BANNED_MODULE_RE.test(m[1])) banned.add(m[1]);
  }
  for (const o of Object.values(res.metafile.outputs)) for (const imp of o.imports) if (imp.external && BANNED_MODULE_RE.test(imp.path)) banned.add(imp.path.replace(/^((?:@[^/]+\/)?[^/]+).*$/, '$1'));
  return { bytes: gzipSync(res.outputFiles[0].contents, { level: 9 }).length, bannedModules: [...banned].sort() };
}

// ------------------------------------------------------------------------------------------------ baseline

function expiryPassed(expires, version, today = new Date()) {
  if (expires === 'RC-1') return /^\d+\.\d+\.\d+-rc\.\d+/.test(version) || (/^\d+\.\d+\.\d+$/.test(version) && Number(version.split('.')[0]) >= 5);
  if (/^\d{4}-\d{2}-\d{2}$/.test(expires)) return today.toISOString().slice(0, 10) > expires;
  return true; // unknown expiry form never keeps an offender green
}

function applyBaseline(violations, baseline, { version, today } = {}) {
  const key = (r) => `${r.file}\u0000${r.rule}`;
  const live = new Set(violations.map(key));
  const rows = new Map();
  const problems = [];
  for (const r of baseline) {
    if (!r || typeof r.file !== 'string' || !RULES.includes(r.rule) || typeof r.owner !== 'string' || !/^REQ-FIN-\d+$/.test(r.reqFin ?? '') || typeof r.expires !== 'string') {
      problems.push({ kind: 'malformed-baseline-row', row: r }); continue;
    }
    rows.set(key(r), r);
    if (expiryPassed(r.expires, version, today)) problems.push({ kind: 'expired-baseline-row', row: r });
    if (!live.has(key(r))) problems.push({ kind: 'stale-baseline-row', row: r });
  }
  for (const v of violations) {
    v.baselined = rows.has(key(v));
    if (!v.baselined) problems.push({ kind: 'new-offender', row: v });
  }
  return problems;
}

// ------------------------------------------------------------------------------------------------ run

async function run(opts = {}) {
  const mode = opts.mode ?? (process.env.LANE === 'L1' ? 'scan' : 'all');
  if (!['scan', 'bytes', 'all'].includes(mode)) throw Object.assign(new Error(`verify-dist-perf: bad --mode ${mode}`), { code: 64 });
  const input = resolveInput(opts);
  const distDir = join(input.pkgDir, 'dist');
  const report = { version: 1, tool: 'scripts/qual/verify-dist-perf.mjs', req: 'REQ-QUAL-46', mode,
    sha: process.env.CI_COMMIT_SHA ?? null, runnerTags: process.env.CI_RUNNER_TAGS ?? null,
    input: { kind: input.kind, path: relative(ROOT, input.path) || '.', ...(input.sha256 ? { sha256: input.sha256 } : {}) },
    scanned: { files: 0 }, violations: [], problems: [], bytes: {}, bundles: {}, method: null, status: 'fail' };
  if (!existsSync(distDir)) {
    report.problems.push({ kind: 'missing-dist', row: { path: relative(ROOT, distDir) } });
    return report;
  }
  const pkgJson = JSON.parse(readFileSync(join(input.pkgDir, 'package.json'), 'utf8'));
  for (const file of walk(distDir)) {
    const rel = relative(input.pkgDir, file).split(sep).join('/');
    const text = readFileSync(file, 'utf8');
    report.scanned.files += 1;
    const hits = scanSource(text, rel);
    if (!hits.length) continue;
    const src = sourceOf(rel, text);
    const own = ownerOf(src);
    for (const h of hits) report.violations.push({ file: src, dist: rel, rule: h.rule, line: h.line, snippet: h.snippet, ...(h.detail ? { detail: h.detail } : {}), ...own });
  }
  if (mode !== 'scan') {
    const esbuildVersion = (require('esbuild')).version;
    report.method = { tool: `esbuild ${esbuildVersion}`, bundle: true, minify: true, format: 'esm', platform: 'browser',
      external: 'react, react-dom, package peerDependencies, banned modules', gzipLevel: 9, entry: "export { X } from 'aura-glass'" };
    const nodePaths = [join(ROOT, 'node_modules')]; // fallback resolution for an extracted tarball / external package dir
    const names = await rootExports(input.pkgDir);
    report.exports = names;
    for (const name of names) {
      try {
        const m = await measureExport(input.pkgDir, name, { nodePaths });
        report.bytes[name] = m.bytes;
        report.bundles[name] = m;
        for (const mod of m.bannedModules) {
          const own = ownerOf('src/index.ts');
          report.violations.push({ file: `aura-glass#${name}`, rule: 'banned-module', detail: mod, owner: own.owner, wp: own.wp, reqFin: own.reqFin });
        }
      } catch (e) {
        report.violations.push({ file: `aura-glass#${name}`, rule: 'bundle-failed', detail: String(e.message ?? e).slice(0, 400), owner: 'PLAT', wp: 'FIN-C', reqFin: 'REQ-FIN-37' });
      }
    }
  }
  const baseline = opts.baseline === false ? [] : JSON.parse(readFileSync(opts.baseline ?? DEFAULT_BASELINE, 'utf8'));
  // A scan-only run cannot see bundle rows; they are judged only by runs that build the bundles.
  const judged = mode === 'scan' ? baseline.filter((r) => r.rule !== 'banned-module' && r.rule !== 'bundle-failed') : baseline;
  report.problems.push(...applyBaseline(report.violations, judged, { version: pkgJson.version, today: opts.today }));
  report.status = report.problems.length ? 'fail' : 'pass';
  return report;
}

/** Baseline rows (rule-3 shape) for the current violations; bundle-failed rows are never baselined. */
function baselineRows(violations, expires = 'RC-1') {
  const seen = new Map();
  for (const v of violations) {
    if (v.rule === 'bundle-failed' || v.wp === 'FIN-G') continue;
    const k = `${v.file}\u0000${v.rule}`;
    if (!seen.has(k)) seen.set(k, { file: v.file, rule: v.rule, owner: v.owner, reqFin: v.reqFin, expires });
  }
  return [...seen.values()].sort((a, b) => (a.file + a.rule).localeCompare(b.file + b.rule));
}

module.exports = { DEFAULT_BASELINE, BANNED_MODULE_RE, MUTATION_OBSERVER_ALLOW, RULES, transitionProperties, scanSource, resolveInput, reqFinFor, ownerOf, sourceOf, rootExports, measureExport, expiryPassed, applyBaseline, run, baselineRows, ROOT };
