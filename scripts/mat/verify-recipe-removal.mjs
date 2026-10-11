#!/usr/bin/env node
/* MAT-179 — REQ-MAT-67 recipe-removal gate.
   `rg -l "buildSurfaceStyles|buildLiquidGlassStyles|buildBackdropFilter|
   createGlassStyle|glassFoundation|glassUtils|liquidGlassUtils" src` must return only
   src/compat/** files (the 4.x adapters; §9 removals are inert there until deleted).
   Additionally, every §5.10 removal row named in --deprecations <file> must carry a
   deprecations fragment entry — when the 4.x fragment table is absent from this tree
   that check is reported `pending`, never failed.

   Usage: node scripts/mat/verify-recipe-removal.mjs [--root <dir>] [--deprecations <json>]
   Exit 1 on any recipe symbol found outside src/compat/**. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { isMain as isMainModule } from './_is-main.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const ROOT = resolve(opt('--root', '.'));
const DEPRECATIONS = opt('--deprecations', null);

const RECIPE_SYMBOLS = [
  'buildSurfaceStyles', 'buildLiquidGlassStyles', 'buildBackdropFilter',
  'createGlassStyle', 'glassFoundation', 'glassUtils', 'liquidGlassUtils',
];
const RE = new RegExp(RECIPE_SYMBOLS.join('|'));

const isCompat = (rel) => rel.startsWith('src/compat/');
const isSrcFile = (name) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(name);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
      yield* walk(p);
    } else if (isSrcFile(name)) {
      yield p;
    }
  }
}

export function scan(root) {
  const srcDir = join(root, 'src');
  const hits = [];
  if (!existsSync(srcDir)) return hits;
  for (const file of walk(srcDir)) {
    const rel = relative(root, file).replace(/\\/g, '/');
    const text = readFileSync(file, 'utf8');
    let lineNo = 0;
    for (const line of text.split('\n')) {
      lineNo += 1;
      const m = RE.exec(line);
      if (m) hits.push({ file: rel, line: lineNo, symbol: m[0], compat: isCompat(rel) });
    }
  }
  return hits;
}

const isMain = isMainModule(import.meta.url);

if (isMain) {
  const hits = scan(ROOT);
  const outside = hits.filter((h) => !h.compat);
  for (const h of hits) {
    console.log(`${h.compat ? 'compat ' : 'FAIL   '}${h.file}:${h.line}  ${h.symbol}`);
  }
  if (outside.length) {
    console.error(`[verify-recipe-removal] ${outside.length} recipe symbol(s) outside src/compat/**`);
    process.exit(1);
  }
  if (DEPRECATIONS) {
    if (!existsSync(resolve(DEPRECATIONS))) {
      console.log('[verify-recipe-removal] deprecations table absent — coverage check pending (authored on release/4.x)');
    } else {
      const dep = JSON.parse(readFileSync(resolve(DEPRECATIONS), 'utf8'));
      const ids = new Set((dep.entries ?? dep).map((e) => e.id ?? e.name));
      const missing = RECIPE_SYMBOLS.filter((s) => !ids.has(s));
      if (missing.length) {
        console.error(`[verify-recipe-removal] removals without deprecation entries: ${missing.join(', ')}`);
        process.exit(1);
      }
      console.log('[verify-recipe-removal] every recipe removal has a deprecation entry');
    }
  }
  console.log(`[verify-recipe-removal] OK — ${hits.length} compat-only recipe reference(s)`);
}
