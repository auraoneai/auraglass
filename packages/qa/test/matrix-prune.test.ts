/* G-12 / REQ-QUAL-12, REQ-QUAL-04 (FIN-429): §4.3 cell counts, pruning rules, cell ids, forcing, shard formula and the
   L6 capture plan (live subjects only, scope selection, sentinels). */
import { describe, expect, test } from '@jest/globals';
import {
  ENGINES, SCENES, axesKey, cellId, parseCellId, type Cell,
} from '../src/matrix/axes';
import { FORCED_COLORS_ENGINES, cellsFor, normalize, prune, pruneReason, SUBJECT_SETS } from '../src/matrix/prune';
import { forceFor, globalsParam, storyUrl } from '../src/matrix/force';
import { CAPTURES_PER_CELL, captureCount, shardCount, shardFromEnv, shardOf } from '../src/matrix/shard';
import {
  assertLiveSources, buildCapturePlan, LiveSubjectError, subjectSet,
  type PlanAg, type PlanInput, type PlanMeta, type PlanStory,
} from '../src/matrix/plan';

const ELIGIBLE = { refractionEligible: true };
const PLAIN = { refractionEligible: false };
const ids = (cells: Cell[]) => cells.map((c) => cellId('s--x', c));
const count = (cells: Cell[], f: (c: Cell) => boolean) => cells.filter(f).length;

describe('§4.3 cell counts per subject-state', () => {
  test.each([
    ['t0-surface', PLAIN, 180],
    ['t0-surface', ELIGIBLE, 180],
    ['flagship', PLAIN, 148],
    ['flagship', ELIGIBLE, 180],
    ['t0-core', PLAIN, 148],
    ['t0-core', ELIGIBLE, 180],
    ['t2', PLAIN, 29],
    ['product-scene', PLAIN, 96],
    ['s2-showcase', PLAIN, 29],
    ['pr-reduced', PLAIN, 24],
  ] as const)('%s (refraction-eligible=%p) = %i cells', (set, ctx, expected) => {
    const cells = cellsFor(set, ctx);
    expect(cells).toHaveLength(expected);
    expect(new Set(ids(cells)).size).toBe(expected);
  });

  test('T0 Surface = 96 core + 52 preference + 32 enhanced', () => {
    const cells = cellsFor('t0-surface', PLAIN);
    const isCore = (c: Cell) => c.transparency === 'glass' && c.preference === 'default' && c.tier === 'standard';
    expect(count(cells, isCore)).toBe(96);
    expect(count(cells, (c) => c.tier === 'enhanced')).toBe(32);
    expect(count(cells, (c) => !isCore(c) && c.tier !== 'enhanced')).toBe(52);
  });

  test('flagship = 96 + 52, +32 enhanced only when refraction-eligible', () => {
    expect(count(cellsFor('flagship', PLAIN), (c) => c.tier === 'enhanced')).toBe(0);
    expect(count(cellsFor('flagship', ELIGIBLE), (c) => c.tier === 'enhanced')).toBe(32);
  });

  test('T2 core = {chromium, webkit} × {photo, flat-white, flat-black} × 2 × 2 + 5 preference', () => {
    const cells = cellsFor('t2', PLAIN);
    const core = cells.filter((c) => c.transparency === 'glass' && c.preference === 'default');
    expect(core).toHaveLength(24);
    expect(new Set(core.map((c) => c.engine))).toEqual(new Set(['chromium', 'webkit']));
    expect(new Set(core.map((c) => c.scene))).toEqual(new Set(['photo', 'flat-white', 'flat-black']));
    expect(cells.length - core.length).toBe(5);
  });

  test('PR reduced = {chromium, webkit} × {photo, flat-black, dense-text} × 2 schemes × {1440, 390}', () => {
    const cells = cellsFor('pr-reduced', PLAIN);
    expect(new Set(cells.map((c) => c.scene))).toEqual(new Set(['photo', 'flat-black', 'dense-text']));
    expect(new Set(cells.map((c) => c.viewport))).toEqual(new Set(['1440', '390']));
    expect(new Set(cells.map((c) => c.engine))).toEqual(new Set(['chromium', 'webkit']));
  });

  test('product scenes cover every engine, scene, scheme and viewport', () => {
    const cells = cellsFor('product-scene', PLAIN);
    expect(new Set(cells.map((c) => c.engine))).toEqual(new Set(ENGINES));
    expect(new Set(cells.map((c) => c.scene))).toEqual(new Set(SCENES));
  });
});

