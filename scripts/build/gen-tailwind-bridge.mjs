#!/usr/bin/env node
/* gen-tailwind-bridge.mjs (PLAT-280, REQ-PLAT-75)
   Generates dist/tailwind.css from dist/tokens/manifest.json:
     @import './tokens.css'; then @theme inline, @utility, @custom-variant only.
   No JS config or preset ships. <= 6 KB gz (excluding tokens.css). */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { ROOT, DIST } from './lib/graph.mjs';

const arg = (name) => { const i = process.argv.indexOf(name); return i === -1 ? null : process.argv[i + 1]; };
const manifestPath = arg('--manifest') ?? join(DIST, 'tokens', 'manifest.json');
const outPath = arg('--out') ?? join(DIST, 'tailwind.css');

export function buildBridge(manifest) {
  const tokens = manifest.tokens ?? [];
  const themeVars = [];
  const seen = new Set();
  for (const t of tokens) {
    const cssVar = t.cssVar ?? t.cssvar;
    if (typeof cssVar !== 'string' || !cssVar.startsWith('--ag-')) continue;
    const tw = cssVar.slice(5).replaceAll('-', '-');
    if (seen.has(tw)) continue;
    seen.add(tw);
    themeVars.push(`  --${tw}: var(${cssVar});`);
  }
  const css = `@import './tokens.css';

@theme inline {
${themeVars.join('\n')}
}

@utility glass-regular { @apply glass-regular; }
@utility glass-clear { @apply glass-clear; }
@utility glass-thin { @apply glass-thin; }
@utility glass-thick { @apply glass-thick; }
@utility content-raised { @apply content-raised; }

@custom-variant ag-dark (&:where([data-ag-scheme='dark'], [data-ag-scheme='dark'] *));
@custom-variant ag-tinted (&:where([data-ag-tinted], [data-ag-tinted] *));
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
