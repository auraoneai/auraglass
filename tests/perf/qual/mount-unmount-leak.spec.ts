/* tests/perf/qual/mount-unmount-leak.spec.ts — REQ-QUAL-42 leaks (QUAL, L10 qual:certify:l10; FIN-446).
   Every flagship (cert-manifest.json / index.json `flagship` tags of the Storybook under test, one story per subject) is
   mounted and unmounted 10× through the Storybook preview (switching to the blank perf fixture unmounts it). Pre-mount
   state is taken after the story's CSF module is imported (import-time work is not a mount) and a forced GC
   (`--js-flags=--expose-gc`, Chromium project qual:l10-invariants-chromium). After the 10th unmount and a forced GC:
     window/document listener counts back to the pre-mount value (per event type),
     0 additional pending rAF callbacks and no rAF requests in a quiet window beyond the pre-mount count,
     0 additional live intervals, 0 additional live Mutation/Resize/IntersectionObservers,
     JS heap delta ≤ 1 MB (CDP Runtime.getHeapUsage).
   Negative fixtures (stories/qual/fixtures/perf/Leak.stories.tsx) prove each probe fails a real leak; the clean fixture
   (same APIs, cleaned up) proves the check does not fail a correct component. Locally (no AG_REMOTE_RUNNER=1) the
   file throws the remote-only message. */
import { join } from 'node:path';
import { expect, test, type CDPSession, type Page } from '@playwright/test';
import { agInstrument } from './instrument.js';
import {
  BLANK_ID, FIXTURE, LIMITS, REMOTE_ONLY_MESSAGE, leakViolations, loadStoryMeta, openPreview, pendingOrFail, rafRequestsIn,
  showStory, snapshot, writeEvidence,
} from './invariants.mjs';
import { ROOT, listFlagships } from '../harness/run-perf.mjs';

if (process.env.AG_REMOTE_RUNNER !== '1') throw new Error(REMOTE_ONLY_MESSAGE);

const STATIC = process.env.AG_STORYBOOK_STATIC ?? join(ROOT, 'storybook-static');
const flagships = listFlagships(STATIC);

type Violation = { code: string; detail: string };
interface State { snapshot: Awaited<ReturnType<typeof snapshot>>; quietRaf: number; heapBytes: number | null }

async function gcAndHeap(page: Page, cdp: CDPSession): Promise<number> {
  const exposed = await page.evaluate(() => typeof (window as unknown as { gc?: () => void }).gc === 'function');
  if (!exposed) throw new Error('window.gc is not exposed: the Chromium project must launch with --js-flags=--expose-gc');
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => { (window as unknown as { gc: () => void }).gc(); });
    await cdp.send('HeapProfiler.collectGarbage');
  }
  const { usedSize } = await cdp.send('Runtime.getHeapUsage');
  return usedSize;
}

async function state(page: Page, cdp: CDPSession): Promise<State> {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const quietRaf = await rafRequestsIn(page, LIMITS.quietMs, LIMITS.reactMs);
  const heapBytes = await gcAndHeap(page, cdp);
  return { snapshot: await snapshot(page), quietRaf, heapBytes };
}

async function leakRun(page: Page, storyId: string, subject = storyId): Promise<Violation[]> {
  await page.addInitScript(agInstrument);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('HeapProfiler.enable');
  await openPreview(page, { storyId: BLANK_ID });
  await loadStoryMeta(page, storyId);                      // import the CSF module before the pre-mount state
  const before = await state(page, cdp);
  for (let i = 0; i < LIMITS.cycles; i++) {
    await showStory(page, storyId);
    await showStory(page, BLANK_ID);
  }
  const after = await state(page, cdp);
  const violations = leakViolations(before, after);
  writeEvidence(`mount-unmount-leak/${storyId}.json`, { storyId, subject, cycles: LIMITS.cycles, heapLimitBytes: LIMITS.heapDeltaBytes, violations, before, after });
  return violations;
}

// Independent tests (default mode): one failure never hides the others' evidence. Each leak run takes 20+ renders.
test.describe.configure({ timeout: 180_000 });

test.describe('negative and clean fixtures (the probe fails real leaks only)', () => {
  test('a component that leaks a window listener fails', async ({ page }) => {
    const leak = (await leakRun(page, FIXTURE.leak.windowListener)).filter((x) => x.code === 'listener-leak');
    expect(leak.map((x) => x.detail)).toEqual([expect.stringMatching(/^window 'resize' listeners \d+ → \d+ \(\+10\)$/)]);
  });
  test('a component that leaks a document listener fails', async ({ page }) => {
    const leak = (await leakRun(page, FIXTURE.leak.documentListener)).filter((x) => x.code === 'listener-leak');
    expect(leak.map((x) => x.detail)).toEqual([expect.stringMatching(/^document 'pointermove' listeners \d+ → \d+ \(\+10\)$/)]);
  });
  test('a component that leaves its rAF loop running fails', async ({ page }) => {
    const codes = (await leakRun(page, FIXTURE.leak.rafLoop)).map((x) => x.code);
    expect(codes).toEqual(expect.arrayContaining(['raf-pending', 'raf-loop']));
  });
  test('a component that leaves an interval running fails', async ({ page }) => {
    expect((await leakRun(page, FIXTURE.leak.interval)).map((x) => x.code)).toContain('interval-leak');
  });
  test('a component that never disconnects its ResizeObserver fails', async ({ page }) => {
    const obs = (await leakRun(page, FIXTURE.leak.observer)).filter((x) => x.code === 'observer-leak');
    expect(obs.map((x) => x.detail)).toEqual([expect.stringMatching(/^live ResizeObserver \d+ → \d+$/)]);
  });
  test('a component using the same APIs and cleaning up passes', async ({ page }) => {
    expect(await leakRun(page, FIXTURE.leak.clean)).toEqual([]);
  });
});

test.describe('every flagship: 10 mount/unmount cycles return to the pre-mount state', () => {
  if (flagships.length === 0) {
    test('flagship subjects exist', () => {
      pendingOrFail(`no flagship stories in ${STATIC} (cert-manifest.json / index.json)`, 'CMP/SURF flagship stories');
    });
  }
  for (const f of flagships) {
    test(`${f.subject} (${f.id})`, async ({ page }) => {
      expect(await leakRun(page, f.id, f.subject)).toEqual([]);
    });
  }
});
