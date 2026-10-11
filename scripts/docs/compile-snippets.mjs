#!/usr/bin/env node
/* scripts/docs/compile-snippets.mjs — REQ-PLAT-102 (REQ-FIN-43), PLAT-382.
 *
 * Type-checks every apps/docs/examples/**\/*.tsx file and every fenced
 * ts | tsx | jsx block in apps/docs/content/**, docs/quickstart/**,
 * docs/guides/** and README.md as ONE strict ts.Program:
 *   strict, jsx react-jsx, module esnext, moduleResolution bundler,
 *   `aura-glass` resolved from the PACKED tarball's .d.ts (its `exports` map,
 *   so a subpath the package does not export fails to resolve).
 * Every block is its own module (`export {}` appended). A fence whose info
 * string carries `{fragment}` is JSX, not a module: its leading `import`
 * lines are hoisted and the rest is wrapped in a generated component.
 *
 * Gate: 0 failures and no skip marker; the run must finish within BUDGET_MS
 * (5 min, PRD). The old snippets-baseline.json is gone. Files owned by
 * another stream (or rewritten by a later FIN-C unit) may be listed in the
 * PRD-F §4.3 rule 3 expiring baseline scripts/integration/baselines/
 * docs-snippets.json (FIN-A file); expired or stale rows fail.
 * Report: .artifacts/plat/docs-snippets.json.
 *
 * Types: .artifacts/pack/aura-glass-<package.json version>.tgz (written by
 * plat:package:pack) or --tarball <path>; it is extracted under
 * .artifacts/docs/snippets/node_modules/aura-glass. In CI (CI=true) or with
 * --require-packed a missing tarball is an error (exit 1). Locally, without a
 * pack, `aura-glass[/subpath]` maps to the manifest's source entry for each
 * exported subpath (build/exports.manifest.json) and the report records
 * `types: "source"` — never accepted as the CI result.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { applyBaseline, loadBaseline, packageVersion } from './lib/baseline.mjs';

const ROOT_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Five minutes (REQ-PLAT-102: `docs:snippets` <= 5 min). Never raised to get green. */
export const BUDGET_MS = 5 * 60 * 1000;

/** Markdown roots whose ts/tsx/jsx fences are checked (repo-relative). */
export const FENCE_ROOTS = ['apps/docs/content', 'docs/quickstart', 'docs/guides'];
export const FENCE_FILES = ['README.md'];
/** Whole-file examples rendered by the docs app's <Example>. */
export const EXAMPLE_ROOT = 'apps/docs/examples';

const LANG = { ts: 'ts', typescript: 'ts', tsx: 'tsx', jsx: 'jsx' };
const OPEN_RE = /^(\s*)(`{3,}|~{3,})\s*([\w-]*)(.*)$/;

const toPosix = (p) => p.split(sep).join('/');

function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, test, out);
    else if (test(name)) out.push(p);
  }
  return out;
}

/**
 * Fenced code blocks of one markdown source. CommonMark fences: the closing
 * fence uses the same character, at least as long, nothing but whitespace
 * after it. Indentation of the opening fence is stripped from the body.
 */
export function parseFences(src) {
  const lines = src.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = OPEN_RE.exec(lines[i]);
    if (!m) continue;
    const [, indent, marker, info, rest] = m;
    if (marker[0] === '`' && rest.includes('`')) continue; // inline code span, not a fence
    const body = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      const close = lines[j].trim();
      if (close[0] === marker[0] && /^(`+|~+)$/.test(close) && close.length >= marker.length) break;
      body.push(lines[j].startsWith(indent) ? lines[j].slice(indent.length) : lines[j].trimStart());
    }
    out.push({ line: i + 1, lang: info.toLowerCase(), meta: rest.trim(), code: body.join('\n') });
    i = j;
  }
  return out;
}

/** Every snippet the gate type-checks, in a stable order. */
export function collectSnippets(root = ROOT_DEFAULT) {
  const snippets = [];
  const mdFiles = [
    ...FENCE_ROOTS.flatMap((r) => walk(join(root, r), (n) => /\.mdx?$/.test(n))),
    ...FENCE_FILES.map((f) => join(root, f)).filter((f) => existsSync(f)),
  ];
  for (const file of mdFiles) {
    const rel = toPosix(relative(root, file));
    for (const f of parseFences(readFileSync(file, 'utf8'))) {
      const lang = LANG[f.lang];
      if (!lang) continue;
      snippets.push({ source: rel, line: f.line, lang, fragment: /\{\s*fragment\s*\}/.test(f.meta), code: f.code });
    }
  }
  for (const file of walk(join(root, EXAMPLE_ROOT), (n) => /\.tsx$/.test(n))) {
    snippets.push({ source: toPosix(relative(root, file)), line: 1, lang: 'tsx', fragment: false, code: readFileSync(file, 'utf8'), example: true });
  }
  return snippets;
}

