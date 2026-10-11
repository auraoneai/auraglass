#!/usr/bin/env node
/* scripts/qual/remote/build-bundle.mjs — REQ-QUAL-67 offline certification bundle for `.ag-aws-remote` workers (QUAL, FIN-425).

   The AWS runner VPC has no egress (runtime-remote E17: the egress CA expired 2026-09-27; offline bundle + S3 worked),
   so a worker gets everything it needs in one bundle:
     bundle/storybook-static/            this pipeline's Storybook build
     bundle/package/<aura-glass-*.tgz>   the tarball under test
     bundle/repo/                        certification/, packages/qa/, scripts/qual/, src/contracts/, fragments/,
                                         contracts/, tests/perf/harness/, package.json, tsconfig.json
     bundle/repo/node_modules/           cert-only node_modules: the dependency closure of every bare import in bundle/repo
                                         plus @playwright/test and esbuild
     bundle/qa-build/lane-runner.mjs     the packages/qa lane runner, prebuilt with esbuild
     bundle/browsers/                    the three Playwright browser builds (chromium*, firefox*, webkit*, + ffmpeg)
     bundle/tools/tesseract, bundle/tessdata/eng.traineddata
     bundle/bundle.manifest.json         { gitSha, imageDigest, files: [{ path, sha256, bytes }], links }
     bundle/bundle.sha256                the same hashes in sha256sum format (worker-entry.sh verifies with sha256sum -c)
   and packs it as <out>/auraglass-cert-bundle-<sha12>.tar.gz. Every input is required; a missing one exits 1 naming it.

   node scripts/qual/remote/build-bundle.mjs --out <dir> [--storybook <dir>] [--tarball <tgz>] [--browsers <dir>]
     [--tesseract <bin>] [--tessdata <dir>] [--image-digest sha256:<hex>] [--sha <git sha>] [--root <repo>] [--no-tar]
   Defaults: storybook-static, $AURAGLASS_TARBALL, $PLAYWRIGHT_BROWSERS_PATH (else /ms-playwright), `tesseract` on PATH,
   $TESSDATA_PREFIX, the digest of $CI_JOB_IMAGE (name@sha256:…) or $AG_IMAGE_DIGEST, $CI_COMMIT_SHA or git HEAD.
   Uploading the bundle (S3) and launching the worker are the gated runner's (skill auraone-remote-run), not this script's. */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, readlinkSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { basename, delimiter, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const REPO_PATHS = Object.freeze({
  required: ['certification', 'packages/qa', 'scripts/qual', 'src/contracts', 'package.json'],
  optional: ['fragments', 'contracts', 'tests/perf/harness', 'tsconfig.json'],
});
export const ALWAYS_MODULES = Object.freeze(['@playwright/test', 'esbuild']);
export const BROWSER_DIRS = Object.freeze({ required: [/^chromium-\d+$/, /^firefox-\d+$/, /^webkit-\d+$/], optional: [/^chromium_headless_shell-\d+$/, /^ffmpeg-\d+$/] });
const SKIP = /(^|\/)(node_modules|\.git|\.artifacts|dist|storybook-static)(\/|$)/;
const BUILTINS = new Set(['assert', 'buffer', 'child_process', 'crypto', 'events', 'fs', 'http', 'https', 'module', 'net', 'os', 'path',
  'perf_hooks', 'process', 'readline', 'stream', 'timers', 'tls', 'url', 'util', 'v8', 'vm', 'worker_threads', 'zlib']);

const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

export function parseArgs(argv, env = process.env) {
  const o = { out: null, storybook: 'storybook-static', tarball: env.AURAGLASS_TARBALL || null, browsers: env.PLAYWRIGHT_BROWSERS_PATH || '/ms-playwright',
    tesseract: null, tessdata: env.TESSDATA_PREFIX || null, imageDigest: null, sha: env.CI_COMMIT_SHA || null, root: null, tar: true };
  const map = { '--out': 'out', '--storybook': 'storybook', '--tarball': 'tarball', '--browsers': 'browsers', '--tesseract': 'tesseract',
    '--tessdata': 'tessdata', '--image-digest': 'imageDigest', '--sha': 'sha', '--root': 'root' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--no-tar') { o.tar = false; continue; }
    if (!map[a]) throw new Error(`unknown argument ${a}`);
    const v = argv[++i];
    if (!v || v.startsWith('--')) throw new Error(`${a} needs a value`);
    o[map[a]] = v;
  }
  if (!o.out) throw new Error('--out <dir> is required');
  o.imageDigest ??= env.CI_JOB_IMAGE?.match(/@(sha256:[0-9a-f]{64})$/)?.[1] ?? env.AG_IMAGE_DIGEST ?? null;
  return o;
}

/** Bare package specifiers imported by .ts/.tsx/.mjs/.js/.cjs files under `dir` (node: builtins excluded). */
export function bareImports(dir) {
  const out = new Set();
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const rel = p.split(sep).join('/');
      if (SKIP.test(rel)) continue;
      const st = lstatSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.(ts|tsx|mts|mjs|js|cjs)$/.test(name) && !/\.d\.m?ts$/.test(name)) {
        const src = readFileSync(p, 'utf8');
        for (const m of src.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|^\s*import\s+)['"]([^'"./][^'"]*)['"]/gm)) {
          const spec = m[1];
          if (spec.startsWith('node:') || BUILTINS.has(spec.split('/')[0])) continue;
          const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
          if (/^[@a-z0-9][\w.@/-]*$/i.test(name)) out.add(name);
        }
      }
    }
  };
  if (existsSync(dir)) walk(dir);
  return [...out].sort();
}

