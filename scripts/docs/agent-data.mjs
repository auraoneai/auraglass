/* scripts/docs/agent-data.mjs — REQ-PLAT-106 (REQ-FIN-44). Shared, read-only
   source loaders for the agent-facing outputs (llms.txt, llms-full.txt and
   @auraglass/mcp's data/mcp-data.json). Every value comes from a tracked
   source: package.json, build/exports.manifest.json, the <Name>.meta.ts
   files, src/components/*.types.ts props, the registry build and the codemod
   / deprecation fragments. Nothing here is hand-maintained. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as esbuild } from 'esbuild';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Same slug rule as gen-component-docs.mjs: AlertDialog -> alert-dialog. */
export const slugOf = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** 'aura-glass' for '.', 'aura-glass/<x>' for './<x>'. */
export const importPath = (entry) => (!entry || entry === '.' ? 'aura-glass' : `aura-glass/${entry.replace(/^\.\//, '')}`);

export const readJson = (root, rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));

export function packageVersion(root = ROOT) {
  return readJson(root, 'package.json').version;
}

/** Commit the data is built from: CI_COMMIT_SHA in CI, else git HEAD. */
export function sourceSha(root = ROOT) {
  if (process.env.AG_RELEASE_SHA) return process.env.AG_RELEASE_SHA;
  if (process.env.CI_COMMIT_SHA) return process.env.CI_COMMIT_SHA;
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
}

/** Public subpaths from the generated exports manifest (FIN-A owns its writer). */
export function loadSubpaths(root = ROOT) {
  const manifest = readJson(root, 'build/exports.manifest.json');
  return manifest.entries.map((e) => ({ subpath: e.subpath, css: Boolean(e.css), source: e.source ?? null }));
}

/**
 * Every exported component's S-31 meta. All tracked src/**\/*.meta.ts files
 * (stories excluded) are bundled in one esbuild pass with packages external
 * and evaluated; any object export with name/entry/parts is a meta.
 * Deduplicated by name+entry, sorted by name.
 */
