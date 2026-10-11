/* G-13 / REQ-QUAL-17 (FIN-430) — L6 console hygiene.

   Every certification subject (one story per subject from this pipeline's Storybook build) loads in each engine over
   `photo` with the default cell; any `pageerror` or `console.error` fails, and `console.warn` fails unless it matches
   an unexpired certification/console-allowlist.json entry (≤90 days, owner stream). The same collector runs inside
   every environment-visual cell; this spec is the one-per-subject sweep plus the negative controls:
   `qual-fixtures-pixel-gates--throws` (uncaught error after mount) and `--console-warn` (unallowlisted warning) must
   be reported. Labels are read back from the page (label-mismatch). Remote-only browser lane. */
import { join } from 'node:path';
import type { Browser } from '@playwright/test';
import { test, expect, installDeterminism } from './_fixtures/determinism';
import { forceFor, storyUrl } from '../../packages/qa/src/matrix/force';
import type { Cell, MatrixEngine } from '../../packages/qa/src/matrix/axes';
import { compareLabels, readBack } from '../../packages/qa/src/evidence/readback';
import type { ConsoleEvent } from '../../packages/qa/src/evidence/consoleAllowlist';
import { ROOT, collectConsole, consoleFailures, laneStories, requestedLabels, settle } from './_fixtures/pixel-gates';

const SCOPE = process.env.AG_SCOPE ?? 'pr';
const STORYBOOK_URL = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const STATIC_DIR = process.env.AG_STORYBOOK_STATIC ?? join(ROOT, 'storybook-static');
const READY_TIMEOUT_MS = 30_000;
/** after cert-ready, keep listening long enough for effects and zero-delay timers to run */
const QUIET_MS = 500;
const ENGINES: readonly MatrixEngine[] = ['chromium', 'webkit', 'firefox'];

function pendingOrFail(reason: string, producer: string): never {
  if (SCOPE === 'release') throw new Error(`release scope: ${reason} (producer: ${producer})`);
  throw new Error(`pending: ${reason} (producer: ${producer})`);
}

const cellFor = (engine: MatrixEngine): Cell => ({ engine, scene: 'photo', scheme: 'light', transparency: 'glass', preference: 'default', tier: 'standard', viewport: '1440' });

async function visit(browser: Browser, storyId: string, cell: Cell): Promise<{ events: ConsoleEvent[]; labelDetail: string; labelOk: boolean }> {
  const force = forceFor(cell);
  const context = await browser.newContext({ ...force.context, colorScheme: force.media.colorScheme, reducedMotion: force.media.reducedMotion,
    forcedColors: force.media.forcedColors, contrast: force.media.contrast, baseURL: STORYBOOK_URL });
  try {
    const page = await context.newPage();
    const events = collectConsole(page);
    await installDeterminism(page);
    await page.emulateMedia(force.media);
    await page.goto(storyUrl(STORYBOOK_URL, storyId, cell));
    await page.locator('[data-ag-story-content][data-ag-cert-ready]').waitFor({ state: 'attached', timeout: READY_TIMEOUT_MS });
    await settle(page);
    await page.waitForTimeout(QUIET_MS);
    const labels = compareLabels(requestedLabels(cell), await page.evaluate(readBack));
    return { events, labelDetail: labels.detail, labelOk: labels.status === 'pass' };
  } finally {
    await context.close();
  }
}

const subjects = laneStories(STATIC_DIR);

test.describe('L6 console (REQ-QUAL-17)', () => {
  if ('pending' in subjects) {
    test('console inputs', () => { pendingOrFail(subjects.pending, subjects.producer); });
    return;
  }

  for (const [name, kind] of [['throws', 'pageerror'], ['console-warn', 'warning']] as const) {
    test(`negative control: ${name} fixture is reported (${kind}) @engine-chromium`, async ({ browser }) => {
      const id = `qual-fixtures-pixel-gates--${name}`;
      if (!subjects.indexIds.has(id)) pendingOrFail(`${id} is not in this pipeline's index.json`, 'stories/qual/fixtures/PixelGates.stories.tsx');
      const v = await visit(browser, id, cellFor('chromium'));
      const bad = consoleFailures(v.events);
      expect(bad.some((l) => l.startsWith(`${kind}: `) && l.includes('qual fixture')), `collector reported: ${bad.join(' | ')}`).toBe(true);
    });
  }

  if (subjects.stories.length === 0) {
    test('console has subjects', () => { pendingOrFail(`0 certification subjects at scope ${SCOPE}`, 'stream stories with parameters.ag'); });
  }

  for (const s of subjects.stories) {
    for (const engine of ENGINES) {
      test(`${s.id} [${s.owner}] @engine-${engine}`, async ({ browser }) => {
        const v = await visit(browser, s.id, cellFor(engine));
        expect(v.labelOk, v.labelDetail).toBe(true);
        expect(consoleFailures(v.events), `REQ-QUAL-17 console for ${s.subject} (${s.owner}) in ${engine}`).toEqual([]);
      });
    }
  }
});
