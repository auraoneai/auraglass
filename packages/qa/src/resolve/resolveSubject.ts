/* REQ-QUAL-01 One subject resolver (QUAL, S-41/S-55). This module is the only code that maps a
   subject to story ids. A subject is `parameters.ag.subject` — a ComponentMeta.name from
   `src/**\/*.meta.ts` or a showcase id from `showcase/showcases.json`. There is no fuzzy matching:
   no title-leaf fallback, no case folding, no owner default. Unresolved input throws. */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { StoryKind, SubjectIndex } from '../../../../src/contracts/testing.ts';
import { loadComponentMetas, type MetaRecord } from './componentMetas.ts';

export type SubjectEntry = SubjectIndex['stories'][number];
export type SubjectOwner = SubjectEntry['owner'];

export const STORY_KINDS: readonly StoryKind[] = ['lab', 'component', 'matrix', 'scene', 'showcase'];
/** Kinds whose index/manifest membership is cross-checked in both directions (REQ-QUAL-01). */
export const CROSS_CHECKED_KINDS: readonly StoryKind[] = ['lab', 'scene', 'showcase', 'matrix'];
/** SHOWCASES file (REQ-QUAL-58, QUAL): `[{ "id": "<showcase-id>", ... }]`. */
export const SHOWCASES_FILE = 'showcase/showcases.json';

export class SubjectResolutionError extends Error {
  readonly code: 'unresolved-subject' | 'ambiguous-subject' | 'manifest-not-in-index' | 'index-not-in-manifest'
    | 'invalid-ag' | 'invalid-showcases' | 'missing-subject-index';
  constructor(code: SubjectResolutionError['code'], message: string) {
    super(`${code}: ${message}`);
    this.name = 'SubjectResolutionError';
    this.code = code;
  }
}

export interface SubjectUniverse {
  metas: ReadonlyMap<string, readonly MetaRecord[]>;
  showcases: ReadonlySet<string>;
}

export type ResolvedSubject =
  | { subject: string; kind: 'component'; owner: SubjectOwner; meta: MetaRecord }
  | { subject: string; kind: 'showcase'; owner: 'QUAL' };

export function parseShowcases(text: string, file = SHOWCASES_FILE): Set<string> {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch (e) {
    throw new SubjectResolutionError('invalid-showcases', `${file}: ${(e as Error).message}`);
  }
  const ids: unknown[] = Array.isArray(raw)
    ? raw.map((r) => (r && typeof r === 'object' ? (r as { id?: unknown }).id : undefined))
    : [];
  if (!Array.isArray(raw) || ids.some((id) => typeof id !== 'string' || !id)) {
    throw new SubjectResolutionError('invalid-showcases', `${file} must be an array of { "id": string, ... } rows`);
  }
  const set = new Set(ids as string[]);
  if (set.size !== ids.length) throw new SubjectResolutionError('invalid-showcases', `${file} repeats a showcase id`);
  return set;
}

/** Reads every ComponentMeta and the showcase registry under `root`. A missing registry means no showcases. */
export function loadSubjectUniverse(root: string): SubjectUniverse {
  const p = join(root, SHOWCASES_FILE);
  return {
    metas: loadComponentMetas(root),
    showcases: existsSync(p) ? parseShowcases(readFileSync(p, 'utf8'), SHOWCASES_FILE) : new Set(),
  };
}

/** Maps a subject to its ComponentMeta or showcase id. Throws on unknown or ambiguous subjects. */
export function resolveSubjectName(subject: string, universe: SubjectUniverse): ResolvedSubject {
  const metas = universe.metas.get(subject) ?? [];
  const isShowcase = universe.showcases.has(subject);
  if (metas.length + (isShowcase ? 1 : 0) > 1) {
    const where = [...metas.map((m) => `${m.file} (${m.owner})`), ...(isShowcase ? [SHOWCASES_FILE] : [])];
    throw new SubjectResolutionError('ambiguous-subject', `'${subject}' is declared ${where.length} times: ${where.join(', ')}`);
  }
  const meta = metas[0];
  if (meta) return { subject, kind: 'component', owner: meta.owner, meta };
  if (isShowcase) return { subject, kind: 'showcase', owner: 'QUAL' };
  throw new SubjectResolutionError('unresolved-subject',
    `'${subject}' is neither a ComponentMeta.name in src/**/*.meta.ts nor a showcase id in ${SHOWCASES_FILE}`);
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
    with that kind. Throws listing every mismatch. */
export function verifyManifestAgainstIndex(manifest: SubjectIndex, index: StorybookIndex): void {
  const stories = new Map(Object.values(index.entries).filter((e) => e.type === 'story').map((e) => [e.id, e]));
  const byId = new Map(manifest.stories.map((s) => [s.id, s]));
  const missingFromIndex: string[] = [];
  const missingFromManifest: string[] = [];
  for (const s of manifest.stories) {
    if (CROSS_CHECKED_KINDS.includes(s.kind) && !stories.has(s.id)) missingFromIndex.push(`${s.id} (${s.kind})`);
  }
  for (const e of stories.values()) {
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
