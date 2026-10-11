/* REQ-QUAL-73 / REQ-FIN-111 L14 review records (QUAL tooling; the records themselves are the design reviewer's).
   A record is one JSON file per reviewed item under certification/review/records/ (FIN-H; this module never writes
   there), shaped by certification/schemas/review-record.schema.json and scored against
   certification/review/visual-rubric.md:
     { version: 1, reviewer, sha, item: { kind: 'subject-state' | 't0-matrix' | 'showcase', subject, state? },
       scores: { R1..R6, R7 (showcase only) } each an integer 1–4, notes, compositeSha256, reviewedAt }
   pass = every criterion ≥3 (so none is 1). Required items at RC-1: every flagship subject-state, the T0 matrix, the
   six S1 showcases and every subject changed by a baseline refresh. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const REVIEW_RECORDS_DIR = 'certification/review/records';
export const REVIEW_RECORD_SCHEMA = 'certification/schemas/review-record.schema.json';
export const CRITERIA = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'] as const;
export const SHOWCASE_ONLY = 'R7';
export const PASS_SCORE = 3;
const KINDS = ['subject-state', 't0-matrix', 'showcase'] as const;
const SHA_RE = /^[0-9a-f]{40}$/;
const SHA256_RE = /^[0-9a-f]{64}$/;
const DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

export type ReviewKind = (typeof KINDS)[number];
export type Criterion = (typeof CRITERIA)[number];
export interface ReviewItemRef { kind: ReviewKind; subject: string; state?: string }
export interface ReviewRecord {
  version: 1; reviewer: string; sha: string; item: ReviewItemRef;
  scores: Partial<Record<Criterion, number>>; notes: string; compositeSha256: string; reviewedAt: string;
}

/** kebab-case id of a ComponentMeta name or state (same rule as tests/a11y/manual/gen-matrix.mjs). */
export const kebab = (name: string): string => name
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
  .replace(/[^A-Za-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();

/** Stable id of a review item; also the record's file name without `.json` (records README). */
export function itemId(item: ReviewItemRef): string {
  if (item.kind === 't0-matrix') return 't0-matrix';
  if (item.kind === 'showcase') return `showcase-${item.subject}`;
  return `${kebab(item.subject)}-${kebab(item.state ?? '')}`;
}

/** Schema problems of one parsed record (empty = schema-valid). Mirrors review-record.schema.json; the schema test
    keeps both in step. */
export function recordProblems(raw: unknown): string[] {
  const p: string[] = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return ['record is not a JSON object'];
  const r = raw as Record<string, unknown>;
  const extra = Object.keys(r).filter((k) => !['version', 'reviewer', 'sha', 'item', 'scores', 'notes', 'compositeSha256', 'reviewedAt'].includes(k));
  if (extra.length) p.push(`unknown field(s) ${extra.join(', ')}`);
  if (r.version !== 1) p.push('version must be 1');
  if (typeof r.reviewer !== 'string' || r.reviewer.trim().length < 2) p.push('reviewer must name the design reviewer');
  if (typeof r.sha !== 'string' || !SHA_RE.test(r.sha)) p.push('sha must be a 40-hex commit SHA');
  if (typeof r.notes !== 'string') p.push('notes must be a string');
  if (typeof r.compositeSha256 !== 'string' || !SHA256_RE.test(r.compositeSha256)) p.push('compositeSha256 must be a 64-hex sha256');
  if (typeof r.reviewedAt !== 'string' || !DATE_TIME_RE.test(r.reviewedAt) || Number.isNaN(Date.parse(r.reviewedAt))) p.push('reviewedAt must be an ISO date-time');
  const item = r.item as Record<string, unknown> | undefined;
  let kind: ReviewKind | null = null;
  if (!item || typeof item !== 'object' || Array.isArray(item)) p.push('item must be an object');
  else {
    const ex = Object.keys(item).filter((k) => !['kind', 'subject', 'state'].includes(k));
    if (ex.length) p.push(`item has unknown field(s) ${ex.join(', ')}`);
    if (!(KINDS as readonly unknown[]).includes(item.kind)) p.push(`item.kind must be one of ${KINDS.join('|')}`);
    else kind = item.kind as ReviewKind;
    if (typeof item.subject !== 'string' || !item.subject) p.push('item.subject must be a non-empty string');
    if (kind === 'subject-state' && (typeof item.state !== 'string' || !item.state)) p.push('item.state is required for a subject-state');
    if (kind !== 'subject-state' && item.state !== undefined) p.push(`item.state is only allowed for a subject-state`);
    if (kind === 'showcase' && typeof item.subject === 'string' && !ID_RE.test(item.subject)) p.push('item.subject of a showcase must be its showcases.json id');
  }
  const scores = r.scores as Record<string, unknown> | undefined;
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) p.push('scores must be an object');
  else {
    const ex = Object.keys(scores).filter((k) => !(CRITERIA as readonly string[]).includes(k));
    if (ex.length) p.push(`scores has unknown criterion ${ex.join(', ')}`);
    for (const c of CRITERIA) {
      const required = c !== SHOWCASE_ONLY || kind === 'showcase';
      const v = scores[c];
      if (v === undefined) { if (required) p.push(`scores.${c} is required`); continue; }
      if (c === SHOWCASE_ONLY && kind !== 'showcase') { p.push(`scores.${c} ("reads as one hand") applies to S1 showcases only`); continue; }
      if (!Number.isInteger(v) || (v as number) < 1 || (v as number) > 4) p.push(`scores.${c} must be an integer 1–4`);
    }
  }
  return p;
}

/** Criteria scored below PASS_SCORE (a 1 or 2 fails the item). */
export function failingCriteria(rec: ReviewRecord): Criterion[] {
  return CRITERIA.filter((c) => rec.scores[c] !== undefined && (rec.scores[c] as number) < PASS_SCORE);
}

export interface LoadedRecord { file: string; raw: unknown; record: ReviewRecord | null; problems: string[] }

/** Reads every `*.json` under a records directory (README.md and other files are ignored). */
export function loadRecords(dir: string): LoadedRecord[] {
  let names: string[];
  try { names = readdirSync(dir).filter((n) => n.endsWith('.json') && statSync(join(dir, n)).isFile()).sort(); } catch { return []; }
  return names.map((n) => {
    const file = join(dir, n);
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { return { file, raw: null, record: null, problems: [`not JSON: ${(e as Error).message}`] }; }
    const problems = recordProblems(raw);
    const record = problems.length ? null : (raw as ReviewRecord);
    if (record && `${itemId(record.item)}.json` !== n) problems.push(`file name must be ${itemId(record.item)}.json`);
    return { file, raw, record: problems.length ? null : record, problems };
  });
}

export interface RequiredItemsInput {
  flagships: ReadonlyArray<{ name: string; states: readonly string[] | null | undefined }>;
  s1Showcases: readonly string[];
  /** subjects changed by a baseline refresh (REQ-QUAL-25), each reviewed as `<subject>-default` unless states known */
  changedSubjects?: readonly string[] | undefined;
}

/** Every review item required at RC-1. A flagship without a static `states` list is a problem (its items cannot be
    enumerated), never silently dropped. A flagship with an empty list is reviewed in its `default` state. */
export function requiredItems(input: RequiredItemsInput): { items: ReviewItemRef[]; problems: string[] } {
  const items = new Map<string, ReviewItemRef>();
  const problems: string[] = [];
  const add = (i: ReviewItemRef) => items.set(itemId(i), i);
  const statesOf = new Map(input.flagships.map((f) => [f.name, f.states]));
  for (const f of input.flagships) {
    if (f.states == null) { problems.push(`flagship ${f.name}: ComponentMeta.states is not a static string array; its review items cannot be enumerated`); continue; }
    for (const s of f.states.length ? f.states : ['default']) add({ kind: 'subject-state', subject: f.name, state: s });
  }
  add({ kind: 't0-matrix', subject: 't0-matrix' });
  for (const id of input.s1Showcases) add({ kind: 'showcase', subject: id });
  for (const s of input.changedSubjects ?? []) {
    const states = statesOf.get(s);
    for (const st of states?.length ? states : ['default']) add({ kind: 'subject-state', subject: s, state: st });
  }
  return { items: [...items.values()], problems };
}

export interface ReviewSummary {
  version: 1; sha: string; required: number; recorded: number; passed: number;
  missing: string[]; failing: Array<{ item: string; file: string; criteria: Criterion[] }>;
  invalid: Array<{ file: string; problems: string[] }>; unbound: Array<{ item: string; file: string; sha: string }>;
  compositeMismatch: Array<{ item: string; file: string; expected: string | null; actual: string }>;
  problems: string[]; verdict: 'pass' | 'fail' | 'incomplete';
}

/** Validates the reviewer's records against the schema, the RC SHA and (when given) the composites the reviewer saw.
    verdict: fail = an invalid, failing, mis-bound or composite-mismatched record; incomplete = a required item has no
    record; pass = every required item has a passing record bound to `sha`. */
export function summarizeReview(opts: {
  sha: string; records: readonly LoadedRecord[]; required: readonly ReviewItemRef[]; requiredProblems?: readonly string[];
  /** item id → composite sha256 from the composites index (composite.ts); omitted = not checked */
  composites?: ReadonlyMap<string, string>;
  /** REQ-QUAL-61: a record on an earlier SHA still binds when the subject's baselines and DOM snapshot have zero
      diffs since that SHA. Omitted = only records on `sha` bind. */
  unchangedSince?: ((item: ReviewItemRef, recordSha: string) => boolean) | undefined;
}): ReviewSummary {
  const invalid = opts.records.filter((r) => !r.record).map((r) => ({ file: r.file, problems: r.problems }));
  const byItem = new Map<string, LoadedRecord>();
  const problems = [...(opts.requiredProblems ?? [])];
  for (const r of opts.records) {
    if (!r.record) continue;
    const id = itemId(r.record.item);
    if (byItem.has(id)) problems.push(`two records for ${id}: ${byItem.get(id)!.file}, ${r.file}`);
    byItem.set(id, r);
  }
  const requiredIds = new Set(opts.required.map(itemId));
  for (const id of byItem.keys()) if (!requiredIds.has(id)) problems.push(`record ${id} matches no required review item`);
  const missing: string[] = [];
  const failing: ReviewSummary['failing'] = [];
  const unbound: ReviewSummary['unbound'] = [];
  const compositeMismatch: ReviewSummary['compositeMismatch'] = [];
  let recorded = 0;
  let passed = 0;
  for (const item of opts.required) {
    const id = itemId(item);
    const r = byItem.get(id);
    if (!r?.record) { missing.push(id); continue; }
    recorded++;
    const rec = r.record;
    let ok = true;
    if (rec.sha !== opts.sha && !opts.unchangedSince?.(item, rec.sha)) { unbound.push({ item: id, file: r.file, sha: rec.sha }); ok = false; }
    const low = failingCriteria(rec);
    if (low.length) { failing.push({ item: id, file: r.file, criteria: low }); ok = false; }
    if (opts.composites) {
      const expected = opts.composites.get(id) ?? null;
      if (expected !== rec.compositeSha256) { compositeMismatch.push({ item: id, file: r.file, expected, actual: rec.compositeSha256 }); ok = false; }
    }
    if (ok) passed++;
  }
  const bad = invalid.length || failing.length || unbound.length || compositeMismatch.length || problems.length;
  return {
    version: 1, sha: opts.sha, required: opts.required.length, recorded, passed, missing, failing, invalid, unbound, compositeMismatch, problems,
    verdict: bad ? 'fail' : missing.length ? 'incomplete' : 'pass',
  };
}