/**
 * Module text for a snippet plus the number of generated lines before the
 * author's first line (for diagnostic line mapping).
 */
export function wrapSnippet(s) {
  if (!s.fragment) return { text: `${s.code}\nexport {};\n`, offset: 0, hoisted: 0 };
  const lines = s.code.split('\n');
  let k = 0;
  // Hoist the leading import block (imports may span lines until the specifier).
  while (k < lines.length && (/^\s*$/.test(lines[k]) || /^\s*import\b/.test(lines[k]))) {
    if (/^\s*import\b/.test(lines[k]) && !/from\s+['"][^'"]+['"]|^\s*import\s+['"]/.test(lines[k])) {
      while (k < lines.length && !/from\s+['"][^'"]+['"]/.test(lines[k])) k++;
    }
    k++;
  }
  const head = lines.slice(0, k);
  const body = lines.slice(k);
  const pre = 'export default function Snippet() {\n  return (\n    <>';
  return {
    text: `${head.join('\n')}\n${pre}\n${body.join('\n')}\n    </>\n  );\n}\n`,
    offset: k + pre.split('\n').length, // 0-based line of the first body line
    hoisted: k,
  };
}

/** Package version from the root package.json. */
const rootVersion = (root) => JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;

/** Repo-relative tarball path for the root package version (same rule as install-pack). */
export const packPath = (root = ROOT_DEFAULT) => `.artifacts/pack/aura-glass-${rootVersion(root)}.tgz`;

/** Extracts the tarball into <work>/node_modules/aura-glass and returns that dir. */
export function extractTarball(tarball, work) {
  const dest = join(work, 'node_modules', 'aura-glass');
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '-C', dest, '--strip-components=1'], { stdio: 'pipe' });
  if (!existsSync(join(dest, 'package.json'))) throw new Error(`${tarball}: no package/package.json`);
  return dest;
}

/** `paths` for source mode: one exact entry per exported subpath (no wildcard). */
export function sourcePaths(root) {
  const manifest = JSON.parse(readFileSync(join(root, 'build', 'exports.manifest.json'), 'utf8'));
  const paths = {};
  for (const e of manifest.entries) {
    if (!e.source || !/\.(ts|tsx)$/.test(e.source)) continue;
    const spec = e.subpath === '.' ? 'aura-glass' : `aura-glass/${e.subpath.replace(/^\.\//, '')}`;
    paths[spec] = [join(root, e.source)];
  }
  return paths;
}

export const COMPILER_OPTIONS = {
  strict: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2022,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  types: ['node', 'react', 'react-dom'],
  allowJs: true,
  checkJs: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
  resolveJsonModule: true,
  isolatedModules: true,
  allowImportingTsExtensions: false,
  forceConsistentCasingInFileNames: true,
};

/**
 * Runs the gate. Returns the report object; `report.failures` is the list of
 * snippets with at least one error diagnostic.
 */
