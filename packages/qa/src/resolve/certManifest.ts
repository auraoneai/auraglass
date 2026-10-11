/* REQ-QUAL-01 (QUAL). Builds the SubjectIndex (S-55, REPORTS.subjects) from a built Storybook's
   index.json and each story's `parameters.ag`, read statically from the CSF source. Every story
   that declares `parameters.ag` must name a resolvable subject and a valid kind. Problems are
   collected and reported together. Offenders in other streams' story files that pre-date this gate
   sit in the expiring baseline (PRD-F §4.3 rule 3); a baselined story is left out of the manifest
   (it cannot be certified) and the baseline fails on new offenders, stale rows and at RC-1. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { storyNameFromExport, toId } from 'storybook/internal/csf';
import type { StoryKind, SubjectIndex } from '../../../../src/contracts/testing.ts';
import { baselineFailures, checkBaseline, type BaselineRow } from '../evidence/expiringBaseline.ts';
import { readCsfParameters, storyAg, type CsfParameters } from './csf.ts';
import {
  STORY_KINDS, SubjectResolutionError, resolveSubjectName, verifyManifestAgainstIndex,
  type StorybookIndex, type StorybookIndexEntry, type SubjectUniverse,
} from './resolveSubject.ts';

export const CERT_MANIFEST_BASELINE = 'packages/qa/baselines/cert-manifest.json';

export interface StoryProblem { storyId: string; file: string; code: string; subject: string; message: string }

export interface CertManifestResult {
  index: SubjectIndex;
  /** story ids without `parameters.ag` (not certifiable; REQ-QUAL-55's story-contract validator owns them) */
  unannotated: string[];
  /** story problems covered by a baseline row (not in the manifest) */
  baselined: StoryProblem[];
  /** every story problem found, baselined or not (input for baseline generation) */
  problems: StoryProblem[];
}

export class CertManifestError extends Error {
  readonly failures: string[];
  constructor(failures: string[]) {
    super(`cert-manifest: ${failures.length} failure(s)\n  - ${failures.join('\n  - ')}`);
    this.name = 'CertManifestError';
    this.failures = failures;
  }
}

const codeOf = (err: unknown): string => {
  const m = /^([a-z]+(?:-[a-z]+)+):/.exec((err as Error).message ?? '');
  return m ? m[1]! : 'error';
};

export const baselineKey = (r: { file: string; code: string; subject: string }): string => `${r.file}\u0000${r.code}\u0000${r.subject}`;

function exportNameOf(entry: StorybookIndexEntry, csf: CsfParameters): string {
  if (entry.exportName) return entry.exportName;
  const prefix = csf.meta.id ?? entry.title;
  const hits = [...csf.stories.keys()].filter((name) => toId(prefix, storyNameFromExport(name)) === entry.id);
  if (hits.length !== 1) {
    throw new Error(`story-export-not-found: ${entry.id} matches ${hits.length} exports of ${entry.importPath}`);
  }
  return hits[0]!;
}

export interface BuildOptions {
  /** baseline rows (parsed JSON); omit for no baseline */
  baseline?: unknown[];
  /** $AG_SCOPE; rows expire at 'release' */
  scope?: string;
  /** return the problems without failing (baseline generation only; never used by the gate) */
  collectOnly?: boolean;
}

/** `readSource(importPath)` returns the CSF text for a Storybook importPath ('./src/...'). */
export function buildCertManifest(sbIndex: StorybookIndex, universe: SubjectUniverse,
  readSource: (importPath: string) => string, opts: BuildOptions = {}): CertManifestResult {
  const problems: StoryProblem[] = [];
  const unannotated: string[] = [];
  const stories: SubjectIndex['stories'] = [];
  const cache = new Map<string, CsfParameters>();
  const entries = Object.values(sbIndex.entries).filter((e) => e.type === 'story').sort((a, b) => a.id.localeCompare(b.id));
  for (const e of entries) {
    const file = e.importPath.replace(/^\.\//, '');
    let subjectSeen = '';
    try {
      let csf = cache.get(e.importPath);
      if (!csf) {
        csf = readCsfParameters(file, readSource(e.importPath));
        cache.set(e.importPath, csf);
      }
      const ag = storyAg(csf, exportNameOf(e, csf));
      if (!ag) { unannotated.push(e.id); continue; }
      const { subject, kind } = ag;
      if (typeof subject !== 'string' || !subject) {
        throw new SubjectResolutionError('invalid-ag', `parameters.ag.subject must be a non-empty string`);
      }
      subjectSeen = subject;
      if (typeof kind !== 'string' || !STORY_KINDS.includes(kind as StoryKind)) {
        throw new SubjectResolutionError('invalid-ag', `parameters.ag.kind '${String(kind)}' is not one of ${STORY_KINDS.join('|')}`);
      }
      const resolved = resolveSubjectName(subject, universe);
      if (kind === 'showcase' && resolved.kind !== 'showcase') {
        throw new SubjectResolutionError('invalid-ag', `kind 'showcase' needs a showcase id subject, '${subject}' is a ComponentMeta`);
      }
      stories.push({ id: e.id, subject, kind: kind as StoryKind, tags: [...(e.tags ?? [])], owner: resolved.owner });
    } catch (err) {
      problems.push({ storyId: e.id, file, code: codeOf(err), subject: subjectSeen, message: (err as Error).message });
    }
  }

  const failures: string[] = [];
  let baselined: StoryProblem[] = [];
  if (opts.baseline) {
    const check = checkBaseline(opts.baseline, problems, (r: BaselineRow) => baselineKey({ file: r.file, code: r.code ?? '', subject: r.subject ?? '' }),
      baselineKey, opts.scope);
    const fresh = new Set(check.fresh);
    baselined = check.expired.length ? [] : problems.filter((p) => !fresh.has(p));
    failures.push(...baselineFailures('cert-manifest', check, (p) => `${p.storyId} (${p.file}): ${p.message}`));
  } else {
    failures.push(...problems.map((p) => `${p.storyId} (${p.file}): ${p.message}`));
  }

  const index: SubjectIndex = { version: 1, stories };
  // Baselined stories are known non-certifiable: exempt only them from the index→manifest direction.
  const exempt = new Set(baselined.map((p) => p.storyId));
  const checkedIndex: StorybookIndex = { ...sbIndex,
    entries: Object.fromEntries(Object.entries(sbIndex.entries).filter(([, e]) => !exempt.has(e.id))) };
  try { verifyManifestAgainstIndex(index, checkedIndex); } catch (err) { failures.push((err as Error).message); }
  if (failures.length && !opts.collectOnly) throw new CertManifestError(failures);
  return { index, unannotated, baselined, problems };
}

/** Reads CSF sources relative to the repository root (Storybook importPaths are './<path>'). */
export function repoSourceReader(root: string): (importPath: string) => string {
  return (importPath) => readFileSync(join(root, importPath.replace(/^\.\//, '')), 'utf8');
}
