/* tests/perf/qual/regression-4x.spec.ts — REQ-QUAL-41 regression vs 4.1 evidence (QUAL, L10 profile c; remote only).

   Project qual:l10-regression-4x (chromium-headless-shell, --disable-gpu: the software-raster regression profile (c)).
   Subjects: listSubjects({ tags: ['flagship'] }) (REPORTS.subjects) plus the showcase ids in
   thresholds.json#perf.regression4x.showcases (S1-1 ai-command-center, S1-3 ops-console, the two AppShell product scenes).
   Desktop 1440×900 and mobile 390×844: the Dialog flagship story opened through its drive steps and both AppShell scenes
   must reach ≥50 fps, ≥0.85× blank, 0 library long tasks >50 ms (packages/qa/src/perf/regression4x.ts). Every other
   flagship's fps is reported (desktop). Results → $AURAGLASS_EVIDENCE_DIR/qual/<job>/regression-4x.json.
   A target that is still a seed (data-ag-seed) or not built yet is `pending:` before release, a failure at release.
   Self-check: the blank fixture throttled by a 30 ms busy rAF loop must fail the ≥50 fps rule. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { expect, test, type Browser } from '@playwright/test';
import { BLANK_ID, ROOT, REMOTE_ONLY_MESSAGE, agPerfInit, measurePage, openStory, readDrive } from '../harness/run-perf.mjs';
import { listSubjects } from '../../helpers/index';
import { parsePerfThresholds } from '../../../packages/qa/src/perf/budgets';
import { regression4xRow, type FpsWindow, type Regression4xRow } from '../../../packages/qa/src/perf/regression4x';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const SCOPE = process.env.AG_SCOPE ?? 'pr';
const BASE = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const EVIDENCE = resolve(ROOT, process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10');
const t = parsePerfThresholds(JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8'))).regression4x;
const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
} as const;
type Vp = keyof typeof VIEWPORTS;

interface Measured { window: FpsWindow | null; seed: boolean }

async function measure(browser: Browser, storyId: string, vp: Vp, extraInit?: () => void): Promise<Measured> {
  const ctx = await browser.newContext({ ...VIEWPORTS[vp], reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  try {
    await page.addInitScript(agPerfInit);
    if (extraInit) await page.addInitScript(extraInit);
    const cdp = await ctx.newCDPSession(page);
    await openStory(page, BASE, storyId, { scene: 'photo', tier: 'standard' });
    if (await page.locator('[data-ag-seed]').count()) return { window: null, seed: true };
    const m = await measurePage(page, { profileId: 'c', engine: 'chromium', browser, cdp, drive: await readDrive(page), cycle: null, vsyncMs: 1000 / 60 });
    return { window: m.windows.settled, seed: false };
  } finally { await ctx.close(); }
}

const pick = <T extends { id: string }>(xs: T[]): T | undefined => {
  const rank = (id: string) => (id.endsWith('--playground') ? 0 : id.endsWith('--states') ? 1 : 2);
  return [...xs].sort((a, b) => rank(a.id) - rank(b.id))[0];
};

test.describe.configure({ mode: 'serial' });

test('self-check: a fixture throttled below 50 fps fails the regression rule', async ({ browser }) => {
  test.setTimeout(120_000);
  const blank = await measure(browser, BLANK_ID, 'desktop');
  const throttled = await measure(browser, BLANK_ID, 'desktop', () => {
    const burn = () => { const s = performance.now(); while (performance.now() - s < 30) { /* 30 ms of main-thread work per frame */ } requestAnimationFrame(burn); };
    requestAnimationFrame(burn);
  });
  const row = regression4xRow({ subject: 'throttled-blank', viewport: 'desktop', window: throttled.window, blank: blank.window }, t);
  expect(row.fps, 'throttled fixture fps').not.toBeNull();
  expect(row.fps as number).toBeLessThan(t.minFps);
  expect(row.failures.some((f) => /fps < 50 fps/.test(f))).toBe(true);
});

test('Dialog and both AppShell scenes reach ≥50 fps, ≥0.85× blank, 0 library long tasks (desktop + mobile)', async ({ browser }) => {
  test.setTimeout(60 * 60 * 1000);
  const flagships = await listSubjects({ tags: ['flagship'] });
  const showcases = await listSubjects({ kind: 'showcase' });
  const targets: Array<{ subject: string; storyId: string | null }> = [
    { subject: 'Dialog', storyId: pick(flagships.filter((s) => s.subject === 'Dialog'))?.id ?? null },
    ...t.showcases.map((id) => ({ subject: id, storyId: pick(showcases.filter((s) => s.subject === id || s.id.startsWith(`${id}--`)))?.id ?? null })),
  ];
  const blanks: Record<Vp, FpsWindow | null> = { desktop: (await measure(browser, BLANK_ID, 'desktop')).window, mobile: (await measure(browser, BLANK_ID, 'mobile')).window };
  const rows: Regression4xRow[] = []; const pending: string[] = []; const failures: string[] = [];
  for (const tgt of targets) {
    if (!tgt.storyId) { pending.push(`${tgt.subject}: not in the subject index`); continue; }
    for (const vp of Object.keys(VIEWPORTS) as Vp[]) {
      const m = await measure(browser, tgt.storyId, vp);
      if (m.seed) { pending.push(`${tgt.subject}: seed`); break; }
      const row = regression4xRow({ subject: tgt.subject, viewport: vp, window: m.window, blank: blanks[vp] }, t);
      rows.push(row);
      for (const f of row.failures) failures.push(`${tgt.subject} ${vp}: ${f}`);
    }
  }
  /* per-subject fps for every other flagship (reported; the 4.1 successors above are the gate) */
  const report: Regression4xRow[] = [];
  for (const s of [...new Map(flagships.map((f) => [f.subject, f])).values()]) {
    if (s.subject === 'Dialog') continue;
    const m = await measure(browser, pick(flagships.filter((f) => f.subject === s.subject))?.id ?? s.id, 'desktop');
    if (!m.seed) report.push(regression4xRow({ subject: s.subject, viewport: 'desktop', window: m.window, blank: blanks.desktop }, t));
  }
  mkdirSync(EVIDENCE, { recursive: true });
  writeFileSync(join(EVIDENCE, 'regression-4x.json'), `${JSON.stringify({ version: 1, scope: SCOPE, profile: 'c', targets: rows, pending, failures, flagships: report }, null, 2)}\n`);
  expect(failures, failures.join('\n')).toEqual([]);
  if (pending.length) {
    if (SCOPE === 'release') throw new Error(`release scope: ${pending.join('; ')}`);
    throw new Error(`pending: ${pending.join('; ')} (producers: CMP Dialog, FIN-G G-26 showcases)`);
  }
});
