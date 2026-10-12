/* REQ-QUAL-01 One subject resolver (QUAL, S-41/S-55). This module is the only code that maps a
   subject to story ids. A subject is `parameters.ag.subject` — one of, exactly:
   - a ComponentMeta.name from `src/**\/*.meta.ts` (S-31);
   - a showcase id from `showcase/showcases.json` (REQ-QUAL-58);
   - a registry item/block name from `registry/{items,blocks}/*\/registry-item.json`
     (registry blocks and items are live subjects, REQ-QUAL-04);
   - a scene subject `scene:<SceneId>` for a SceneId in S-42 (REQ-QUAL-08);
   - a Material Lab subject `lab:<id>` declared by a story under `.storybook/lab/**` (REQ-QUAL-53).
   There is no fuzzy matching: no title-leaf fallback, no case folding, no owner default.
   Unresolved input throws. */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { SCENES, type StoryKind, type SubjectIndex } from '../../../../src/contracts/testing.ts';
import { loadOwnerOf } from '../evidence/ownership.ts';
import { loadComponentMetas, type MetaRecord } from './componentMetas.ts';
import { readCsfParameters, storyAg } from './csf.ts';

export type SubjectEntry = SubjectIndex['stories'][number];
export type SubjectOwner = SubjectEntry['owner'];

export const STORY_KINDS: readonly StoryKind[] = ['lab', 'component', 'matrix', 'scene', 'showcase'];
/** Kinds whose index/manifest membership is cross-checked in both directions (REQ-QUAL-01). */
export const CROSS_CHECKED_KINDS: readonly StoryKind[] = ['lab', 'scene', 'showcase', 'matrix'];
/** SHOWCASES file (REQ-QUAL-58, QUAL): `[{ "id": "<showcase-id>", ... }]`. */
export const SHOWCASES_FILE = 'showcase/showcases.json';

export class SubjectResolutionError extends Error {
  readonly code: 'unresolved-subject' | 'ambiguous-subject' | 'manifest-not-in-index' | 'index-not-in-manifest'
    | 'invalid-ag' | 'invalid-showcases' | 'invalid-registry' | 'missing-subject-index';
  constructor(code: SubjectResolutionError['code'], message: string) {
    super(`${code}: ${message}`);
    this.name = 'SubjectResolutionError';
    this.code = code;
  }
}

/** One registry-item.json under registry/items or registry/blocks: its `name` is the subject its stories declare. */
export interface RegistryRecord {
  name: string;
  owner: SubjectOwner;
  file: string;
}

export interface SubjectUniverse {
  metas: ReadonlyMap<string, readonly MetaRecord[]>;
  showcases: ReadonlySet<string>;
  registry: ReadonlyMap<string, readonly RegistryRecord[]>;
  /** `lab:<id>` subjects declared under `.storybook/lab/**` (REQ-QUAL-53); QUAL-owned. */
  lab: ReadonlySet<string>;
}

export type ResolvedSubject =
  | { subject: string; kind: 'component'; owner: SubjectOwner; meta: MetaRecord }
  | { subject: string; kind: 'showcase'; owner: 'QUAL' }
  | { subject: string; kind: 'showcase'; owner: SubjectOwner; registry: RegistryRecord }
  | { subject: string; kind: 'scene'; owner: 'QUAL' }
  | { subject: string; kind: 'lab'; owner: 'QUAL' };

export function parseShowcases(text: string, file = SHOWCASES_FILE): Set<string> {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch (e) {
    throw new SubjectResolutionError('invalid-showcases', `${file}: ${(e as Error).message}`);
  }
  // The registry is either a bare array of rows or G-26's `{ version, showcases: [rows] }` document (REQ-QUAL-58).
  const rows: unknown = raw && typeof raw === 'object' && !Array.isArray(raw) && 'showcases' in raw
    ? (raw as { showcases: unknown }).showcases
    : raw;
  const ids: unknown[] = Array.isArray(rows)
    ? rows.map((r) => (r && typeof r === 'object' ? (r as { id?: unknown }).id : undefined))
    : [];
  if (!Array.isArray(rows) || ids.some((id) => typeof id !== 'string' || !id)) {
    throw new SubjectResolutionError('invalid-showcases', `${file} must be an array of { "id": string, ... } rows (or { "showcases": [...] })`);
  }
  const set = new Set(ids as string[]);
  if (set.size !== ids.length) throw new SubjectResolutionError('invalid-showcases', `${file} repeats a showcase id`);
  return set;
}

