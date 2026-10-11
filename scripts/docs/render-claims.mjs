#!/usr/bin/env node
// render-claims.mjs — REQ-PLAT-104 (PLAT-390). Fill paired claim regions
//   <!-- ag:claim id="tarball-mb" -->…<!-- /ag:claim -->
// in README.md, llms.txt and the generated release body from
// apps/docs/generated/claims.json. The markers are kept, so a rendered file
// re-renders idempotently. A claim whose value is null (or an id with no
// claim) renders the literal word pending — never a guess.
//
// Usage: node scripts/docs/render-claims.mjs [--file <path>]...
//   default files: README.md, llms.txt, the release body when present.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIMS_PATH, RELEASE_BODY } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** One paired region; group 1 = id, group 2 = current body. */
export const REGION_RE = /<!--\s*ag:claim\s+id="([\w-]+)"\s*-->([\s\S]*?)<!--\s*\/ag:claim\s*-->/g;

export function formatClaim(c) {
  if (!c || c.value == null) return 'pending';
  if (!c.unit) return String(c.value);
  return c.unit.startsWith(':') ? `${c.value}${c.unit}` : `${c.value} ${c.unit}`;
}

export function render(text, claims) {
  return text.replace(REGION_RE, (_, id) => `<!-- ag:claim id="${id}" -->${formatClaim(claims[id])}<!-- /ag:claim -->`);
}

export function loadClaims(root = ROOT) {
  const p = join(root, CLAIMS_PATH);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')).claims ?? {} : {};
}

export function renderFile(path, claims) {
  const src = readFileSync(path, 'utf8');
  const out = render(src, claims);
  if (out !== src) writeFileSync(path, out);
  return [...src.matchAll(REGION_RE)].length;
}

export function main(argv = process.argv.slice(2), root = ROOT) {
  const files = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === '--file') files.push(argv[++i]);
  const targets = files.length ? files : ['README.md', 'llms.txt', RELEASE_BODY];
  const claims = loadClaims(root);
  let filled = 0;
  for (const rel of targets) {
    const p = join(root, rel);
    if (existsSync(p)) filled += renderFile(p, claims);
    else if (files.length) { console.error(`render-claims: ${rel} missing`); return 1; }
  }
  console.log(`render-claims: filled ${filled} regions in ${targets.filter((t) => existsSync(join(root, t))).join(', ')}`);
  return 0;
}
if (process.argv[1]?.endsWith('render-claims.mjs')) process.exitCode = main();
