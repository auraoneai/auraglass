/* REQ-QUAL-04 / REQ-QUAL-12 (QUAL, FIN-429). The L6 capture plan: one entry per (subject-state × cell).

   Inputs are read by the lane from the same pipeline's Storybook build (never from another job's screenshots or JSON):
   `storybook-static/index.json`, `storybook-static/cert-manifest.json` (SubjectIndex, REPORTS.subjects), each story's
   static `parameters.ag` (S-41) and the subject's ComponentMeta (S-31) / showcase registry tier.

   Scope (PRD-QUAL §4.2 L6 column): pr = affected subjects + sentinel set at the PR-reduced matrix; main = every subject
   at the T2-reduced matrix; nightly / release = every subject at its own §4.3 set. */
import type { StoryStateDrive } from '../../../../src/contracts/testing';
import { BASE_STATE, cellId, type Cell } from './axes';
import { cellsFor, normalize, prune, type SubjectSet } from './prune';

export type LaneScope = 'pr' | 'main' | 'nightly' | 'release';

/** Story kinds certified by L6. `lab` stories are the Material Lab (REQ-QUAL-53, human tooling) and `scene` stories are
    the scene assets themselves (REQ-QUAL-08); neither is a capture subject. */
export const L6_KINDS = ['component', 'matrix', 'showcase'] as const;

export interface PlanStory { id: string; subject: string; kind: string; tags: readonly string[]; owner: string }

export interface PlanAg {
  states?: readonly StoryStateDrive[];
  refraction?: boolean;
  scenes?: readonly string[] | 'all';
  tier?: 'lightweight' | 'standard' | 'enhanced';
  axes?: { transparency?: readonly string[]; scheme?: readonly string[]; contrast?: readonly string[] };
}

export interface PlanMeta { tier: 'T0' | 'T1' | 'T2' | 'preview'; flagship?: number; material?: { refractionEligible?: boolean } }

export interface Sentinel { subject: string; story?: string; state?: string }

export interface PlanInput {
  scope: LaneScope;
  /** ids of `storybook-static/index.json` entries of type story (this pipeline's build) */
  indexIds: ReadonlySet<string>;
  stories: readonly PlanStory[];
  ag: ReadonlyMap<string, PlanAg | undefined>;
  metas: ReadonlyMap<string, PlanMeta>;
  showcaseTiers: ReadonlyMap<string, 'S1' | 'S2'>;
  /** null = every subject (no affected-subject list was supplied) */
  affected: ReadonlySet<string> | null;
  sentinels: readonly Sentinel[];
}

export interface PlanEntry {
  id: string;
  storyId: string;
  /** REQ-QUAL-04: the story this capture renders; always an id of this pipeline's index.json */
  sourceStoryId: string;
  subject: string;
  owner: string;
  kind: string;
  set: SubjectSet;
  matrix: SubjectSet;
  state: string;
  drive: StoryStateDrive['drive'];
  cell: Cell;
}

export interface PlanProblem { storyId: string; subject: string; owner: string; code: string; message: string }

export interface CapturePlan { entries: PlanEntry[]; problems: PlanProblem[]; pendingSentinels: Sentinel[] }

export class LiveSubjectError extends Error {
  readonly missing: string[];
  constructor(missing: string[]) {
    super(`live-subject: ${missing.length} capture source(s) are not stories of this pipeline's storybook-static/index.json: ${missing.join(', ')}`);
    this.name = 'LiveSubjectError';
    this.missing = missing;
  }
}

/** REQ-QUAL-04: every capture's `sourceStoryId` must be a story of the same pipeline's index.json. */
export function assertLiveSources(captures: ReadonlyArray<{ sourceStoryId: string }>, indexIds: ReadonlySet<string>): void {
  const missing = [...new Set(captures.map((c) => c.sourceStoryId).filter((id) => !indexIds.has(id)))].sort();
  if (missing.length) throw new LiveSubjectError(missing);
}

/** Which §4.3 subject set a story belongs to; throws `subject-set-unknown` when the inputs cannot decide. */
export function subjectSet(story: PlanStory, meta: PlanMeta | undefined, showcaseTier: 'S1' | 'S2' | undefined): SubjectSet {
  if (story.kind === 'showcase') {
    if (!showcaseTier) throw new Error(`subject-set-unknown: showcase '${story.subject}' has no tier in showcase/showcases.json`);
    return showcaseTier === 'S1' ? 'product-scene' : 's2-showcase';
  }
  if (!meta) throw new Error(`subject-set-unknown: no ComponentMeta named '${story.subject}' (src/**/*.meta.ts)`);
  if (story.subject === 'Surface') return 't0-surface';
  if (meta.tier === 'T0') return 't0-core';
  if (typeof meta.flagship === 'number') return 'flagship';
  return 't2';
}

