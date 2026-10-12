/* server-safe.mjs — emits the server-safe exports record (PLAT-261, REQ-PLAT-69).
   Safe list = the implementation module of every ComponentMeta with
   rsc:'server' PLUS the always-safe foundations (cn, tokens, icon glyphs).
   For EACH safe module (not per manifest entry) the graph reached under the
   `react-server` condition, without crossing a 'use client' boundary, must
   import no client signal and no SSR shim:
     - local specifiers (relative, `@/`, `aura-glass[/…]`) are followed;
     - bare specifiers are resolved through package.json `exports` with the
       conditions ['react-server', 'import', 'default'] (Node's algorithm:
       first matching key in object order); one that does not resolve under
       react-server makes the module unsafe, a resolved file that opens with
       'use client' is a client reference (boundary), anything else is a
       server dependency whose package internals are not scanned;
     - every non-boundary local file is checked WHOLE with the exact signal
       set of lint/rules/plat/use-client-required.cjs (run through ESLint's
       Linter, so both checks can never disagree).
   Type-only imports/exports are not edges. The record keeps `entries`
   (per manifest JS entry, the same walk from the entry source) for the RSC
   guide and the canary server page, and adds `modules`: one row per safe
   module with its verdict.
   --check: exit 1 when committed build/server-safe-exports.json drifts.
   --write: regenerate it. */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { ROOT, manifestEntries, walk, loadJson } from './lib/graph.mjs';

const require = createRequire(import.meta.url);
const RECORD = join(ROOT, 'build', 'server-safe-exports.json');
export const CONDITIONS = ['react-server', 'import', 'default'];
const SHIM_RE = /\b(AuraGlassClientBoundary|AuraGlassSSRProvider|StyleSheetManager|registryGuard)\b/;
const EXTS = ['.ts', '.tsx', '.mts', '.js', '.mjs', '.jsx'];
const posixRel = (root, f) => relative(root, f).split(sep).join('/');

/* Files whose exports are always server-safe foundations (PLAT-69): cn,
   tokens, icon glyph modules. */
const ALWAYS_SAFE = (file) =>
  /\/internal\/cn\.tsx?$/.test(file) ||
  /\/src\/tokens\//.test(file) ||
  /\/icons\/(?!Icon\.meta)[^/]+\.tsx?$/.test(file) ||
  /\/icons\/[a-z-]+\/[a-z-]+\.tsx?$/.test(file);
const NOT_MODULE = /\.(test|spec|stories|meta)\.tsx?$|\.d\.ts$|\/__tests__\/|\/__fixtures__\//;

/* ---------- parsing (TypeScript AST: directives and value edges) ---------- */
const parseCache = new Map();
function parse(file) {
  let hit = parseCache.get(file);
  if (hit) return hit;
  const text = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true,
    /\.[jt]sx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  let useClient = false;
  for (const st of sf.statements) {
    if (ts.isExpressionStatement(st) && ts.isStringLiteral(st.expression)) {
      if (st.expression.text === 'use client') useClient = true;
      continue;
    }
    break;
  }
  const specs = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const c = node.importClause;
      const typeOnly = c && (c.isTypeOnly || (!c.name && c.namedBindings && ts.isNamedImports(c.namedBindings)
        && c.namedBindings.elements.length > 0 && c.namedBindings.elements.every((e) => e.isTypeOnly)));
      if (!typeOnly) specs.push(node.moduleSpecifier.text);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const typeOnly = node.isTypeOnly || (node.exportClause && ts.isNamedExports(node.exportClause)
        && node.exportClause.elements.length > 0 && node.exportClause.elements.every((e) => e.isTypeOnly));
      if (!typeOnly) specs.push(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword
      && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      specs.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  hit = { text, useClient, specs };
  parseCache.set(file, hit);
  return hit;
}

/* ---------- resolution ---------- */
function resolveFile(base) {
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTS) if (existsSync(base + ext)) return base + ext;
  // TS ESM style: './x.js' written for './x.ts'
  const m = /\.(m?)js$/.exec(base);
  if (m) for (const ext of m[1] ? ['.mts'] : ['.ts', '.tsx']) if (existsSync(base.slice(0, -m[0].length) + ext)) return base.slice(0, -m[0].length) + ext;
  for (const ext of EXTS) if (existsSync(join(base, 'index' + ext))) return join(base, 'index' + ext);
  return null;
}

/** Local specifier -> file under `<root>/src`, or null when bare. */
function resolveLocal(spec, from, root) {
  const src = join(root, 'src');
  if (spec.startsWith('@/')) return resolveFile(join(src, spec.slice(2)));
  if (spec.startsWith('.')) return resolveFile(resolve(dirname(from), spec));
  if (spec === 'aura-glass') return resolveFile(join(src, 'index'));
  if (spec.startsWith('aura-glass/')) return resolveFile(join(src, spec.slice('aura-glass/'.length)));
  return undefined; // bare
}

