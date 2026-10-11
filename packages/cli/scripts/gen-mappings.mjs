#!/usr/bin/env node
/**
 * Compile codemod mappings (S-50): run loadFragments('codemods') +
 * loadFragments('deprecations') at the repo root and write one JSON file per
 * stream into src/migrate/4to5/mappings/. Transforms never read fragments
 * directly — this script is the only bridge. Output is git-ignored.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(HERE, '..');
const REPO = path.resolve(PKG, '..', '..');
const OUT = path.join(PKG, 'src', 'migrate', '4to5', 'mappings');

const { loadFragments } = await import(pathToFileURL(path.join(REPO, 'src', 'contracts', 'load-fragments.mjs')).href);

mkdirSync(OUT, { recursive: true });
const codemods = await loadFragments('codemods', REPO);
for (const { stream, value } of codemods) {
  const v = Array.isArray(value) ? value[0] : value;
  writeFileSync(path.join(OUT, `${stream}.json`), `${JSON.stringify(v ?? {}, null, 2)}\n`);
}
try {
  const deps = await loadFragments('deprecations', REPO);
  const entries = deps.flatMap(({ value }) => (Array.isArray(value) ? value : [value])).filter(Boolean);
  writeFileSync(path.join(OUT, 'deprecations.json'), `${JSON.stringify(entries, null, 2)}\n`);
} catch {
  writeFileSync(path.join(OUT, 'deprecations.json'), '[]\n');
}
if (!existsSync(OUT)) throw new Error('mappings output missing');
console.log(`gen-mappings: wrote ${codemods.length} stream(s) + deprecations to ${path.relative(REPO, OUT)}`);
