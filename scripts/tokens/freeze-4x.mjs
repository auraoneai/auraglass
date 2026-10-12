#!/usr/bin/env node
/* scripts/tokens/freeze-4x.mjs — MAT-328 (REQ-MAT-21, DS-011).
 * Freezes the 4.x rendered material values into DTCG JSON at
 * tokens/legacy/4x-rendered.tokens.json so the 4.2 bridge and the compat
 * adapters reproduce legacy pixels exactly (values unrounded).
 *
 * Sources (frozen under tokens/legacy/):
 *   tokens/legacy/4x-glass-source.json — the rendered surface literals
 *     (background gradient, fill, border), the backdropFilter blur ternary,
 *     and buildSurfaceStyles() output per {intent, elevation, tier},
 *     extracted from legacy/src/tokens/glass.ts before REQ-PLAT-79 deleted
 *     legacy/ (the 4.x original lives on release/4.x).
 *   tokens/legacy/4x-primitives.css — every --glass-* primitive in :root.
 *
 * Every emitted token carries $extensions["ag.tier"] = "legacy" (schema
 * MAT-005). The file is generated; regenerate with `node scripts/tokens/
 * freeze-4x.mjs` — the L4 drift gate diffs it fail-closed. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const GLASS_SOURCE = join(root, 'tokens/legacy/4x-glass-source.json');
const TOKENS_CSS = join(root, 'tokens/legacy/4x-primitives.css');
const OUT = join(root, 'tokens/legacy/4x-rendered.tokens.json');

const LEGACY_EXT = { 'ag.tier': 'legacy', 'ag.legacy': true };
// Frozen values are pre-resolved rendered CSS strings — $type 'ag-rendered'
// (schema MAT-005): verbatim strings, never re-interpreted by the compiler.
const tok = (value, type) => ({ $value: value, $type: type, $extensions: { ...LEGACY_EXT } });

// --- 1. load the frozen 4.x surface source -------------------------------------
// REQ-PLAT-79: legacy/src/tokens/glass.ts is deleted with legacy/**; the
// rendered literals it produced are frozen verbatim in 4x-glass-source.json.
const { cells } = JSON.parse(readFileSync(GLASS_SOURCE, 'utf8'));
if (!cells || typeof cells !== 'object' || !cells.neutral?.level1?.high) {
  console.error('freeze-4x: tokens/legacy/4x-glass-source.json did not expose the expected cells matrix');
  process.exit(1);
}

const intents = Object.keys(cells).sort();
const elevations = Object.keys(cells[intents[0]]).sort();
const tiers = Object.keys(cells[intents[0]][elevations[0]]).sort();
const cell = (intent, elevation, tier) => {
  const c = cells[intent]?.[elevation]?.[tier];
  if (!c) { console.error(`freeze-4x: missing cell ${intent}/${elevation}/${tier} in 4x-glass-source.json`); process.exit(1); }
  return c;
};

// --- 2. freeze rendered surface styles ----------------------------------------
// One frozen cell per {intent, elevation, tier} from the real 4.x render path.
const surface = {};
for (const intent of intents) {
  surface[intent] = {};
  for (const elevation of elevations) {
    surface[intent][elevation] = {};
    for (const tier of tiers) {
      const styles = cell(intent, elevation, tier);
      surface[intent][elevation][tier] = {
        'backdrop-blur': tok(`${styles.backdropBlurPx}px`, 'ag-rendered'),
        'backdrop-filter': tok(styles.backdropFilter, 'ag-rendered'),
        'box-shadow': tok(styles.boxShadow, 'ag-rendered'),
      };
    }
  }
}

// Shared rendered literals from buildSurfaceStyles' return (identical for every
// surface cell — verified across the matrix below).
const probe = cell('neutral', 'level1', 'high');
const shared = {
  gradient: tok(probe.background, 'ag-rendered'),
  fill: tok(probe.backgroundColor, 'ag-rendered'),
  border: tok(probe.border, 'ag-rendered'),
};
for (const intent of intents)
  for (const elevation of elevations)
    for (const tier of tiers) {
      const s = cell(intent, elevation, tier);
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
    const px = cell(intent, elevation, 'high').backdropBlurPx;
    blurTernary[String(px)] = tok(
      cell(intent, elevation, 'high').backdropFilter,
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
    primitives[name] = { ...tok(value, 'ag-rendered'), $extensions: { ...LEGACY_EXT, 'ag.legacyVar': name } };
  }
}
const primitiveCount = Object.keys(primitives).length;
if (primitiveCount === 0) {
  console.error('freeze-4x: no --glass-* primitives found in tokens/legacy/4x-primitives.css');
  process.exit(1);
}

// --- 4. emit -------------------------------------------------------------------
const doc = {
  $description:
    'Frozen 4.x rendered material values (MAT-328). Generated by scripts/tokens/freeze-4x.mjs from tokens/legacy/4x-glass-source.json (extracted from the deleted legacy/src/tokens/glass.ts, REQ-PLAT-79) and tokens/legacy/4x-primitives.css; do not hand-edit.',
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
