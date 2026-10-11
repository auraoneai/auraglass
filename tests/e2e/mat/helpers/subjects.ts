/* REQ-MAT-65 (D.3-39): subject enumeration for every MAT catalogue-wide a11y
   spec. Subjects always come from the frozen S-40 `listSubjects()`; a MAT spec
   never hard-codes another stream's story ids. Owner attribution:
   - when the Storybook under test serves REPORTS.subjects (cert-manifest.json,
     written by QUAL from parameters.ag), the manifest's `owner` is used as is;
   - otherwise `listSubjects()` falls back to index.json and labels every entry
     PLAT, so the owner is resolved from the story's importPath through
     contracts/ownership.json (first matching row on the 5x line, the same
     resolution scripts/ci/verify-ownership.mjs uses).
   Each spec passes the S-40 `listSubjects` (tests/helpers) in explicitly, so
   the enumeration source is visible in the spec itself.
   Every failure message is prefixed `[<owner> <subject> <storyId>]` so the
   lane report attributes it to the subject's owner. An empty subject list is
   an error (fail closed), never a pass. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import picomatch from 'picomatch';
import { REPORTS } from '../../../../src/contracts/testing';
import type { SubjectIndex, StoryKind, ListSubjects } from '../../../../src/contracts/testing';

export type Owner = SubjectIndex['stories'][number]['owner'];
export interface Subject {
  id: string;
  subject: string;
  kind: StoryKind;
  tags: readonly string[];
  owner: Owner;
  /** where the owner came from: the QUAL subject manifest or contracts/ownership.json */
  ownerSource: 'cert-manifest' | 'ownership.json';
}

/* Playwright runs from the repo root (playwright.config.ts testDir ./tests). */
const ROOT = process.cwd();
const STREAM_OWNERS = new Set<Owner>(['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL']);

interface OwnershipRow { id: string; glob: string; owner: string; lines?: string[] }
let rowsCache: Array<OwnershipRow & { test: (p: string) => boolean }> | null = null;
function ownershipRows() {
  if (!rowsCache) {
    const rows = (JSON.parse(readFileSync(join(ROOT, 'contracts', 'ownership.json'), 'utf8')) as { rows: OwnershipRow[] }).rows;
    rowsCache = rows
      .filter((r) => !r.lines || r.lines.includes('5x'))
      .map((r) => ({ ...r, test: picomatch(r.glob, { dot: true }) }));
  }
  return rowsCache;
}

/** Stream that owns a repo path (first matching ownership.json row, default PLAT). */
export function ownerOfPath(path: string): Owner {
  const p = path.replace(/^\.\//, '');
  const row = ownershipRows().find((r) => r.test(p));
  const owner = (row?.owner ?? 'PLAT') as Owner;
  return STREAM_OWNERS.has(owner) ? owner : 'PLAT';
}

const storybookBase = () => process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';

async function manifestServed(): Promise<boolean> {
  const path = REPORTS.subjects.replace(/^storybook-static\//, '');
  const res = await fetch(`${storybookBase()}/${path}`).catch(() => null);
  return !!res && res.ok;
}

async function indexEntries(): Promise<Map<string, { importPath: string; type: string }>> {
  const res = await fetch(`${storybookBase()}/index.json`);
  if (!res.ok) throw new Error(`index.json not served by ${storybookBase()} (HTTP ${res.status})`);
  const raw = (await res.json()) as { entries?: Record<string, { id: string; importPath?: string; type?: string }> };
  return new Map(Object.values(raw.entries ?? {}).map((e) => [e.id, { importPath: e.importPath ?? '', type: e.type ?? 'story' }]));
}

let cache: Promise<Subject[]> | null = null;

/** Every story subject of the Storybook under test, owner-attributed. Throws when empty. */
export function allSubjects(listSubjects: ListSubjects): Promise<Subject[]> {
  if (!cache) {
    cache = (async () => {
      const stories = await listSubjects();
      if (!stories.length) throw new Error(`listSubjects() returned 0 subjects from ${storybookBase()}`);
      if (await manifestServed()) {
        return stories.map((s) => ({ ...s, ownerSource: 'cert-manifest' as const }));
      }
      // index.json fallback: docs entries are not renderable subjects.
      const entries = await indexEntries();
      return stories.filter((s) => entries.get(s.id)?.type === 'story').map((s) => {
        const importPath = entries.get(s.id)!.importPath;
        if (!importPath) throw new Error(`story ${s.id} has no importPath in index.json; owner cannot be attributed`);
        return { ...s, owner: ownerOfPath(importPath), ownerSource: 'ownership.json' as const };
      });
    })();
    cache.catch(() => { cache = null; }); // a failed enumeration is retried, never cached
  }
  return cache;
}

export type SweepScope = 'pr' | 'full';
/** MAT_A11Y_SCOPE=pr (default; PR pipelines): flagship subjects plus MAT's own;
    full (main/nightly/release): every subject in the index. */
export const sweepScope = (): SweepScope => (process.env.MAT_A11Y_SCOPE === 'full' ? 'full' : 'pr');

/** Subjects a catalogue-wide MAT sweep iterates at the current scope (docs pages excluded). */
export async function sweepSubjects(listSubjects: ListSubjects, scope: SweepScope = sweepScope()): Promise<Subject[]> {
  const all = (await allSubjects(listSubjects)).filter((s) => !s.tags.includes('no-cert'));
  const picked = scope === 'full' ? all : all.filter((s) => s.tags.includes('flagship') || s.owner === 'MAT');
  if (!picked.length) throw new Error(`no subjects for MAT a11y sweep at scope=${scope}`);
  return picked;
}

/** One representative story per subject name (States, then Playground, then the first). */
export function onePerSubject(subjects: readonly Subject[]): Subject[] {
  const by = new Map<string, Subject[]>();
  for (const s of subjects) by.set(`${s.owner}:${s.subject}`, [...(by.get(`${s.owner}:${s.subject}`) ?? []), s]);
  return [...by.values()].map((list) =>
    list.find((s) => /--states$/.test(s.id)) ?? list.find((s) => /--playground$/.test(s.id)) ?? list[0]!);
}

/** MAT's own fixture story (an A11y/* or MAT/* story): must be listed and owned by MAT. */
export async function matFixture(listSubjects: ListSubjects, storyId: string): Promise<Subject> {
  const s = (await allSubjects(listSubjects)).find((x) => x.id === storyId);
  if (!s) throw new Error(`MAT fixture story ${storyId} is not in listSubjects()`);
  if (s.owner !== 'MAT') throw new Error(`fixture ${storyId} resolves to owner ${s.owner}, not MAT — MAT specs use only MAT's own fixtures`);
  return s;
}

/** Owner-attributed failure label. */
export const tag = (s: Pick<Subject, 'owner' | 'subject' | 'id'>) => `[${s.owner} ${s.subject} ${s.id}]`;

/** Group failure strings by owner for the lane report annotation. */
export function byOwner(fails: ReadonlyArray<{ owner: Owner; msg: string }>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const f of fails) (out[f.owner] ??= []).push(f.msg);
  return out;
}
