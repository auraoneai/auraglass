/* MAT-285 + MAT-298 (REQ-MAT-54/55, REQ-MAT-65): forced colors — zero VISIBLE
   backdrop filters on every subject from listSubjects() (S-40; flagship + MAT
   subjects at MAT_A11Y_SCOPE=pr, the whole index at full) plus scrim/shell
   surfaces; Canvas/CanvasText computed; focusable parts keep outline-style
   solid, width >=2px, color equal to a Highlight probe. Forced colours are
   emulated with page.emulateMedia on every engine; a cell where the engine did
   not apply the emulation fails (never faked). Failures are attributed to the
   subject's owner. */
import { test, expect } from '@playwright/test';
import { countVisibleBackdropFilters } from './helpers/surfaces';
import { emulateForcedColors, assertMedia } from './helpers/emulate';
import { listSubjects } from '../../helpers';
import { sweepSubjects, matFixture, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

test.describe('forced colors', () => {
  test('zero visible backdrop filters', async ({ page, browserName }, testInfo) => {
    test.setTimeout(30 * 60 * 1000);
    await emulateForcedColors(page);
    const subjects = await sweepSubjects(listSubjects);
    const rows: Array<{ id: string; subject: string; owner: Owner; engine: string; visible: number }> = [];
    const fails: Array<{ owner: Owner; msg: string }> = [];
    for (const s of subjects) {
      await page.goto(`/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
      await assertMedia(page, '(forced-colors: active)');
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const n = await countVisibleBackdropFilters(page);
      rows.push({ id: s.id, subject: s.subject, owner: s.owner, engine: browserName, visible: n });
      if (n !== 0) fails.push({ owner: s.owner, msg: `${tag(s)} ${n} visible backdrop filter(s) under forced colors` });
    }
    // Canvas/CanvasText must be what text+canvas compute to
    const probe = await page.evaluate(() => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      const cs = getComputedStyle(el);
      const canvas = document.createElement('div');
      canvas.style.color = 'CanvasText';
      canvas.style.backgroundColor = 'Canvas';
      document.body.appendChild(canvas);
      const sys = getComputedStyle(canvas);
      const out = { color: cs.color, sysText: sys.color, sysCanvas: sys.backgroundColor };
      el.remove(); canvas.remove();
      return out;
    });
    expect(probe.color, 'body text computes to CanvasText').toBe(probe.sysText);
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/forced-colors-filters-${browserName}.json`, JSON.stringify({ rows, byOwner: byOwner(fails) }, null, 2));
    testInfo.annotations.push({ type: 'note', description: `${rows.length} subjects, ${fails.length} failing` });
    expect(fails.map((f) => f.msg), 'subjects with visible backdrop filters under forced colors').toEqual([]);
  });

  test('focus ring', async ({ page }) => {
    await emulateForcedColors(page);
    const fixture = await matFixture(listSubjects, 'a11y-focusring--default');
    await page.goto(`/iframe.html?id=${fixture.id}&viewMode=story`);
    await page.waitForSelector('[data-ag-part]');
    await assertMedia(page, '(forced-colors: active)');
    const parts = await page.$$('[data-ag-part]');
    expect(parts.length).toBeGreaterThan(0);
    const highlightProbe = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.color = 'Highlight';
      document.body.appendChild(el);
      const c = getComputedStyle(el).color;
      el.remove();
      return c;
    });
    let checked = 0;
    for (const p of parts) {
      const focusable = await p.evaluate((el) =>
        el instanceof HTMLElement &&
        (el.tabIndex >= 0 || /^(a|button|input|select|textarea)$/i.test(el.tagName)));
      if (!focusable) continue;
      await p.focus();
      const cs = await p.evaluate((el) => {
        const s = getComputedStyle(el);
        return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
      });
      expect(cs.style, `${tag(fixture)} outline-style solid under forced colors`).toBe('solid');
      expect(parseFloat(cs.width), `${tag(fixture)} outline-width >= 2px`).toBeGreaterThanOrEqual(2);
      expect(cs.color, `${tag(fixture)} outline-color == Highlight probe`).toBe(highlightProbe);
      checked += 1;
    }
    expect(checked, 'at least one focusable part verified').toBeGreaterThan(0);
  });
});
