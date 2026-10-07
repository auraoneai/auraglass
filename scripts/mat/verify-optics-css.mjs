#!/usr/bin/env node
/* MAT-100 — REQ-MAT-39 CSS scanner (no stylelint dependency; PostCSS via stylelint's
   own install per OI-MAT-04). Applies the optics patterns to every .css file under
   src outside src/material/css and generated token CSS.

   Usage:
     node scripts/mat/verify-optics-css.mjs [--root <dir>] [--ratchet <baseline.json>]
   Prints one `file:line  <pattern-id>  <decl>` per violation.
   Exit 1: any violation (default) or a ratchet regression (new file or higher
   per-file count versus the baseline). */
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { OPTICS_PATTERNS } from './optics-patterns.mjs';

const require = createRequire(import.meta.url);
const postcss = (() => {
  try {
    // OI-MAT-04: resolve postcss through stylelint's dependency tree.
    const styleRequire = createRequire(require.resolve('stylelint/package.json'));
    return styleRequire('postcss');
  } catch {
    console.error('[verify-optics-css] postcss unavailable via stylelint');
    process.exit(2);
  }
})();

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const ROOT = resolve(opt('--root', '.'));
const RATCHET = opt('--ratchet', null);

const isExcluded = (rel) =>
  rel.startsWith('src/material/css/')
  || rel.includes('/generated/')
  || rel.startsWith('dist/')
  || rel.startsWith('node_modules/')
  || rel.startsWith('legacy/');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      yield* walk(p);
    } else if (name.endsWith('.css')) {
      yield p;
    }
  }
}

export function scan(root) {
  const srcDir = join(root, 'src');
  const files = existsSync(srcDir) ? [...walk(srcDir)] : [];
  const violations = [];
  for (const file of files) {
    const rel = relative(root, file).replace(/\\/g, '/');
    if (isExcluded(rel)) continue;
    const text = readFileSync(file, 'utf8');
    let ast;
    try {
      ast = postcss.parse(text, { from: file });
    } catch (err) {
      violations.push({ file: rel, line: 0, pattern: 'unparseable', decl: String(err) });
      continue;
    }
    ast.walkDecls((decl) => {
      const hay = `${decl.prop}: ${decl.value}`;
      for (const p of OPTICS_PATTERNS) {
        if (p.re.test(hay)) {
          violations.push({ file: rel, line: decl.source?.start?.line ?? 0, pattern: p.id, decl: hay.slice(0, 120) });
        }
      }
    });
  }
  return violations;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);

if (isMain) {
  const violations = scan(ROOT);
  for (const v of violations) {
    console.log(`${v.file}:${v.line}  ${v.pattern}  ${v.decl}`);
  }
  if (RATCHET) {
    const baseline = JSON.parse(readFileSync(resolve(RATCHET), 'utf8'));
    const baseFiles = baseline.files ?? {};
    const counts = {};
    for (const v of violations) counts[v.file] = (counts[v.file] ?? 0) + 1;
    const regressions = [];
    for (const [file, n] of Object.entries(counts)) {
      const base = baseFiles[file];
      if (base === undefined) regressions.push(`${file}: new violating file (${n})`);
      else if (n > base) regressions.push(`${file}: ${base} -> ${n} violations`);
    }
    if (regressions.length) {
      console.error(`[verify-optics-css] ratchet regression:\n  ${regressions.join('\n  ')}`);
      process.exit(1);
    }
    console.log(`[verify-optics-css] ratchet OK (${violations.length} violation(s), baseline ${Object.keys(baseFiles).length} file(s))`);
    process.exit(0);
  }
  process.exit(violations.length ? 1 : 0);
}
