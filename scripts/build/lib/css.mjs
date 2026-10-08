/* CSS assembly library (PLAT-275, REQ-PLAT-74).
   Deterministic: layer order is the contract constant; fragments sort by (order, file). */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { transform as esbuildTransform } from 'esbuild';
import { ROOT, SRC, DIST, walk } from './graph.mjs';
import { loadFragments } from '../../../src/contracts/load-fragments.mjs';

export const CSS_LAYERS = ['ag.compat', 'ag.reset', 'ag.tokens', 'ag.material', 'ag.components', 'ag.a11y'];
export const LAYER_ORDER_STATEMENT = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';
export const TAILWIND_BRIDGE_ORDER = '@layer theme, base, ag, components, utilities;';

/** LAYER_CONTENT_OWNER (§4.3): where each layer's non-fragment content comes from. */
export const LAYER_CONTENT_OWNER = {
  'ag.compat': 'src/compat/css/** (PLAT-authored compat css)',
  'ag.reset': 'css fragments with layer ag.reset',
  'ag.tokens': 'scripts/tokens/build.mjs output (MAT)',
  'ag.material': 'src/material/css/generated/*.css (MAT, emitted by tokens build)',
  'ag.components': 'css fragments with layer ag.components',
  'ag.a11y': 'css fragments with layer ag.a11y (QUAL)',
};

export const CSS_TARGETS = 'chrome99, edge99, firefox103, safari15.4';

/** Load every stream's css fragments → [{stream, layer, bundle, order, file, content}] sorted deterministically. */
export async function collectCssFragments(root = ROOT) {
  const frags = await loadFragments('css', root);
  const out = [];
  for (const { stream, file, value } of frags) {
    for (const f of value) {
      const abs = join(root, f.file);
      if (!existsSync(abs)) throw new Error(`css fragment file missing: ${f.file} (stream ${stream}, ${file})`);
      if (!CSS_LAYERS.includes(f.layer)) throw new Error(`css fragment ${f.file}: unknown layer ${f.layer}`);
      out.push({ stream, layer: f.layer, bundle: f.bundle, order: f.order ?? 0, file: f.file, content: readFileSync(abs, 'utf8') });
    }
  }
  out.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
  return out;
}

/** Non-fragment layer sources that exist on the tree right now (pending sources are skipped). */
function layerSupplements(layer, root) {
  const out = [];
  // ag.compat content arrives via css fragments (PLAT's own fragment rows).
  if (layer === 'ag.tokens') { const f = join(root, 'dist/tokens.css'); if (existsSync(f)) out.push(f); }
  if (layer === 'ag.material') {
    const dir = join(root, 'src/material/css/generated');
    if (existsSync(dir)) for (const n of readdirSync(dir).sort()) if (n.endsWith('.css')) out.push(join(dir, n));
  }
  return out;
}

/** Assemble one css bundle file. Returns the css text. */
export async function assembleBundle(bundle, fragments, root = ROOT) {
  let body = LAYER_ORDER_STATEMENT + '\n\n';
  for (const layer of CSS_LAYERS) {
    const fragChunks = fragments.filter(f => f.bundle === bundle && f.layer === layer).map(f => `/* ${f.file} (${f.stream}) */\n${f.content.trim()}`);
    const supChunks = bundle === 'styles.css' ? layerSupplements(layer, root).map(f => readFileSync(f, 'utf8').trim()) : [];
    const chunks = [...fragChunks, ...supChunks].filter(Boolean);
    if (!chunks.length) continue;
    // Supplementary token/material css already carries @layer blocks; emit them unwrapped.
    const wrapped = chunks.map(c => c.includes('@layer') ? c : `@layer ${layer} {\n${indent(c)}\n}`).join('\n\n');
    body += wrapped + '\n\n';
  }
  return body.trimEnd() + '\n';
}

function indent(css) { return css.split('\n').map(l => (l.trim() ? '  ' + l : l)).join('\n'); }

/** Lower css to the contract browser targets via esbuild. */
export async function lowerCss(css, targets = CSS_TARGETS) {
  const res = await esbuildTransform(css, { loader: 'css', target: targets.split(', ') });
  return res.code;
}

/** Write every bundle the fragments + supplements produce. Returns {written, pending}. */
export async function assembleAllCss(root = ROOT, { lower = false } = {}) {
  const fragments = await collectCssFragments(root);
  const bundles = new Set(['styles.css', 'material.css', 'compat/globals.css']);
  for (const f of fragments) bundles.add(f.bundle);
  const written = [];
  const pending = [];
  mkdirSync(DIST, { recursive: true });
  for (const b of [...bundles].sort()) {
    let css = await assembleBundle(b, fragments, root);
    if (lower) css = await lowerCss(css);
    const dest = join(DIST, b);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, css);
    written.push(`dist/${b}`);
  }
  // MAT-owned standalone artifacts: only when their sources exist (pending otherwise).
  for (const spec of ['tokens.css', 'compat/tokens.css']) {
    const dest = join(DIST, spec);
    if (!existsSync(dest)) pending.push(`dist/${spec} (tokens build output pending)`);
  }
  // compat/tokens.css supplement from src/compat/css when MAT's build has not run.
  return { written, pending };
}
