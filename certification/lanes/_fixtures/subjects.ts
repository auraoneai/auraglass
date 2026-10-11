/* FIN-G lane fixture (G-18, REQ-QUAL-21..23): subject enumeration for the
   SSR, overlay-stacking, engine and motion lanes.

   Subjects come only from the Storybook under test (S-40 listSubjects, which
   reads REPORTS.subjects / index.json); story file paths come from that
   build's index.json. Stories tagged `no-cert` (the QUAL negative fixtures
   in stories/qual/fixtures/**) are never certification subjects — the lanes
   address them by id, as negative controls. */
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { listSubjects } from '../../../tests/helpers';
import type { ComponentMeta } from '../../../src/contracts/components';
import type { SubjectIndex } from '../../../src/contracts/testing';
import { pendingOrFail } from './pending';
import { ROOT } from './root';

export { ROOT };
export const STORYBOOK_URL = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';

export type Subject = SubjectIndex['stories'][number];

export interface IndexEntry {
  id: string;
  title: string;
  name: string;
  importPath: string;
  exportName?: string;
  tags: string[];
  type: 'story' | 'docs';
}

let indexCache: Promise<Map<string, IndexEntry>> | null = null;

/** storybook-static/index.json of the build under test, keyed by story id. Throws when unreachable. */
export function storyIndex(): Promise<Map<string, IndexEntry>> {
  indexCache ??= (async () => {
    const res = await fetch(`${STORYBOOK_URL}/index.json`);
    if (!res.ok) throw new Error(`index.json not reachable at ${STORYBOOK_URL} (HTTP ${res.status}) — qual:build:storybook must run first`);
    const raw = (await res.json()) as { entries?: Record<string, IndexEntry> };
    const out = new Map<string, IndexEntry>();
    for (const e of Object.values(raw.entries ?? {})) if (e.type === 'story') out.set(e.id, e);
    if (out.size === 0) throw new Error(`index.json at ${STORYBOOK_URL} lists no stories`);
    return out;
  })();
  return indexCache;
}

/** Certification subjects (never `no-cert` fixtures). Empty → pending before release, fail at release. */
export async function laneSubjects(filter: Parameters<typeof listSubjects>[0] = {}): Promise<Subject[]> {
  const all = (await listSubjects(filter)).filter((s) => !s.tags.includes('no-cert'));
  if (all.length === 0) {
    pendingOrFail(`no subjects match ${JSON.stringify(filter)} in the subject index at ${STORYBOOK_URL}`,
      'stream stories with parameters.ag (CMP/SURF/MAT) + cert manifest (G-01)');
  }
  return all;
}

export interface SubjectStory extends Subject {
  importPath: string;
  exportName: string;
}

const toExportName = (name: string): string => name.replace(/(?:^|[^A-Za-z0-9]+)([A-Za-z0-9])/g, (_m, c: string) => c.toUpperCase());

/** One story per subject: the Playground story when present, else the first by id. */
export async function onePerSubject(subjects: Subject[]): Promise<SubjectStory[]> {
  const index = await storyIndex();
  const bySubject = new Map<string, Subject[]>();
  for (const s of subjects) bySubject.set(s.subject, [...(bySubject.get(s.subject) ?? []), s]);
  const out: SubjectStory[] = [];
  for (const [subject, list] of bySubject) {
    const sorted = [...list].sort((a, b) => a.id.localeCompare(b.id));
    const pick = sorted.find((s) => s.id.endsWith('--playground')) ?? sorted[0]!;
    const entry = index.get(pick.id);
    if (!entry) throw new Error(`subject ${subject}: story ${pick.id} is in the subject index but not in index.json`);
    out.push({ ...pick, importPath: entry.importPath, exportName: entry.exportName ?? toExportName(entry.name) });
  }
  return out.sort((a, b) => a.subject.localeCompare(b.subject));
}

/** A QUAL fixture story (stories/qual/fixtures/**) by id; it must be in the build. */
export async function fixtureStory(id: string): Promise<SubjectStory> {
  const entry = (await storyIndex()).get(id);
  if (!entry) throw new Error(`QUAL fixture story ${id} is missing from ${STORYBOOK_URL}/index.json`);
  return {
    id, subject: `fixture:${id}`, kind: 'component', tags: entry.tags, owner: 'QUAL',
    importPath: entry.importPath, exportName: entry.exportName ?? toExportName(entry.name),
  };
}

let metaCache: Promise<Map<string, ComponentMeta>> | null = null;

/** Every src/**\/*.meta.ts default export, keyed by ComponentMeta.name. */
export function componentMetas(): Promise<Map<string, ComponentMeta>> {
  metaCache ??= (async () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const d of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, d.name);
        if (d.isDirectory()) { if (d.name !== '__tests__' && d.name !== 'node_modules') walk(p); }
        else if (d.name.endsWith('.meta.ts')) files.push(p);
      }
    };
    walk(join(ROOT, 'src'));
    const out = new Map<string, ComponentMeta>();
    for (const f of files.sort()) {
      const mod = (await import(pathToFileURL(f).href)) as { default?: ComponentMeta };
      if (!mod.default?.name) throw new Error(`${relative(ROOT, f)} has no default ComponentMeta export`);
      out.set(mod.default.name, mod.default);
    }
    return out;
  })();
  return metaCache;
}