/** Installed package dir for `name` as resolved from `fromDir` (nested node_modules first, then upwards to `root`). */
function packageDir(name, fromDir, root) {
  let d = fromDir;
  for (;;) {
    const cand = join(d, 'node_modules', name);
    if (existsSync(join(cand, 'package.json'))) return cand;
    if (resolve(d) === resolve(root) || dirname(d) === d) return null;
    d = dirname(d);
  }
}

/** Dependency closure (dependencies + optionalDependencies + installed peerDependencies) of `roots` in root/node_modules.
    Returns repo-relative package dirs; throws naming the missing root packages. */
export function moduleClosure(root, roots) {
  const dirs = new Set();
  const missing = [];
  const visit = (name, fromDir, required) => {
    const dir = packageDir(name, fromDir, root);
    if (!dir) { if (required) missing.push(name); return; }
    const rel = relative(root, dir).split(sep).join('/');
    if (dirs.has(rel)) return;
    dirs.add(rel);
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    for (const d of Object.keys(pkg.dependencies ?? {})) visit(d, dir, true);
    for (const d of Object.keys(pkg.optionalDependencies ?? {})) visit(d, dir, false);
    for (const d of Object.keys(pkg.peerDependencies ?? {})) visit(d, dir, false);
  };
  for (const r of roots) visit(r, root, true);
  if (missing.length) throw new Error(`node_modules missing: ${[...new Set(missing)].join(', ')} (run npm ci first)`);
  // A package nested inside another package's node_modules is copied with its parent.
  return [...dirs].sort().filter((d, _i, all) => !all.some((p) => p !== d && d.startsWith(`${p}/`)));
}

function which(bin, env) {
  for (const d of (env.PATH ?? '').split(delimiter)) if (d && existsSync(join(d, bin))) return join(d, bin);
  return null;
}

/** Every regular file (sha256, bytes) and symlink under `dir`, sorted, paths relative to `dir`. */
export function hashTree(dir, exclude = new Set()) {
  const files = [];
  const links = [];
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      const rel = relative(dir, p).split(sep).join('/');
      if (exclude.has(rel)) continue;
      const st = lstatSync(p);
      if (st.isSymbolicLink()) links.push({ path: rel, target: readlinkSync(p) });
      else if (st.isDirectory()) walk(p);
      else if (st.isFile()) files.push({ path: rel, sha256: sha256(p), bytes: st.size });
    }
  };
  walk(dir);
  return { files, links };
}

