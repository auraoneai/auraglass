/* G-17 / REQ-QUAL-19 (FIN-438, REQ-FIN-104) — L5 Behaviour lane.

   - axe over every subject-state from listSubjects() (never `no-cert` fixtures) with color-contrast ON, scoped to the
     story content and overlay roots: photo + flat-white × light + dark in chromium, webkit and firefox; at nightly and
     release scope all 8 scenes in chromium and webkit. serious/critical fail; moderate also fails for flagships
     (ComponentMeta.flagship set, or the story tagged `flagship`).
   - Preference emulation per subject-state (chromium): forcedColors 'active', contrast 'more', reducedMotion 'reduce'
     (each read back with matchMedia, so an emulation that did not apply fails instead of passing vacuously) and
     data-ag-transparency="solid" forced on <html>; axe with the same impact rule.
   - Flagship APG coverage: every flagship has an APG spec under tests/a11y/apg/<owner>/ — `pending` before RC-1,
     `fail` at release scope (AG_SCOPE=release).
   - Self-run against the CMP contract doubles (stories/qual/fixtures/ContractDoubles.stories.tsx): axe + APG keyboard
     scripts; these tests carry the `double-pass` annotation and the lane runner records them as `double-pass`.
   Location-discovered stream specs (tests/a11y/apg/<stream>/**, tests/e2e/<stream>/**) are separate projects of
   certification/playwright.cert.config.ts. Storybook `play` functions are not the mechanism. Browser lane: GitLab CI /
   gated remote runner only. Tests titled @engine-<engine> run only in that engine's lane project (grepInvert). */
import { test, expect, type Page } from '@playwright/test';
import { gotoStory } from '../../tests/helpers';
import { apg, axeScan, BLOCKING_IMPACTS, FLAGSHIP_BLOCKING_IMPACTS, formatViolations } from '../../tests/a11y/apg/harness';
import type { ApgStep } from '../../src/contracts/testing';
import {
  ENGINES, PREFERENCE_CELLS, PREFERENCE_ENGINE, STORY_SCAN_INCLUDE, apgCoverage, apgSpecFiles, axeCells,
  type LaneScope,
} from './_fixtures/behaviour';
import { pendingOrFail, LANE_SCOPE } from './_fixtures/pending';
import { ROOT } from './_fixtures/root';
import { componentMetas, laneSubjects, STORYBOOK_URL, type Subject } from './_fixtures/subjects';

const SCOPE: LaneScope = LANE_SCOPE;
const CELL_TIMEOUT_MS = 30_000;

type Loaded =
  | { subjects: Subject[]; flagships: Set<string> }
  | { pending: string; producer: string };

/** Subjects of the Storybook under test + flagship names from the metas. A missing producer is pending (fail at release). */
async function load(): Promise<Loaded> {
  let subjects: Subject[];
  try {
    subjects = await laneSubjects();
  } catch (e) {
    const msg = (e as Error).message;
    // pendingOrFail (called again in the tests) is `pending:` below release and a failure at release scope
    if (/^(pending|release scope):/.test(msg)) return { pending: msg.replace(/^(pending|release scope): /, ''), producer: 'stream stories + cert manifest (G-01)' };
    return { pending: `subject index unreachable at ${STORYBOOK_URL}: ${msg.split('\n')[0]}`, producer: 'qual:build:storybook served at AG_STORYBOOK_URL' };
  }
  const metas = await componentMetas();
  const flagships = new Set([...metas.values()].filter((m) => typeof m.flagship === 'number').map((m) => m.name));
  return { subjects, flagships };
}

const isFlagship = (s: Subject, flagships: Set<string>) => s.tags.includes('flagship') || flagships.has(s.subject);

async function scan(page: Page, flagship: boolean): Promise<string | null> {
  const r = await axeScan(page, { colorContrast: true, include: STORY_SCAN_INCLUDE, failOn: flagship ? FLAGSHIP_BLOCKING_IMPACTS : BLOCKING_IMPACTS });
  return r.blocking.length ? formatViolations(r.blocking) : null;
}

const loaded = await load();

