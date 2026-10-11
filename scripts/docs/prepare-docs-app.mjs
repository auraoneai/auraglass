#!/usr/bin/env node
/* scripts/docs/prepare-docs-app.mjs — PLAT-374/375/377 (REQ-PLAT-99, REQ-FIN-43).
   Writes the build-time data the docs app reads, so the app itself never
   imports library source (it consumes aura-glass only from the packed
   tarball):

     apps/docs/generated/nav-data.json   components (from every src/**\/*.meta.ts),
                                         surfaces (certified registry blocks),
                                         api subpaths (package.json exports),
                                         scenes (S-42 SCENES + SCENE_BACKDROP)
     apps/docs/generated/examples.tsx    static import map of apps/docs/examples/<slug>/*.tsx
     apps/docs/public/scenes/<id>.<ext>  scene stills copied from certification/scenes/

   Metas and the scene contract are evaluated with the TypeScript compiler
   (transpile + sandboxed eval); any runtime import other than defineMeta
   fails the run instead of being guessed. */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import { build as buildRegistry } from '../registry/build.mjs';

const ROOT_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCENE_EXTS = ['avif', 'webp', 'jpg', 'jpeg', 'png'];

/** kebab-case slug, identical to gen-component-docs.mjs (AppShell → app-shell). */
export const slugify = (name) => name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

/** Transpile a TS module to CJS and evaluate it with an explicit import allow-list. */
export function evalTsModule(file, allowImport) {
  const src = readFileSync(file, 'utf8');
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false },
    fileName: file,
  });
  const module = { exports: {} };
  const require = (spec) => {
    const value = allowImport(spec);
    if (value === undefined) throw new Error(`${file}: runtime import '${spec}' is not allowed in build-time evaluation`);
    return value;
  };
  vm.runInNewContext(outputText, { module, exports: module.exports, require }, { filename: file });
  return module.exports;
}

const isMeta = (v) => v && typeof v === 'object' && typeof v.name === 'string' && typeof v.tier === 'string'
  && typeof v.entry === 'string' && Array.isArray(v.parts);

export function collectComponents(root) {
  const files = walk(join(root, 'src')).filter((f) => f.endsWith('.meta.ts'));
  const foundation = { defineMeta: (m) => m };
  const rows = [];
  for (const file of files) {
    const mod = evalTsModule(file, (spec) => (/(^|\/)foundation(\/index)?$/.test(spec) ? foundation : undefined));
    /* A file may export the same meta object as default and as a named export. */
    for (const value of new Set(Object.values(mod))) {
      if (!isMeta(value)) continue;
      rows.push({
        name: value.name, slug: slugify(value.name), owner: value.owner ?? null, entry: value.entry, tier: value.tier,
        flagship: typeof value.flagship === 'number' ? value.flagship : null, rsc: value.rsc ?? null,
        parts: [...value.parts], states: [...(value.states ?? [])], file: relative(root, file).split(sep).join('/'),
      });
    }
  }
  /* Two metas may declare the same export name (e.g. a CMP copy and the SURF
     module the entry barrel actually exports). The page documents the meta
     that lives under the entry's own source directory (entry './data' →
     src/data/); the other is reported as a conflict for its owner. */
  const bySlug = new Map();
  const conflicts = [];
  const home = (r) => (r.entry === '.' ? null : `src/${r.entry.replace(/^\.\//, '')}/`);
  for (const r of rows.sort((a, b) => a.file.localeCompare(b.file))) {
    const prev = bySlug.get(r.slug);
    if (!prev) { bySlug.set(r.slug, r); continue; }
    const h = home(r);
    const keep = h && r.file.startsWith(h) && !prev.file.startsWith(h) ? r : prev;
    if (!(h && (r.file.startsWith(h) !== prev.file.startsWith(h))))
      throw new Error(`duplicate component '${r.name}' in ${prev.file} and ${r.file} with no entry-directory owner to prefer`);
    conflicts.push({ name: r.name, kept: keep.file, dropped: keep === r ? prev.file : r.file });
    bySlug.set(r.slug, keep);
  }
  return { components: [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name)), conflicts };
}

