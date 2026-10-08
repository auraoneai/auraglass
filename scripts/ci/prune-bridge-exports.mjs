#!/usr/bin/env node
/**
 * Conditional 4.3 bridge subpaths (PLAT-156/157).
 * Emits ./material, ./styles/v5.css, ./compat/tokens.css, ./compat/globals.css
 * only when their source inputs exist on this line; writes the decided map to
 * package.json#exports and a record to .artifacts/bridge-exports.json.
 * --restore puts back the base exports (postpack).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.env.AURAGLASS_REPO_ROOT || path.resolve(import.meta.dirname, '..', '..');
const pkgPath = path.join(ROOT, 'package.json');
const backupPath = path.join(ROOT, '.bridge-exports.backup.json');

const CANDIDATES = {
  './material': { types: './dist/material/index.d.ts', import: './dist/material/index.mjs', require: './dist/material/index.cjs', default: './dist/material/index.mjs' },
  './styles/v5.css': './dist/styles/v5.css',
  './compat/tokens.css': './dist/compat/tokens.css',
  './compat/globals.css': './dist/compat/globals.css',
};
const SOURCES = {
  './material': 'src/material/index.ts',
  './styles/v5.css': 'src/styles/v5.css',
  './compat/tokens.css': 'src/compat/tokens.css',
  './compat/globals.css': 'src/compat/css/globals.css',
};

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (process.argv.includes('--restore')) {
  if (fs.existsSync(backupPath)) { fs.writeFileSync(pkgPath, fs.readFileSync(backupPath, 'utf8')); fs.rmSync(backupPath); }
  process.exit(0);
}
fs.writeFileSync(backupPath, JSON.stringify(pkg, null, 2) + '\n');
const rowH = (process.env.AURAGLASS_ROW_H || '') !== 'absent';
const emitted = {}, omitted = [];
for (const [key, value] of Object.entries(CANDIDATES)) {
  const src = SOURCES[key];
  const absent = !rowH || !fs.existsSync(path.join(ROOT, src));
  if (absent) { omitted.push({ key, reason: rowH ? `missing source ${src}` : 'row-H inputs absent' }); delete pkg.exports[key]; }
  else { emitted[key] = value; pkg.exports[key] = value; }
}
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
const evDir = process.env.AURAGLASS_EVIDENCE_DIR || path.join(ROOT, '.artifacts');
fs.mkdirSync(evDir, { recursive: true });
fs.writeFileSync(path.join(evDir, 'bridge-exports.json'), JSON.stringify({ emitted: Object.keys(emitted), omitted }, null, 2) + '\n');
console.log(`bridge-exports: ${Object.keys(emitted).length} emitted, ${omitted.length} omitted`);
