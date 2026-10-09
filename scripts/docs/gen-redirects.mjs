#!/usr/bin/env node
/* gen-redirects.mjs — PLAT-399 / REQ-PLAT-83. Generates apps/docs/redirects.json
   and the _redirects text emitted into public/ by scripts/ci/assemble-pages.mjs.

   Sources of rules:
     1. base wildcard rules (kept 4.x URL shapes -> new site sections)
     2. one explicit 301 per docs/** path deleted by RM-13 (computed from git)
     3. deprecation fragment `doc` anchors -> /plat/migrate/5#dep-<id>
     4. /v4/* -> the release/4.x Pages deployment (AG_V4_PAGES_ORIGIN)     */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const RM13 = '4842edc5e';
export const V4_ORIGIN = process.env.AG_V4_PAGES_ORIGIN ?? 'https://auraoneai.github.io/auraglass-4x';

const BASE_RULES = [
  { from: '/docs', to: '/plat/introduction', status: 301 },
  { from: '/docs/*', to: '/plat/:splat', status: 301 },
  { from: '/readme', to: '/plat/introduction', status: 301 },
  { from: '/installation', to: '/plat/introduction', status: 301 },
  { from: '/guides/migration', to: '/plat/migrate/5', status: 301 },
  { from: '/guides/consciousness-*', to: '/plat/migrate/5', status: 301 },
  { from: '/recipes/*', to: '/surfaces/blocks', status: 301 },
  { from: '/cli/*', to: '/plat/cli', status: 301 },
  { from: '/components/*', to: '/components/:splat', status: 301 },
  { from: '/app-shell/*', to: '/components/app-shell', status: 301 },
  { from: '/theme/*', to: '/foundations/tokens', status: 301 },
  { from: '/liquid-glass/*', to: '/foundations/glass', status: 301 },
];

/* docs/<path> -> new-site destination for the deleted family. */
const FAMILY_TARGET = [
  [/^docs\/components\//, '/components/'],
  [/^docs\/guides\//, '/plat/migrate/5'],
  [/^docs\/cli\//, '/plat/cli'],
  [/^docs\/theme\//, '/foundations/tokens'],
  [/^docs\/liquid-glass\//, '/foundations/glass'],
  [/^docs\/recipes\//, '/surfaces/blocks'],
  [/^docs\/app-shell\//, '/components/app-shell'],
  [/^docs\/package-entrypoints/, '/plat/api'],
  [/^docs\/release\//, '/plat/migrate/5'],
  [/^docs\/readme\.md$/, '/plat/introduction'],
];
const familyTarget = (p) => (FAMILY_TARGET.find(([re]) => re.test(p)) ?? [null, '/plat/migrate/5'])[1];

export const urlOf = (docsPath) => '/' + docsPath.replace(/^docs\//, '').replace(/\.md$/, '').replace(/\/readme$/, '');

export function rm13Paths(root = ROOT) {
  const out = execFileSync('git', ['show', '--name-only', '--pretty=format:', RM13, '--', 'docs'],
    { cwd: root, encoding: 'utf8' });
  return out.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('docs/'));
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function depDocAnchors(root = ROOT) {
  /* symbol -> '#dep-<id>' so a removed component page can land on its
     deprecation row instead of the generic section. Fragments are simple
     object literals — parsed with a regex so this runs inside jest and the
     docs build alike (esbuild/loadFragments can't run under jest). */
  const map = new Map();
  const dir = join(root, 'fragments/deprecations');
  if (!existsSync(dir)) return map;
  for (const name of readdirSync(dir)) {
    if (!/\.(ts|mts|json)$/.test(name)) continue;
    const text = readFileSync(join(dir, name), 'utf8');
    for (const m of text.matchAll(/symbol:\s*'([^']+)'[^}]*?doc:\s*'(#[a-z0-9-]+)'/g))
      map.set(kebab(m[1]), m[2]);
    for (const m of text.matchAll(/"symbol"\s*:\s*"([^"]+)"[^}]*?"doc"\s*:\s*"(#[a-z0-9-]+)"/g))
      map.set(kebab(m[1]), m[2]);
  }
  return map;
}

export async function buildRedirects(root = ROOT) {
  const anchors = depDocAnchors(root);
  const seen = new Set(); const rules = [];
  const push = (from, to, status = 301) => {
    if (seen.has(from)) return;
    seen.add(from); rules.push({ from, to, status });
  };
  for (const p of rm13Paths(root)) {
    if (!p.endsWith('.md') && !p.endsWith('.mdx')) continue;
    const from = urlOf(p);
    /* an explicit dep anchor wins when the page's kebab name matches a symbol */
    const slug = p.split('/').pop().replace(/\.mdx?$/, '');
    const anchor = anchors.get(slug);
    push(from, anchor ? `/plat/migrate/5${anchor}` : familyTarget(p));
  }
  for (const r of BASE_RULES) push(r.from, r.to, r.status);
  push('/v4/*', `${V4_ORIGIN}/:splat`, 301);
  return rules;
}

export function emitRedirects(rules) {
  return rules.map((r) => `${r.from} ${r.to} ${r.status ?? 301}`).join('\n') + '\n';
}

export async function generate(root = ROOT) {
  const rules = await buildRedirects(root);
  return emitRedirects(rules);
}

export async function main() {
  const rules = await buildRedirects();
  mkdirSync(join(ROOT, 'apps/docs'), { recursive: true });
  writeFileSync(join(ROOT, 'apps/docs/redirects.json'),
    JSON.stringify({ version: 2, generated: 'apps/docs/out/_redirects by plat:build:docs', redirects: rules }, null, 2) + '\n');
  console.log(`redirects.json: ${rules.length} rules`);
  if (process.argv.includes('--emit')) process.stdout.write(emitRedirects(rules));
}
if (process.argv[1]?.endsWith('gen-redirects.mjs')) await main();