/** package.json `exports` target for `sub` under CONDITIONS (null: not exported). */
export function exportsTarget(exp, sub, conditions = CONDITIONS) {
  const pick = (v) => {
    if (v == null) return null;
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) { for (const x of v) { const r = pick(x); if (r) return r; } return null; }
    for (const [k, x] of Object.entries(v)) if (conditions.includes(k)) { const r = pick(x); if (r) return r; }
    return null;
  };
  const isMap = exp && typeof exp === 'object' && !Array.isArray(exp) && Object.keys(exp).some((k) => k.startsWith('.'));
  if (!isMap) return sub === '.' ? pick(exp) : null;
  if (Object.hasOwn(exp, sub)) return pick(exp[sub]);
  for (const [k, v] of Object.entries(exp)) {
    const star = k.indexOf('*');
    if (star < 0) continue;
    const pre = k.slice(0, star); const post = k.slice(star + 1);
    if (sub.startsWith(pre) && sub.endsWith(post) && sub.length >= k.length - 1) {
      const t = pick(v);
      if (t) return t.replace('*', sub.slice(pre.length, sub.length - post.length));
    }
  }
  return null;
}

/** Bare specifier -> { file } | { error } under the react-server conditions. */
export function resolveBare(spec, from) {
  if (spec.startsWith('node:')) return { builtin: true };
  const parts = spec.split('/');
  const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  const sub = '.' + spec.slice(name.length);
  for (let dir = dirname(from); ; dir = dirname(dir)) {
    const pkgDir = join(dir, 'node_modules', name);
    const pj = join(pkgDir, 'package.json');
    if (existsSync(pj)) {
      const pkg = JSON.parse(readFileSync(pj, 'utf8'));
      let target;
      if (pkg.exports !== undefined) {
        target = exportsTarget(pkg.exports, sub);
        if (!target) return { error: `'${spec}' is not exported under the react-server conditions` };
      } else {
        target = sub === '.' ? (pkg.module ?? pkg.main ?? 'index.js') : sub;
      }
      const file = resolveFile(join(pkgDir, target));
      return file ? { file } : { error: `'${spec}' -> ${target} is missing` };
    }
    if (dirname(dir) === dir) break;
  }
  if (require('node:module').builtinModules.includes(name)) return { builtin: true };
  return { error: `'${spec}' does not resolve` };
}

/* ---------- signals: the use-client-required rule, run by ESLint ---------- */
/** Hooks React's `react-server` build exports (useId, useMemo, ...): callable
 *  in a Server Component, so not a client signal under that condition. */
export function reactServerHooks(root = ROOT) {
  const r = resolveBare('react', join(root, 'src', 'index.ts'));
  if (!r.file) return [];
  try { return Object.keys(require(r.file)).filter((k) => /^use[A-Z]|^createContext$/.test(k)).sort(); }
  catch { return []; }
}

const linters = new Map();
function clientSignal(file, text, root) {
  let l = linters.get(root);
  if (!l) {
    const { Linter } = require('eslint');
    const parser = require('@typescript-eslint/parser');
    const rule = require(join(ROOT, 'lint/rules/plat/use-client-required.cjs'));
    l = {
      linter: new Linter({ configType: 'flat', cwd: root }),
      config: [{
        files: ['**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'],
        languageOptions: { parser, ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
        plugins: { ag: { rules: { 'use-client-required': rule } } },
        rules: { 'ag/use-client-required': ['error', { allowHooks: reactServerHooks(root) }] },
      }],
    };
    linters.set(root, l);
  }
  // A rule hit on a directive-free file is exactly a client signal.
  const msgs = l.linter.verify(text, l.config, { filename: file });
  const hit = msgs.find((m) => m.ruleId === 'ag/use-client-required');
  if (hit) return /signal \((.*)\) but does not/.exec(hit.message)?.[1] ?? hit.message;
  // fatal parse errors and "No matching configuration" (ruleId null) are not a pass
  const broken = msgs.find((m) => m.fatal || m.ruleId === null);
  return broken ? `not checkable: ${broken.message}` : null;
}

/** Walk the react-server graph of `start`. Returns { safe, reason?, files }. */
export function serverGraph(start, root = ROOT) {
  const src = join(root, 'src');
  const seen = new Set();
  const stack = [start];
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    if (/\.css$/.test(f)) continue;
    const { text, useClient, specs } = parse(f);
    if (useClient && f !== start) continue; // client reference: the boundary ends the server walk
    if (useClient) return { safe: false, reason: `module itself is 'use client': ${posixRel(root, f)}`, files: seen };
    if (SHIM_RE.test(text)) return { safe: false, reason: `SSR shim reachable: ${posixRel(root, f)}`, files: seen };
    const sig = clientSignal(f, text, root);
    if (sig) return { safe: false, reason: `client signal (${sig}) in ${posixRel(root, f)}`, files: seen };
    for (const spec of specs) {
      const local = resolveLocal(spec, f, root);
      if (local === undefined) {
        const r = resolveBare(spec, f);
        if (r.error) return { safe: false, reason: `${r.error} (imported by ${posixRel(root, f)})`, files: seen };
        continue; // server dependency or client reference; package internals are not scanned
      }
      if (local === null) {
        if (/\.css$/.test(spec)) continue;
        return { safe: false, reason: `unresolved '${spec}' in ${posixRel(root, f)}`, files: seen };
      }
      if (local.startsWith(src)) stack.push(local);
    }
  }
  return { safe: true, files: seen };
}

