#!/usr/bin/env node
// gen-claims.mjs — REQ-PLAT-104 (PLAT-389, REQ-FIN-43). Resolve every claim id
// from the release SHA's artifacts into apps/docs/generated/claims.json:
//   { sha, tag, ga, pending: [ids], claims: { id: { value, unit, source: { artifact, sha, path } } } }
//
// Custody rules (PRD REQ-PLAT-104, G-14):
//   - the build SHA is CI_COMMIT_SHA (GitLab), else `git rev-parse HEAD`;
//   - every artifact carries its producing SHA — a `sha` field (JSON), a
//     PACK_SHA line (pack.env), or a `<artifact>.sha` sidecar. A SHA different
//     from the build SHA always fails the run;
//   - committed tree sources (TREE_SOURCES) are read from the build checkout:
//     HEAD must be the build SHA and the file must be clean;
//   - PLAT's own artifacts missing or without a SHA always fail;
//   - a missing (or SHA-less) cross-stream artifact renders the claim as the
//     literal "pending" with no number, is listed under `pending`, and fails
//     only the GA build: CI_COMMIT_TAG matching v5.x.y (no pre-release);
//   - a present artifact whose value is null (e.g. a quickstart cell still on
//     the alpha-smoke fallback) is pending as well, and fails the GA build.
//
// Usage: node scripts/docs/gen-claims.mjs   (exit 1 on any error)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTIFACTS, CLAIMS_PATH, TREE_SOURCES } from './paths.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Artifact owner per ARTIFACTS key; 'PLAT' artifacts missing always fail. */
export const ARTIFACT_OWNER = {
  perfReport: 'QUAL', releaseVerdict: 'QUAL', visualClass: 'QUAL', subjects: 'QUAL',
  packEnv: 'PLAT', quickstartTiming: 'PLAT', sizeBudgets: 'PLAT', registryReport: 'PLAT',
  matContrast: 'MAT', matRecipes: 'MAT',
};

export const GA_TAG_RE = /^v5\.\d+\.\d+$/;

const kb = (bytes) => (typeof bytes === 'number' ? Math.round((bytes / 1024) * 10) / 10 : null);
const num = (v) => (v == null || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null);
const uniqueCount = (xs) => new Set(xs).size;

/* Claim table: id → source (an ARTIFACTS key or a TREE_SOURCES key), the
   human-readable path recorded in claims.json, and the extractor. Every
   value is read or counted from the producer's output — never a literal. */
export const CLAIM_SOURCES = {
  'flagship-count': {
    artifact: 'subjects', unit: 'flagships', path: 'stories[tags∋flagship].subject (unique)',
    value: (d) => (Array.isArray(d?.stories) ? uniqueCount(d.stories.filter((s) => s.tags?.includes('flagship')).map((s) => s.subject)) : null),
  },
  'component-count': {
    artifact: 'subjects', unit: 'components', path: 'stories[kind=component].subject (unique)',
    value: (d) => (Array.isArray(d?.stories) ? uniqueCount(d.stories.filter((s) => s.kind === 'component').map((s) => s.subject)) : null),
  },
  'root-value-exports': {
    tree: 'rootExports', unit: 'exports', path: 'exports.length',
    value: (d) => (Array.isArray(d?.exports) ? d.exports.length : null),
  },
  'button-gzip-kb': {
    artifact: 'sizeBudgets', unit: 'KB', path: 'rows[id=Button].measuredBytes / 1024',
    value: (d) => kb(d?.rows?.find((r) => r.id === 'Button')?.measuredBytes ?? null),
  },
  'styles-css-gzip-kb': {
    artifact: 'sizeBudgets', unit: 'KB', path: 'measured.stylesCssGzBytes / 1024',
    value: (d) => kb(d?.measured?.stylesCssGzBytes ?? null),
  },
  'tarball-mb': { artifact: 'packEnv', unit: 'MB', path: 'TARBALL_MB', value: (d) => num(d?.TARBALL_MB) },
  'contrast-min-regular': { artifact: 'matContrast', unit: ':1', path: 'summary.minRegular', value: (d) => num(d?.summary?.minRegular) },
  'contrast-min-large': { artifact: 'matContrast', unit: ':1', path: 'summary.minLarge', value: (d) => num(d?.summary?.minLarge) },
  'glass-recipes': { artifact: 'matRecipes', unit: 'recipes', path: 'independent-glass-recipes', value: (d) => num(d?.['independent-glass-recipes']) },
  'quickstart-seconds-next': { artifact: 'quickstartTiming', unit: 's', path: 'quickstart-seconds-next.value', value: (d) => num(d?.['quickstart-seconds-next']?.value) },
  'quickstart-seconds-vite': { artifact: 'quickstartTiming', unit: 's', path: 'quickstart-seconds-vite.value', value: (d) => num(d?.['quickstart-seconds-vite']?.value) },
  'registry-block-count': {
    artifact: 'registryReport', unit: 'blocks', path: 'items[kind=blocks,status=certified].length',
    value: (d) => (Array.isArray(d?.items) ? d.items.filter((i) => i.kind === 'blocks' && i.status === 'certified').length : null),
  },
  'codemod-transform-count': {
    tree: 'catalogue', unit: 'transforms', path: 'transforms.length',
    value: (d) => (Array.isArray(d?.transforms) ? d.transforms.length : null),
  },
  'pixel-gates-passed': {
    artifact: 'releaseVerdict', unit: 'gates', path: 'items[status=pass].length',
    value: (d) => (Array.isArray(d?.items) ? d.items.filter((i) => i.status === 'pass').length : null),
  },
};

