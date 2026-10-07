#!/usr/bin/env node
/* @ag-contract-seed: S-52. PLAT-owned. `--entry <entry>` writes etc/api/<entry>.exports.json
   (sorted value exports from the built barrel) and a minimal .api.md. Final CLI flags. */
import { build } from 'esbuild';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const entry = arg('entry');
if (!entry) { console.error('usage: api-report.mjs --entry <entry> (e.g. material, root, compat.plat)'); process.exit(2); }

const manifest = JSON.parse(readFileSync('build/exports.manifest.json', 'utf8'));
const sub = entry === 'root' ? '.' : `./${entry.split('.')[0]}`;
const row = manifest.entries.find((e) => e.subpath === sub);
if (!row) { console.error(`api-report: no ENTRIES row for '${sub}'`); process.exit(1); }

const src = row.source.startsWith('src/') ? row.source : null;
let names = [];
if (src && existsSync(src)) {
  const res = await build({
    entryPoints: [src], bundle: true, write: false, format: 'esm', platform: 'node',
    external: ['react', 'react-dom', 'react-dom/*', 'react/*', 'clsx', '@base-ui/react', '@tanstack/*', 'react-aria-components', 'react-aria-components/*', '@internationalized/*', '@react-aria/*', '@react-stately/*', '@react-types/*'],
    logLevel: 'silent', metafile: true,
  });
  // value exports = top-level named exports, excluding type-only. Re-parse the barrel's
  // own export statements only (star re-exports resolve through esbuild's output).
  const text = res.outputFiles[0].text;
  const m = /export\s*\{([^}]*)\}\s*;?\s*$/m.exec(text) ?? /exports\.\w+\s*=/gm.exec(text);
  if (m && m[1]) {
    names = m[1].split(',').map((s) => s.trim().replace(/\s+as\s+\w+$/, '')).filter(Boolean).sort();
  }
}

mkdirSync('etc/api', { recursive: true });
writeFileSync(`etc/api/${entry}.exports.json`, JSON.stringify({ entry: sub, exports: names }, null, 1) + '\n');
writeFileSync(`etc/api/${entry}.api.md`,
  [`## API Report — aura-glass ${sub === '.' ? '(root)' : sub}`, '',
   ...names.map((n) => `- \`${n}\``), ''].join('\n'));
console.log(`api-report: wrote etc/api/${entry}.{exports.json,api.md} (${names.length} exports)`);
