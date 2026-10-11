#!/usr/bin/env node
/* scripts/build/api-report.mjs — REQ-PLAT-22 (B22a). Final CLI:

     node scripts/build/api-report.mjs --entry <entry> [--check]
     node scripts/build/api-report.mjs --line 4x [--check]

   5x mode: one ENTRIES row per --entry (from build/exports.manifest.json); emits
   etc/api/<entry>.exports.json + .api.md; 'root.<stream>' rows come from
   src/root/<stream>.ts; 'compat.<stream>' rows from src/compat/<stream>/index.ts;
   'css.<entry>' rows emit <entry>.css-api.json. 4x mode: one report per
   package.json `exports` key that has a `types` condition (the B22a "40 of 47"
   set); slug '.' -> 'index', './a/b' -> 'a-b'; plus etc/api/manifest.json.

   API Extractor 7.59.4 produces the .api.md when the built d.ts rollup exists;
   otherwise the report falls back to the bundled-source name pass. Entries that
   cannot be analysed are recorded in the report's `unanalysable` list — on the
   5x line that is a hard failure once package.json version >= 5.0.0-alpha.1. */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(import.meta.url);
export const EXTRACTOR_VERSION = '7.59.4';

const EXTERNAL = ['react', 'react-dom', 'react-dom/*', 'react/*', 'clsx', '@base-ui/react', '@tanstack/*',
  'react-aria-components', 'react-aria-components/*', '@internationalized/*', '@react-aria/*', '@react-stately/*',
  '@react-types/*', 'framer-motion', 'motion', 'zod', 'date-fns'];

