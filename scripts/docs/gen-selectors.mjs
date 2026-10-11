#!/usr/bin/env node
// gen-selectors.mjs — PLAT-379. Emit data-ag-part/-state selectors per
// component/surface into apps/docs/generated/selectors.json for PartsTable.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GENERATED_DIR } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PART_RE = /data-ag-(part|state)=['"`]([\w-]+)['"`]/g;

export function collectParts(root = ROOT) {
  const out = {};
  const scan = (dir, owner) => {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir, { recursive: true }).sort()) {
      if (!/\.(tsx?|jsx?)$/.test(f)) continue;
      const src = readFileSync(join(dir, f), 'utf8');
      for (const m of src.matchAll(PART_RE)) {
        const subject = f.split('/')[0];
        (out[owner + ':' + subject] ??= new Set()).add(`${m[1]}:${m[2]}`);
      }
    }
  };
  scan(join(root, 'registry'), 'registry');
  scan(join(root, 'src/components'), 'cmp');
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v].sort()]));
}

export function main() {
  const sel = collectParts();
  const dest = join(ROOT, GENERATED_DIR, 'selectors.json');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify(sel, null, 2) + '\n');
  console.log(`selectors.json: ${Object.keys(sel).length} subjects`);
}
if (process.argv[1]?.endsWith('gen-selectors.mjs')) main();
