#!/usr/bin/env node
/* scripts/mat/verify-preference-source.mjs — L1 Static (REQ-MAT-51, REQ-FIN-58, D.3-31).
 *
 * One preference source: OS preference media queries and the 4.x reduced-motion
 * hooks may appear only in src/theme/preferences/** and src/theme/script/**.
 * Scans <root>/src/** (.ts/.tsx/.js/.jsx/.mjs/.cjs) with the TypeScript parser and
 * reports:
 *   - matchMedia: a call to matchMedia (bare, member, optional or element access)
 *     whose first argument is a string — literal, template, concatenation or a
 *     same-file const binding — containing prefers-reduced-motion,
 *     prefers-contrast, prefers-reduced-transparency or forced-colors;
 *   - import: an import/re-export/require()/import() of a 4.x reduced-motion hook
 *     (by binding name or by its 4.x module path).
 *
 * Findings are compared with the ratchet baseline
 * (scripts/mat/preference-source-baseline.json; rows owned by another WP, expiring
 * RC-1). Exit 1 on a finding without a row, a count above its row, a row whose
 * count is now lower or zero (lower/delete it: the baseline only shrinks), a parse
 * failure, or — with --enforce-zero (release scope) — any row at all.
 * Folded into a named lint rule once OI-MAT-03 lands.
 *
 * Usage: node scripts/mat/verify-preference-source.mjs [--root <dir>] [--baseline <json>] [--enforce-zero]
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export const QUERY = /prefers-reduced-motion|prefers-contrast|prefers-reduced-transparency|forced-colors/;
export const ALLOWED = /^src\/theme\/(preferences|script)\//;
/** 4.x reduced-motion / motion-preference hooks and providers (release/4.x src/hooks,
 *  src/contexts/MotionPreferenceContext, src/primitives/motion/ReducedMotionProvider). */
export const BANNED_NAMES = new Set([
  'useReducedMotion', 'useEnhancedReducedMotion', 'useMotionPreference',
  'useMotionPreferenceContext', 'MotionPreferenceContext', 'MotionPreferenceProvider',
  'ReducedMotionProvider', 'prefersReducedMotion', 'withReducedMotion',
]);
export const BANNED_MODULE = /(^|\/)(hooks\/(useReducedMotion|useEnhancedReducedMotion|useMotionPreference)|contexts\/MotionPreferenceContext|primitives\/motion\/ReducedMotionProvider)(\.[cm]?[jt]sx?)?$/;

const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);
const KIND = { '.ts': ts.ScriptKind.TS, '.tsx': ts.ScriptKind.TSX, '.js': ts.ScriptKind.JS, '.jsx': ts.ScriptKind.JSX, '.mjs': ts.ScriptKind.JS, '.cjs': ts.ScriptKind.JS };

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries.sort()) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name)) && !name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