describe('pruning rules', () => {
  const base: Cell = { engine: 'chromium', scene: 'photo', scheme: 'light', transparency: 'glass', preference: 'default', tier: 'standard', viewport: '1440' };

  test('forced-colors ⇒ lightweight + solid; solid ⇒ lightweight', () => {
    expect(normalize({ ...base, preference: 'forced-colors' })).toMatchObject({ transparency: 'solid', tier: 'lightweight' });
    expect(normalize({ ...base, transparency: 'solid' })).toMatchObject({ tier: 'lightweight' });
    expect(pruneReason({ ...base, transparency: 'solid' }, PLAIN)).toBe('not-normalised');
  });

  test('forced-colors only in engines whose emulation reads back', () => {
    expect(FORCED_COLORS_ENGINES).toEqual(['chromium']);
    const fc = normalize({ ...base, preference: 'forced-colors' });
    expect(pruneReason(fc, PLAIN)).toBeNull();
    expect(pruneReason({ ...fc, engine: 'webkit' }, PLAIN)).toBe('forced-colors-not-emulated');
    expect(pruneReason({ ...fc, engine: 'firefox' }, PLAIN)).toBe('forced-colors-not-emulated');
  });

  test('enhanced ⇒ chromium ∧ glass ∧ default preference ∧ refraction-eligible', () => {
    const e = { ...base, tier: 'enhanced' as const };
    expect(pruneReason(e, ELIGIBLE)).toBeNull();
    expect(pruneReason(e, PLAIN)).toBe('enhanced-not-refraction-eligible');
    expect(pruneReason({ ...e, engine: 'webkit' }, ELIGIBLE)).toBe('enhanced-chromium-only');
    expect(pruneReason({ ...e, transparency: 'tinted' }, ELIGIBLE)).toBe('enhanced-glass-only');
    expect(pruneReason({ ...e, preference: 'reduced-motion' }, ELIGIBLE)).toBe('enhanced-default-preference-only');
    expect(pruneReason({ ...e, preference: 'contrast-more' }, ELIGIBLE)).toBe('enhanced-default-preference-only');
  });

  test('every generated cell survives pruning and prune() deduplicates', () => {
    for (const set of SUBJECT_SETS) {
      for (const ctx of [PLAIN, ELIGIBLE]) {
        const cells = cellsFor(set, ctx);
        const eligible = set === 't0-surface' ? ELIGIBLE : ctx;
        expect(cells.filter((c) => pruneReason(c, eligible) !== null)).toEqual([]);
        expect(prune([...cells, ...cells], eligible)).toHaveLength(cells.length);
      }
    }
  });
});

describe('cell ids', () => {
  const cell: Cell = { engine: 'webkit', scene: 'dense-text', scheme: 'dark', transparency: 'tinted', preference: 'default', tier: 'standard', viewport: '390' };

  test('format <storyId>|<scene>|<engine>|<axes> and round trip', () => {
    expect(cellId('cmp-button--playground', cell)).toBe('cmp-button--playground|dense-text|webkit|dark.tinted.default.standard.390');
    expect(cellId('cmp-button--playground', cell, 'focus-visible')).toBe('cmp-button--playground|dense-text|webkit|dark.tinted.default.standard.390.state-focus-visible');
    expect(axesKey(cell)).toBe('dark.tinted.default.standard.390');
    expect(parseCellId(cellId('a--b', cell, 'open'))).toEqual({ storyId: 'a--b', cell, state: 'open' });
    expect(parseCellId(cellId('a--b', cell))).toEqual({ storyId: 'a--b', cell, state: 'default' });
  });

  test('malformed ids throw', () => {
    expect(() => parseCellId('a--b|photo|chromium')).toThrow(/4 '\|'-separated/);
    expect(() => parseCellId('a--b|nowhere|chromium|light.glass.default.standard.1440')).toThrow(/scene 'nowhere'/);
    expect(() => parseCellId('a--b|photo|gecko|light.glass.default.standard.1440')).toThrow(/engine 'gecko'/);
    expect(() => parseCellId('a--b|photo|chromium|light.glass.default.standard.768')).toThrow(/viewport '768'/);
    expect(() => cellId('a|b', cell)).toThrow(/invalid story id/);
    expect(() => cellId('a--b', cell, 'Open State')).toThrow(/kebab-case/);
  });
});

