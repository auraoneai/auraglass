#!/usr/bin/env node
/* scripts/tokens/freeze-4x.mjs — MAT-328 (REQ-MAT-21, DS-011).
 * Freezes the 4.x rendered material values into DTCG JSON at
 * tokens/legacy/4x-rendered.tokens.json so the 4.2 bridge and the compat
 * adapters reproduce legacy pixels exactly (values unrounded).
 *
 * Sources (quarantined under legacy/, read-only):
 *   tokens/legacy/src/glass.ts  — the shared rendered literals (background
 *     gradient ~:997, fill ~:1001, border ~:1030), the backdropFilter blur
 *     ternary, and buildSurfaceStyles() output per {intent, elevation, tier}.
 *   tokens/legacy/src/tokens.css — every --glass-* primitive in :root.
 *
 * Every emitted token carries $extensions["ag.tier"] = "legacy" (schema
 * MAT-005). The file is generated; regenerate with `node scripts/tokens/
 * freeze-4x.mjs` — the L4 drift gate diffs it fail-closed. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const GLASS_TS = join(root, 'tokens/legacy/src/glass.ts');
const TOKENS_CSS = join(root, 'tokens/legacy/src/tokens.css');
const OUT = join(root, 'tokens/legacy/4x-rendered.tokens.json');

const LEGACY_EXT = { 'ag.tier': 'legacy' };
const tok = (value, type) => ({ $value: value, $type: type, $extensions: { ...LEGACY_EXT } });

// --- 1. load the legacy module ------------------------------------------------
// glass.ts is a leaf TS file (no imports); bundle it to a data: URL and import.
const bundled = await build({
  entryPoints: [GLASS_TS],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  logLevel: 'silent',
});
const url = 'data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64');
const mod = await import(url);
const { AURA_GLASS, PERFORMANCE_TIERS, glassTokenUtils } = mod;
if (!AURA_GLASS?.surfaces || !glassTokenUtils?.buildSurfaceStyles) {
  console.error('freeze-4x: tokens/legacy/src/glass.ts did not expose AURA_GLASS/glassTokenUtils');
  process.exit(1);
}

const intents = Object.keys(AURA_GLASS.surfaces).sort();
const elevations = Object.keys(AURA_GLASS.surfaces[intents[0]]).sort();
const tiers = Object.keys(PERFORMANCE_TIERS).sort();

// --- 2. freeze rendered surface styles ----------------------------------------
// Rendered once per {intent, elevation, tier} via the real 4.x render path.
const surface = {};
for (const intent of intents) {
  surface[intent] = {};
  for (const elevation of elevations) {
    surface[intent][elevation] = {};
    for (const tier of tiers) {
      const styles = glassTokenUtils.buildSurfaceStyles(intent, elevation, tier);
      surface[intent][elevation][tier] = {
        'backdrop-blur': tok(`${AURA_GLASS.surfaces[intent][elevation].backdropBlur.px}px`, 'dimension'),
        'backdrop-filter': tok(styles.backdropFilter, 'ag-rendered'),
        'box-shadow': tok(styles.boxShadow, 'ag-rendered'),
      };
    }
  }
}

// Shared rendered literals from buildSurfaceStyles' return (identical for every
// surface cell — verified across the matrix below).
const probe = glassTokenUtils.buildSurfaceStyles('neutral', 'level1', 'high');
const shared = {
  gradient: tok(probe.background, 'ag-rendered'),
  fill: tok(probe.backgroundColor, 'ag-rendered'),
  border: tok(probe.border, 'ag-rendered'),
};
for (const intent of intents)
  for (const elevation of elevations)
    for (const tier of tiers) {
      const s = glassTokenUtils.buildSurfaceStyles(intent, elevation, tier);
      if (s.background !== probe.background || s.backgroundColor !== probe.backgroundColor || s.border !== probe.border) {
        console.error(`freeze-4x: ${intent}/${elevation}/${tier} rendered literals diverge from shared values`);
        process.exit(1);
      }
    }

// The blur ternary arms (backdropBlur.px -> literal backdropFilter), captured
// verbatim so the bridge can map a spec to its 4.x filter without the table.
const blurTernary = {};
for (const intent of intents)
  for (const elevation of elevations) {
    const px = AURA_GLASS.surfaces[intent][elevation].backdropBlur.px;
    blurTernary[String(px)] = tok(
      glassTokenUtils.buildSurfaceStyles(intent, elevation, 'high').backdropFilter,
      'ag-rendered'
    );
  }

// --- 3. freeze --glass-* css primitives ---------------------------------------
const cssSrc = readFileSync(TOKENS_CSS, 'utf8');
const primitives = {};
// every ":root" block; capture declarations whose name starts with --glass-
for (const block of cssSrc.matchAll(/:root\s*\{([^}]*)\}/gs)) {
  for (const decl of block[1].matchAll(/(--glass-[A-Za-z0-9_-]*)\s*:\s*([^;]+);/g)) {
    const [, name, raw] = decl;
    const value = raw.trim().replace(/\s+/g, ' ');
    const type = /px|rem|em$|ms$|s$/.test(value) ? 'dimension' : /rgba?\(|#|hsl|var\(/.test(value) ? 'color' : 'ag-css-var';
    primitives[name] = { ...tok(value, type), $extensions: { ...LEGACY_EXT, 'ag.cssVar': name } };
  }
}
const primitiveCount = Object.keys(primitives).length;
if (primitiveCount === 0) {
  console.error('freeze-4x: no --glass-* primitives found in tokens/legacy/src/tokens.css');
  process.exit(1);
}

// --- 4. emit -------------------------------------------------------------------
const doc = {
  $description:
    'Frozen 4.x rendered material values (MAT-328). Generated by scripts/tokens/freeze-4x.mjs from tokens/legacy/src/glass.ts and tokens/legacy/src/tokens.css; do not hand-edit.',
  legacy: {
    '4x-rendered': {
      shared,
      'blur-ternary': blurTernary,
      surface,
      primitive: primitives,
    },
  },
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(doc, null, 2) + '\n');
console.log(
  `freeze-4x: wrote ${OUT} — ${intents.length} intents x ${elevations.length} elevations x ${tiers.length} tiers, ` +
    `${Object.keys(blurTernary).length} ternary arms, ${primitiveCount} --glass-* primitives`
);
