#!/usr/bin/env node
// gen-mcp-data.mjs — PLAT-395. Bundle packages/mcp/data/mcp-data.json from
// the published registry index + docs inventory + component props —
// the only data the MCP server reads (≤5MB cap).
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GENERATED_DIR, REGISTRY_INDEX } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAX = 5 * 1024 * 1024;

export function main() {
  const idx = join(ROOT, REGISTRY_INDEX);
  const items = existsSync(idx) ? (JSON.parse(readFileSync(idx, 'utf8')).items ?? []) : [];
  /* Props come from gen-component-docs.mjs (TS compiler API over the packed d.ts), keyed by component name. */
  const propsPath = join(ROOT, GENERATED_DIR, 'props.json');
  if (!existsSync(propsPath)) { console.error(`${GENERATED_DIR}/props.json missing — run node scripts/docs/gen-component-docs.mjs first`); process.exit(1); }
  const props = JSON.parse(readFileSync(propsPath, 'utf8'));
  const components = {};
  for (const [name, rows] of Object.entries(props)) components[name] = { subpath: '.', props: rows.map(({ name, type, required }) => ({ name, type, required })) };
  const docs = [];
  for (const dir of ['apps/docs/content', 'docs/guides', 'docs/quickstart']) {
    const p = join(ROOT, dir);
    if (!existsSync(p)) continue;
    for (const f of readdirSync(p, { recursive: true }).sort()) if (/\.(md|mdx)$/.test(String(f))) docs.push({ path: `${dir}/${f}` });
  }
  const version = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
  const data = JSON.stringify({ version, components, items, docs }, null, 1) + '\n';
  if (Buffer.byteLength(data) > MAX) { console.error(`mcp-data.json > 5MB`); process.exit(1); }
  const dest = join(ROOT, 'packages/mcp/data');
  mkdirSync(dest, { recursive: true });
  writeFileSync(join(dest, 'mcp-data.json'), data);
  console.log(`mcp-data.json ${Buffer.byteLength(data)}B: ${items.length} items, ${Object.keys(components).length} components, ${docs.length} docs`);
}
if (process.argv[1]?.endsWith('gen-mcp-data.mjs')) main();
