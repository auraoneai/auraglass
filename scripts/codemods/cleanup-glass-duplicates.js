#!/usr/bin/env node
/**
 * Cleanup duplicate/garbled glass-* class tokens produced by prior migrations.
 * - Collapses repeated "glass-" prefixes: e.g., glass-glass-glass-text-sm -> glass-text-sm
 * - Fixes "min-glass-" → "glass-min-" typos
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'src');
const exts = new Set(['.tsx', '.ts']);

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else if (entry.isFile() && exts.has(path.extname(entry.name))) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of listFiles(ROOT)) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;
  // Collapse repeats of glass- prefix inside className strings
  src = src.replace(/(className\s*=\s*["'`][^"'`]*?)(glass-(?:glass-)+)/g, (_, pre, dup) => pre + dup.replace(/glass-(?:glass-)+/g, 'glass-'));
  // Generic collapse across file for any leftover repeats
  src = src.replace(/glass-(?:glass-)+/g, 'glass-');
  // Fix min-glass- -> glass-min-
  src = src.replace(/min-glass-/g, 'glass-min-');
  // Fix accidental 'glassglass--' and 'glassglass-'
  src = src.replace(/glassglass--/g, 'glass--');
  src = src.replace(/glassglass-/g, 'glass-');
  if (src !== before) {
    fs.writeFileSync(file, src);
    changed++;
  }
}
console.log(`cleanup-glass-duplicates: changed ${changed} files`);