const SUBJECT_OWNERS: readonly SubjectOwner[] = ['CMP', 'SURF', 'MAT', 'QUAL', 'PLAT'];
/** Registry trees whose per-directory registry-item.json names are subjects (REQ-QUAL-04). */
export const REGISTRY_DIRS = ['registry/items', 'registry/blocks'];
/** The Material Lab harness: `lab:` subjects are declared here and nowhere else (REQ-QUAL-53). */
export const LAB_DIR = '.storybook/lab';

/** Parses one registry-item.json. The owner is the item's own `meta.auraglass.owner` when it
    declares one, else the contracts/ownership.json owner of its path (injected as `ownerOf`);
    neither means the item does not declare an owner and loading fails. */
export function parseRegistryItem(text: string, file: string, ownerOf?: (path: string) => string): RegistryRecord {
  const bad = (why: string): never => { throw new SubjectResolutionError('invalid-registry', `${file}: ${why}`); };
  let raw: unknown;
  try { raw = JSON.parse(text); } catch (e) { return bad((e as Error).message); }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return bad('not an object');
  const r = raw as { name?: unknown; meta?: { auraglass?: { owner?: unknown } } };
  if (typeof r.name !== 'string' || !r.name) return bad('name must be a non-empty string');
  const declared = r.meta?.auraglass?.owner;
  const owner = typeof declared === 'string' && (SUBJECT_OWNERS as readonly string[]).includes(declared)
    ? declared
    : ownerOf?.(file);
  if (typeof owner !== 'string' || !(SUBJECT_OWNERS as readonly string[]).includes(owner)) {
    return bad(`no resolvable owner for '${r.name}' (meta.auraglass.owner or contracts/ownership.json)`);
  }
  return { name: r.name, owner: owner as SubjectOwner, file };
}

/** Every registry item/block under `root`, grouped by name (a repeated name is ambiguous). */
export function loadRegistrySubjects(root: string): Map<string, RegistryRecord[]> {
  let ownerOf: ((path: string) => string) | undefined;
  try { ownerOf = loadOwnerOf(root); } catch { ownerOf = undefined; }
  const out = new Map<string, RegistryRecord[]>();
  for (const dir of REGISTRY_DIRS) {
    const abs = join(root, dir);
    let entries: import('node:fs').Dirent[];
    try { entries = readdirSync(abs, { withFileTypes: true }); } catch { continue; }
    for (const d of entries.filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = `${dir}/${d.name}/registry-item.json`;
      const p = join(root, file);
      if (!existsSync(p)) continue;
      const rec = parseRegistryItem(readFileSync(p, 'utf8'), file, ownerOf);
      const list = out.get(rec.name);
      if (list) list.push(rec);
      else out.set(rec.name, [rec]);
    }
  }
  return out;
}

function walkStoryFiles(dir: string, out: string[]): void {
  let entries: import('node:fs').Dirent[];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const d of entries) {
    const p = join(dir, d.name);
    if (d.isDirectory()) walkStoryFiles(p, out);
    else if (d.isFile() && /\.stories\.tsx?$/.test(d.name)) out.push(p);
  }
}

/** Every `lab:` subject declared by the Material Lab harness stories themselves. A story outside
    the harness may reference one of these subjects; it may not invent a new `lab:` subject. */
export function loadLabSubjects(root: string): Set<string> {
  const files: string[] = [];
  walkStoryFiles(join(root, LAB_DIR), files);
  files.sort();
  const out = new Set<string>();
  for (const abs of files) {
    const file = relative(root, abs).split(sep).join('/');
    let csf;
    try { csf = readCsfParameters(file, readFileSync(abs, 'utf8')); } catch { continue; }
    for (const name of csf.stories.keys()) {
      try {
        const subject = storyAg(csf, name)?.subject;
        if (typeof subject === 'string' && subject.startsWith('lab:')) out.add(subject);
      } catch { /* an unreadable declaration is the cert gate's problem to report per story */ }
    }
  }
  return out;
}

