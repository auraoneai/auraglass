/* scripts/qual/perf/lib.mjs — shared Node helpers for the QUAL perf tools (REQ-QUAL-37..41).
   Loads the TypeScript logic in packages/qa/src/perf/*.ts through esbuild (no ts-node), reads ComponentMeta identity
   fields statically (TypeScript compiler API), builds the src/** import graph and downloads same-project job artifacts
   with CI_JOB_TOKEN (GitLab jobs API, ref/tag form — the only artifact endpoint a job token may call). */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const loaded = new Map();
/** Imports packages/qa/src/perf/<name>.ts bundled by esbuild (node platform). */
export async function loadQa(name, root = ROOT) {
  const key = `${root}:${name}`;
  if (loaded.has(key)) return loaded.get(key);
  const { build } = await import('esbuild');
  const res = await build({ entryPoints: [join(root, 'packages/qa/src/perf', `${name}.ts`)], bundle: true, write: false, format: 'esm',
    platform: 'node', logLevel: 'silent', packages: 'external' });
  const file = join(mkdtempSync(join(tmpdir(), 'ag-qa-perf-')), `${name}.mjs`);
  writeFileSync(file, res.outputFiles[0].text);
  const mod = await import(pathToFileURL(file).href);
  loaded.set(key, mod);
  return mod;
}

export function rel(root, abs) { return relative(root, abs).split(sep).join('/'); }

function walk(dir, pred, out = []) {
  let names;
  try { names = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const d of names) {
    if (d.name === 'node_modules' || d.name.startsWith('.') || d.name === '__tests__') continue;
    const p = join(dir, d.name);
    if (d.isDirectory()) walk(p, pred, out); else if (d.isFile() && pred(d.name)) out.push(p);
  }
  return out;
}

/** Every ComponentMeta identity under <root>/src: { name, tier, flagship?, file, dir } (repo-relative paths). */
export async function readMetas(root = ROOT) {
  const ts = (await import('typescript')).default;
  const out = [];
  for (const file of walk(join(root, 'src'), (n) => n.endsWith('.meta.ts'))) {
    const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const visit = (n) => {
      if (ts.isObjectLiteralExpression(n)) {
        const lit = {};
        for (const p of n.properties) {
          if (!ts.isPropertyAssignment(p) || !(ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) continue;
          const v = p.initializer;
          if (ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) lit[p.name.text] = v.text;
          else if (ts.isNumericLiteral(v)) lit[p.name.text] = Number(v.text);
        }
        if (typeof lit.name === 'string' && typeof lit.tier === 'string' && typeof lit.owner === 'string') {
          out.push({ name: lit.name, tier: lit.tier, owner: lit.owner, ...(typeof lit.flagship === 'number' ? { flagship: lit.flagship } : {}),
            file: rel(root, file), dir: rel(root, dirname(file)) });
          return;
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

const SPEC_RE = /(?:import|export)\s[^'"`;]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g;
const EXTS = ['', '.ts', '.tsx', '.mts', '.js', '.mjs', '.css', '/index.ts', '/index.tsx', '/index.js'];

/** Relative-import graph over src/** (repo-relative paths). Package imports are leaves outside the graph. */
export function importGraph(root = ROOT) {
  const files = walk(join(root, 'src'), (n) => /\.(ts|tsx|mts|js|mjs|css)$/.test(n) && !/\.(test|spec|stories)\.[tj]sx?$/.test(n));
  const edges = new Map();
  for (const abs of files) {
    const text = readFileSync(abs, 'utf8');
    const deps = new Set();
    for (const m of text.matchAll(SPEC_RE)) {
      const spec = m[1] ?? m[2] ?? m[3];
      if (!spec || !spec.startsWith('.')) continue;
      const base = resolve(dirname(abs), spec.replace(/\.js$/, ''));
      const hit = EXTS.map((e) => base + e).find((p) => { try { return statSync(p).isFile(); } catch { return false; } });
      if (hit) deps.add(rel(root, hit));
    }
    edges.set(rel(root, abs), [...deps]);
  }
  return { edges };
}

export function git(args, root = ROOT) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function isAncestor(a, b, root = ROOT) {
  try { execFileSync('git', ['merge-base', '--is-ancestor', a, b], { cwd: root, stdio: 'ignore' }); return true; } catch { return false; }
}

/** Downloads one file from the latest successful `job` on `ref` (branch or tag) of this project, using CI_JOB_TOKEN.
    Returns { ok, status, body } — never throws on HTTP errors so callers decide pending vs fail. */
export async function fetchRefArtifact({ ref, job, path }) {
  const api = process.env.CI_API_V4_URL; const project = process.env.CI_PROJECT_ID; const token = process.env.CI_JOB_TOKEN;
  if (!api || !project || !token) return { ok: false, status: 0, body: null, reason: 'CI_API_V4_URL / CI_PROJECT_ID / CI_JOB_TOKEN not set (not a GitLab job)' };
  const url = `${api}/projects/${encodeURIComponent(project)}/jobs/artifacts/${encodeURIComponent(ref)}/raw/${path.split('/').map(encodeURIComponent).join('/')}?job=${encodeURIComponent(job)}`;
  const res = await fetch(url, { headers: { 'JOB-TOKEN': token } }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
  const body = await res.text();
  return { ok: res.ok, status: res.status, body: res.ok ? body : null, reason: res.ok ? null : `GET ${url.replace(/\?.*/, '')}?job=${job} → HTTP ${res.status}` };
}

export function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')); }

/** Files under `dirs` at commit `sha` that carry a seed marker (contract §6.1). [] = seed-free. */
export function seedMarkersAt(sha, dirs, root = ROOT) {
  const pattern = '@ag-contract-seed|contracts/seed[\'"]|data-ag-seed';
  try {
    return execFileSync('git', ['grep', '-l', '-E', pattern, sha, '--', ...dirs], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\n').filter(Boolean).map((l) => l.replace(`${sha}:`, ''));
  } catch (e) {
    if (e.status === 1) return [];                          // git grep: no match
    throw new Error(`git grep at ${sha} failed: ${e.message}`);
  }
}

/** Expands comma-separated paths/globs (node:fs globSync) relative to cwd. */
export async function expandInputs(list, cwd = process.cwd()) {
  const { globSync } = await import('node:fs');
  const out = [];
  for (const p of list.split(',').map((s) => s.trim()).filter(Boolean)) {
    const hits = /[*?[]/.test(p) ? globSync(p, { cwd }) : [p];
    for (const h of hits) out.push(resolve(cwd, h));
  }
  return [...new Set(out)].sort();
}
