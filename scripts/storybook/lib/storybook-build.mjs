/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): shared helpers for the Storybook build scripts
   (build.mjs, check-build-log.mjs, write-build-manifest.mjs, verify-fresh.mjs) and the
   tests/e2e/qual/storybook flows. Node built-ins only. */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const BUILD_MANIFEST = 'ag-build.json';
export const INDEX_FILE = 'index.json';
export const MANIFEST_KEYS = ['sha', 'dirty', 'builtAt', 'storybookVersion', 'packageVersion', 'storyCount', 'indexSha256'];
/** REQ-QUAL-56 budgets: storybook-static ≤60 MB excluding source maps; build ≤6 min. */
export const BUDGET = { maxBytesExcludingMaps: 60 * 1024 * 1024, maxBuildMs: 6 * 60 * 1000 };

/** The `.storybook/main.ts` `stories` globs (verbatim, §4.11) as walk roots + file patterns.
    tests/storybook/storybook-config.test.ts asserts this table equals main.ts. */
export const STORY_GLOBS = [
  '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)',
  '../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)',
  '../registry/**/*.stories.@(ts|tsx)', '../showcase/**/*.stories.@(ts|tsx)',
  '../certification/scenes/**/*.stories.@(ts|tsx)', '../.storybook/lab/**/*.stories.@(ts|tsx)',
];

export const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const toPosix = (p) => p.split(sep).join('/');

/** `../<dir>/**\/*.<ext>` → { dir, test } for the two glob shapes main.ts uses. */
export function parseStoryGlob(glob) {
  const m = /^\.\.\/(.+?)\/\*\*\/\*\.(mdx|stories\.@\(ts\|tsx\))$/.exec(glob);
  if (!m) throw new Error(`unsupported story glob: ${glob}`);
  const test = m[2] === 'mdx' ? (f) => f.endsWith('.mdx') : (f) => /\.stories\.tsx?$/.test(f);
  return { dir: m[1], kind: m[2] === 'mdx' ? 'docs' : 'stories', test };
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'storybook-static']);
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (d.isDirectory()) return SKIP_DIRS.has(d.name) ? [] : walk(join(dir, d.name));
    return d.isFile() ? [join(dir, d.name)] : [];
  });
}

/** Repo-relative `./<path>` of every file the main.ts globs match (Storybook's `importPath` form). */
export function storyFiles(root, globs = STORY_GLOBS) {
  const out = new Map();
  for (const g of globs) {
    const { dir, kind, test } = parseStoryGlob(g);
    for (const f of walk(join(root, dir))) {
      if (test(f)) out.set(`./${toPosix(relative(root, f))}`, kind);
    }
  }
  return out;
}

/** Parsed Storybook index.json (`{ v, entries }`). */
export function readIndex(dir) {
  const text = readFileSync(join(dir, INDEX_FILE));
  const index = JSON.parse(text.toString('utf8'));
  if (!index || typeof index !== 'object' || typeof index.entries !== 'object') {
    throw new Error(`${join(dir, INDEX_FILE)} is not a Storybook index (no "entries")`);
  }
  return { index, sha: sha256(text) };
}

export const storyEntries = (index) => Object.values(index.entries).filter((e) => e && e.type === 'story');

/** Bytes under `dir`, excluding `*.map` source maps. */
export function sizeExcludingMaps(dir) {
  return walk(dir).filter((f) => !f.endsWith('.map')).reduce((n, f) => n + statSync(f).size, 0);
}

export function gitSha(root) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
}

/** Tracked or untracked-but-not-ignored changes; [] for a clean tree. */
export function gitDirtyPaths(root) {
  const out = execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: root, encoding: 'utf8' });
  return out.split('\n').filter(Boolean).map((l) => l.slice(3));
}

export const isCi = (env = process.env) => env.CI === 'true' || env.GITLAB_CI === 'true';

/** The SHA a consumer expects the build to be from: explicit, else CI_COMMIT_SHA, else git HEAD. */
export function expectedSha(root, explicit, env = process.env) {
  return explicit || env.CI_COMMIT_SHA || gitSha(root);
}

/** REQ-QUAL-56 freshness rules over an already-read manifest and index text. Returns a list of problems ([] = fresh). */
export function freshnessProblems({ manifest, indexText, sha, requireClean }) {
  if (manifest === undefined || manifest === null) return [`${BUILD_MANIFEST} is missing; the Storybook build did not run write-build-manifest.mjs`];
  const problems = [];
  const missing = MANIFEST_KEYS.filter((k) => !(k in manifest));
  if (missing.length) problems.push(`${BUILD_MANIFEST} lacks ${missing.join(', ')}`);
  if (manifest.sha !== sha) problems.push(`${BUILD_MANIFEST} sha ${manifest.sha} ≠ SHA under test ${sha} (stale Storybook build)`);
  if (requireClean && manifest.dirty !== false) problems.push(`${BUILD_MANIFEST} records a dirty tree (dirty=${manifest.dirty}); CI builds must come from a clean checkout`);
  if (indexText === undefined || indexText === null) problems.push(`${INDEX_FILE} is missing`);
  else if (manifest.indexSha256 !== sha256(indexText)) problems.push(`${INDEX_FILE} sha256 ≠ ${BUILD_MANIFEST} indexSha256 (index changed after the manifest was written)`);
  return problems;
}

/** Reads `<dir>/ag-build.json` + `<dir>/index.json` and applies freshnessProblems. */
export function verifyFreshDir({ dir, sha, requireClean }) {
  const mPath = join(dir, BUILD_MANIFEST);
  const iPath = join(dir, INDEX_FILE);
  let manifest = null;
  if (existsSync(mPath)) {
    try { manifest = JSON.parse(readFileSync(mPath, 'utf8')); } catch (e) { return [`${mPath} is not JSON: ${e.message}`]; }
  }
  const indexText = existsSync(iPath) ? readFileSync(iPath) : null;
  return freshnessProblems({ manifest, indexText, sha, requireClean });
}

/** Parses `--flag value` pairs and bare `--flag` booleans. */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[a.slice(2)] = true;
    else { out[a.slice(2)] = next; i++; }
  }
  return out;
}
