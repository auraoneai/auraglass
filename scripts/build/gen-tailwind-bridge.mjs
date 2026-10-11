#!/usr/bin/env node
/* gen-tailwind-bridge.mjs (PLAT-280, REQ-PLAT-75)
   Generates dist/tailwind.css from dist/tokens/manifest.json:
     @import './tokens.css'; then @theme inline, @utility, @custom-variant only.
   Token categories map into explicit Tailwind namespaces:
     --color-*  from color tokens (--ag-color-*, --ag-on-surface*, other color types)
     --radius-* from radius tokens (--ag-radius-*, --ag-surface-radius)
     --shadow-* from shadow tokens (--ag-shadow-*, --ag-surface-shadow -> --shadow-glass)
   The glass utilities + content-raised declare real properties read from the
   MAT material vars (no self-@apply). No JS config or preset ships. <= 6 KB gz
   (excluding tokens.css). */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { ROOT, DIST } from './lib/graph.mjs';

const arg = (name) => { const i = process.argv.indexOf(name); return i === -1 ? null : process.argv[i + 1]; };
const manifestPath = arg('--manifest') ?? join(DIST, 'tokens', 'manifest.json');
const outPath = arg('--out') ?? join(DIST, 'tailwind.css');

/* token -> tailwind theme var name (without the leading `--`). Returns null for
   tokens that carry no cssVar. Category rewrites happen first so the public
   namespaces are exact; anything left keeps its `--ag-` suffix as the name. */
const twName = (t) => {
  const cssVar = t.cssVar ?? t.cssvar;
  if (typeof cssVar !== 'string' || !cssVar.startsWith('--ag-')) return null;
  const leaf = cssVar.slice(5);
  if (leaf.startsWith('color-')) return `color-${leaf.slice(6)}`;
  if (leaf.startsWith('radius-')) return `radius-${leaf.slice(7)}`;
  if (leaf.startsWith('shadow-')) return `shadow-${leaf.slice(7)}`;
  if (leaf === 'surface-radius') return 'radius-surface';
  if (leaf === 'surface-shadow') return 'shadow-glass';
  if (leaf === 'on-surface' || leaf.startsWith('on-surface-')) return `color-${leaf}`;
  if (t.type === 'color') return `color-${leaf}`;
  return leaf;
};

export function buildBridge(manifest) {
  const tokens = manifest.tokens ?? [];
  /* material-tier tokens are the runtime values and win name collisions with
     sys tokens (e.g. material.surface.on-surface -> --color-on-surface must
     resolve to var(--ag-on-surface), not var(--ag-color-on-surface)). */
  const sorted = [...tokens].sort((a, b) => (a.tier === 'material' ? 1 : 0) - (b.tier === 'material' ? 1 : 0));
  const themeVars = new Map();
  for (const t of sorted) {
    const cssVar = t.cssVar ?? t.cssvar;
    const name = twName(t);
    if (!name) continue;
    themeVars.set(name, `  --${name}: var(${cssVar});`);
  }
  const css = `@import './tokens.css';

@theme inline {
${[...themeVars.values()].join('\n')}
}

/* glass-* utilities mirror the MAT material surfaces: fill/rim/shadow come from
   the public material vars, the backdrop blur ladder follows the standard tier
   (thin 12px, regular 20px, thick 32px). No self-@apply. */
@utility glass-regular {
  background: var(--ag-surface-fill, oklch(0.99 0.004 250 / 0.85));
  border: 1px solid var(--ag-surface-rim, oklch(1 0 0 / 0.18));
  border-radius: var(--ag-surface-radius, var(--ag-radius-md));
  box-shadow: var(--ag-shadow-regular, 0 4px 16px oklch(0 0 0 / 0.14));
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}
@utility glass-clear {
  background: transparent;
  border: 1px solid var(--ag-surface-rim, oklch(1 0 0 / 0.18));
  border-radius: var(--ag-surface-radius, var(--ag-radius-md));
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  backdrop-filter: blur(20px) saturate(1.6);
}
@utility glass-thin {
  background: var(--ag-surface-fill, oklch(0.99 0.004 250 / 0.85));
  border: 1px solid var(--ag-surface-rim, oklch(1 0 0 / 0.18));
  border-radius: var(--ag-surface-radius, var(--ag-radius-md));
  box-shadow: var(--ag-shadow-thin, 0 1px 4px oklch(0 0 0 / 0.1));
  -webkit-backdrop-filter: blur(12px) saturate(1.6);
  backdrop-filter: blur(12px) saturate(1.6);
}
@utility glass-thick {
  background: var(--ag-surface-fill, oklch(0.99 0.004 250 / 0.85));
  border: 1px solid var(--ag-surface-rim, oklch(1 0 0 / 0.18));
  border-radius: var(--ag-surface-radius, var(--ag-radius-md));
  box-shadow: var(--ag-shadow-thick, 0 8px 32px oklch(0 0 0 / 0.2));
  -webkit-backdrop-filter: blur(32px) saturate(1.6);
  backdrop-filter: blur(32px) saturate(1.6);
}
@utility content-raised {
  background: var(--ag-surface-fill, oklch(0.99 0.004 250 / 0.8));
  border: 1px solid var(--ag-surface-rim, oklch(1 0 0 / 0.18));
  border-radius: var(--ag-surface-radius, var(--ag-radius-md));
  box-shadow: var(--ag-shadow-regular, 0 4px 16px oklch(0 0 0 / 0.14));
}

@custom-variant ag-dark (&:where([data-ag-scheme=dark], [data-ag-scheme=dark] *));
@custom-variant ag-tinted (&:where([data-tinted], [data-tinted] *));
@custom-variant ag-solid (&:where([data-ag-transparency='solid'], [data-ag-transparency='solid'] *));
`;
  return css;
}

if (!existsSync(manifestPath)) {
  console.log(`gen-tailwind-bridge: pending (no ${manifestPath} until tokens build lands)`);
  process.exit(0);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const css = buildBridge(manifest);
const withoutImport = css.replace(/^@import.*\n/, '');
const gz = gzipSync(withoutImport, { level: 9 }).length;
if (gz > 6 * 1024) { console.error(`gen-tailwind-bridge: tailwind.css minus tokens.css is ${gz}B gz > 6144B`); process.exit(1); }
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, css);
console.log(`gen-tailwind-bridge: wrote ${outPath} (${css.length}B, ${gz}B gz excl. tokens.css)`);
