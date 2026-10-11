/* tests/perf/qual/backdrop-root.spec.ts — REQ-QUAL-43 (1): no `.ag-surface` host is a backdrop root (QUAL, L10; FIN-446).
   Runs in the chromium, webkit and firefox projects of tests/perf/qual/playwright.config.ts (qual:certify:l10).
   Over every subject cell (each story declaring parameters.ag.subject × its scenes) every `.ag-surface` in the document
   (portalled overlays included) has computed backdrop-filter none, filter none, opacity 1, mix-blend-mode normal and
   will-change auto unless the host carries [data-ag-animating]. The blur belongs on ::before; a host that is itself a
   backdrop root isolates every nested surface's backdrop. The seeded negative fixture must fail with one violation per
   property, the clean fixture must pass. Locally (no AG_REMOTE_RUNNER=1) the file throws the remote-only message. */
import { expect, test, type Page } from '@playwright/test';
import { SCENES } from '../../../src/contracts/testing';
import { agInstrument } from './instrument.js';
import {
  FIXTURE, REMOTE_ONLY_MESSAGE, backdropRootViolations, crawlCells, formatCellFailures, openPreview, probeSurfaceHosts,
  settleAnimations, showStory, subjectStories, writeEvidence,
} from './invariants.mjs';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const ALL_SCENES = [...SCENES];

async function hostViolations(page: Page) {
  await page.evaluate(settleAnimations);
  return backdropRootViolations(await page.evaluate(probeSurfaceHosts));
}

async function fixture(page: Page, storyId: string) {
  await page.addInitScript(agInstrument);
  await openPreview(page);
  await showStory(page, storyId);
  return hostViolations(page);
}

test.describe.configure({ mode: 'serial' });

test('negative fixture: each host style that makes a backdrop root is reported, [data-ag-animating] will-change is allowed', async ({ page }) => {
  const violations = await fixture(page, FIXTURE.backdropRoot.hosts);
  const byFixture = violations.map((x) => [x.code, /data-fixture=([\w-]+)/.exec(x.detail)?.[1]]);
  expect(byFixture.sort()).toEqual([
    ['backdrop-filter', 'backdrop-filter'], ['filter', 'filter'], ['mix-blend-mode', 'mix-blend-mode'],
    ['opacity', 'opacity'], ['will-change', 'will-change'],
  ]);
});

test('clean fixture: public Surfaces are not backdrop roots', async ({ page }) => {
  expect(await fixture(page, FIXTURE.backdropRoot.clean)).toEqual([]);
});

test('every subject cell: no .ag-surface host is a backdrop root', async ({ page, browserName }) => {
  test.setTimeout(45 * 60_000);
  await page.addInitScript(agInstrument);
  const { stories, unannotated } = await subjectStories(page, ALL_SCENES);
  const results = await crawlCells(page, stories, ALL_SCENES, { perCell: () => hostViolations(page) });
  writeEvidence(`backdrop-root-${browserName}.json`, { engine: browserName, subjects: stories.length, unannotated, cells: results.length, results });
  expect(results.length).toBeGreaterThan(0);
  expect(formatCellFailures(results)).toEqual([]);
});