test.describe('L5 behaviour', () => {
  test('flagship APG coverage @engine-chromium', async () => {
    const metas = [...(await componentMetas()).values()];
    const rows = apgCoverage(metas, apgSpecFiles(ROOT));
    expect(rows.length, 'flagship metas (ComponentMeta.flagship)').toBeGreaterThan(0);
    const missing = rows.filter((r) => r.spec === null);
    if (missing.length) {
      pendingOrFail(`${missing.length} flagship(s) without an APG spec: ${missing.map((r) => `[${r.owner}] #${r.flagship} ${r.name} → ${r.expected}`).join('; ')}`,
        'each owner stream (CMP/SURF/MAT) adds tests/a11y/apg/<owner>/<name>.apg.spec.ts before RC-1');
    }
  });

  if ('pending' in loaded) {
    for (const engine of ENGINES) test(`axe subject matrix @engine-${engine}`, () => { pendingOrFail(loaded.pending, loaded.producer); });
    return;
  }

  for (const s of loaded.subjects) {
    const flagship = isFlagship(s, loaded.flagships);
    for (const engine of ENGINES) {
      const cells = axeCells(SCOPE, engine);
      test(`axe ${s.id} @engine-${engine}`, async ({ page }) => {
        test.setTimeout(CELL_TIMEOUT_MS * cells.length);
        const failures: string[] = [];
        for (const cell of cells) {
          await gotoStory(page, s.id, { scene: cell.scene, scheme: cell.scheme });
          const v = await scan(page, flagship);
          if (v) failures.push(`${cell.scene}/${cell.scheme}: ${v}`);
        }
        expect(failures, `[${s.owner}] ${s.subject}${flagship ? ' (flagship: moderate fails)' : ''} — axe ${engine}`).toEqual([]);
      });
    }
    test(`preferences ${s.id} @engine-${PREFERENCE_ENGINE}`, async ({ page }) => {
      test.setTimeout(CELL_TIMEOUT_MS * PREFERENCE_CELLS.length);
      const failures: string[] = [];
      for (const cell of PREFERENCE_CELLS) {
        await page.emulateMedia({ forcedColors: 'none', contrast: 'no-preference', reducedMotion: 'no-preference', ...cell.media });
        await gotoStory(page, s.id, { scene: 'photo', scheme: 'light' });
        if (cell.readBack) {
          const q = cell.readBack;
          expect(await page.evaluate((query) => window.matchMedia(query).matches, q), `${cell.id}: emulation read back ${q}`).toBe(true);
        }
        if (cell.html) {
          await page.evaluate((attrs) => {
            for (const [k, v] of Object.entries(attrs)) document.documentElement.setAttribute(k, v);
            return new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
          }, cell.html);
        }
        const v = await scan(page, flagship);
        if (v) failures.push(`${cell.id}: ${v}`);
      }
      expect(failures, `[${s.owner}] ${s.subject}${flagship ? ' (flagship: moderate fails)' : ''} — preference emulation`).toEqual([]);
    });
  }
});

/* ---- self-run against the CMP contract doubles (recorded double-pass) ---------------------------------------------- */
const DOUBLE_STORY = (name: string) => `qual-fixtures-contract-doubles--${name}`;
const DOUBLES: Array<{ story: string; focus: string; script: ApgStep[]; check?: (page: Page) => Promise<void> }> = [
  { story: DOUBLE_STORY('collapsible-double'), focus: '[data-ag-part="trigger"]',
    script: [{ press: 'Enter', expectFocus: 'trigger', expectState: { 'aria-expanded': 'true' } }, { press: 'Enter', expectState: { 'aria-expanded': 'false' } }] },
  { story: DOUBLE_STORY('toolbar-double'), focus: '[data-ag-part="button"]',
    script: [{ press: 'ArrowRight', expectFocus: 'role=button[name=Italic]' }, { press: 'ArrowRight', expectFocus: 'role=button[name=Underline]' },
      { press: 'ArrowLeft', expectFocus: 'role=button[name=Italic]' }] },
  { story: DOUBLE_STORY('dialog-double'), focus: '[data-ag-part="trigger"]',
    script: [{ press: 'Enter' }],
    check: async (page) => {
      await expect(page.locator('[data-ag-part="content"]')).toBeVisible();
      await expect.poll(() => page.evaluate(() => !!document.querySelector('[data-ag-part="content"]')?.contains(document.activeElement)),
        'focus moves into the dialog').toBe(true);
      await apg.keyboard(page, [{ press: 'Escape', expectFocus: 'trigger' }]);
      await expect(page.locator('[data-ag-part="content"]')).toHaveCount(0);
    } },
  { story: DOUBLE_STORY('menu-double'), focus: '[data-ag-part="trigger"]',
    script: [{ press: 'ArrowDown', expectFocus: 'role=menuitem[name=Rename]' }, { press: 'ArrowDown', expectFocus: 'role=menuitem[name=Duplicate]' },
      { press: 'Escape', expectFocus: 'trigger' }] },
];

test.describe('L5 behaviour self-run on contract doubles', () => {
  for (const d of DOUBLES) {
    test(`double ${d.story} @engine-chromium`, { annotation: { type: 'double-pass', description: 'tests/contract-doubles/cmp/* (contract §5.2 rule 4)' } }, async ({ page }) => {
      if ('pending' in loaded) pendingOrFail(loaded.pending, loaded.producer);
      await gotoStory(page, d.story, { scene: 'flat-white', scheme: 'light' });
      expect(await page.locator('[data-ag-double]').count(), 'story renders the contract double').toBeGreaterThan(0);
      const v = await scan(page, true);
      expect(v, 'axe (color-contrast on, moderate fails)').toBeNull();
      await page.focus(d.focus);
      await apg.keyboard(page, d.script);
      if (d.check) await d.check(page);
    });
  }
});