/** The implementation module a `X.meta.ts` describes: sibling X.tsx/X.ts, else the dir index. */
function moduleOfMeta(metaFile) {
  const dir = dirname(metaFile);
  const base = basename(metaFile).replace(/\.meta\.ts$/, '');
  for (const ext of ['.tsx', '.ts']) if (existsSync(join(dir, base + ext))) return join(dir, base + ext);
  return resolveFile(join(dir, 'index'));
}

export function serverSafeModules(root = ROOT) {
  const src = join(root, 'src');
  const rows = [];
  const metaEntries = [];
  for (const m of walk(src, (p) => p.endsWith('.meta.ts'))) {
    const text = readFileSync(m, 'utf8');
    const rsc = /rsc:\s*'(server|client|mixed)'/.exec(text)?.[1];
    const name = /name:\s*'([^']+)'/.exec(text)?.[1] ?? m.split('/').pop();
    metaEntries.push({ file: m, name, rsc });
    if (rsc === 'server') rows.push({ file: moduleOfMeta(m), meta: name, metaFile: m });
  }
  for (const f of walk(src, (p) => /\.tsx?$/.test(p) && ALWAYS_SAFE(p) && !NOT_MODULE.test(p))) rows.push({ file: f, foundation: true });
  return { rows, metaEntries };
}

export function generateServerSafeExports(root = ROOT) {
  const { rows, metaEntries } = serverSafeModules(root);
  const modules = rows.map((r) => {
    const id = r.file ? posixRel(root, r.file) : posixRel(root, r.metaFile);
    const tag = r.foundation ? { from: 'foundation' } : { from: 'meta', meta: r.meta };
    if (!r.file) return { module: id, ...tag, safe: false, reason: 'no implementation module next to the meta' };
    const g = serverGraph(r.file, root);
    return { module: id, ...tag, safe: g.safe, ...(g.reason ? { reason: g.reason } : {}) };
  }).sort((a, b) => a.module.localeCompare(b.module) || String(a.meta).localeCompare(String(b.meta)));
  const entries = [];
  for (const e of manifestEntries(root).js) {
    const file = join(root, e.source);
    if (!existsSync(file)) { entries.push({ subpath: e.subpath, safe: false, reason: 'missing' }); continue; }
    const g = serverGraph(file, root);
    entries.push({ subpath: e.subpath, safe: g.safe, ...(g.reason ? { reason: g.reason } : {}) });
  }
  return {
    version: 1,
    safeModules: [...new Set(modules.filter((m) => m.safe).map((m) => m.module))].sort(),
    meta: metaEntries.map(({ name, rsc }) => ({ name, rsc })).sort((a, b) => a.name.localeCompare(b.name)),
    modules,
    entries,
  };
}

/* CLI only: scripts/build/post.mjs imports generateServerSafeExports, and the
   --check/--write side effects must not run (or exit) inside that build step. */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  const mode = process.argv[2] ?? '--check';
  const want = generateServerSafeExports();
  if (mode === '--write' || mode === '--emit') {
    writeFileSync(RECORD, JSON.stringify(want, null, 2) + '\n');
    const bad = want.modules.filter((m) => !m.safe).length;
    console.log(`server-safe-exports: wrote ${want.entries.length} entries, ${want.modules.length} safe-listed modules (${bad} unsafe)`);
  } else {
    const have = existsSync(RECORD) ? loadJson(RECORD) : null;
    if (JSON.stringify(have) !== JSON.stringify(want)) {
      console.error('server-safe-exports: DRIFT — regenerate with `node scripts/build/server-safe.mjs --write`');
      process.exit(1);
    }
    console.log(`server-safe-exports: up to date (${want.entries.length} entries, ${want.modules.length} modules)`);
  }
}
