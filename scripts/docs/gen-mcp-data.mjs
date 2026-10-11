#!/usr/bin/env node
// gen-mcp-data.mjs — REQ-PLAT-106 (REQ-FIN-44). Writes
// packages/mcp/data/mcp-data.json { version, sha, components, registry,
// migrations }: the only data @auraglass/mcp reads at runtime (≤5 MB).
// Sources (all tracked): package.json version, git/CI sha, every
// <Name>.meta.ts + its Props interface, the registry build (computed in
// memory, nothing written) and the compiled codemod / deprecation fragments.
// Usage: node scripts/docs/gen-mcp-data.mjs [--root <dir>] [--out <file>]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { PUBLIC_DOCS_URL } from './paths.mjs';
import { ROOT, importPath, loadMetas, loadMigrations, loadProps, loadRegistry, packageVersion, slugOf, sourceSha } from './agent-data.mjs';

export const MAX_BYTES = 5 * 1024 * 1024;
const base = PUBLIC_DOCS_URL.endsWith('/') ? PUBLIC_DOCS_URL : `${PUBLIC_DOCS_URL}/`;

export async function generate(root = ROOT) {
  const version = packageVersion(root);
  const sha = sourceSha(root);
  const metas = await loadMetas(root);
  const propsOf = await loadProps(root);

  const components = metas.map(({ meta, file }) => ({
    name: meta.name,
    slug: slugOf(meta.name),
    import: `import { ${meta.name} } from '${importPath(meta.entry)}';`,
    entry: importPath(meta.entry),
    owner: meta.owner,
    tier: meta.tier,
    ...(meta.flagship != null ? { flagship: meta.flagship } : {}),
    rsc: meta.rsc,
    parts: [...meta.parts],
    states: [...(meta.states ?? [])],
    variants: meta.variants ?? {},
    ...(meta.material ? { material: meta.material } : {}),
    ...(meta.apg ? { apg: meta.apg } : {}),
    migratesFrom: (meta.migration ?? []).map((m) => m.from),
    props: propsOf(meta.name),
    docs: `${base}components/${slugOf(meta.name)}.md`,
    source: file,
  }));

  const registry = (await loadRegistry(root, sha)).map(({ item, row }) => {
    const meta = item.meta?.auraglass ?? {};
    return {
      name: item.name,
      type: item.type,
      title: item.title ?? null,
      description: item.description ?? null,
      status: row?.status ?? 'pending',
      ...(row?.reason ? { reason: row.reason } : {}),
      surface: meta.surface ?? null,
      owner: meta.owner ?? row?.owner ?? null,
      ga: meta.ga === true,
      components: meta.components ?? [],
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
      install: `npx @auraglass/cli add ${item.name}`,
      url: row?.status === 'certified' ? `${base}r/${item.name}.json` : null,
      files: (item.files ?? []).map((f) => ({ path: f.path, type: f.type, ...(f.target ? { target: f.target } : {}), content: f.content ?? null })),
      ...(item.cssVars ? { cssVars: item.cssVars } : {}),
      ...(item.css ? { css: item.css } : {}),
    };
  });

  const migrations = await loadMigrations(root, metas);
  return { version, sha, components, registry, migrations };
}

export async function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const root = arg('--root') ? resolve(arg('--root')) : ROOT;
  const out = arg('--out') ? resolve(arg('--out')) : join(root, 'packages/mcp/data/mcp-data.json');
  const data = await generate(root);
  const text = `${JSON.stringify(data)}\n`;
  const bytes = Buffer.byteLength(text);
  if (bytes > MAX_BYTES) { console.error(`gen-mcp-data: ${bytes}B exceeds the 5 MB cap`); return 1; }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, text);
  console.log(`gen-mcp-data: ${bytes}B — ${data.components.length} components, ${data.registry.length} registry items, ${Object.keys(data.migrations).length} migration symbols (v${data.version}, ${data.sha.slice(0, 12)})`);
  return 0;
}
if (process.argv[1]?.endsWith('gen-mcp-data.mjs')) main().then((c) => process.exit(c), (e) => { console.error(e); process.exit(1); });
