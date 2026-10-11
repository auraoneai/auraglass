#!/usr/bin/env node
// gen-llms.mjs — REQ-PLAT-106 (REQ-FIN-44).
//   llms.txt       (≤12 KB, tracked, shipped in the aura-glass tarball):
//                  llms.txt.tmpl + package.json version + exports manifest
//                  subpath map + one line per flagship meta linking
//                  <docs>/components/<slug>.md + do-not list + Versions.
//   llms-full.txt  (≤400 KB, Pages only → apps/docs/public/, git-ignored):
//                  llms.txt + generated markdown for every component meta +
//                  the docs content and quickstarts.
// No Glass* name is ever recommended; the Versions section follows the
// dist-tag policy in scripts/release/dist-tag.mjs.
// Usage: node scripts/docs/gen-llms.mjs            write llms.txt + Pages copies
//        node scripts/docs/gen-llms.mjs --check    exit 1 when llms.txt is stale
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PUBLIC_DOCS_URL } from './paths.mjs';
import { distTagFor } from '../release/dist-tag.mjs';
import { ROOT, importPath, loadMetas, loadProps, loadSubpaths, packageVersion, slugOf } from './agent-data.mjs';

export const LLMS_MAX = 12 * 1024;
export const FULL_MAX = 400 * 1024;
export const GLASS_NAME = /\bGlass[A-Z]\w*/;
const PAGES_DIR = 'apps/docs/public';
const base = PUBLIC_DOCS_URL.endsWith('/') ? PUBLIC_DOCS_URL : `${PUBLIC_DOCS_URL}/`;
const isGlass = (name) => /^(Liquid)?Glass[A-Z]/.test(name);

function versionsSection(version) {
  const tag = distTagFor(version);
  const major = version.split('.')[0];
  const lines = [`- \`${version}\` — this package, published on the \`${tag}\` dist-tag`];
  if (tag === 'next') {
    lines.push(`- \`${major}.x\` — pre-release train on \`next\`; GA pending`);
    lines.push('- `4.x` — current stable on `latest` until 5.0.0 GA, then `v4-lts` (fixes and security only for 12 months after GA)');
  } else {
    lines.push(`- \`${major}.x\` — current stable on \`latest\``);
    lines.push('- `4.x` — LTS on `v4-lts`: fixes and security only for 12 months after 5.0.0 GA');
  }
  lines.push('- `<4.x` — unsupported');
  return lines.join('\n');
}

function subpathSection(subpaths, metas) {
  const byEntry = new Map();
  for (const { meta } of metas) {
    if (isGlass(meta.name)) continue;
    const key = importPath(meta.entry);
    (byEntry.get(key) ?? byEntry.set(key, new Set()).get(key)).add(meta.name);
  }
  return subpaths.filter((s) => s.subpath !== './package.json').map(({ subpath }) => {
    const spec = subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.slice(2)}`;
    if (/\.(css|json)$/.test(subpath)) return `- \`${spec}\` — ${subpath.endsWith('.css') ? 'stylesheet' : 'data'}`;
    const names = [...(byEntry.get(spec) ?? [])].sort();
    return names.length ? `- \`${spec}\` — ${names.join(', ')}` : `- \`${spec}\``;
  }).join('\n');
}

function flagshipSection(metas) {
  return metas
    .filter(({ meta }) => meta.flagship != null && !isGlass(meta.name))
    .sort((a, b) => a.meta.flagship - b.meta.flagship || a.meta.name.localeCompare(b.meta.name))
    .map(({ meta }) => `- [${meta.name}](${base}components/${slugOf(meta.name)}.md): \`${importPath(meta.entry)}\`, ${meta.tier}`)
    .join('\n');
}

