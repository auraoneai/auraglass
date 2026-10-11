/* tests/perf/qual/webgl-context.spec.ts — REQ-QUAL-43 (3): WebGL context budget (QUAL, L10 qual:certify:l10; FIN-446).
   Runs in the chromium, webkit and firefox projects at deviceScaleFactor 2 (so the DPR ≤ 1.5 cap is observable).
   Every cell that holds a live WebGL context is checked for: ≤1 live context, backing store ≤ 1.5 × CSS size,
   0 requestAnimationFrame requests while document.visibilityState is 'hidden' and while every canvas is offscreen,
   and every context created by the cell lost (WEBGL_lose_context) after unmount. The seeded negative fixtures must fail
   with exactly their own violation; the clean fixture must pass.
   The "3 `./three` surfaces" cell needs `./three` surface components; the entry exports nothing at 5.0 (OI-01,
   REQ-SURF-165), so that test reports `pending:` (PRD-F §4.3 rule 2; a failure at release) until the entry ships one.
   Locally (no AG_REMOTE_RUNNER=1) the file throws the remote-only message. */
import { expect, test, type Page } from '@playwright/test';
import { SCENES } from '../../../src/contracts/testing';
import { agInstrument } from './instrument.js';
import {
  BLANK_ID, FIXTURE, LIMITS, REMOTE_ONLY_MESSAGE, crawlCells, formatCellFailures, liveContexts, openPreview, pageNow,
  pendingOrFail, rafRequestsIn, showStory, snapshot, subjectStories, webglViolations, whileHidden, whileOffscreen, writeEvidence,
} from './invariants.mjs';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const ALL_SCENES = [...SCENES];
test.use({ deviceScaleFactor: 2 });

/** Measures the story currently shown (mounted at/after `since`). A story that created a WebGL context is then
    unmounted (switch to the blank fixture) and its contexts must be lost. */
async function webglCell(page: Page, since: number) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const mounted = await snapshot(page, since);
  const live = liveContexts(mounted).length;
  const hiddenRaf = live ? await whileHidden(page, () => rafRequestsIn(page, LIMITS.quietMs, LIMITS.reactMs)) : null;
  const offscreenRaf = live ? await whileOffscreen(page, () => rafRequestsIn(page, LIMITS.quietMs, LIMITS.reactMs)) : null;
  let unmounted = null;
  if (mounted.webgl.length) {
    await showStory(page, BLANK_ID);
    unmounted = await snapshot(page, since);
  }
  return { mounted, hiddenRaf, offscreenRaf, unmounted, violations: webglViolations({ mounted, hiddenRaf, offscreenRaf, unmounted }) };
}

async function fixture(page: Page, storyId: string) {
  await page.addInitScript(agInstrument);
  await openPreview(page);
  const since = await pageNow(page);
  await showStory(page, storyId);
  return webglCell(page, since);
}

test.describe.configure({ mode: 'serial' });

test('clean fixture: one capped, gated, released context passes', async ({ page }) => {
  const r = await fixture(page, FIXTURE.webgl.clean);
  expect(liveContexts(r.mounted)).toHaveLength(1);
  expect(r.violations).toEqual([]);
});

const NEGATIVE: Array<[keyof typeof FIXTURE.webgl, string[]]> = [
  ['threeContexts', ['webgl-context-budget']],
  ['unreleased', ['webgl-unreleased']],
  ['ungatedLoop', ['webgl-raf-hidden', 'webgl-raf-offscreen']],
  ['fullDpr', ['webgl-dpr']],
];
for (const [name, codes] of NEGATIVE) {
  test(`negative fixture ${name}: reported as ${codes.join(', ')}`, async ({ page }) => {
    const r = await fixture(page, FIXTURE.webgl[name]);
    expect([...new Set(r.violations.map((x) => x.code))].sort()).toEqual([...codes].sort());
  });
}

test('3 ./three surfaces: ≤1 live context, released on unmount, 0 rAF while hidden, DPR ≤ 1.5', async () => {
  const entry = (await import('../../../src/three/index')) as Record<string, unknown>;
  const components = Object.keys(entry).filter((k) => typeof entry[k] === 'function' || (typeof entry[k] === 'object' && entry[k] !== null));
  if (components.length === 0) {
    pendingOrFail('`./three` (src/three/index.ts) exports no surface component (OI-01), so no 3-surface `./three` cell can be mounted',
      'FIN-F REQ-SURF-165 `./three` entry');
  }
  throw new Error(`./three now exports ${components.join(', ')}: add a 3-surface fixture story for them in `
    + 'stories/qual/fixtures/perf/Webgl.stories.tsx and measure it here with webglCell()');
});

test('every subject cell holding WebGL: budget, DPR cap, hidden/offscreen loop, release on unmount', async ({ page, browserName }) => {
  test.setTimeout(45 * 60_000);
  await page.addInitScript(agInstrument);
  const { stories, unannotated } = await subjectStories(page, ALL_SCENES);
  /* Contexts created at/after `since` belong to the current cell: the previous cell either created none or ended on
     the blank fixture. */
  let since = 0;
  const withGl: string[] = [];
  const results = await crawlCells(page, stories, ALL_SCENES, {
    perCell: async ({ storyId, scene }) => {
      const r = await webglCell(page, since);
      if (liveContexts(r.mounted).length) withGl.push(`${storyId} @ ${scene}`);
      since = await pageNow(page);
      return r.violations;
    },
    onScene: async () => { since = await pageNow(page); },
  });
  writeEvidence(`webgl-context-${browserName}.json`, { engine: browserName, subjects: stories.length, unannotated, cells: results.length, cellsWithWebgl: withGl, results });
  expect(results.length).toBeGreaterThan(0);
  expect(formatCellFailures(results)).toEqual([]);
});