/** Every registry block whose meta.auraglass.certified matches the build sha (scripts/registry/build.mjs rule). */
export function collectSurfaces(root, { sha } = {}) {
  const { index, report } = buildRegistry({ root, sha: sha ?? null, write: false });
  const byName = new Map(index.items.map((i) => [i.name, i]));
  return report.items
    .filter((r) => r.kind === 'blocks' && r.status === 'certified')
    .map((r) => {
      const item = byName.get(r.name) ?? {};
      return { name: r.name, title: item.title ?? r.name, description: item.description ?? '', owner: r.owner, files: (item.files ?? []).map((f) => f.path) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** One API page per JavaScript subpath of the root package.json exports map. */
export function collectApi(root) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  return Object.keys(pkg.exports ?? {})
    .filter((k) => k !== './package.json' && !/\.(css|json)$/.test(k))
    .map((subpath) => {
      const slug = subpath === '.' ? 'root' : subpath.replace(/^\.\//, '').replace(/\//g, '.');
      return { subpath, slug, label: subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.replace(/^\.\//, '')}`, report: `etc/api/${slug}.api.md` };
    });
}

export function collectScenes(root) {
  const mod = evalTsModule(join(root, 'src/contracts/testing.ts'), () => undefined);
  const dir = join(root, 'certification/scenes');
  return mod.SCENES.map((id) => {
    const ext = SCENE_EXTS.find((e) => existsSync(join(dir, `${id}.${e}`)));
    return { id, backdrop: mod.SCENE_BACKDROP[id], file: ext ? `${id}.${ext}` : null };
  });
}

export function collectExamples(appDir) {
  const dir = join(appDir, 'examples');
  if (!existsSync(dir)) return [];
  const out = [];
  for (const slug of readdirSync(dir).sort()) {
    const sub = join(dir, slug);
    if (!statSync(sub).isDirectory()) continue;
    for (const f of readdirSync(sub).sort()) if (/\.tsx$/.test(f)) out.push({ slug, name: f.replace(/\.tsx$/, ''), path: `${slug}/${f.replace(/\.tsx$/, '')}` });
  }
  return out;
}

export function renderExamplesModule(examples) {
  const lines = [
    '/* GENERATED by scripts/docs/prepare-docs-app.mjs — do not edit. */',
    "import type { ComponentType } from 'react';",
    ...examples.map((e, i) => `import Example${i} from '../examples/${e.path}';`),
    '',
    'export interface ExampleEntry { name: string; Component: ComponentType }',
    'export const EXAMPLES: Record<string, ExampleEntry[]> = {',
  ];
  const bySlug = new Map();
  examples.forEach((e, i) => { if (!bySlug.has(e.slug)) bySlug.set(e.slug, []); bySlug.get(e.slug).push(`{ name: ${JSON.stringify(e.name)}, Component: Example${i} }`); });
  for (const [slug, entries] of bySlug) lines.push(`  ${JSON.stringify(slug)}: [${entries.join(', ')}],`);
  lines.push('};', '');
  return lines.join('\n');
}

export function collectNavData(root = ROOT_DEFAULT, opts = {}) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const { components, conflicts } = collectComponents(root);
  return {
    version: pkg.version,
    components,
    componentConflicts: conflicts,
    surfaces: collectSurfaces(root, opts),
    api: collectApi(root),
    scenes: collectScenes(root),
  };
}

export function main(root = ROOT_DEFAULT) {
  const appDir = join(root, 'apps/docs');
  const data = collectNavData(root);
  const gen = join(appDir, 'generated');
  mkdirSync(gen, { recursive: true });
  writeFileSync(join(gen, 'nav-data.json'), JSON.stringify(data, null, 2) + '\n');
  const examples = collectExamples(appDir);
  writeFileSync(join(gen, 'examples.tsx'), renderExamplesModule(examples));
  const sceneOut = join(appDir, 'public/scenes');
  mkdirSync(sceneOut, { recursive: true });
  for (const s of data.scenes) if (s.file) copyFileSync(join(root, 'certification/scenes', s.file), join(sceneOut, s.file));
  for (const c of data.componentConflicts) console.warn(`prepare-docs-app: duplicate meta '${c.name}': documenting ${c.kept}, not ${c.dropped}`);
  console.log(`prepare-docs-app: ${data.components.length} components, ${data.surfaces.length} certified surfaces, ${data.api.length} api subpaths, `
    + `${data.scenes.filter((s) => s.file).length}/${data.scenes.length} scene stills, ${examples.length} examples`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