export const slugify = (key) => (key === '.' ? 'index' : key.replace(/^\.\//, '').replace(/\//g, '-'));

export function extractorBin(root = ROOT) {
  // ./bin/* is not in the package's exports map; resolve via package.json + bin field.
  try {
    const pkgPath = require.resolve('@microsoft/api-extractor/package.json', { paths: [root] });
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    const rel = (pkg.bin ?? {})['api-extractor'];
    if (!rel) return null;
    const bin = join(dirname(pkgPath), rel);
    return existsSync(bin) ? bin : null;
  } catch { return null; }
}

export function extractorAvailable(root = ROOT) {
  return extractorBin(root) !== null;
}

// --- name extraction ----------------------------------------------------------
export async function extractNames(sourcePath, { root = ROOT } = {}) {
  const { build } = await import('esbuild');
  const res = await build({
    entryPoints: [sourcePath], bundle: true, write: false, format: 'esm', platform: 'node',
    external: EXTERNAL, logLevel: 'silent', metafile: true, tsconfig: join(root, 'tsconfig.json'),
  });
  const text = res.outputFiles[0]?.text ?? '';
  const tail = [...text.matchAll(/export\s*\{([^}]*)\}\s*;?/g)].pop();
  if (tail?.[1]) {
    return tail[1].split(',').map((s) => s.trim().replace(/\s+as\s+\w+$/, ''))
      .map((s) => s.replace(/^type\s+/, '')).filter(Boolean).sort();
  }
  return [...text.matchAll(/^export\s+(?:const|function|class)\s+(\w+)/gm)].map((m) => m[1]).sort();
}

// CSS custom-property report (css-api.json): vars declared via `ag-*`.
export function extractCssApi(sourcePath) {
  if (!existsSync(sourcePath)) return null;
  const text = readFileSync(sourcePath, 'utf8');
  return [...new Set([...text.matchAll(/(--ag-[a-z0-9-]+)/gi)].map((m) => m[1]))].sort();
}

// API Extractor on a built d.ts rollup → .api.md content, or null when the
// extractor cannot run. The extractor writes into a temp dir inside the repo
// (it finds the project's package.json by walking up from the config file).
export function apiExtractorReport({ dtsPath, reportFileName, configDir, root = ROOT }) {
  const bin = extractorBin(root);
  if (!bin) return null;
  const tmp = mkdtempSync(join(root, 'build', '.api-extractor-'));
  const cfg = {
    extends: join(root, 'api-extractor.base.json'),
    projectFolder: root,
    mainEntryPointFilePath: dtsPath,
    apiReport: { enabled: true, reportFileName, reportFolder: tmp },
    docModel: { enabled: false },
    tsdocMetadata: { enabled: false },
    compiler: { overrideTsconfig: { compilerOptions: { skipLibCheck: false } } },
  };
  const cfgPath = join(tmp, 'api-extractor.json');
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
  try {
    execFileSync(process.execPath, [bin, 'run', '--local', '--config', cfgPath], { cwd: configDir ?? root, stdio: 'pipe' });
    const out = join(tmp, reportFileName);
    return existsSync(out) ? readFileSync(out, 'utf8') : null;
  } catch { return null; } finally { try { rmSync(tmp, { recursive: true, force: true }); } catch { /* ignore */ } }
}

const mdHeader = (title) => `## API Report — ${title}\n\n`;
const mdNames = (names) => names.map((n) => `- \`${n}\``).join('\n');

export function reportFiles(entry, names, { unanalysable = [] } = {}) {
  names = [...names].sort();
  return {
    exportsJson: `${JSON.stringify({ entry, exports: names, unanalysable }, null, 1)}\n`,
    apiMd: `${mdHeader(`aura-glass ${entry}`)}${mdNames(names)}\n${unanalysable.length ? `\n### Unanalysable\n${mdNames(unanalysable)}\n` : ''}`,
  };
}

// Resolve an entry's source file on the 5x line.
export function entrySource(entry, { root = ROOT } = {}) {
  const manifestPath = join(root, 'build/exports.manifest.json');
  if (!existsSync(manifestPath)) return null;
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const [kind, ...rest] = entry.split('.');
  if (kind === 'root') return { source: `src/root/${rest[0]}.ts`, subpath: `.${rest[0] === 'index' ? '' : `/${rest[0]}`}` };
  if (kind === 'compat') return { source: `src/compat/${rest[0]}/index.ts`, subpath: `./compat/${rest[0]}` };
  if (kind === 'css') return { css: `src/${rest.join('/')}.css`, entry };
  if (kind === 'cli') return { source: 'packages/cli/src/index.ts', subpath: null, cli: true };
  const row = (manifest.entries ?? []).find((e) => e.subpath === `./${entry}` || e.subpath === entry);
  // Manifest entries are labelled by their package subpath ('./tokens') in the report.
  return row ? { source: row.source, subpath: row.subpath, label: row.subpath } : null;
}

export async function run5x(entry, { root = ROOT, check = false, failOnUnanalysable = null } = {}) {
  const resolved = entrySource(entry, { root });
  const unanalysable = [];
  let names = []; let css = null;
  if (resolved?.css) css = extractCssApi(join(root, resolved.css));
  else if (resolved?.source && existsSync(join(root, resolved.source))) {
    try { names = await extractNames(join(root, resolved.source), { root }); }
    catch (e) { unanalysable.push(`${resolved.source}: ${e.message}`); }
  } else unanalysable.push(`no source for entry '${entry}'`);

  const files = {};
  const stem = entry;
  const { exportsJson, apiMd } = reportFiles(resolved?.label ?? entry, names, { unanalysable });
  files[`etc/api/${stem}.exports.json`] = exportsJson;
  files[`etc/api/${stem}.api.md`] = apiMd;
  // API Extractor produces the .api.md when the built d.ts rollup exists
  // (7.59.4, skipLibCheck:false); the name pass is the fallback.
  const manifestPath = join(root, 'build/exports.manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { entries: [] };
  const types = resolved?.subpath
    ? (manifest.entries ?? []).find((e) => e.subpath === resolved.subpath)?.types
    : null;
  if (types && existsSync(join(root, types))) {
    const api = apiExtractorReport({ dtsPath: join(root, types), reportFileName: `${stem}.api.md`, root });
    if (api) files[`etc/api/${stem}.api.md`] = api;
  }
  if (css) files[`etc/api/${stem}.css-api.json`] = `${JSON.stringify({ entry, vars: css }, null, 1)}\n`;
  return { files, unanalysable, check, failOnUnanalysable };
}

export function exportsKeysWithTypes(pkg) {
  return Object.entries(pkg.exports ?? {}).filter(([, v]) => v && typeof v === 'object' && 'types' in v).map(([k]) => k).sort();
}

export function run4x({ root = ROOT } = {}) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const keys = exportsKeysWithTypes(pkg);
  const manifest = { version: 1, mode: '4x', keys, unanalysable: [] };
  const files = { 'etc/api/manifest.json': `${JSON.stringify(manifest, null, 2)}\n` };
  for (const key of keys) {
    const slug = slugify(key);
    const target = pkg.exports[key].types;
    let names = [];
    if (target && existsSync(join(root, target))) {
      try { names = extractDtsNames(readFileSync(join(root, target), 'utf8'), dirname(join(root, target))); }
      catch { manifest.unanalysable.push(key); }
    } else manifest.unanalysable.push(key);
    const { apiMd } = reportFiles(key, names, {});
    files[`etc/api/${slug}.api.md`] = apiMd;
  }
  files['etc/api/manifest.json'] = `${JSON.stringify(manifest, null, 2)}\n`;
  return { files, manifest };
}

// --- d.ts export names for the 4x line (no bundler needed for dist .d.ts) -----
export function extractDtsNames(text, _dir) {
  const names = new Set();
  for (const m of text.matchAll(/export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum|namespace)\s+(\w+)/g)) names.add(m[1]);
  for (const m of text.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const aliased = /\s+as\s+(\w+)$/.exec(part.trim());
      const t = (aliased ? aliased[1] : part.trim().replace(/^type\s+/, '')).trim();
      if (t) names.add(t);
    }
  }
  if (/export\s+default\b/.test(text)) names.add('default');
  return [...names].sort();
}

