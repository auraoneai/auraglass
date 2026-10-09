#!/usr/bin/env node
/* scripts/registry/build.mjs — PLAT-351/352 (REQ-PLAT-94). Globs every
   owner's registry/{base,blocks,items}/<id>/registry-item.json, inlines
   file contents, validates against the vendored schema + meta.auraglass,
   and writes the deterministic, git-ignored outputs:

     registry/registry.json                      discovery index (all items)
     registry/registry-report.json               certified/omitted/pending
     apps/docs/public/r/<name>.json              published items only
     apps/docs/public/r/v/<version>/<name>.json  immutable versioned copies
     packages/registry/r/*.json + index.json     @auraglass/registry data

   Usage: node scripts/registry/build.mjs [--sha <sha>] [--version <v>]
          [--ga-tag v5.x.y] [--root <dir>] [--manifest <path>]
   GA (v5.x.y release tag): an omitted GA item fails the build. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_BASE_URL, REGISTRY_INDEX, REGISTRY_PUBLIC_DIR, REGISTRY_PACKAGE_DIR, REGISTRY_REPORT, SHADCN_SCHEMA } from '../docs/paths.mjs';

const ROOT_DEFAULT = join(fileURLToPath(import.meta.url), '../../..');
const SIZE_LIMITS = { base: 40 * 1024, block: 150 * 1024, items: 400 * 1024 };
const BASE_CSS_VARS = {
  '--background': 'var(--ag-color-canvas, var(--ag-surface-fill))',
  '--foreground': 'var(--ag-on-surface)',
  '--primary': 'var(--ag-surface-fill)',
  '--primary-foreground': 'var(--ag-on-surface)',
  '--muted': 'var(--ag-on-surface-muted)',
  '--border': 'var(--ag-surface-rim)',
  '--ring': 'var(--ag-focus-outer)',
  '--radius': 'var(--ag-surface-radius)',
};
const BASE_CSS = '@import "aura-glass/styles.css" layer(ag);';
const BASE_CSS_TAILWIND = '@import "aura-glass/tailwind.css";';

export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  }
  return value;
}
export const emit = (v) => JSON.stringify(stable(v), null, 2) + '\n';

/* Minimal validator for the vendored schema subset (no ajv in devDeps). */
export function validate(schema, value, path = '$') {
  const errs = [];
  if (schema.type) {
    const t = schema.type;
    const ok = (Array.isArray(t) ? t : [t]).some((tt) =>
      tt === 'array' ? Array.isArray(value)
      : tt === 'null' ? value === null
      : tt === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value)
      : typeof value === tt);
    if (!ok) errs.push(`${path}: expected ${Array.isArray(t) ? t.join('|') : t}, got ${JSON.stringify(value)?.slice(0, 60)}`);
  }
  if (errs.length) return errs;
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${path}: ${JSON.stringify(value)} not in enum`);
  if (schema.pattern && typeof value === 'string' && !new RegExp(schema.pattern).test(value))
    errs.push(`${path}: ${value} fails ${schema.pattern}`);
  if (schema.type === 'object' || (value && typeof value === 'object' && !Array.isArray(value))) {
    for (const k of schema.required ?? []) if (!(k in value)) errs.push(`${path}: missing ${k}`);
    const props = schema.properties ?? {};
    for (const [k, v] of Object.entries(value)) {
      if (props[k]) errs.push(...validate(props[k], v, `${path}.${k}`));
      else if (schema.additionalProperties === false) errs.push(`${path}: unexpected key ${k}`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object')
        errs.push(...validate(schema.additionalProperties, v, `${path}.${k}`));
    }
  }
  if (Array.isArray(value) && schema.items) {
    if (schema.minItems && value.length < schema.minItems) errs.push(`${path}: < ${schema.minItems} items`);
    value.forEach((v, i) => errs.push(...validate(schema.items, v, `${path}[${i}]`)));
  }
  return errs;
}

export function readItem(dir, id, relRoot) {
  const file = join(dir, 'registry-item.json');
  const item = JSON.parse(readFileSync(file, 'utf8'));
  const files = (item.files ?? []).map((f) => {
    const src = join(dir, f.path);
    return { ...f, content: existsSync(src) ? readFileSync(src, 'utf8') : null };
  });
  item.files = files;
  return { id, dir, file: relative(relRoot, file), item, files };
}

/* The registry:base item's cssVars/css are generated from the token
   manifest: every --ag-* var the bridge references must exist there. */
export function generateBaseTheme(manifestPath, { tailwind4 = false } = {}) {
  const cssVars = { theme: { radius: 'var(--ag-surface-radius)' }, light: { ...BASE_CSS_VARS }, dark: { ...BASE_CSS_VARS } };
  const missing = [];
  if (manifestPath && existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const present = new Set((manifest.tokens ?? []).map((t) => t.cssVar));
    const required = new Set(Object.values(BASE_CSS_VARS).flatMap((v) => [...v.matchAll(/--ag-[a-z0-9-]+/g)].map((m) => m[0])));
    for (const v of required) if (!present.has(v)) missing.push(v);
  }
  return { cssVars, css: tailwind4 ? `${BASE_CSS}\n${BASE_CSS_TAILWIND}` : BASE_CSS, missingCssVars: missing };
}

export function build({ root = ROOT_DEFAULT, sha = null, version = null, gaTag = null, manifest = null, write = true, tailwind4 = false } = {}) {
  const errors = [];
  const schemaPath = join(root, 'registry/schema/registry-item.json');
  const schema = existsSync(schemaPath) ? JSON.parse(readFileSync(schemaPath, 'utf8')) : null;
  const pkgPath = join(root, 'package.json');
  version ??= existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath, 'utf8')).version : '0.0.0';
  sha ??= process.env.AG_RELEASE_SHA ?? process.env.CI_COMMIT_SHA ??
    (() => { try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); } catch { return 'unknown'; } })();
  const ga = gaTag ? /^v5\.\d+\.\d+$/.test(gaTag) : /^\d+\.\d+\.\d+$/.test(version) && process.env.AG_SCOPE === 'release';

  /* Discover every owner's items (sorted for determinism). */
  const found = [];
  for (const kind of ['base', 'blocks', 'items']) {
    const dir = join(root, 'registry', kind);
    if (!existsSync(dir)) continue;
    for (const id of readdirSync(dir).sort()) {
      if (!existsSync(join(dir, id, 'registry-item.json'))) continue;
      found.push({ kind, ...readItem(join(dir, id), id, root) });
    }
  }

  const manifestPath = manifest ?? [join(root, 'dist/tokens/manifest.json'), join(root, 'canaries/types-strict/node_modules/aura-glass/dist/tokens/manifest.json'), join(root, 'tests/contract-doubles/tokens/manifest.json')].find(existsSync) ?? null;
  const items = found.map(({ kind, item, file }) => ({ kind, item, file }));
  const report = { sha, version, ga: !!gaTag || ga, manifest: manifestPath ? relative(root, manifestPath) : null, items: [] };
  const index = { $schema: SHADCN_SCHEMA.registry, name: 'auraglass', homepage: DOCS_BASE_URL, items: [] };
  const published = [];

  const all = [...items];
  const theme = generateBaseTheme(manifestPath, { tailwind4 });
  if (!all.some((x) => x.item.type === 'registry:base')) {
    /* The base item is manifest-generated even without authored source. */
    all.unshift({
      kind: 'base',
      file: 'registry/base/auraglass/registry-item.json',
      item: {
        $schema: SHADCN_SCHEMA.item, name: 'auraglass', type: 'registry:base', title: 'AuraGlass',
        description: 'AuraGlass 5.0 design system base — package dependency, layer import and shadcn variable bridge.',
        dependencies: ['aura-glass@^5'], registryDependencies: [],
        files: [{ path: 'lib/auraglass.ts', type: 'registry:item', target: 'lib/auraglass.ts', content: "export { cn } from 'aura-glass';\n" }],
        meta: { auraglass: { owner: 'PLAT', surface: 'base', client: false, components: [], ga: true, minVersion: '5.0.0' } },
      },
    });
  }
  for (const { item } of all) {
    if (item.type === 'registry:base') {
      item.cssVars ??= theme.cssVars;
      item.css ??= theme.css;
      if (theme.missingCssVars.length) {
        report.base = { missingCssVars: theme.missingCssVars };
        errors.push(`${item.name}: manifest misses vars: ${theme.missingCssVars.join(', ')}`);
      }
    }
  }

  for (const { kind, item, file } of all) {
    const meta = item.meta?.auraglass ?? null;
    const row = { name: item.name, kind, file, owner: meta?.owner ?? null, status: 'pending' };
    const errs = [];
    /* files[].content is a build-time inline, not part of the authored schema. */
    const authored = { ...item, files: (item.files ?? []).map(({ content, ...rest }) => rest) };
    if (schema) errs.push(...validate(schema, authored, item.name));
    else errs.push(`${item.name}: schema file missing`);
    const inlineErr = (item.files ?? []).filter((f) => f.content === null).map((f) => `${item.name}: file ${f.path} missing`);
    if (inlineErr.length) errs.push(...inlineErr);
    const size = Buffer.byteLength(emit(item), 'utf8');
    const limit = SIZE_LIMITS[kind === 'base' ? 'base' : kind === 'blocks' ? 'block' : 'items'];
    if (size > limit) errs.push(`${item.name}: ${size}B exceeds ${limit}B`);
    row.sizeBytes = size;
    if (errs.length) { row.status = 'invalid'; row.errors = errs; errors.push(...errs); report.items.push(row); continue; }
    const certified = meta?.certified ?? null;
    if (kind === 'base' || certified === sha) { row.status = 'certified'; row.certified = certified ?? 'base'; }
    else { row.status = 'omitted'; row.reason = !meta ? 'meta.auraglass missing' : certified ? `certified ${certified} != ${sha}` : 'uncertified'; }
    report.items.push(row);
    index.items.push(item);
    if (row.status === 'certified') published.push(item);
    else if (ga && meta?.ga === true) errors.push(`GA build omits ${item.name} (${row.reason})`);
  }

  const indexOut = emit(index);
  const reportOut = emit(report);
  if (write) {
    const w = (p, s) => { mkdirSync(join(root, p, '..'), { recursive: true }); writeFileSync(join(root, p), s); };
    w(REGISTRY_INDEX, indexOut);
    w(REGISTRY_REPORT, reportOut);
    w('.artifacts/plat/registry-report.json', reportOut);
    const pkgDir = join(root, REGISTRY_PACKAGE_DIR);
    for (const item of published) {
      w(join(REGISTRY_PUBLIC_DIR, `${item.name}.json`), emit(item));
      w(join(REGISTRY_PUBLIC_DIR, 'v', version, `${item.name}.json`), emit(item));
      w(join(REGISTRY_PACKAGE_DIR, 'r', `${item.name}.json`), emit(item));
    }
    if (existsSync(pkgDir) || published.length)
      w(join(REGISTRY_PACKAGE_DIR, 'index.json'), emit({ $schema: SHADCN_SCHEMA.registry, name: 'auraglass', homepage: DOCS_BASE_URL, version, sha, items: published.map((i) => i.name).sort() }));
  }
  return { index, report, published: published.map((i) => i.name), errors };
}

export function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const { errors, published, report } = build({
    sha: arg('--sha'), version: arg('--version'), gaTag: arg('--ga-tag'), root: arg('--root') ?? undefined, manifest: arg('--manifest'), tailwind4: argv.includes('--tailwind4'),
  });
  console.log(`registry build: ${report.items.length} discovered, ${published.length} published (${published.join(', ') || 'none'}), ${report.items.filter((i) => i.status === 'omitted').length} omitted pending certification`);
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  return 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