/** Reads every ComponentMeta, the showcase registry, the registry items/blocks and the Material
    Lab declarations under `root`. A missing showcase registry means no showcases. */
export function loadSubjectUniverse(root: string): SubjectUniverse {
  const p = join(root, SHOWCASES_FILE);
  return {
    metas: loadComponentMetas(root),
    showcases: existsSync(p) ? parseShowcases(readFileSync(p, 'utf8'), SHOWCASES_FILE) : new Set(),
    registry: loadRegistrySubjects(root),
    lab: loadLabSubjects(root),
  };
}

/** Maps a subject to its declaration. Throws on unknown or ambiguous subjects. */
export function resolveSubjectName(subject: string, universe: SubjectUniverse): ResolvedSubject {
  const metas = universe.metas.get(subject) ?? [];
  const registry = universe.registry.get(subject) ?? [];
  const isShowcase = universe.showcases.has(subject);
  const isScene = subject.startsWith('scene:') && (SCENES as readonly string[]).includes(subject.slice('scene:'.length));
  const isLab = universe.lab.has(subject);
  const declared = metas.length + registry.length + (isShowcase ? 1 : 0) + (isScene ? 1 : 0) + (isLab ? 1 : 0);
  if (declared > 1) {
    const where = [
      ...metas.map((m) => `${m.file} (${m.owner})`),
      ...registry.map((r) => `${r.file} (${r.owner})`),
      ...(isShowcase ? [SHOWCASES_FILE] : []),
      ...(isScene ? ['src/contracts/testing.ts (S-42 SCENES)'] : []),
      ...(isLab ? [`${LAB_DIR}/** (QUAL)`] : []),
    ];
    throw new SubjectResolutionError('ambiguous-subject', `'${subject}' is declared ${where.length} times: ${where.join(', ')}`);
  }
  const meta = metas[0];
  if (meta) return { subject, kind: 'component', owner: meta.owner, meta };
  const item = registry[0];
  if (item) return { subject, kind: 'showcase', owner: item.owner, registry: item };
  if (isShowcase) return { subject, kind: 'showcase', owner: 'QUAL' };
  if (isScene) return { subject, kind: 'scene', owner: 'QUAL' };
  if (isLab) return { subject, kind: 'lab', owner: 'QUAL' };
  throw new SubjectResolutionError('unresolved-subject',
    `'${subject}' is neither a ComponentMeta.name in src/**/*.meta.ts, a showcase id in ${SHOWCASES_FILE}, `
    + `a registry item name in ${REGISTRY_DIRS.join('/** or ')}/**/registry-item.json, a scene subject `
    + `(scene:<SceneId>, S-42), nor a Material Lab subject declared in ${LAB_DIR}/**`);
}

/** Story ids of one subject in a SubjectIndex. Throws when the subject has no story. */
export function resolveSubject(index: SubjectIndex, subject: string, filter: { kind?: StoryKind } = {}): string[] {
  const ids = index.stories.filter((s) => s.subject === subject && (!filter.kind || s.kind === filter.kind)).map((s) => s.id);
  if (ids.length === 0) {
    throw new SubjectResolutionError('unresolved-subject',
      `subject '${subject}'${filter.kind ? ` (kind ${filter.kind})` : ''} has no story in the SubjectIndex`);
  }
  return ids;
}

/** ListSubjects filter semantics (S-40) over a SubjectIndex; the helper in tests/helpers wraps this. */
export function filterSubjects(index: SubjectIndex,
  filter: { tags?: readonly string[]; kind?: StoryKind; owner?: SubjectOwner } = {}): SubjectEntry[] {
  return index.stories.filter((s) =>
    (!filter.tags || filter.tags.every((t) => s.tags.includes(t)))
    && (!filter.kind || s.kind === filter.kind)
    && (!filter.owner || s.owner === filter.owner));
}