/** Scan one source text; returns [{ line, kind, detail }]. */
export function scanSource(fileName, text) {
  const sf = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, KIND[extname(fileName)] ?? ts.ScriptKind.TS);
  const diags = sf.parseDiagnostics ?? [];
  if (diags.length) {
    const d = diags[0];
    const { line } = sf.getLineAndCharacterOfPosition(d.start ?? 0);
    throw new Error(`${fileName}:${line + 1} parse error: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
  }
  const consts = new Map();
  const findings = [];
  const lineOf = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;

  const strOf = (node, depth = 0) => {
    if (!node || depth > 8) return null;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isTemplateExpression(node)) return node.head.text + node.templateSpans.map((s) => `\${}${s.literal.text}`).join('');
    if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node) || ts.isTypeAssertionExpression?.(node)) return strOf(node.expression, depth + 1);
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const l = strOf(node.left, depth + 1);
      const r = strOf(node.right, depth + 1);
      return l === null && r === null ? null : `${l ?? ''}${r ?? ''}`;
    }
    if (ts.isIdentifier(node) && consts.has(node.text)) return strOf(consts.get(node.text), depth + 1);
    return null;
  };

  const isMatchMediaCallee = (e) => {
    while (ts.isParenthesizedExpression(e) || ts.isNonNullExpression(e)) e = e.expression;
    if (ts.isIdentifier(e)) return e.text === 'matchMedia';
    if (ts.isPropertyAccessExpression(e)) return e.name.text === 'matchMedia';
    if (ts.isElementAccessExpression(e)) return strOf(e.argumentExpression) === 'matchMedia';
    return false;
  };

  const banModule = (node, spec) => {
    if (BANNED_MODULE.test(spec)) findings.push({ line: lineOf(node), kind: 'import', detail: `4.x reduced-motion module '${spec}'` });
  };
  const banName = (node, name, spec) => {
    if (BANNED_NAMES.has(name)) findings.push({ line: lineOf(node), kind: 'import', detail: `4.x reduced-motion hook '${name}' from '${spec}'` });
  };

  // pass 1: const string bindings (any scope; names are resolved by text)
  const collect = (node) => {
    if (ts.isVariableDeclarationList(node) && node.flags & ts.NodeFlags.Const) {
      for (const d of node.declarations) if (ts.isIdentifier(d.name) && d.initializer) consts.set(d.name.text, d.initializer);
    }
    ts.forEachChild(node, collect);
  };
  collect(sf);

  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      const c = node.importClause;
      const before = findings.length;
      if (c?.name) banName(c.name, c.name.text, spec);
      const nb = c?.namedBindings;
      if (nb && ts.isNamedImports(nb)) for (const el of nb.elements) banName(el, (el.propertyName ?? el.name).text, spec);
      if (findings.length === before) banModule(node, spec);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      const before = findings.length;
      const ec = node.exportClause;
      if (ec && ts.isNamedExports(ec)) for (const el of ec.elements) banName(el, (el.propertyName ?? el.name).text, spec);
      if (findings.length === before) banModule(node, spec);
    } else if (ts.isCallExpression(node)) {
      const arg0 = node.arguments[0];
      if (isMatchMediaCallee(node.expression)) {
        const q = strOf(arg0);
        if (q !== null && QUERY.test(q)) findings.push({ line: lineOf(node), kind: 'matchMedia', detail: `matchMedia(${JSON.stringify(q)})` });
      } else if ((node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require')) && arg0) {
        const spec = strOf(arg0);
        if (spec !== null) banModule(node, spec);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return findings;
}

function main() {
  const argv = process.argv.slice(2);
  const opt = (name) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const root = resolve(opt('--root') ?? repo);
  const baselinePath = resolve(opt('--baseline') ?? resolve(repo, 'scripts/mat/preference-source-baseline.json'));
  const enforceZero = argv.includes('--enforce-zero');
  const tag = '[verify-preference-source]';
  const fail = (lines) => {
    for (const l of lines) console.error(`${tag} ${l}`);
    process.exit(1);
  };

  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
  if (!Array.isArray(baseline.rows)) fail([`${baselinePath}: missing "rows" array`]);
  const shape = baseline.rows.flatMap((r, i) => [
    ...['file', 'kind', 'count', 'owner', 'expires'].filter((k) => !(k in r)).map((k) => `baseline row ${i}: missing "${k}"`),
    ...(r.kind === 'matchMedia' || r.kind === 'import' ? [] : [`baseline row ${i}: kind must be matchMedia|import`]),
    ...(Number.isInteger(r.count) && r.count >= 1 ? [] : [`baseline row ${i}: count must be a positive integer`]),
    ...(typeof r.file === 'string' && ALLOWED.test(r.file) ? [`baseline row ${i}: ${r.file} is an allowed source; it needs no row`] : []),
  ]);
  if (shape.length) fail(shape);

  const files = walk(join(root, 'src'));
  if (files.length === 0) fail([`no source files under ${join(root, 'src')}`]);
  const rel = (f) => relative(root, f).split(sep).join('/');
  const problems = [];
  const found = new Map(); // `${file}\0${kind}` -> findings
  let scanned = 0;
  for (const f of files) {
    const r = rel(f);
    if (ALLOWED.test(r)) continue;
    scanned += 1;
    let list;
    try {
      list = scanSource(r, readFileSync(f, 'utf8'));
    } catch (e) {
      problems.push(String(e.message ?? e));
      continue;
    }
    for (const x of list) {
      const key = `${r}\0${x.kind}`;
      if (!found.has(key)) found.set(key, []);
      found.get(key).push(x);
    }
  }

  const rows = new Map(baseline.rows.map((r) => [`${r.file}\0${r.kind}`, r]));
  for (const [key, list] of found) {
    const [file, kind] = key.split('\0');
    const row = rows.get(key);
    const detail = list.map((x) => `${file}:${x.line} ${kind} ${x.detail}`);
    if (!row) problems.push(...detail.map((d) => `outside src/theme/{preferences,script}/**: ${d}`));
    else if (list.length > row.count) problems.push(`count ${list.length} > baseline ${row.count} for ${file} (${kind})`, ...detail.map((d) => `  ${d}`));
  }
  for (const [key, row] of rows) {
    const n = found.get(key)?.length ?? 0;
    if (n === 0) problems.push(`stale baseline row: ${row.file} (${row.kind}) has 0 findings — delete the row`);
    else if (n < row.count) problems.push(`ratchet down: ${row.file} (${row.kind}) has ${n} < baseline ${row.count} — lower the row`);
  }
  if (enforceZero && baseline.rows.length > 0) {
    problems.push(`--enforce-zero: ${baseline.rows.length} baseline row(s) remain`);
    for (const r of baseline.rows) problems.push(`  ${r.file} (${r.kind}) x${r.count} (owner ${r.owner}${r.wp ? `, ${r.wp}` : ''}, expires ${r.expires})`);
  }
  if (problems.length) fail(problems);
  const ratcheted = baseline.rows.reduce((s, r) => s + r.count, 0);
  console.log(`${tag} OK — ${scanned} files outside src/theme/{preferences,script}; ${ratcheted} ratcheted finding(s) in ${baseline.rows.length} baseline row(s), 0 new`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
