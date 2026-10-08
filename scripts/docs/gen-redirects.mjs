#!/usr/bin/env node
// gen-redirects.mjs — PLAT-399. Emit apps/docs/out/_redirects (Pages/Next
// static-export redirect file) from apps/docs/redirects.json after
// docs:build. Also validates shape + no duplicate sources.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function generate(root = ROOT) {
  const { redirects } = JSON.parse(readFileSync(join(root, 'apps/docs/redirects.json'), 'utf8'));
  const seen = new Set(); const lines = [];
  for (const r of redirects) {
    if (seen.has(r.from)) throw new Error(`duplicate redirect source ${r.from}`);
    seen.add(r.from);
    lines.push(`${r.from} ${r.to} ${r.status ?? 301}`);
  }
  return lines.join('\n') + '\n';
}

export function main() {
  const out = generate();
  const dest = join(ROOT, 'apps/docs/out');
  mkdirSync(dest, { recursive: true });
  writeFileSync(join(dest, '_redirects'), out);
  console.log(`_redirects: ${out.trim().split('\n').length} rules`);
}
if (process.argv[1]?.endsWith('gen-redirects.mjs')) main();
