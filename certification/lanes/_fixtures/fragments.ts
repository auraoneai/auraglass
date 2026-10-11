/* certification/lanes/_fixtures/fragments.ts — QUAL (REQ-QUAL-12, contract §4.11 / S-50 `playwright` kind).
   Loads `fragments/playwright/<stream>.json` for certification/playwright.cert.config.ts and validates every project
   against PlaywrightProjectFragment (`{ name: '<stream>:<id>', testDir, testMatch?, use? }`). Accepted file shapes:
   a project array (contract), or an object of project arrays keyed by wave (SURF writes `{ W1: [...], W2: [...] }`);
   both are flattened in file order. The cert config appends only projects named `<stream>:cert-*`.

   A malformed `<stream>:cert-*` project throws (it would otherwise silently not run). Malformed non-cert projects are
   not cert projects; they are returned as `issues` attributed to the owning stream so the lane can report them.
   Duplicate cert project names inside one stream (two waves registering the same name) are disambiguated with the
   wave key (`surf:cert-media-sampling@W4`) and also reported, so both test dirs run. testDir is resolved against the
   repository root (fragments name repo-relative paths), never against certification/. */
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

export const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;
export type Stream = (typeof STREAMS)[number];
export const CERT_RE = /^(plat|mat|cmp|surf|qual):cert-[a-z0-9][a-z0-9-]*(@[A-Za-z0-9]+)?$/;

export interface CertProject { name: string; testDir: string; testMatch?: string; use?: Record<string, unknown> }
export interface FragmentIssue { stream: Stream; file: string; project: string; code: string; message: string }
export interface FragmentLoad { projects: CertProject[]; issues: FragmentIssue[] }

const ALLOWED_KEYS = new Set(['name', 'testDir', 'testMatch', 'use']);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Flattens the accepted file shapes into `[wave|null, entry]` pairs; throws on any other shape. */
function entriesOf(raw: unknown, file: string): Array<[string | null, unknown]> {
  if (Array.isArray(raw)) return raw.map((e) => [null, e]);
  if (isRecord(raw)) {
    const out: Array<[string | null, unknown]> = [];
    for (const [wave, list] of Object.entries(raw)) {
      if (!Array.isArray(list)) throw new Error(`${file}: key '${wave}' must be an array of PlaywrightProjectFragment`);
      for (const e of list) out.push([wave, e]);
    }
    return out;
  }
  throw new Error(`${file}: must be an array (or wave-keyed object) of PlaywrightProjectFragment`);
}

/** Shape errors for one entry (empty = valid). */
export function projectShapeErrors(entry: unknown, stream: Stream): string[] {
  if (!isRecord(entry)) return ['project is not an object'];
  const errors: string[] = [];
  for (const k of Object.keys(entry)) if (!ALLOWED_KEYS.has(k)) errors.push(`unknown key '${k}'`);
  if (typeof entry.name !== 'string' || !entry.name) errors.push('name must be a non-empty string');
  else if (!entry.name.startsWith(`${stream}:`)) errors.push(`name '${entry.name}' must start with '${stream}:' (PlaywrightProjectFragment.name)`);
  if (typeof entry.testDir !== 'string' || !entry.testDir) errors.push('testDir must be a non-empty string');
  else if (isAbsolute(entry.testDir) || entry.testDir.split(/[\\/]/).includes('..')) errors.push(`testDir '${entry.testDir}' must be repo-relative`);
  if ('testMatch' in entry && typeof entry.testMatch !== 'string') errors.push('testMatch must be a string');
  if ('use' in entry && !isRecord(entry.use)) errors.push('use must be an object');
  return errors;
}

export function loadCertProjects(root: string, streams: readonly Stream[] = STREAMS): FragmentLoad {
  const projects: CertProject[] = [];
  const issues: FragmentIssue[] = [];
  for (const stream of streams) {
    const file = `fragments/playwright/${stream}.json`;
    const abs = resolve(root, file);
    if (!existsSync(abs)) continue;
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(abs, 'utf8')); } catch (e) { throw new Error(`${file}: invalid JSON (${(e as Error).message})`); }
    const names = new Map<string, number>();
    for (const [wave, entry] of entriesOf(raw, file)) {
      const label = isRecord(entry) && typeof entry.name === 'string' ? entry.name : '(unnamed)';
      const isCert = typeof label === 'string' && /^[a-z]+:cert-/.test(label);
      const errors = projectShapeErrors(entry, stream);
      if (errors.length) {
        if (isCert) throw new Error(`${file}: cert project '${label}' is malformed: ${errors.join('; ')}`);
        issues.push({ stream, file, project: label, code: 'fragment-shape', message: errors.join('; ') });
        continue;
      }
      const p = entry as unknown as CertProject;
      if (!CERT_RE.test(p.name)) continue;
      let name = p.name;
      const n = names.get(p.name) ?? 0;
      names.set(p.name, n + 1);
      if (n > 0) {
        if (!wave) throw new Error(`${file}: duplicate cert project name '${p.name}'`);
        name = `${p.name}@${wave}`;
        issues.push({ stream, file, project: p.name, code: 'duplicate-cert-project', message: `'${p.name}' is registered more than once; the ${wave} entry runs as '${name}'` });
      }
      const out: CertProject = { name, testDir: resolve(root, p.testDir) };
      if (p.testMatch !== undefined) out.testMatch = p.testMatch;
      if (p.use !== undefined) out.use = p.use;
      projects.push(out);
    }
  }
  return { projects, issues };
}
