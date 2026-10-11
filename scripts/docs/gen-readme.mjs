#!/usr/bin/env node
// gen-readme.mjs — PLAT-390 (REQ-PLAT-104, REQ-PLAT-103). README.md is
// generated from scripts/docs/readme.tmpl.md (kept out of the repo root: npm
// force-packs every root README* file): copy the template, fill the
// `<!-- generated:quickstart -->` region from docs/quickstart/next.md (the
// default Tailwind variant, via quickstart-steps.mjs), fill the
// `<!-- generated:peers -->` table from package.json peerDependencies +
// peerDependenciesMeta (never a hand-written peer matrix), then render-claims
// fills every `<!-- ag:claim id="…" -->…<!-- /ag:claim -->` region from
// apps/docs/generated/claims.json (pending-safe, never invented numbers).
//
// Usage: node scripts/docs/gen-readme.mjs [--check]
//   --check  exit 1 when README.md differs from the generated output.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIMS_PATH } from './paths.mjs';
import { render } from './render-claims.mjs';
import { parseQuickstart, renderReadmeQuickstart } from './quickstart-steps.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TEMPLATE = 'scripts/docs/readme.tmpl.md';
const QUICKSTART = 'docs/quickstart/next.md';
const QUICKSTART_VARIANT = 'tailwind';
const OUT = 'README.md';
const REGION_RE = /<!-- generated:quickstart -->[\s\S]*?<!-- \/generated:quickstart -->/;
const PEERS_RE = /<!-- generated:peers -->[\s\S]*?<!-- \/generated:peers -->/;

/** Replace the generated:quickstart region of `text` with steps rendered from `nextMd`. */
export function fillQuickstart(text, nextMd) {
  if (!REGION_RE.test(text)) throw new Error(`${TEMPLATE}: missing <!-- generated:quickstart --> … <!-- /generated:quickstart --> markers`);
  const body = renderReadmeQuickstart(parseQuickstart(nextMd), QUICKSTART_VARIANT);
  const region = [
    '<!-- generated:quickstart -->',
    `<!-- Generated from ${QUICKSTART} by scripts/docs/gen-readme.mjs; edit that file, not this region. -->`,
    '',
    body,
    '',
    `Without Tailwind, or on Vite: [docs/quickstart/next.md](./${QUICKSTART}) and [docs/quickstart/vite.md](./docs/quickstart/vite.md).`,
    '<!-- /generated:quickstart -->',
  ].join('\n');
  return text.replace(REGION_RE, () => region);
}

/** Peer table rows from package.json: every peerDependencies key, optional per peerDependenciesMeta. */
export function peerRows(pkg) {
  const meta = pkg.peerDependenciesMeta ?? {};
  return Object.keys(pkg.peerDependencies ?? {}).sort().map((name) => ({
    name, range: pkg.peerDependencies[name], optional: meta[name]?.optional === true,
  }));
}

/** Replace the generated:peers region of `text` with the table built from `pkg`. */
export function fillPeers(text, pkg) {
  if (!PEERS_RE.test(text)) throw new Error(`${TEMPLATE}: missing <!-- generated:peers --> … <!-- /generated:peers --> markers`);
  const rows = peerRows(pkg);
  const region = [
    '<!-- generated:peers -->',
    '<!-- Generated from package.json peerDependencies + peerDependenciesMeta by scripts/docs/gen-readme.mjs. -->',
    '',
    '| Package | Range | Required |',
    '| --- | --- | --- |',
    ...rows.map((r) => `| \`${r.name}\` | \`${r.range}\` | ${r.optional ? 'optional' : 'required'} |`),
    '<!-- /generated:peers -->',
  ].join('\n');
  return text.replace(PEERS_RE, () => region);
}

export function generate(root = ROOT) {
  const tmpl = join(root, TEMPLATE);
  if (!existsSync(tmpl)) throw new Error(`${TEMPLATE} missing — create the template first`);
  const claimsPath = join(root, CLAIMS_PATH);
  const claims = existsSync(claimsPath) ? JSON.parse(readFileSync(claimsPath, 'utf8')).claims : {};
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const withQuickstart = fillQuickstart(readFileSync(tmpl, 'utf8'), readFileSync(join(root, QUICKSTART), 'utf8'));
  return render(fillPeers(withQuickstart, pkg), claims);
}

/** README.md vs the generated output: { ok, expected, actual }. */
export function checkReadme(root = ROOT) {
  const expected = generate(root);
  const actual = existsSync(join(root, OUT)) ? readFileSync(join(root, OUT), 'utf8') : '';
  return { ok: actual === expected, expected, actual };
}

export function main(argv = process.argv.slice(2), root = ROOT) {
  let out;
  try {
    if (argv.includes('--check')) {
      const { ok } = checkReadme(root);
      if (!ok) { console.error(`${OUT} is stale: run node scripts/docs/gen-readme.mjs`); return 1; }
      console.log(`${OUT} is up to date with ${TEMPLATE} and ${QUICKSTART}`);
      return 0;
    }
    out = generate(root);
  } catch (e) { console.error(String(e.message ?? e)); return 1; }
  writeFileSync(join(root, OUT), out);
  console.log(`README.md generated from ${TEMPLATE} (quickstart from ${QUICKSTART}${(out.match(/ag:claim/g) ?? []).length ? ', claim regions filled' : ''})`);
  return 0;
}
if (process.argv[1]?.endsWith('gen-readme.mjs')) process.exitCode = main();