describe('forcing', () => {
  const base: Cell = { engine: 'firefox', scene: 'flat-black', scheme: 'dark', transparency: 'glass', preference: 'reduced-motion', tier: 'standard', viewport: '390' };

  test('explicit DPR 1 desktop / 3 mobile; touch on mobile; no isMobile on firefox', () => {
    expect(forceFor({ ...base, viewport: '1440' }).context).toEqual({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, hasTouch: false });
    expect(forceFor(base).context).toEqual({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true });
    expect(forceFor({ ...base, engine: 'webkit' }).context.isMobile).toBe(true);
  });

  test('preference → globals, <html> attributes and emulateMedia', () => {
    const f = forceFor(base);
    expect(f.media).toEqual({ colorScheme: 'dark', reducedMotion: 'reduce', forcedColors: 'none', contrast: 'no-preference' });
    expect(f.html).toEqual({ 'data-ag-scheme': 'dark', 'data-ag-contrast': 'standard', 'data-ag-transparency': 'glass', 'data-ag-motion': 'none', 'data-ag-tier': 'standard' });
    const more = forceFor({ ...base, preference: 'contrast-more' });
    expect(more.media.contrast).toBe('more');
    expect(more.html['data-ag-contrast']).toBe('more');
    expect(forceFor(normalize({ ...base, engine: 'chromium', preference: 'forced-colors' })).media.forcedColors).toBe('active');
    expect(globalsParam(f.globals)).toBe('scene:flat-black;scheme:dark;contrast:standard;transparency:glass;motion:none;tier:standard');
  });

  test('story URL is the cert-mode iframe with the cell globals', () => {
    const u = new URL(storyUrl('http://sb.test/', 'cmp-button--playground', base));
    expect(u.pathname).toBe('/iframe.html');
    expect(u.searchParams.get('id')).toBe('cmp-button--playground');
    expect(u.searchParams.get('ag-cert')).toBe('1');
    expect(u.searchParams.get('globals')).toBe(globalsParam(forceFor(base).globals));
  });
});

describe('shards = ceil(captures ÷ (measuredRate × 3,600))', () => {
  test('formula', () => {
    expect(CAPTURES_PER_CELL).toBe(3);
    expect(captureCount(33_000)).toBe(99_000);
    expect(shardCount(99_000, 1.26)).toBe(Math.ceil(99_000 / (1.26 * 3600)));
    expect(shardCount(99_000, 1.26)).toBe(22);
    expect(shardCount(4536, 1.26)).toBe(1);
    expect(shardCount(4537, 1.26)).toBe(2);
    expect(shardCount(0, 1.26)).toBe(1);
  });

  test('rate must be measured (> 0) and inputs integral', () => {
    expect(() => shardCount(10, 0)).toThrow(/measured capture rate/);
    expect(() => shardCount(10, Number.NaN)).toThrow(/measured capture rate/);
    expect(() => shardCount(1.5, 1)).toThrow(/non-negative integer/);
    expect(() => captureCount(-1)).toThrow(/non-negative integer/);
  });

  test('stable shard assignment covers every shard index', () => {
    const cells = cellsFor('flagship', ELIGIBLE).map((c) => cellId('cmp-button--playground', c));
    const a = cells.map((id) => shardOf(id, 7));
    expect(cells.map((id) => shardOf(id, 7))).toEqual(a);
    expect(new Set(a)).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]));
    expect(() => shardOf('x', 0)).toThrow(/≥ 1/);
  });

  test('shard from env', () => {
    expect(shardFromEnv({})).toBeNull();
    expect(shardFromEnv({ AG_SHARD: '2/5' })).toEqual({ index: 2, total: 5 });
    expect(shardFromEnv({ CI_NODE_INDEX: '3', CI_NODE_TOTAL: '4' })).toEqual({ index: 3, total: 4 });
    expect(() => shardFromEnv({ AG_SHARD: '6/5' })).toThrow(/invalid shard/);
    expect(() => shardFromEnv({ AG_SHARD: 'x' })).toThrow(/AG_SHARD/);
  });
});

