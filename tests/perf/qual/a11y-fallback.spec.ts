/* tests/perf/qual/a11y-fallback.spec.ts — REQ-QUAL-43 (4): accessibility fallbacks cost no blur (QUAL, L10 qual:certify:l10;
   FIN-446). Runs in the chromium, webkit and firefox projects. Under each fallback condition, on every scene of every
   subject cell, 0 elements (or ::before/::after) have a computed backdrop-filter / -webkit-backdrop-filter ≠ none:
     forced-colors          page.emulateMedia({ forcedColors: 'active' }), read back through matchMedia — Chromium only
                            (QUAL PRD OI-QUAL-04: forced-colors cells are Chromium-only until per-engine emulation is
                            confirmed; a silent no-op fails the read-back)
     transparency-solid     the `transparency` global = solid (data-ag-transparency="solid")
     tier-lightweight       the `tier` global = lightweight (data-ag-tier="lightweight")
   The bespoke-blur negative fixture must fail under every condition; the Surfaces fixture must pass.
   Locally (no AG_REMOTE_RUNNER=1) the file throws the remote-only message. */
import { expect, test, type Page } from '@playwright/test';
import { SCENES } from '../../../src/contracts/testing';
import { agInstrument } from './instrument.js';
import {
  FIXTURE, REMOTE_ONLY_MESSAGE, crawlCells, fallbackViolations, formatCellFailures, openPreview, probeBlurred,
  settleAnimations, showStory, subjectStories, writeEvidence,
} from './invariants.mjs';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const ALL_SCENES = [...SCENES];
type Engine = 'chromium' | 'webkit' | 'firefox';
interface Condition { id: string; globals: Record<string, string>; forcedColors: boolean }
const FORCED: Condition = { id: 'forced-colors', globals: {}, forcedColors: true };
const SOLID: Condition = { id: 'transparency-solid', globals: { transparency: 'solid' }, forcedColors: false };
const LIGHTWEIGHT: Condition = { id: 'tier-lightweight', globals: { tier: 'lightweight' }, forcedColors: false };
const CONDITIONS: Record<Engine, Condition[]> = { chromium: [FORCED, SOLID, LIGHTWEIGHT], webkit: [SOLID, LIGHTWEIGHT], firefox: [SOLID, LIGHTWEIGHT] };

/** Applies the condition to the loaded preview and proves it took effect. */
async function applyCondition(page: Page, c: Condition) {
  if (c.forcedColors) {
    await page.emulateMedia({ forcedColors: 'active' });
    expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches), 'forced-colors emulation read-back').toBe(true);
  }
  for (const [key, value] of Object.entries(c.globals)) {
    const attr = `data-ag-${key}`;
    const applied = await page.evaluate(({ a, val }) => document.documentElement.getAttribute(a) === val
      || document.querySelector(`[${a}="${val}"]`) !== null, { a: attr, val: value });
    expect(applied, `${attr}="${value}" applied by the preview`).toBe(true);
  }
}

async function blurred(page: Page, c: Condition) {
  await page.evaluate(settleAnimations);
  return fallbackViolations(await page.evaluate(probeBlurred), c.id);
}

// Independent tests (default mode): one failure never hides the others' evidence.

/* The condition list is per engine (OI-QUAL-04): each describe is tagged @<engine>, and every invariants project in
   tests/perf/qual/playwright.config.ts greps out the other engines' tags. */
for (const engine of ['chromium', 'webkit', 'firefox'] as const) {
  for (const c of CONDITIONS[engine]) {
    test.describe(`${c.id} @${engine}`, () => {
      test.beforeEach(({ browserName }) => {
        if (browserName !== engine) throw new Error(`@${engine} tests ran in the ${browserName} project: check the project grepInvert`);
      });

      test('negative fixture: a hand-rolled blur that ignores the fallback is reported', async ({ page }) => {
        await page.addInitScript(agInstrument);
        await openPreview(page, { globals: c.globals });
        await showStory(page, FIXTURE.fallback.bespokeBlur);
        await applyCondition(page, c);
        const v = await blurred(page, c);
        expect(v.map((x) => x.code)).toEqual(['backdrop-filter-under-fallback']);
        expect(v[0]!.detail).toContain('[data-ag-fixture=bespoke-blur]');
      });

      test('Surfaces fixture: public Surfaces drop every backdrop-filter', async ({ page }) => {
        await page.addInitScript(agInstrument);
        await openPreview(page, { globals: c.globals });
        await showStory(page, FIXTURE.fallback.surfaces);
        await applyCondition(page, c);
        expect(await blurred(page, c)).toEqual([]);
      });

      test('every subject cell on every scene: 0 backdrop-filter elements', async ({ page }) => {
        test.setTimeout(45 * 60_000);
        await page.addInitScript(agInstrument);
        if (c.forcedColors) await page.emulateMedia({ forcedColors: 'active' });
        const { stories, unannotated } = await subjectStories(page, ALL_SCENES);
        const results = await crawlCells(page, stories, ALL_SCENES, {
          globals: c.globals,
          onScene: () => applyCondition(page, c),
          perCell: () => blurred(page, c),
        });
        writeEvidence(`a11y-fallback-${c.id}-${engine}.json`, { engine, condition: c.id, subjects: stories.length, unannotated, cells: results.length, results });
        expect(results.length).toBeGreaterThan(0);
        expect(formatCellFailures(results)).toEqual([]);
      });
    });
  }
}