async function main() {
  const argv = process.argv.slice(2);
  const arg = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : null; };
  const has = (f) => argv.includes(f);
  const entry = arg('entry'); const line = arg('line'); const check = has('--check');
  if (!entry && line !== '4x') {
    console.error('usage: api-report.mjs --entry <entry> [--check] | --line 4x [--check]');
    return 2;
  }
  const version = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version ?? '0.0.0';
  const alphaNum = /-alpha\.(\d+)$/.exec(version)?.[1];
  const failOnUn = alphaNum !== undefined ? Number(alphaNum) >= 1 : /^5\./.test(version);

  let files = {}; let unanalysable = [];
  if (line === '4x') {
    const r = run4x({ root: ROOT }); files = r.files;
    unanalysable = r.manifest.unanalysable;
  } else {
    if (!entrySource(entry, { root: ROOT })) {
      console.error(`api-report: unknown entry '${entry}' (not in build/exports.manifest.json and not root.*/compat.*/css.*/cli)`);
      return 2;
    }
    const r = await run5x(entry, { root: ROOT, check });
    files = r.files; unanalysable = r.unanalysable;
  }
  const stale = [];
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(ROOT, rel);
    if (check) { if (!existsSync(abs) || readFileSync(abs, 'utf8') !== content) stale.push(rel); }
    else { mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, content); }
  }
  if (check && stale.length) { console.error(`api-report --check FAIL: ${stale.join(', ')}`); return 1; }
  if (unanalysable.length) {
    console.error(`api-report: ${unanalysable.length} unanalysable: ${unanalysable.join('; ')}`);
    if (failOnUn && line !== '4x') return 1;
  }
  console.log(`api-report: ${Object.keys(files).length} file(s) ${check ? 'verified' : 'written'}${entry ? ` for ${entry}` : ''}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