export async function buildBundle(o, env = process.env) {
  const root = resolve(o.root ?? join(dirname(fileURLToPath(import.meta.url)), '../../..'));
  const at = (p) => resolve(root, p);
  const problems = [];
  const sha = o.sha ?? (() => { try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } })();
  if (!sha || !/^[0-9a-f]{7,40}$/.test(sha)) problems.push('git SHA (--sha / CI_COMMIT_SHA / git HEAD)');
  if (!o.imageDigest || !/^sha256:[0-9a-f]{64}$/.test(o.imageDigest)) problems.push('image digest sha256:<64 hex> (--image-digest, CI_JOB_IMAGE pinned by digest, or AG_IMAGE_DIGEST)');
  const storybook = at(o.storybook);
  if (!existsSync(join(storybook, 'index.json'))) problems.push(`Storybook build ${o.storybook}/index.json`);
  const tarball = o.tarball ? at(o.tarball) : null;
  if (!tarball || !existsSync(tarball) || !tarball.endsWith('.tgz')) problems.push(`package tarball (--tarball / AURAGLASS_TARBALL)${o.tarball ? `: ${o.tarball}` : ''}`);
  for (const p of REPO_PATHS.required) if (!existsSync(at(p))) problems.push(`repository path ${p}`);
  const browsers = resolve(o.browsers);
  const browserEntries = existsSync(browsers) ? readdirSync(browsers) : [];
  const pickedBrowsers = [];
  for (const re of BROWSER_DIRS.required) {
    const hit = browserEntries.filter((n) => re.test(n));
    if (!hit.length) problems.push(`Playwright browser build ${re.source} in ${o.browsers}`);
    pickedBrowsers.push(...hit);
  }
  for (const re of BROWSER_DIRS.optional) pickedBrowsers.push(...browserEntries.filter((n) => re.test(n)));
  const tesseract = o.tesseract ? resolve(o.tesseract) : which('tesseract', env);
  if (!tesseract || !existsSync(tesseract)) problems.push('tesseract binary (--tesseract or on PATH)');
  const traineddata = o.tessdata ? join(resolve(o.tessdata), 'eng.traineddata') : null;
  if (!traineddata || !existsSync(traineddata)) problems.push('eng.traineddata (--tessdata <dir> / TESSDATA_PREFIX)');
  let modules = [];
  if (!problems.length) {
    try {
      const roots = new Set(ALWAYS_MODULES);
      for (const p of [...REPO_PATHS.required, ...REPO_PATHS.optional]) if (existsSync(at(p)) && statSync(at(p)).isDirectory()) for (const m of bareImports(at(p))) roots.add(m);
      const self = JSON.parse(readFileSync(at('package.json'), 'utf8')).name;
      roots.delete(self);
      modules = moduleClosure(root, [...roots].sort());
    } catch (e) { problems.push(e.message); }
  }
  if (problems.length) return { ok: false, problems };

  const out = resolve(o.out);
  const bundle = join(out, 'bundle');
  rmSync(bundle, { recursive: true, force: true });
  mkdirSync(bundle, { recursive: true });
  const copy = (from, to) => cpSync(from, join(bundle, to), { recursive: true, verbatimSymlinks: true, filter: (src) => !/(^|[/\\])\.git([/\\]|$)/.test(src) });
  copy(storybook, 'storybook-static');
  copy(tarball, `package/${basename(tarball)}`);
  for (const p of [...REPO_PATHS.required, ...REPO_PATHS.optional]) if (existsSync(at(p))) copy(at(p), `repo/${p}`);
  for (const m of modules) copy(at(m), `repo/${m}`);
  for (const b of pickedBrowsers) copy(join(browsers, b), `browsers/${b}`);
  copy(tesseract, 'tools/tesseract');
  copy(traineddata, 'tessdata/eng.traineddata');
  // packages/qa build: the lane runner prebuilt (certification/run.mjs rebuilds the same entry with esbuild at run time)
  const { build } = await import('esbuild');
  const res = await build({ entryPoints: [at('packages/qa/src/evidence/laneRunner.ts')], bundle: true, write: false, format: 'esm', platform: 'node', packages: 'external', logLevel: 'silent' });
  mkdirSync(join(bundle, 'qa-build'), { recursive: true });
  writeFileSync(join(bundle, 'qa-build/lane-runner.mjs'), res.outputFiles[0].text);

  const meta = new Set(['bundle.manifest.json', 'bundle.sha256']);
  const { files, links } = hashTree(bundle, meta);
  const manifest = {
    version: 1, gitSha: sha, imageDigest: o.imageDigest, createdAt: new Date().toISOString(),
    tarball: basename(tarball), browsers: pickedBrowsers.sort(), modules: modules.length,
    totals: { files: files.length, bytes: files.reduce((n, f) => n + f.bytes, 0), links: links.length },
    files, links,
  };
  writeFileSync(join(bundle, 'bundle.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(bundle, 'bundle.sha256'), files.map((f) => `${f.sha256}  ${f.path}`).join('\n') + '\n');
  let archive = null;
  if (o.tar) {
    archive = join(out, `auraglass-cert-bundle-${sha.slice(0, 12)}.tar.gz`);
    const t = spawnSync('tar', ['-czf', archive, '-C', out, 'bundle'], { encoding: 'utf8' });
    if (t.status !== 0) return { ok: false, problems: [`tar failed: ${t.stderr}`] };
  }
  return { ok: true, problems: [], bundle, archive, manifest };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  let o;
  try { o = parseArgs(process.argv.slice(2)); } catch (e) { console.error(`build-bundle: ${e.message}`); process.exit(64); }
  buildBundle(o).then((r) => {
    if (!r.ok) { console.error(`build-bundle: missing inputs:\n  ${r.problems.join('\n  ')}`); process.exit(1); }
    console.log(`build-bundle: ${r.manifest.totals.files} files (${(r.manifest.totals.bytes / 1e6).toFixed(1)} MB), ${r.manifest.modules} packages, browsers ${r.manifest.browsers.join(', ')}`);
    console.log(`build-bundle: ${r.archive ?? r.bundle}`);
  }, (e) => { console.error(`build-bundle: crashed: ${e?.stack ?? e}`); process.exit(1); });
}
