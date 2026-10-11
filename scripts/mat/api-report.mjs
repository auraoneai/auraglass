#!/usr/bin/env node
/* scripts/mat/api-report.mjs — MAT-343/345 (REQ-MAT-22). Lane wrapper around
   PLAT's frozen `npm run api:update -- --entry <entry>` (scripts/build/
   api-report.mjs, S-52) plus the two composed per-stream reports the frozen
   CLI cannot address:
     root.mat   -> etc/api/root.mat.api.md   from src/root/mat.ts
     compat.mat -> etc/api/compat.mat.api.md  from src/compat/mat/index.ts
   Also writes etc/api/material.css-api.json (MAT-345): public CSS variables
   (S-03 PUBLIC_CSS_VARS + MOTION_CSS_VARS), the S-01 attribute registry, and
   the a11yOverridable list + required rung values (REQ-MAT-54).

   usage: node scripts/mat/api-report.mjs [--all]
          node scripts/mat/api-report.mjs --entry material
          node scripts/mat/api-report.mjs --entry root.mat|compat.mat
          node scripts/mat/api-report.mjs --entry material.css-api
*/
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const entry = arg('entry');
const ALL = process.argv.includes('--all');
const ENTRIES_ENTRIES = ['material', 'theme', 'tokens', 'motion'];
const COMPOSED = { 'root.mat': 'src/root/mat.ts', 'compat.mat': 'src/compat/mat/index.ts' };

if (!ALL && !entry) {
  console.error('usage: api-report.mjs --all | --entry material|theme|tokens|motion|root.mat|compat.mat|material.css-api');
  process.exit(2);
}
const targets = ALL ? [...ENTRIES_ENTRIES, ...Object.keys(COMPOSED), 'material.css-api'] : [entry];

/** Bundle a TS module and import it via data: URL (contract sources). */
async function bundleModule(src) {
  const res = await build({
    entryPoints: [src], bundle: true, write: false, format: 'esm', platform: 'node',
    external: ['react', 'react-dom'], logLevel: 'silent',
  });
  return import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString('base64')}`);
}
const entriesSpec = (await bundleModule('src/contracts/entries.ts')).ENTRIES;

/** Value exports of a TS barrel via esbuild (same technique as PLAT's tool). */
async function exportsOf(src) {
  const res = await build({
    entryPoints: [src], bundle: true, write: false, format: 'esm', platform: 'node',
    external: ['react', 'react-dom', 'react-dom/*', 'react/*', 'clsx', '@base-ui/react', '@tanstack/*'],
    logLevel: 'silent',
  });
  const text = res.outputFiles[0].text;
  const m = /export\s*\{([^}]*)\}\s*;?\s*$/m.exec(text);
  if (!m || !m[1]) return [];
  // `local as exported`: report the exported name (esbuild renames a local
  // that collides inside the bundle, e.g. createGlassTheme2 as createGlassTheme)
  return m[1].split(',').map((s) => s.trim().replace(/^\w+\s+as\s+/, '')).filter(Boolean).sort();
}

/** MAT-343: every difference vs the ENTRIES contract listed in the report. */
function diffSection(sub, names) {
  const spec = entriesSpec.find((e) => e.subpath === sub);
  if (!spec) return '';
  const wanted = spec.exports.filter((e) => !e.startsWith('@'));
  const missing = wanted.filter((e) => !names.includes(e));
  const extra = names.filter((n) => !wanted.includes(n));
  return ['', '## Diff vs ENTRIES (architecture §4.2)', '',
    `- missing (contract exports absent from barrel): ${missing.length ? missing.map((n) => `\`${n}\``).join(', ') : 'none'}`,
    `- extra (barrel exports not in contract): ${extra.length ? extra.map((n) => `\`${n}\``).join(', ') : 'none'}`, ''].join('\n');
}

async function writeComposed(name, src) {
  if (!existsSync(src)) {
    console.error(`api-report: pending — ${src} absent, skipping ${name}`);
    return;
  }
  const names = await exportsOf(src);
  mkdirSync('etc/api', { recursive: true });
  writeFileSync(`etc/api/${name}.exports.json`, JSON.stringify({ entry: name, source: src, exports: names }, null, 1) + '\n');
  writeFileSync(`etc/api/${name}.api.md`,
    [`## API Report — aura-glass ${name} (${src})`, '', ...names.map((n) => `- \`${n}\``), ''].join('\n'));
  console.log(`api-report: wrote etc/api/${name}.{exports.json,api.md} (${names.length} exports)`);
}

async function writeCssApi() {
  const { PUBLIC_CSS_VARS } = await bundleModule('src/contracts/tokens.ts');
  const { MOTION_CSS_VARS } = await bundleModule('src/contracts/motion.ts');
  const { AG_ATTRIBUTES, SURFACE_CLASS } = await bundleModule('src/contracts/material.ts');
  const variables = Object.entries(PUBLIC_CSS_VARS).flatMap(([group, vars]) =>
    vars.map((v) => ({ name: v, group })),
  ).concat(MOTION_CSS_VARS.map((v) => ({ name: v, group: 'motion' })));
  const attributes = Object.fromEntries(
    Object.entries(AG_ATTRIBUTES).map(([name, spec]) => [name, { setter: spec.setter, values: spec.values }]),
  );
  const doc = {
    entry: './material.css',
    surfaceClass: SURFACE_CLASS,
    variables,
    attributes,
    /* MAT-345 (REQ-MAT-54): members the a11y rungs may override on [data-ag-surface]. */
    a11yOverridable: [
      '--_ag-blur', '--_ag-saturation', '--ag-specular', '--_ag-tint-floor',
      '--_ag-grain-opacity', '--_ag-shadow', '--_ag-fill',
    ],
    /* Required rung values per MAT-345 / REQ-MAT-54. */
    a11yRungs: {
      'contrast-more': {
        saturation: 1, specular: 0, grain: 'removed', transparencyFloor: 'tinted',
      },
      'forced-colors': {
        fill: 'Canvas', ink: 'CanvasText', border: 'CanvasText', shadow: 'none',
      },
      'reduced-transparency': { transparencyFloor: 'tinted' },
    },
  };
  mkdirSync('etc/api', { recursive: true });
  writeFileSync('etc/api/material.css-api.json', JSON.stringify(doc, null, 1) + '\n');
  console.log(`api-report: wrote etc/api/material.css-api.json (${variables.length} vars, ${Object.keys(attributes).length} attrs)`);
}

for (const t of targets) {
  if (t === 'material.css-api') { await writeCssApi(); continue; }
  if (COMPOSED[t]) { await writeComposed(t, COMPOSED[t]); continue; }
  if (!ENTRIES_ENTRIES.includes(t)) { console.error(`api-report: unknown entry '${t}'`); process.exit(1); }
  // PLAT frozen CLI is the canonical writer for ENTRIES entries (S-52).
  execFileSync('node', ['scripts/build/api-report.mjs', '--entry', t], { stdio: 'inherit' });
  const sub = `./${t}`;
  const exportsJson = JSON.parse(readFileSync(`etc/api/${t}.exports.json`, 'utf8'));
  const apiMd = readFileSync(`etc/api/${t}.api.md`, 'utf8');
  writeFileSync(`etc/api/${t}.api.md`, apiMd + diffSection(sub, exportsJson.exports));
}