function git(root, args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
}

/** Build SHA: CI_COMMIT_SHA, else the checkout HEAD. Never a placeholder. */
export function buildSha(root = ROOT, env = process.env) {
  return env.CI_COMMIT_SHA || git(root, ['rev-parse', 'HEAD']) || null;
}

function parseEnv(text) {
  const out = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

/** Read one ARTIFACTS entry → { state: 'missing' } | { data, sha } (sha may be null). */
export function readArtifact(root, key) {
  const rel = ARTIFACTS[key];
  const abs = join(root, rel);
  if (!existsSync(abs)) return { rel, state: 'missing' };
  const raw = readFileSync(abs, 'utf8');
  let data;
  try { data = rel.endsWith('.env') ? parseEnv(raw) : JSON.parse(raw); }
  catch (e) { return { rel, state: 'unreadable', reason: `${rel}: ${e.message}` }; }
  let sha = rel.endsWith('.env') ? data.PACK_SHA ?? null : typeof data?.sha === 'string' ? data.sha : null;
  if (!sha && existsSync(`${abs}.sha`)) sha = readFileSync(`${abs}.sha`, 'utf8').trim() || null;
  return { rel, state: 'present', data, sha };
}

/** Read one TREE_SOURCES entry from the build checkout (HEAD == build SHA, file clean). */
export function readTree(root, key, sha) {
  const rel = TREE_SOURCES[key];
  const abs = join(root, rel);
  if (!existsSync(abs)) return { rel, state: 'missing' };
  const head = git(root, ['rev-parse', 'HEAD']);
  if (!head) return { rel, state: 'unreadable', reason: `${rel}: not inside a git checkout (no tree custody)` };
  if (head !== sha) return { rel, state: 'foreign', sha: head };
  const dirty = git(root, ['status', '--porcelain', '--', rel]);
  if (dirty === null || dirty !== '') return { rel, state: 'unreadable', reason: `${rel}: modified or untracked at ${sha} (no tree custody)` };
  try { return { rel, state: 'present', data: JSON.parse(readFileSync(abs, 'utf8')), sha: head }; }
  catch (e) { return { rel, state: 'unreadable', reason: `${rel}: ${e.message}` }; }
}

export function generate({ root = ROOT, env = process.env, write = true } = {}) {
  const sha = buildSha(root, env);
  const tag = env.CI_COMMIT_TAG || null;
  const ga = Boolean(tag && GA_TAG_RE.test(tag));
  const claims = {}; const errors = []; const pending = [];
  if (!sha) errors.push('no build SHA: CI_COMMIT_SHA unset and no git HEAD');

  for (const [id, src] of Object.entries(CLAIM_SOURCES)) {
    const owner = src.tree ? 'PLAT' : ARTIFACT_OWNER[src.artifact];
    const art = src.tree ? readTree(root, src.tree, sha) : readArtifact(root, src.artifact);
    const base = { unit: src.unit, source: { artifact: art.rel, sha: art.sha ?? null, path: src.path } };
    const markPending = (reason) => {
      claims[id] = { value: null, ...base, state: 'pending', reason };
      pending.push(id);
      if (owner === 'PLAT' && reason.startsWith('missing')) errors.push(`${id}: PLAT artifact ${art.rel} missing`);
      else if (ga) errors.push(`${id}: pending on GA tag ${tag} (G-14): ${reason}`);
    };

    if (art.state === 'missing') { markPending(`missing ${art.rel}`); continue; }
    if (art.state === 'unreadable') { errors.push(`${id}: ${art.reason}`); claims[id] = { value: null, ...base, state: 'error' }; continue; }
    if (art.state === 'foreign' || (art.sha && sha && art.sha !== sha)) {
      errors.push(`${id}: ${art.rel} sha ${art.sha} != build ${sha}`);
      claims[id] = { value: null, ...base, state: 'error' };
      continue;
    }
    if (!art.sha) {
      if (owner === 'PLAT') { errors.push(`${id}: PLAT artifact ${art.rel} carries no sha (field, PACK_SHA or .sha sidecar)`); claims[id] = { value: null, ...base, state: 'error' }; }
      else markPending(`no sha custody on ${art.rel} (${owner})`);
      continue;
    }
    const value = src.value(art.data);
    if (value == null) { markPending(`${art.rel} has no value at ${src.path}`); continue; }
    claims[id] = { value, ...base };
  }

  const out = { sha, tag, ga, pending, claims };
  if (write) {
    const dest = join(root, CLAIMS_PATH);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
  }
  return { ...out, errors };
}

export function main({ root = ROOT, env = process.env } = {}) {
  const { claims, pending, errors, sha, ga } = generate({ root, env });
  console.log(`gen-claims: ${Object.keys(claims).length} ids at ${sha ?? '?'}${ga ? ' (GA tag)' : ''}, ${pending.length} pending, ${errors.length} errors`);
  for (const id of pending) console.log(`  pending ${id}: ${claims[id].reason}`);
  if (errors.length) { errors.forEach((e) => console.error(`  FAIL ${e}`)); return 1; }
  return 0;
}
if (process.argv[1]?.endsWith('gen-claims.mjs')) process.exitCode = main();