export async function loadMetas(root = ROOT) {
  const files = execFileSync('git', ['ls-files', '--', 'src/**/*.meta.ts'], { cwd: root, encoding: 'utf8' })
    .split('\n').filter((f) => f && !/\/stories\//.test(f)).sort();
  if (!files.length) return [];
  const res = await esbuild({
    stdin: { contents: files.map((f, i) => `export * as m${i} from './${f}';`).join('\n'), resolveDir: root, loader: 'ts' },
    bundle: true, write: false, format: 'cjs', platform: 'node', packages: 'external', logLevel: 'error',
  });
  const mod = { exports: {} };
  const req = createRequire(join(root, 'package.json'));
  new Function('module', 'exports', 'require', res.outputFiles[0].text)(mod, mod.exports, req);
  const seen = new Map();
  Object.values(mod.exports).forEach((ns, i) => {
    for (const v of Object.values(ns)) {
      if (!v || typeof v !== 'object' || typeof v.name !== 'string' || typeof v.entry !== 'string' || !Array.isArray(v.parts)) continue;
      const key = `${v.name}@${v.entry}`;
      if (!seen.has(key)) seen.set(key, { meta: v, file: files[i] });
    }
  });
  return [...seen.values()].sort((a, b) => a.meta.name.localeCompare(b.meta.name) || a.meta.entry.localeCompare(b.meta.entry));
}

/** Prop rows per component: <Name>Props, else <Name>RootProps (compound roots). */
export async function loadProps(root = ROOT) {
  const { collect } = await import(pathToFileURL(join(root, 'scripts/docs/gen-props.mjs')).href);
  const all = collect(root);
  return (name) => (all[`${name}Props`] ?? all[`${name}RootProps`] ?? []).map(({ name: n, type, required, description }) => ({
    name: n, type, required, ...(description ? { description } : {}),
  }));
}

/** Registry discovery index + certification report, computed without writing. */
export async function loadRegistry(root = ROOT, sha = undefined) {
  const { build } = await import(pathToFileURL(join(root, 'scripts/registry/build.mjs')).href);
  const { index, report } = build({ root, sha, write: false });
  const rows = new Map(report.items.map((r) => [r.name, r]));
  return index.items.map((item) => ({ item, row: rows.get(item.name) ?? null }));
}

const normEntry = (e) => (!e || e === '.' ? 'aura-glass' : e.startsWith('./') ? `aura-glass/${e.slice(2)}` : e);

/**
 * Migration entries keyed by 4.x symbol (or subpath / CSS var / package),
 * compiled from fragments/codemods/* and fragments/deprecations/* through the
 * contract loader (the same bridge packages/cli's gen-mappings.mjs uses) plus
 * each meta's migration rows. Within a symbol the canonical-names rename
 * comes first.
 */
export async function loadMigrations(root = ROOT, metas = []) {
  const { loadFragments } = await import(pathToFileURL(join(root, 'src/contracts/load-fragments.mjs')).href);
  const catalogue = existsSync(join(root, 'packages/cli/src/migrate/4to5/catalogue.json'))
    ? readJson(root, 'packages/cli/src/migrate/4to5/catalogue.json').transforms : [];
  const docOf = (id) => catalogue.find((t) => t.id === id)?.doc ?? null;
  const ORDER = ['canonical-names', 'imports-subpaths', 'prop-grammar', 'component-meta', 'removed', 'css-vars', 'deps', 'deprecation'];
  const out = {};
  const add = (symbol, entry) => {
    const list = (out[symbol] ??= []);
    const key = JSON.stringify(entry);
    if (!list.some((e) => JSON.stringify(e) === key)) list.push(entry);
  };

  for (const { stream, value } of await loadFragments('codemods', root)) {
    const v = (Array.isArray(value) ? value[0] : value) ?? {};
    for (const r of v.renames ?? []) {
      if (r.from === '*') {
        add(normEntry(r.fromEntry), { transform: 'imports-subpaths', from: normEntry(r.fromEntry), to: normEntry(r.toEntry), stream, doc: docOf('imports-subpaths') });
      } else {
        add(r.from, {
          transform: 'canonical-names', from: r.from, fromEntry: normEntry(r.fromEntry), to: r.to, toEntry: normEntry(r.toEntry),
          compatOnly: r.compatOnly === true, stream, doc: docOf('canonical-names'),
        });
      }
    }
    const props = new Map();
    for (const row of v.props ?? []) (props.get(row.component) ?? props.set(row.component, []).get(row.component)).push(row);
    for (const [component, rows] of props) {
      add(component, { transform: 'prop-grammar', component, rows: rows.map(({ component: _c, ...r }) => r), stream, doc: docOf('prop-grammar') });
    }
    for (const row of v.removed ?? []) add(row.symbol, { transform: 'removed', ...row, entry: normEntry(row.entry), stream });
    for (const [cssVar, to] of Object.entries(v.cssVars ?? {})) add(cssVar, { transform: 'css-vars', from: cssVar, to, stream, doc: docOf('css-vars') });
    for (const row of v.deps ?? []) add(row.pkg, { transform: 'deps', ...row, stream, doc: docOf('deps') });
  }
  for (const { stream, value } of await loadFragments('deprecations', root)) {
    const rows = Array.isArray(value) ? value : (value?.entries ?? []);
    for (const row of rows) if (row?.symbol) add(row.symbol, { transform: 'deprecation', ...row, stream });
  }
  for (const { meta } of metas) {
    for (const row of meta.migration ?? []) {
      add(row.from, {
        transform: 'component-meta', component: meta.name, import: importPath(meta.entry),
        automation: row.automation, compat: row.compat, ...(row.props ? { props: row.props } : {}), ...(row.selectors ? { selectors: row.selectors } : {}),
      });
    }
  }
  for (const list of Object.values(out)) list.sort((a, b) => ORDER.indexOf(a.transform) - ORDER.indexOf(b.transform));
  return Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
}