describe('capture plan (REQ-QUAL-04 live subjects, scope selection, sentinels)', () => {
  const stories: PlanStory[] = [
    { id: 'mat-surface--playground', subject: 'Surface', kind: 'matrix', tags: [], owner: 'MAT' },
    { id: 'cmp-button--playground', subject: 'Button', kind: 'component', tags: ['flagship'], owner: 'CMP' },
    { id: 'overlays-dialog--default', subject: 'Dialog', kind: 'component', tags: ['flagship'], owner: 'CMP' },
    { id: 'data-chip--default', subject: 'Chip', kind: 'component', tags: [], owner: 'CMP' },
    { id: 'showcases-ops-console--full-page', subject: 'ops-console', kind: 'showcase', tags: ['showcase'], owner: 'QUAL' },
    { id: 'showcases-music-player--full-page', subject: 'music-player', kind: 'showcase', tags: ['showcase'], owner: 'QUAL' },
    { id: 'material-lab--overview', subject: 'Surface', kind: 'lab', tags: ['lab'], owner: 'QUAL' },
    { id: 'scenes--photo', subject: 'scene:photo', kind: 'scene', tags: ['scene'], owner: 'QUAL' },
    { id: 'qual-fixtures--opaque', subject: 'Button', kind: 'component', tags: ['no-cert'], owner: 'QUAL' },
  ];
  const metas = new Map<string, PlanMeta>([
    ['Surface', { tier: 'T0' }],
    ['Button', { tier: 'T1', flagship: 1 }],
    ['Dialog', { tier: 'T1', flagship: 9, material: { refractionEligible: true } }],
    ['Chip', { tier: 'T2' }],
  ]);
  const ag = new Map<string, PlanAg | undefined>([
    ['overlays-dialog--default', { states: [{ name: 'open', drive: [{ action: 'open', target: 'trigger' }] }] }],
    ['cmp-button--playground', { states: [{ name: 'hover', drive: [{ action: 'hover', target: 'root' }] }, { name: 'focus-visible', drive: [{ action: 'focus', target: 'root' }] }] }],
  ]);
  const input = (over: Partial<PlanInput> = {}): PlanInput => ({
    scope: 'release', indexIds: new Set(stories.map((s) => s.id)), stories, ag, metas,
    showcaseTiers: new Map([['ops-console', 'S1'], ['music-player', 'S2']]), affected: null,
    sentinels: [{ subject: 'Surface', story: 'playground' }, { subject: 'Button', story: 'playground' }, { subject: 'Dialog', state: 'open' }],
    ...over,
  });
  const bySubjectState = (p: ReturnType<typeof buildCapturePlan>) => {
    const m = new Map<string, number>();
    for (const e of p.entries) m.set(`${e.storyId}#${e.state}`, (m.get(`${e.storyId}#${e.state}`) ?? 0) + 1);
    return Object.fromEntries(m);
  };

  test('subject sets', () => {
    expect(subjectSet(stories[0]!, metas.get('Surface'), undefined)).toBe('t0-surface');
    expect(subjectSet(stories[1]!, metas.get('Button'), undefined)).toBe('flagship');
    expect(subjectSet(stories[3]!, metas.get('Chip'), undefined)).toBe('t2');
    expect(subjectSet(stories[4]!, undefined, 'S1')).toBe('product-scene');
    expect(subjectSet(stories[5]!, undefined, 'S2')).toBe('s2-showcase');
    expect(subjectSet({ ...stories[3]!, subject: 'SurfaceGroup' }, { tier: 'T0' }, undefined)).toBe('t0-core');
    expect(() => subjectSet(stories[4]!, undefined, undefined)).toThrow(/subject-set-unknown/);
    expect(() => subjectSet({ ...stories[3]!, subject: 'Ghost' }, undefined, undefined)).toThrow(/subject-set-unknown/);
  });

  test('release: every subject-state at its §4.3 set; lab, scene and no-cert stories are not L6 subjects', () => {
    const plan = buildCapturePlan(input());
    expect(plan.problems).toEqual([]);
    expect(bySubjectState(plan)).toEqual({
      'mat-surface--playground#default': 180,
      'cmp-button--playground#default': 148,
      'cmp-button--playground#hover': 148,
      'cmp-button--playground#focus-visible': 148,
      'overlays-dialog--default#default': 180,
      'overlays-dialog--default#open': 180,
      'data-chip--default#default': 29,
      'showcases-ops-console--full-page#default': 96,
      'showcases-music-player--full-page#default': 29,
    });
    expect(plan.entries.every((e) => e.sourceStoryId === e.storyId)).toBe(true);
    expect(plan.entries.find((e) => e.state === 'open')?.drive).toEqual([{ action: 'open', target: 'trigger' }]);
  });

  test('main: every subject at the T2-reduced matrix', () => {
    const plan = buildCapturePlan(input({ scope: 'main' }));
    expect(new Set(Object.values(bySubjectState(plan)))).toEqual(new Set([29]));
  });

  test('pr: affected subjects + sentinel set at the PR-reduced matrix; missing sentinels are pending', () => {
    const plan = buildCapturePlan(input({ scope: 'pr', affected: new Set(['Chip']), stories: stories.filter((s) => s.subject !== 'Surface') }));
    expect(bySubjectState(plan)).toEqual({
      'cmp-button--playground#default': 24,
      'cmp-button--playground#hover': 24,
      'cmp-button--playground#focus-visible': 24,
      'overlays-dialog--default#open': 24,
      'data-chip--default#default': 24,
    });
    expect(plan.pendingSentinels).toEqual([{ subject: 'Surface', story: 'playground' }]);
  });

  test('a manifest story absent from this pipeline\'s index.json is a live-subject problem, never a capture', () => {
    const indexIds = new Set(stories.map((s) => s.id).filter((id) => id !== 'data-chip--default'));
    const plan = buildCapturePlan(input({ indexIds }));
    expect(plan.entries.some((e) => e.storyId === 'data-chip--default')).toBe(false);
    expect(plan.problems).toEqual([expect.objectContaining({ storyId: 'data-chip--default', code: 'live-subject', owner: 'CMP' })]);
  });

  test('assertLiveSources fails on a capture referencing an id absent from index.json (fixture manifest)', () => {
    const index = new Set(['cmp-button--playground']);
    expect(() => assertLiveSources([{ sourceStoryId: 'cmp-button--playground' }], index)).not.toThrow();
    let err: unknown;
    try { assertLiveSources([{ sourceStoryId: 'cmp-button--playground' }, { sourceStoryId: 'cmp-button--gone' }], index); } catch (e) { err = e; }
    expect(err).toBeInstanceOf(LiveSubjectError);
    expect((err as LiveSubjectError).missing).toEqual(['cmp-button--gone']);
  });

  test('story axes restrict cells; problems are owner-attributed', () => {
    const restricted = new Map(ag);
    restricted.set('data-chip--default', { scenes: ['photo'], axes: { scheme: ['light'] } });
    restricted.set('showcases-music-player--full-page', { states: [{ name: 'x' }, { name: 'x' }] });
    const plan = buildCapturePlan(input({ ag: restricted, metas: new Map([...metas].filter(([k]) => k !== 'Button')) }));
    expect(bySubjectState(plan)['data-chip--default#default']).toBe(4 + 5);
    expect(plan.problems.map((p) => [p.storyId, p.code, p.owner])).toEqual([
      ['cmp-button--playground', 'subject-set-unknown', 'CMP'],
      ['showcases-music-player--full-page', 'invalid-state', 'QUAL'],
    ]);
  });
});
