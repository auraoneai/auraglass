/* MAT-303 (REQ-A11Y-30, REQ-MAT-62/65): target size, fine pointer — at
   1440x900 every interactive element on every subject from listSubjects()
   (S-40; flagship + MAT at MAT_A11Y_SCOPE=pr, the whole index at full) owns a
   24x24 box centred on itself (elementFromPoint at the centre and ±11.5 px,
   helpers/targets.ts) or meets the 24px-circle spacing exception. The coarse-pointer half lives in target-size-coarse.spec.ts
   (Chromium + WebKit projects; Firefox has no isMobile emulation). Failures
   are attributed to the subject's owner. */
import { test, expect } from '@playwright/test';
import { listSubjects } from '../../helpers';
import { sweepSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import { probeTargets } from './helpers/targets';
import fs from 'node:fs';

test.describe('target size', () => {
  test('fine pointer: centred 24x24 ownership or spacing exception on every subject', async ({ browser, baseURL, browserName }) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const fails: Array<{ owner: Owner; msg: string }> = [];
    let measured = 0;
    for (const s of subjects) {
      await page.goto(`${baseURL ?? ''}/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
      // every interactive element: a 24x24 box centred on it resolves to it
      // (elementFromPoint at the centre and centre ± 11.5 px on both axes),
      // or the 24px-circle spacing exception holds. An element merely
      // hit-testing inside its own rect is not enough (that passed any size).
      const rows = (await probeTargets(page, 11.5)).map((p) => ({ ...p, ok: p.owned || p.spaced }));
      measured += rows.length;
      for (const r of rows) {
        if (!r.ok) fails.push({ owner: s.owner, msg: `${tag(s)} ${r.part || r.tag} ${r.w}x${r.h} does not own a centred 24x24 box (missed ${r.missed.join(',')}) and misses the 24px spacing exception` });
      }
    }
    await context.close();
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/target-size-fine-${browserName}.json`, JSON.stringify({ subjects: subjects.length, measured, byOwner: byOwner(fails) }, null, 2));
    expect(measured, 'parts measured across subjects').toBeGreaterThan(0);
    expect(fails.map((f) => f.msg), 'fine-pointer target-size failures').toEqual([]);
  });
});