function applyStoryAxes(cells: Cell[], ag: PlanAg | undefined, refractionEligible: boolean): Cell[] {
  let out = cells;
  if (ag?.scenes && ag.scenes !== 'all') {
    const allowed = new Set(ag.scenes);
    out = out.filter((c) => allowed.has(c.scene));
  }
  if (ag?.axes?.transparency) { const s = new Set(ag.axes.transparency); out = out.filter((c) => s.has(c.transparency)); }
  if (ag?.axes?.scheme) { const s = new Set(ag.axes.scheme); out = out.filter((c) => s.has(c.scheme)); }
  if (ag?.axes?.contrast) {
    const s = new Set(ag.axes.contrast);
    out = out.filter((c) => s.has(c.preference === 'contrast-more' ? 'more' : 'standard'));
  }
  if (ag?.tier) {
    const tier = ag.tier;
    out = prune(out.map((c) => normalize({ ...c, tier })), { refractionEligible });
  }
  return out;
}

function statesOf(story: PlanStory, ag: PlanAg | undefined): Array<{ name: string; drive: StoryStateDrive['drive'] }> {
  const out: Array<{ name: string; drive: StoryStateDrive['drive'] }> = [{ name: BASE_STATE, drive: undefined }];
  const seen = new Set([BASE_STATE]);
  for (const s of ag?.states ?? []) {
    if (!s || typeof s.name !== 'string' || !s.name) throw new Error(`invalid-state: ${story.id} has a parameters.ag.states entry without a name`);
    if (seen.has(s.name)) throw new Error(`invalid-state: ${story.id} declares state '${s.name}' twice (or uses the reserved '${BASE_STATE}')`);
    seen.add(s.name);
    out.push({ name: s.name, drive: s.drive });
  }
  return out;
}

function sentinelMatches(s: Sentinel, story: PlanStory, state: string): boolean {
  if (s.subject !== story.subject) return false;
  if (s.story && !story.id.endsWith(`--${s.story}`)) return false;
  if (s.state && s.state !== state) return false;
  return true;
}

export function buildCapturePlan(input: PlanInput): CapturePlan {
  const entries: PlanEntry[] = [];
  const problems: PlanProblem[] = [];
  const stories = input.stories
    .filter((s) => (L6_KINDS as readonly string[]).includes(s.kind) && !s.tags.includes('no-cert'))
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));
  const sentinelHit = new Set<Sentinel>();

  for (const story of stories) {
    const problem = (code: string, message: string) => problems.push({ storyId: story.id, subject: story.subject, owner: story.owner, code, message });
    if (!input.indexIds.has(story.id)) {
      problem('live-subject', `${story.id} is in cert-manifest.json but not in this pipeline's index.json`);
      continue;
    }
    const ag = input.ag.get(story.id);
    const meta = input.metas.get(story.subject);
    let set: SubjectSet;
    let states: ReturnType<typeof statesOf>;
    try {
      set = subjectSet(story, meta, input.showcaseTiers.get(story.subject));
      states = statesOf(story, ag);
    } catch (e) {
      const msg = (e as Error).message;
      problem(/^([a-z-]+):/.exec(msg)?.[1] ?? 'error', msg);
      continue;
    }
    const refractionEligible = ag?.refraction ?? meta?.material?.refractionEligible ?? false;
    const affected = input.affected === null || input.affected.has(story.subject);

    for (const st of states) {
      let matrix: SubjectSet;
      if (input.scope === 'pr') {
        const sentinel = input.sentinels.filter((s) => sentinelMatches(s, story, st.name));
        sentinel.forEach((s) => sentinelHit.add(s));
        if (!affected && sentinel.length === 0) continue;
        matrix = 'pr-reduced';
      } else if (input.scope === 'main') {
        matrix = 't2';
      } else {
        matrix = set;
      }
      const cells = applyStoryAxes(cellsFor(matrix, { refractionEligible }), ag, refractionEligible);
      if (cells.length === 0) {
        problem('empty-matrix', `${story.id} state '${st.name}': parameters.ag axes leave 0 cells of the ${matrix} matrix`);
        continue;
      }
      for (const cell of cells) {
        entries.push({
          id: cellId(story.id, cell, st.name), storyId: story.id, sourceStoryId: story.id, subject: story.subject, owner: story.owner,
          kind: story.kind, set, matrix, state: st.name, drive: st.drive, cell,
        });
      }
    }
  }
  const pendingSentinels = input.scope === 'pr' ? input.sentinels.filter((s) => !sentinelHit.has(s)) : [];
  const ids = new Set<string>();
  for (const e of entries) {
    if (ids.has(e.id)) throw new Error(`capture-plan: duplicate cell id ${e.id}`);
    ids.add(e.id);
  }
  return { entries, problems, pendingSentinels };
}
