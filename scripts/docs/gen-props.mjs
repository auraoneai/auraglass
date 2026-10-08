#!/usr/bin/env node
// gen-props.mjs — PLAT-378. Extract public prop rows from component
// *.types.ts files into apps/docs/generated/props.json for PropsTable.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GENERATED_DIR } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/* Parse `name?: type; // comment` rows out of Props interfaces. This is a
   light extractor — full signatures come from TypeDoc in gen-component-docs. */
export function parseProps(src) {
  const rows = [];
  const iface = src.match(/interface\s+(\w*Props)\s*(?:extends\s+[^{]+)?\{/g) ?? [];
  for (const head of iface) {
    const name = head.match(/interface\s+(\w+)/)[1];
    const start = src.indexOf(head) + head.length;
    let depth = 1, i = start;
    for (; i < src.length && depth > 0; i++) { if (src[i] === '{') depth++; if (src[i] === '}') depth--; }
    const body = src.slice(start, i - 1);
    for (const m of body.matchAll(/(?:\/\*\*([^*]*)\*\/\s*)?(\w+)(\?)?:\s*([^;\n]+)/g)) {
      rows.push({ component: name, name: m[2], required: !m[3], type: m[4].trim().replace(/\s+/g, ' '), description: m[1]?.trim() });
    }
  }
  return rows;
}

export function collect(root = ROOT) {
  const out = {};
  const srcDir = join(root, 'src/components');
  if (!existsSync(srcDir)) return out;
  for (const dir of readdirSync(srcDir).sort()) {
    for (const f of readdirSync(join(srcDir, dir)).filter((f) => f.endsWith('.types.ts')).sort()) {
      const rows = parseProps(readFileSync(join(srcDir, dir, f), 'utf8'));
      for (const r of rows) (out[r.component] ??= []).push(r);
    }
  }
  return out;
}

export function main() {
  const props = collect();
  const dest = join(ROOT, GENERATED_DIR, 'props.json');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify(props, Object.keys(props).sort(), 2) + '\n');
  console.log(`props.json: ${Object.keys(props).length} components`);
}
if (process.argv[1]?.endsWith('gen-props.mjs')) main();