/** Validates a parsed cert-manifest.json; throws `missing-subject-index` on any shape error. */
export function parseSubjectIndex(raw: unknown, source = 'cert-manifest.json'): SubjectIndex {
  const bad = (why: string): never => { throw new SubjectResolutionError('missing-subject-index', `${source}: ${why}`); };
  if (!raw || typeof raw !== 'object') return bad('not an object');
  const r = raw as { version?: unknown; stories?: unknown };
  if (r.version !== 1) bad(`version must be 1, got ${String(r.version)}`);
  if (!Array.isArray(r.stories)) return bad('stories must be an array');
  for (const s of r.stories as Array<Record<string, unknown>>) {
    if (typeof s.id !== 'string' || typeof s.subject !== 'string' || !STORY_KINDS.includes(s.kind as StoryKind)
      || !Array.isArray(s.tags) || !['CMP', 'SURF', 'MAT', 'QUAL', 'PLAT'].includes(s.owner as string)) {
      bad(`malformed story row ${JSON.stringify(s).slice(0, 120)}`);
    }
  }
  return raw as SubjectIndex;
}

/** Fetches REPORTS.subjects from a served Storybook. No index.json fallback: a Storybook without a
    cert-manifest was not built by qual:build:storybook and cannot be certified. */
export async function fetchSubjectIndex(baseUrl: string, subjectsPath = 'storybook-static/cert-manifest.json'): Promise<SubjectIndex> {
  const rel = subjectsPath.replace(/^storybook-static\//, '');
  const url = `${baseUrl.replace(/\/$/, '')}/${rel}`;
  const res = await fetch(url);
  if (!res.ok) throw new SubjectResolutionError('missing-subject-index', `${url} returned HTTP ${res.status}`);
  return parseSubjectIndex(await res.json(), url);
}

// ---- Storybook index.json cross-check -------------------------------------------------------

export interface StorybookIndexEntry { id: string; title: string; name: string; importPath: string; type: 'story' | 'docs';
  tags?: string[]; exportName?: string }
export interface StorybookIndex { v: number; entries: Record<string, StorybookIndexEntry> }

/** Index kind tags: STORY_TAGS has 'lab', 'scene', 'showcase'; 'matrix' is accepted the same way. */
function taggedKind(e: StorybookIndexEntry): StoryKind | null {
  for (const k of CROSS_CHECKED_KINDS) if (e.tags?.includes(k)) return k;
  return null;
}

/** REQ-QUAL-01 mismatch rule for kinds lab/scene/showcase/matrix: every manifest story of those kinds is
    a story in index.json, and every index.json story tagged with one of those kinds is in the manifest
    with that kind. Stories tagged `no-cert` are fixtures that are never certification subjects
    (S-41 STORY_TAGS; e.g. the REQ-QUAL-35 perf fixtures keep the `lab` tag), so the
    index→manifest direction does not require them. Throws listing every mismatch. */
export function verifyManifestAgainstIndex(manifest: SubjectIndex, index: StorybookIndex): void {
  const stories = new Map(Object.values(index.entries).filter((e) => e.type === 'story').map((e) => [e.id, e]));
  const byId = new Map(manifest.stories.map((s) => [s.id, s]));
  const missingFromIndex: string[] = [];
  const missingFromManifest: string[] = [];
  for (const s of manifest.stories) {
    if (CROSS_CHECKED_KINDS.includes(s.kind) && !stories.has(s.id)) missingFromIndex.push(`${s.id} (${s.kind})`);
  }
  for (const e of stories.values()) {
    if (e.tags?.includes('no-cert')) continue;
    const k = taggedKind(e);
    if (!k) continue;
    const m = byId.get(e.id);
    if (!m || m.kind !== k) missingFromManifest.push(`${e.id} (tag ${k}${m ? `, manifest kind ${m.kind}` : ''})`);
  }
  if (missingFromIndex.length) {
    throw new SubjectResolutionError('manifest-not-in-index', `${missingFromIndex.length} manifest stor(ies) absent from index.json: ${missingFromIndex.join(', ')}`);
  }
  if (missingFromManifest.length) {
    throw new SubjectResolutionError('index-not-in-manifest', `${missingFromManifest.length} index.json stor(ies) absent from the manifest: ${missingFromManifest.join(', ')}`);
  }
}
