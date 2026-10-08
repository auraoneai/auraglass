#!/usr/bin/env node
// render-claims.mjs — PLAT-390. Fill `<!-- ag:claim <id> -->` regions in
// README.md, llms.txt templates and the release body from claims.json.
// A claim with value null renders the literal word pending — never a guess.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIMS_PATH } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CLAIM_RE = /<!--\s*ag:claim\s+([\w-]+)\s*-->/g;

export function render(text, claims) {
  return text.replace(CLAIM_RE, (_, id) => {
    const c = claims[id];
    return c && c.value != null ? `${c.value}${c.unit ? ` ${c.unit}` : ''}` : 'pending';
  });
}

export function renderFile(path, claims) {
  const src = readFileSync(path, 'utf8');
  const out = render(src, claims);
  writeFileSync(path, out);
  return (src.match(CLAIM_RE) ?? []).length;
}

export function main() {
  const claimsPath = join(ROOT, CLAIMS_PATH);
  const claims = existsSync(claimsPath) ? JSON.parse(readFileSync(claimsPath, 'utf8')).claims : {};
  let filled = 0;
  for (const rel of ['README.md', 'llms.txt', 'apps/docs/content/plat/introduction.mdx']) {
    const p = join(ROOT, rel);
    if (existsSync(p)) filled += renderFile(p, claims);
  }
  console.log(`render-claims: filled ${filled} regions`);
}
if (process.argv[1]?.endsWith('render-claims.mjs')) main();
