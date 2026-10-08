#!/usr/bin/env node
// MAT-051 gate dead-vars.
// Every public manifest var needs >= 1 reader in dist/css or library src TS/CSS
// (excluding generated, tests, stories), or carries $extensions['ag.public']=true
// (public surface is contract-stable). Private --_ag-* vars declared in hand-written
// files need >= 1 reader; private vars inside generated artifacts (tokens.css,
// tailwind.css, material css generated/) are the recipe contract consumed by
// material.css and component lanes — counted, not failed.
// With --write-consumers, rewrites dist/tokens/manifest.json consumer counts.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, rel, walkFiles } from './_util.mjs';

const update = process.argv.includes('--write-consumers');
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const manifestPath = arg('--manifest') ?? join(ROOT, 'dist/tokens/manifest.json');
const distDir = arg('--dist') ?? join(ROOT, 'dist');
const srcDir = arg('--src') ?? join(ROOT, 'src');
if (!existsSync(manifestPath)) {
  console.error('dead-vars: dist/tokens/manifest.json missing — run npm run tokens:build first');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

// reader corpus: emitted css + hand-written src (no generated/tests/stories/dist-copies)
const corpus = [];
for (const f of walkFiles(distDir, ['.css'])) corpus.push([rel(f), readFileSync(f, 'utf8')]);
for (const f of walkFiles(srcDir, ['.ts', '.tsx', '.css'])) {
  const r = rel(f);
  if (r.includes('/generated/') || r.endsWith('.generated.ts') || r.includes('__tests__')) continue;
  corpus.push([r, readFileSync(f, 'utf8')]);
}

const VAR_USE = (v) => new RegExp(`var\\(\\s*${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
const countReaders = (v) => {
  let n = 0;
  for (const [, text] of corpus) n += (text.match(VAR_USE(v)) ?? []).length;
  return n;
};

// --_ag-* declared in hand-written src css must be read somewhere.
// (Compiler-emitted recipe privates are excluded: their consumers live in
// material.css and component css owned by lanes outside T.)
const emittedPrivate = new Map();
const recipePrivate = new Set();
for (const [r, text] of corpus) {
  const generated = r.startsWith('dist/') || r.includes('/generated/') || r.endsWith('.generated.ts');
  for (const m of text.matchAll(/(--_ag-[a-zA-Z0-9-]+)\s*:/g)) {
    if (generated) recipePrivate.add(m[1]);
    else emittedPrivate.set(m[1], r);
  }
}

const counts = new Map();
for (const t of manifest.tokens) counts.set(t.cssVar, countReaders(t.cssVar));
for (const v of emittedPrivate.keys()) counts.set(v, countReaders(v));
for (const v of recipePrivate) counts.set(v, countReaders(v));

const deadPublic = manifest.tokens.filter((t) => (counts.get(t.cssVar) ?? 0) === 0 && t.public !== true);
const deadPrivate = [...emittedPrivate.keys()].filter((v) => (counts.get(v) ?? 0) === 0);

if (update) {
  for (const t of manifest.tokens) t.consumers = [{ count: counts.get(t.cssVar) ?? 0 }];
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n');
}

let failed = false;
for (const t of deadPublic) { console.error(`dead-vars: public ${t.cssVar} (${t.name}) has 0 readers`); failed = true; }
for (const v of deadPrivate) { console.error(`dead-vars: private ${v} emitted at ${emittedPrivate.get(v)} has 0 readers`); failed = true; }
if (failed) process.exit(1);
const deadRecipe = [...recipePrivate].filter((v) => (counts.get(v) ?? 0) === 0).length;
console.log(`dead-vars: 0 dead vars (public ${manifest.tokens.length}, hand-written private ${emittedPrivate.size}, recipe private ${recipePrivate.size} with ${deadRecipe} awaiting consumer lanes)${update ? ' — consumers written' : ''}`);
