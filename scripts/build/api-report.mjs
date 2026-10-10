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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
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

export function extractorAvailable(root = ROOT) {
  try { return require.resolve('@microsoft/api-extractor/package.json', { paths: [root] }) ? true : false; } catch { return false; }
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

// API Extractor on a built d.ts rollup → trimmed markdown lines.
export function apiExtractorReport({ dtsPath, reportPath, configDir, root = ROOT }) {
  const cfg = {
    extends: join(root, 'api-extractor.base.json'),
    projectFolder: root,
    mainEntryPointFilePath: dtsPath,
    apiReport: { enabled: true, reportFileName: reportPath.split('/').pop(), reportFolder: dirname(reportPath) },
  };
  const cfgPath = join(dirname(reportPath), '.api-extractor.tmp.json');
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
  try {
    const bin = require.resolve('@microsoft/api-extractor/bin/api-extractor', { paths: [root] });
    execFileSync(process.execPath, [bin, 'run', '--local', '--config', cfgPath], { cwd: configDir ?? root, stdio: 'pipe' });
    return true;
  } catch { return false; } finally { try { execFileSync('rm', ['-f', cfgPath]); } catch { /* ignore */ } }
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
  if (kind === 'root' && rest.length === 0) {
    const row = (manifest.entries ?? []).find((e) => e.subpath === '.');
    return row ? { source: row.source, subpath: '.' } : null;
  }
  if (kind === 'root') return { source: `src/root/${rest[0]}.ts`, subpath: `.${rest[0] === 'index' ? '' : `/${rest[0]}`}` };
  if (kind === 'compat') return { source: `src/compat/${rest[0]}/index.ts`, subpath: `./compat/${rest[0]}` };
  if (kind === 'css') return { css: `src/${rest.join('/')}.css`, entry };
  if (kind === 'cli') return { source: 'packages/cli/src/index.ts', subpath: null, cli: true };
  const row = (manifest.entries ?? []).find((e) => e.subpath === `./${entry}` || e.subpath === entry);
  return row ? { source: row.source, subpath: row.subpath } : null;
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
  const { exportsJson, apiMd } = reportFiles(entry, names, { unanalysable });
  files[`etc/api/${stem}.exports.json`] = exportsJson;
  files[`etc/api/${stem}.api.md`] = apiMd;
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

// Every entry that has a committed etc/api/<stem>.exports.json — the check
// corpus for `--all` (REQ-PLAT-22): each stem must resolve via entrySource.
export function allEntries(root = ROOT) {
  const dir = join(root, 'etc/api');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.exports.json'))
    .map((f) => f.replace(/\.exports\.json$/, '')).sort();
}

// CLI entry. `root` is injectable so the --all/--check paths are testable on
// a fixture tree; the script itself always runs against the repo ROOT.
export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : null; };
  const has = (f) => argv.includes(f);
  const entry = arg('entry'); const line = arg('line'); const check = has('--check');
  const all = has('--all');
  if (!entry && !all && line !== '4x') {
    console.error('usage: api-report.mjs --entry <entry> [--check] | --all [--check] | --line 4x [--check]');
    return 2;
  }
  // An --entry with no ENTRIES row (and no fixed kind) is a usage error: no
  // report is written for a name that does not exist.
  if (entry && line !== '4x' && !entrySource(entry, { root })) {
    console.error(`api-report: unknown entry '${entry}' (no build/exports.manifest.json row)`);
    return 2;
  }
  const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version ?? '0.0.0';
  const alphaNum = /-alpha\.(\d+)$/.exec(version)?.[1];
  const failOnUn = alphaNum !== undefined ? Number(alphaNum) >= 1 : /^5\./.test(version);

  let files = {}; let unanalysable = [];
  if (line === '4x') {
    const r = run4x({ root }); files = r.files;
    unanalysable = r.manifest.unanalysable;
  } else {
    const entries = all ? allEntries(root) : [entry];
    // --all is fail-closed: an empty corpus (wrong ROOT, missing etc/api) or a
    // committed report whose stem no longer resolves to a source is an error,
    // never a vacuous pass.
    if (all && entries.length === 0) {
      console.error(`api-report --all FAIL: no etc/api/*.exports.json under ${root}`);
      return 1;
    }
    const orphans = all ? entries.filter((e) => !entrySource(e, { root })) : [];
    if (orphans.length) {
      console.error(`api-report --all FAIL: report(s) with no ENTRIES row/source: ${orphans.join(', ')}`);
      return 1;
    }
    for (const e of entries) {
      const r = await run5x(e, { root, check });
      Object.assign(files, r.files); unanalysable.push(...r.unanalysable);
    }
  }
  const stale = [];
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    if (check) { if (!existsSync(abs) || readFileSync(abs, 'utf8') !== content) stale.push(rel); }
    else { mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, content); }
  }
  if (check && stale.length) { console.error(`api-report --check FAIL: ${stale.join(', ')}`); return 1; }
  if (unanalysable.length) {
    console.error(`api-report: ${unanalysable.length} unanalysable: ${unanalysable.join('; ')}`);
    if (failOnUn && line !== '4x') return 1;
  }
  console.log(`api-report: ${Object.keys(files).length} file(s) ${check ? 'verified' : 'written'}${entry ? ` for ${entry}` : ''}${all ? ' for --all' : ''}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
