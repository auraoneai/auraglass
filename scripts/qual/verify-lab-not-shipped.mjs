#!/usr/bin/env node
// scripts/qual/verify-lab-not-shipped.mjs — REQ-QUAL-54 "never shipped" (REQ-FIN-106, FIN-451), L1 built-in.
//  1. Import guard: no file under src/**, showcase/** or registry/** imports (static import/export-from, dynamic import(),
//     require()) anything under .storybook/**.
//  2. Shipped-artifact scan: the packed tarball (AURAGLASS_TARBALL, written by plat:package:pack's dotenv, or --tarball)
//     and/or a dist/ directory (--dist) contain no `.storybook` path and no story-only attribute
//     (data-ag-story-content | story-kind | cert-ready | lab-override | state-cell) in any runtime file
//     (.js/.mjs/.cjs/.css/.html/.json). Type declarations (.d.ts/.d.mts/.d.cts) are not markup: the S-01 attribute
//     registry type names the story-only attributes so that MAT/QUAL tooling can refer to them; they never render.
// CLI: node scripts/qual/verify-lab-not-shipped.mjs [--tarball <tgz>] [--dist <dir>] [--imports-only]
//   With neither --tarball, --dist nor AURAGLASS_TARBALL the scan fails (fail-closed), unless --imports-only.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const STORY_ONLY_ATTRIBUTES = ['data-ag-story-content', 'data-ag-story-kind', 'data-ag-cert-ready', 'data-ag-lab-override', 'data-ag-state-cell'];
const ATTR_RE = new RegExp(`\\b(${STORY_ONLY_ATTRIBUTES.join('|')})\\b`);
const GUARDED_ROOTS = ['src', 'showcase', 'registry'];
const SOURCE = /\.(tsx?|jsx?|mjs|cjs|mts|cts|mdx)$/;
const RUNTIME = /\.(js|mjs|cjs|css|html|json)$/;
const DECLARATION = /\.d\.(ts|mts|cts)$/;

/** Module specifiers of a source file (static, re-export, dynamic import and require with a string literal). */
export function specifiers(code, file) {
  const kind = /\.(tsx|jsx|mdx)$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, kind);
  const out = [];
  const visit = (n) => {
    if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteralLike(n.moduleSpecifier)) out.push(n.moduleSpecifier.text);
    if (ts.isCallExpression(n) && n.arguments.length && ts.isStringLiteralLike(n.arguments[0])
      && (n.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(n.expression) && n.expression.text === 'require'))) out.push(n.arguments[0].text);
    if (ts.isImportTypeNode(n) && ts.isLiteralTypeNode(n.argument) && ts.isStringLiteral(n.argument.literal)) out.push(n.argument.literal.text);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/** Contract S-51: MDX docs may import exactly `.storybook/blocks/index.tsx` (the doc blocks), nothing else. */
const isDocBlocks = (target) => /^\.storybook\/blocks(\/index(\.tsx)?)?$/.test(target);

/** True when `spec`, imported from repo-relative `file`, points into .storybook/** (minus the S-51 MDX allowance). */
export function reachesStorybook(spec, file) {
  if (spec.startsWith('.')) {
    const target = posix.normalize(posix.join(posix.dirname(file), spec));
    if (file.endsWith('.mdx') && isDocBlocks(target)) return false;
    return target === '.storybook' || target.startsWith('.storybook/');
  }
  return /(^|\/)\.storybook(\/|$)/.test(spec);
}

export function importViolations(files) {
  return files.flatMap(({ file, code }) => specifiers(code, file).filter((s) => reachesStorybook(s, file))
    .map((s) => `${file} imports ${s} (.storybook/** is never importable from src/showcase/registry)`));
}

export function guardedFiles(root = ROOT) {
  return execFileSync('git', ['ls-files', '-z', '--', ...GUARDED_ROOTS], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\0').filter((f) => f && SOURCE.test(f) && existsSync(join(root, f)))
    .map((file) => ({ file, code: readFileSync(join(root, file), 'utf8') }));
}

/** Findings for a list of shipped files `{ path, read() }`. */
export function shippedViolations(entries) {
  const out = [];
  for (const e of entries) {
    if (/(^|\/)\.storybook(\/|$)/.test(e.path)) out.push(`${e.path}: a .storybook file is shipped`);
    if (DECLARATION.test(e.path) || !RUNTIME.test(e.path)) continue;
    const m = ATTR_RE.exec(e.read());
    if (m) out.push(`${e.path}: ships story-only attribute ${m[1]}`);
  }
  return out;
}

function walk(dir, base = dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p, base) : [relative(base, p).split(sep).join('/')];
  });
}

export function dirEntries(dir, prefix) {
  return walk(dir).map((p) => ({ path: `${prefix}${p}`, read: () => readFileSync(join(dir, p), 'utf8') }));
}

/** Unpacks a tarball into a temp dir and scans it; the temp dir is always removed. */
export function scanTarball(tgz) {
  const tmp = mkdtempSync(join(tmpdir(), 'ag-lab-not-shipped-'));
  try {
    execFileSync('tar', ['-xzf', tgz, '-C', tmp]);
    return shippedViolations(dirEntries(tmp, `${tgz.split('/').pop()}:`));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

export function main(argv = process.argv.slice(2), env = process.env, root = ROOT) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  const findings = importViolations(guardedFiles(root));
  console.log(`verify-lab-not-shipped: import guard over ${GUARDED_ROOTS.join(', ')}`);
  if (!argv.includes('--imports-only')) {
    const tarball = arg('--tarball') ?? env.AURAGLASS_TARBALL;
    const dist = arg('--dist');
    if (!tarball && !dist) findings.push('no shipped artifact to scan: set AURAGLASS_TARBALL (plat:package:pack) or pass --tarball/--dist');
    if (tarball) {
      const abs = resolve(root, tarball);
      if (!existsSync(abs)) findings.push(`tarball ${tarball} does not exist`);
      else { findings.push(...scanTarball(abs)); console.log(`verify-lab-not-shipped: scanned ${tarball}`); }
    }
    if (dist) {
      const abs = resolve(root, dist);
      if (!existsSync(abs)) findings.push(`dist directory ${dist} does not exist`);
      else { findings.push(...shippedViolations(dirEntries(abs, `${dist.replace(/\/$/, '')}/`))); console.log(`verify-lab-not-shipped: scanned ${dist}/`); }
    }
  }
  for (const f of findings) console.error(`  FAIL ${f}`);
  return findings.length ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main());
