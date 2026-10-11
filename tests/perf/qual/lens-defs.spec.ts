/* tests/perf/qual/lens-defs.spec.ts — REQ-QUAL-43 (2): one SVG lens-defs per document, no url() backdrops off Chromium
   (QUAL, L10 qual:certify:l10; FIN-446). Runs in the chromium, webkit and firefox projects.
     - With 10 enhanced refraction surfaces mounted under AuraGlassProvider tier="enhanced": exactly one
       svg[data-ag-lens-defs] in the document on every engine, and 0 applied url() backdrops on Gecko/WebKit
       (refraction is Chromium-only, lens.css). While src/material has not registered LensDefs with the provider mount
       registry the producer is missing and the test reports `pending:` (PRD-F §4.3 rule 2; a failure at release).
     - Seeded negative fixture (two LensDefs, engine mis-detected as chromium, inline url() backdrop): reported as
       lens-defs-duplicate on every engine and lens-url-backdrop on Gecko/WebKit.
     - Every subject cell: ≤1 svg[data-ag-lens-defs] and, on Gecko/WebKit, 0 url() backdrops.
   Locally (no AG_REMOTE_RUNNER=1) the file throws the remote-only message. */
import { expect, test, type Page } from '@playwright/test';
import { SCENES } from '../../../src/contracts/testing';
import { agInstrument } from './instrument.js';
import {
  FIXTURE, REMOTE_ONLY_MESSAGE, crawlCells, formatCellFailures, lensViolations, openPreview, pendingOrFail, probeLens,
  settleAnimations, showStory, subjectStories, writeEvidence,
} from './invariants.mjs';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const ALL_SCENES = [...SCENES];

async function lensProbe(page: Page) {
  await page.evaluate(settleAnimations);
  return page.evaluate(probeLens);
}

test.describe.configure({ mode: 'serial' });

test('10 enhanced surfaces: exactly one svg[data-ag-lens-defs], 0 url() backdrops on Gecko/WebKit', async ({ page, browserName }) => {
  await page.addInitScript(agInstrument);
  await openPreview(page, { globals: { tier: 'enhanced' } });
  await showStory(page, FIXTURE.lens.enhanced10);
  const probe = await lensProbe(page);
  expect(probe.refractionSurfaces).toBe(10);
  const registered = await page.locator('[data-ag-fixture="lens-enhanced-10"]').getAttribute('data-ag-lens-registered');
  if (registered !== 'true') {
    pendingOrFail('src/material/lens/LensDefs is not registered with the provider mount registry (registerProviderMount(\'lensDefs\')), '
      + 'so AuraGlassProvider tier="enhanced" mounts no svg[data-ag-lens-defs]', 'FIN-D (MAT-183 / A11Y-029 LensDefs mount)');
  }
  expect(lensViolations(probe, browserName, { expectDefs: true })).toEqual([]);
});

test('negative fixture: duplicate lens defs and an applied url() backdrop are reported', async ({ page, browserName }) => {
  await page.addInitScript(agInstrument);
  await openPreview(page, { globals: { tier: 'enhanced' } });
  await showStory(page, FIXTURE.lens.duplicate);
  const codes = [...new Set(lensViolations(await lensProbe(page), browserName).map((x) => x.code))].sort();
  expect(codes).toEqual(browserName === 'chromium' ? ['lens-defs-duplicate'] : ['lens-defs-duplicate', 'lens-url-backdrop']);
});

test('every subject cell: ≤1 svg[data-ag-lens-defs]; 0 url() backdrops on Gecko/WebKit', async ({ page, browserName }) => {
  test.setTimeout(45 * 60_000);
  await page.addInitScript(agInstrument);
  const { stories, unannotated } = await subjectStories(page, ALL_SCENES);
  const results = await crawlCells(page, stories, ALL_SCENES, { perCell: async () => lensViolations(await lensProbe(page), browserName) });
  writeEvidence(`lens-defs-${browserName}.json`, { engine: browserName, subjects: stories.length, unannotated, cells: results.length, results });
  expect(results.length).toBeGreaterThan(0);
  expect(formatCellFailures(results)).toEqual([]);
});
