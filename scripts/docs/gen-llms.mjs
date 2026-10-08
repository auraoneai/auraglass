#!/usr/bin/env node
// gen-llms.mjs — PLAT-392/393. llms.txt (≤12KB) ships in the tarball;
// llms-full.txt (≤400KB) carries the expanded index: every docs page,
// every registry item, every export subpath. Both go through
// render-claims so numbers stay sourced.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIMS_PATH, REGISTRY_INDEX } from './paths.mjs';
import { render } from './render-claims.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LLMS_MAX = 12 * 1024;
const FULL_MAX = 400 * 1024;

export function main() {
  const claims = existsSync(join(ROOT, CLAIMS_PATH)) ? JSON.parse(readFileSync(join(ROOT, CLAIMS_PATH), 'utf8')).claims : {};
  /* llms.txt from the committed template */
  const tmpl = readFileSync(join(ROOT, 'llms.txt.tmpl'), 'utf8');
  const llms = render(tmpl, claims);
  if (Buffer.byteLength(llms) > LLMS_MAX) { console.error(`llms.txt ${Buffer.byteLength(llms)}B > 12KB`); process.exit(1); }
  writeFileSync(join(ROOT, 'llms.txt'), llms);

  /* llms-full.txt — index every section, page, item and subpath */
  const lines = [llms, '\n## Docs index\n'];
  for (const dir of ['apps/docs/content', 'docs/guides', 'docs/quickstart']) {
    const p = join(ROOT, dir);
    if (!existsSync(p)) continue;
    for (const f of readdirSync(p, { recursive: true }).sort()) {
      if (/\.(md|mdx)$/.test(String(f))) lines.push(`- ${dir}/${f}`);
    }
  }
  const idx = join(ROOT, REGISTRY_INDEX);
  if (existsSync(idx)) {
    lines.push('\n## Registry items\n');
    for (const i of JSON.parse(readFileSync(idx, 'utf8')).items ?? []) lines.push(`- ${i.name} (${i.type}) — ${i.title ?? ''}`);
  }
  const manifest = join(ROOT, 'build/exports.manifest.json');
  if (existsSync(manifest)) {
    lines.push('\n## Export subpaths\n');
    for (const e of JSON.parse(readFileSync(manifest, 'utf8')).entries ?? []) lines.push(`- aura-glass${e.subpath === '.' ? '' : e.subpath}`);
  }
  const full = lines.join('\n') + '\n';
  if (Buffer.byteLength(full) > FULL_MAX) { console.error(`llms-full.txt ${Buffer.byteLength(full)}B > 400KB`); process.exit(1); }
  writeFileSync(join(ROOT, 'llms-full.txt'), full);
  console.log(`llms.txt ${Buffer.byteLength(llms)}B, llms-full.txt ${Buffer.byteLength(full)}B`);
}
if (process.argv[1]?.endsWith('gen-llms.mjs')) main();
