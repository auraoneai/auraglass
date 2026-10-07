#!/usr/bin/env node
/* MAT-096 — REQ-MAT-22 material css-api report.
   Emits etc/api/material.css-api.json { public, private, attributes,
   privateAttributes }:
     public            = every public custom property (S-03 PUBLIC_CSS_VARS +
                         MOTION_CSS_VARS, resolved by importing the contracts)
     private           = every --_ag-* name referenced under src/material/**
     attributes        = SC-21 attribute registry (AG_ATTRIBUTES) minus private
                         attributes; data-ag-material is rejected (D-20)
     privateAttributes = data-ag-sizeclass|radius|spacing|inset|edge|edge-style|
                         lens-ready|full-height|lens-defs
   --check regenerates and fails when a committed public name disappeared without
   a deprecations.json entry { kind: 'css-var', name } (SC-02/03).

   Usage: node scripts/mat/material-css-api.mjs [--root <dir>] [--check]
          [--deprecations <path>] [--write]   (default writes) */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');

export const PRIVATE_ATTRIBUTES = [
  'data-ag-sizeclass', 'data-ag-radius', 'data-ag-spacing', 'data-ag-inset',
  'data-ag-edge', 'data-ag-edge-style', 'data-ag-lens-ready', 'data-ag-full-height',
  'data-ag-lens-defs',
];

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

const isSrcFile = (name) => /\.(css|ts|tsx)$/.test(name);
const isTestFile = (rel) => rel.includes('__tests__') || /\.test\.[^.]+$/.test(rel);

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

async function loadContract(root, file) {
  const src = join(root, 'src/contracts', file);
  if (!existsSync(src)) return {};
  const out = join(mkdtempSync(join(tmpdir(), 'ag-cssapi-')), `${file}.mjs`);
  const res = await esbuild.build({
    entryPoints: [src], bundle: true, format: 'esm', platform: 'node',
    outfile: out, logLevel: 'silent',
  });
  if (res.errors.length) throw new Error(`esbuild failed on ${file}`);
  return import(pathToFileURL(out).href);
}

export async function generate(root) {
  const tokens = await loadContract(root, 'tokens.ts');
  const motion = await loadContract(root, 'motion.ts');
  const material = await loadContract(root, 'material.ts');

  const publicVars = new Set();
  for (const group of Object.values(tokens.PUBLIC_CSS_VARS ?? {})) {
    for (const v of group) publicVars.add(v);
  }
  for (const v of motion.MOTION_CSS_VARS ?? []) publicVars.add(v);

  const privateVars = new Set();
  const materialDir = join(root, 'src/material');
  const forbidden = [];
  if (existsSync(materialDir)) {
    for (const file of walk(materialDir)) {
      const rel = relative(root, file).replace(/\\/g, '/');
      if (isTestFile(rel)) continue;
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(/--_ag-[a-z0-9-]+/g)) privateVars.add(m[0]);
      if (/\bdata-ag-material\b/.test(text)) {
        forbidden.push(`${rel}: data-ag-material (D-20)`);
      }
    }
  }
  if (forbidden.length) {
    throw Object.assign(new Error(`forbidden attribute:\n  ${forbidden.join('\n  ')}`), { code: 'D20' });
  }

  const attrs = Object.keys(material.AG_ATTRIBUTES ?? {});
  if (attrs.includes('data-ag-material')) {
    throw Object.assign(new Error('AG_ATTRIBUTES contains data-ag-material (D-20)'), { code: 'D20' });
  }
  const attributes = attrs.filter((a) => !PRIVATE_ATTRIBUTES.includes(a)).sort();

  return {
    public: [...publicVars].sort(),
    private: [...privateVars].sort(),
    attributes,
    privateAttributes: [...PRIVATE_ATTRIBUTES].sort(),
  };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const ROOT = resolve(opt('--root', '.'));
  const CHECK = args.includes('--check');
  const DEPRECATIONS = resolve(opt('--deprecations', join(ROOT, 'deprecations.json')));
  const OUT = join(ROOT, 'etc/api/material.css-api.json');
  try {
    const next = await generate(ROOT);
    if (CHECK) {
      const committed = existsSync(OUT)
        ? JSON.parse(readFileSync(OUT, 'utf8'))
        : { public: [], private: [], attributes: [] };
      const deprecations = existsSync(DEPRECATIONS)
        ? JSON.parse(readFileSync(DEPRECATIONS, 'utf8'))
        : { entries: [] };
      const entries = deprecations.entries ?? deprecations;
      const deprecated = new Set(
        entries.filter((e) => e.kind === 'css-var').map((e) => e.name ?? e.id),
      );
      const missing = [
        ...committed.public.filter((v) => !next.public.includes(v)).map((v) => ['public', v]),
        ...committed.attributes.filter((a) => !next.attributes.includes(a)).map((a) => ['attributes', a]),
      ];
      const unretired = missing.filter(([, name]) => !deprecated.has(name));
      if (unretired.length) {
        for (const [section, name] of unretired) {
          console.error(`[material-css-api] removed public ${section} name '${name}' has no css-var deprecation entry`);
        }
        process.exit(1);
      }
      console.log('[material-css-api] --check OK');
      process.exit(0);
    }
    mkdirSync(join(ROOT, 'etc/api'), { recursive: true });
    writeFileSync(OUT, `${JSON.stringify(next, null, 1)}\n`);
    console.log(`[material-css-api] wrote ${relative(process.cwd(), OUT)}`);
  } catch (err) {
    if (err.code === 'D20') {
      console.error(`[material-css-api] ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
}
