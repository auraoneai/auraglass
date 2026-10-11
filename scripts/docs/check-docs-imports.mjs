#!/usr/bin/env node
/* scripts/docs/check-docs-imports.mjs — REQ-PLAT-102 (REQ-FIN-43), PLAT-384
   import bans. No docs snippet (apps/docs/examples/**, fenced ts/tsx/jsx in
   apps/docs/content/**, docs/quickstart/**, docs/guides/**, README.md)
   imports from:
     - `@/…` (repo path alias),
     - a relative path into the repo's `src/` (`../src`, `../../src/x`, …),
     - `@aura/glass` (fictional 4.x package name),
     - `aura-glass/<subpath>` absent from the package.json `exports` map
       (deep `dist/` imports included).
   Specifiers come from ts.preProcessFile (static import/export-from, dynamic
   import(), require()). Expiring baseline: scripts/integration/baselines/
   docs-imports.json (PRD-F §4.3 rule 3). */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { collectSnippets, wrapSnippet } from './compile-snippets.mjs';
import { applyBaseline, loadBaseline, packageVersion } from './lib/baseline.mjs';

const ROOT_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Export-map subpaths as importable specifiers (`aura-glass`, `aura-glass/theme`, …). */
export function exportedSpecifiers(pkg) {
  const keys = typeof pkg.exports === 'string' ? ['.'] : Object.keys(pkg.exports ?? {});
  return new Set(keys.map((k) => (k === '.' ? pkg.name : `${pkg.name}/${k.replace(/^\.\//, '')}`)));
}

/** Matches an export-map key with a `*` pattern, if any. */
function matchesPattern(spec, exported) {
  for (const e of exported) {
    if (!e.includes('*')) continue;
    const [pre, post] = e.split('*');
    if (spec.startsWith(pre) && spec.endsWith(post) && spec.length >= pre.length + post.length) return true;
  }
  return false;
}

/** Ban reason for one specifier, or null. */
export function banReason(spec, exported, name = 'aura-glass') {
  if (spec === '@/' || spec.startsWith('@/')) return 'imports the repo path alias `@/`';
  if (/^\.{1,2}\//.test(spec) && /(^|\/)src(\/|$)/.test(spec)) return 'imports repo source through a relative `src/` path';
  if (spec === '@aura/glass' || spec.startsWith('@aura/glass/')) return 'imports the non-existent package `@aura/glass`';
  if (spec === name || spec.startsWith(`${name}/`)) {
    if (!exported.has(spec) && !matchesPattern(spec, exported)) return `\`${spec}\` is not in the aura-glass exports map`;
  }
  return null;
}

/** Specifiers imported by one module text. */
export function importsOf(text) {
  return ts.preProcessFile(text, true, true).importedFiles.map((f) => f.fileName);
}

/** Every violation in the repo (or in `snippets`). */
export function findViolations({ root = ROOT_DEFAULT, snippets = collectSnippets(root), pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) } = {}) {
  const exported = exportedSpecifiers(pkg);
  const out = [];
  for (const s of snippets) {
    const text = s.example ? s.code : wrapSnippet(s).text;
    for (const spec of importsOf(text)) {
      const reason = banReason(spec, exported, pkg.name);
      if (reason) out.push({ file: s.source, line: s.line, specifier: spec, reason });
    }
  }
  return out;
}

export function main(root = ROOT_DEFAULT) {
  const found = findViolations({ root });
  const baseline = loadBaseline(root, 'docs-imports');
  const { excused, blocking, errors } = applyBaseline(found, baseline.rows, packageVersion(root));
  for (const v of blocking) console.error(`  FAIL ${v.file}:${v.line} '${v.specifier}' — ${v.reason}`);
  for (const e of errors) console.error(`  FAIL (baseline) ${e}`);
  console.log(`docs:imports: ${blocking.length} violations` + (excused.length ? ` (+${excused.length} in ${baseline.path})` : ''));
  return blocking.length || errors.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) process.exit(main());