export function compile({ root = ROOT_DEFAULT, tarball = null, requirePacked = false, snippets = collectSnippets(root) } = {}) {
  const t0 = Date.now();
  const work = join(root, '.artifacts', 'docs', 'snippets');
  mkdirSync(work, { recursive: true });

  const tgz = tarball ? resolve(tarball) : join(root, packPath(root));
  let types;
  const options = { ...COMPILER_OPTIONS, typeRoots: [join(root, 'node_modules', '@types')] };
  if (existsSync(tgz)) {
    extractTarball(tgz, work);
    types = { mode: 'packed', tarball: toPosix(relative(root, tgz)) };
  } else if (requirePacked) {
    throw new Error(`${toPosix(relative(root, tgz))} missing — plat:package:pack must run first (snippets type-check against the packed .d.ts)`);
  } else {
    rmSync(join(work, 'node_modules', 'aura-glass'), { recursive: true, force: true });
    options.baseUrl = root;
    options.paths = sourcePaths(root);
    types = { mode: 'source', tarball: null };
  }

  const virtual = new Map();
  const meta = new Map();
  snippets.forEach((s, i) => {
    const ext = s.lang === 'jsx' ? 'jsx' : s.lang === 'tsx' || s.fragment ? 'tsx' : 'ts';
    const name = join(work, 'src', `${String(i).padStart(4, '0')}.${ext}`);
    const w = s.example ? { text: s.code, offset: 0, hoisted: 0 } : wrapSnippet(s);
    virtual.set(name, w.text);
    meta.set(name, { ...s, ...w });
  });

  const host = ts.createCompilerHost(options, true);
  const baseGet = host.getSourceFile.bind(host);
  host.fileExists = ((orig) => (f) => virtual.has(resolve(f)) || orig(f))(host.fileExists.bind(host));
  host.readFile = ((orig) => (f) => virtual.get(resolve(f)) ?? orig(f))(host.readFile.bind(host));
  host.getSourceFile = (f, lang, onError, create) => {
    const text = virtual.get(resolve(f));
    return text !== undefined ? ts.createSourceFile(f, text, lang, true) : baseGet(f, lang, onError, create);
  };

  const program = ts.createProgram({ rootNames: [...virtual.keys()], options, host });
  const failures = [];
  const global = ts.getPreEmitDiagnostics(program).filter((d) => !d.file && d.category === ts.DiagnosticCategory.Error);
  for (const name of virtual.keys()) {
    const sf = program.getSourceFile(name);
    const diags = ts.getPreEmitDiagnostics(program, sf).filter((d) => d.category === ts.DiagnosticCategory.Error);
    if (!diags.length) continue;
    const m = meta.get(name);
    failures.push({
      source: m.source,
      line: m.line,
      lang: m.lang,
      fragment: m.fragment,
      errors: diags.map((d) => {
        const { line } = d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start) : { line: 0 };
        // Map to the markdown line: fence line + 1 + author line (hoisted imports keep their numbers).
        const authorLine = m.fragment && line >= m.offset ? line - m.offset + m.hoisted : line;
        return { line: m.example ? line + 1 : m.line + 1 + authorLine, code: d.code, message: ts.flattenDiagnosticMessageText(d.messageText, ' ') };
      }),
    });
  }
  const ms = Date.now() - t0;
  return {
    total: snippets.length,
    sources: [...new Set(snippets.map((s) => s.source))].length,
    types,
    compilerOptions: { strict: true, jsx: 'react-jsx', moduleResolution: 'bundler' },
    durationMs: ms,
    budgetMs: BUDGET_MS,
    globalErrors: global.map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' ')),
    failures,
  };
}

export const REPORT_PATH = '.artifacts/plat/docs-snippets.json';

export function main(argv = process.argv.slice(2), root = ROOT_DEFAULT) {
  const ti = argv.indexOf('--tarball');
  const tarball = ti >= 0 ? argv[ti + 1] : null;
  const requirePacked = argv.includes('--require-packed') || process.env.CI === 'true';
  let report;
  let baseline;
  try {
    report = compile({ root, tarball, requirePacked });
    baseline = loadBaseline(root, 'docs-snippets');
  } catch (e) {
    console.error(`docs:snippets: ${e.message}`);
    return 1;
  }
  const findings = report.failures.map((f) => ({ ...f, file: f.source }));
  const { excused, blocking, errors } = applyBaseline(findings, baseline.rows, packageVersion(root));
  report.baseline = { path: baseline.path, rows: baseline.rows.length, excusedSnippets: excused.length, errors };
  report.blocking = blocking.length;
  const dest = join(root, REPORT_PATH);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify(report, null, 2) + '\n');
  for (const f of blocking) {
    for (const e of f.errors) console.error(`  FAIL ${f.source}:${e.line} TS${e.code} ${e.message}`);
  }
  for (const g of report.globalErrors) console.error(`  FAIL (options) ${g}`);
  for (const e of errors) console.error(`  FAIL (baseline) ${e}`);
  const overBudget = report.durationMs > BUDGET_MS;
  console.log(
    `docs:snippets: ${report.total} snippets from ${report.sources} files, ${blocking.length} failing` +
    (excused.length ? ` (+${excused.length} in ${baseline.path})` : '') +
    `, types=${report.types.mode}${report.types.tarball ? ` (${report.types.tarball})` : ''}, ${(report.durationMs / 1000).toFixed(1)} s` +
    (overBudget ? ` — over the ${BUDGET_MS / 1000} s budget` : ''),
  );
  if (report.types.mode === 'source') console.log('docs:snippets: no packed tarball — source-mode result; CI requires the pack (--require-packed)');
  return blocking.length || errors.length || report.globalErrors.length || overBudget ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) process.exit(main());
