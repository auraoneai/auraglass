#!/usr/bin/env node
/* rewrite-dts-aliases.mjs (PLAT-252, REQ-PLAT-66)
   After tsc --emitDeclarationOnly, declaration files can still reference tsconfig
   path aliases (aura-glass/x, @/x) which do not resolve in the published package.
   Rewrite every relative-resolvable alias to the relative dist path so the emitted
   graph is path-identity with the runtime graph (dist/x.js <-> dist/x.d.ts).
   Plain-JS sources (src/x.mjs, e.g. theme/wcag.mjs shared with the tokens build) get
   no tsc declaration; their hand-written src/x.d.mts companion is copied to x.d.ts. */
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { DIST, SRC, walk } from './lib/graph.mjs';
import { existsSync } from 'node:fs';

const SPEC_RE = /(from\s*|import\s*\(\s*|import\s*)['"]([^'"]+)['"]/g;

export function rewriteFile(dtsFile) {
  let text = readFileSync(dtsFile, 'utf8');
  let changed = false;
  text = text.replace(SPEC_RE, (m, pre, spec) => {
    let target = null;
    if (spec === 'aura-glass') target = join(DIST, 'index.d.ts');
    else if (spec.startsWith('aura-glass/')) {
      const sub = spec.slice('aura-glass/'.length);
      for (const c of [join(DIST, `${sub}/index.d.ts`), join(DIST, `${sub}.d.ts`)]) if (existsSync(c)) target = c;
      if (!target && sub === 'styles.css') target = null; // css subpaths never resolve in d.ts
      if (!target) return m; // leave untouched; verifier reports it
    } else if (spec.startsWith('@/')) {
      const sub = spec.slice(2);
      for (const c of [join(DIST, `${sub}/index.d.ts`), join(DIST, `${sub}.d.ts`)]) if (existsSync(c)) target = c;
      if (!target) return m;
    } else if (spec.startsWith('.') && !/\.\w+$/.test(spec)) {
      // extensionless relative specifier: node16 ESM resolves `./x` literally
      // (no extension search), so point it at the runtime `.js` (REQ-PLAT-73).
      const dir = dirname(dtsFile);
      for (const [cand, suffix] of [[join(dir, `${spec}.d.ts`), '.js'], [join(dir, spec, 'index.d.ts'), '/index.js']]) {
        if (existsSync(cand)) { changed = true; return `${pre}'${spec}${suffix}'`; }
      }
      return m; // unresolved — verifier reports it
    } else return m;
    let rel = relative(dirname(dtsFile), target).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    rel = rel.replace(/\.d\.ts$/, '.js'); // d.ts references use the runtime specifier
    changed = true;
    return `${pre}'${rel}'`;
  });
  if (changed) writeFileSync(dtsFile, text);
  return changed;
}

/** dist/x.js emitted from src/x.mjs: copy src/x.d.mts to dist/x.d.ts when tsc emitted none. */
export function copyMjsDeclarations(root = DIST) {
  let n = 0;
  for (const js of walk(root, p => p.endsWith('.js'))) {
    const stem = relative(root, js).replace(/\.js$/, '');
    const dts = join(root, `${stem}.d.ts`);
    const companion = join(SRC, `${stem}.d.mts`);
    if (existsSync(dts) || !existsSync(join(SRC, `${stem}.mjs`)) || !existsSync(companion)) continue;
    copyFileSync(companion, dts);
    n++;
  }
  return n;
}

export function rewriteAll(root = DIST) {
  copyMjsDeclarations(root);
  const files = walk(root, p => p.endsWith('.d.ts'));
  let n = 0;
  for (const f of files) if (rewriteFile(f)) n++;
  return { files: files.length, rewritten: n };
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  const r = rewriteAll();
  console.log(`rewrite-dts-aliases: ${r.files} d.ts scanned, ${r.rewritten} rewritten`);
}