export function componentMarkdown(meta, props) {
  const out = [`### ${meta.name}`, '', `\`import { ${meta.name} } from '${importPath(meta.entry)}'\` · tier ${meta.tier} · ${meta.rsc}`];
  if (meta.parts?.length) out.push('', `Parts (\`data-ag-part\`): ${meta.parts.map((p) => `\`${p}\``).join(', ')}`);
  if (meta.states?.length) out.push('', `States: ${meta.states.map((s) => `\`${s}\``).join(', ')}`);
  const variants = Object.entries(meta.variants ?? {});
  if (variants.length) out.push('', 'Variants:', ...variants.map(([k, v]) => `- \`${k}\`: ${v.map((x) => `\`${x}\``).join(', ')}`));
  if (props.length) out.push('', '| Prop | Type | Required |', '| --- | --- | --- |', ...props.map((p) => `| \`${p.name}\` | \`${p.type.replace(/\|/g, '\\|')}\` | ${p.required ? 'yes' : 'no'} |`));
  if (meta.migration?.length) out.push('', `Replaces 4.x: ${meta.migration.map((m) => `\`${m.from}\` (${m.automation})`).join(', ')}`);
  return out.join('\n');
}

function docsFiles(root) {
  const out = [];
  for (const dir of ['docs/quickstart', 'apps/docs/content']) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs, { recursive: true }).map(String).sort()) {
      if (/\.mdx?$/.test(f)) out.push(join(abs, f));
    }
  }
  return out;
}

/** @returns {Promise<{ llms: string, full: string, version: string }>} */
export async function generate(root = ROOT) {
  const version = packageVersion(root);
  const metas = await loadMetas(root);
  const tmpl = readFileSync(join(root, 'llms.txt.tmpl'), 'utf8');
  const values = {
    version,
    install: distTagFor(version) === 'next' ? 'aura-glass@next' : `aura-glass@^${version.split('.')[0]}`,
    subpaths: subpathSection(loadSubpaths(root), metas),
    flagships: flagshipSection(metas),
    versions: versionsSection(version),
    base,
  };
  const llms = tmpl.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in values)) throw new Error(`llms.txt.tmpl: unknown placeholder ${m}`);
    return values[k];
  });

  const propsOf = await loadProps(root);
  const full = [
    llms.trimEnd(), '', '## Component reference', '',
    metas.map(({ meta }) => componentMarkdown(meta, propsOf(meta.name))).join('\n\n'), '',
    '## Guides', '',
    docsFiles(root).map((f) => `<!-- ${relative(root, f)} -->\n${readFileSync(f, 'utf8').trim()}`).join('\n\n'), '',
  ].join('\n');
  return { llms, full, version };
}

export function verify({ llms, full, version }) {
  const errors = [];
  const bytes = Buffer.byteLength(llms);
  if (bytes > LLMS_MAX) errors.push(`llms.txt is ${bytes}B > ${LLMS_MAX}B`);
  if (!llms.startsWith(`# AuraGlass ${version}\n`)) errors.push(`llms.txt H1 does not carry package.json version ${version}`);
  const glass = llms.split('\n').filter((l) => GLASS_NAME.test(l));
  if (glass.length) errors.push(`llms.txt names Glass* symbols: ${glass.join(' | ')}`);
  const fullBytes = Buffer.byteLength(full);
  if (fullBytes > FULL_MAX) errors.push(`llms-full.txt is ${fullBytes}B > ${FULL_MAX}B`);
  return errors;
}

export async function main(argv = process.argv.slice(2), root = ROOT) {
  const out = await generate(root);
  const errors = verify(out);
  if (argv.includes('--check')) {
    const tracked = existsSync(join(root, 'llms.txt')) ? readFileSync(join(root, 'llms.txt'), 'utf8') : '';
    if (tracked !== out.llms) errors.push('llms.txt is stale (version, metas, manifest or template changed) — run node scripts/docs/gen-llms.mjs');
  }
  if (errors.length) { for (const e of errors) console.error(`gen-llms: ${e}`); return 1; }
  if (!argv.includes('--check')) {
    writeFileSync(join(root, 'llms.txt'), out.llms);
    mkdirSync(join(root, PAGES_DIR), { recursive: true });
    writeFileSync(join(root, PAGES_DIR, 'llms.txt'), out.llms);
    writeFileSync(join(root, PAGES_DIR, 'llms-full.txt'), out.full);
  }
  console.log(`gen-llms: llms.txt ${Buffer.byteLength(out.llms)}B, llms-full.txt ${Buffer.byteLength(out.full)}B (v${out.version})${argv.includes('--check') ? ' — up to date' : ''}`);
  return 0;
}
if (process.argv[1]?.endsWith('gen-llms.mjs')) main().then((c) => process.exit(c), (e) => { console.error(e); process.exit(1); });
