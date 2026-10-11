/* REQ-MAT-65 (D.3-39): coverage sweep over every subject from listSubjects()
   (S-40; flagship + MAT at MAT_A11Y_SCOPE=pr, the whole index at full):
   1. 100% of live ::before backdrop filters sit on an element carrying
      data-ag-surface (live = computed backdrop-filter not 'none', pseudo
      content generated, not display:none / visibility:hidden, non-zero box);
   2. material decorative elements (ScrollEdge, Environment backdrop media,
      LensDefs) are aria-hidden="true", are not focusable (themselves or any
      descendant) and carry no role.
   Measured in the engine through computed styles; failures are attributed to
   the subject's owner. Writes .artifacts/mat/a11y-coverage-<engine>.json. */
import { test, expect } from '@playwright/test';
import { listSubjects } from '../../helpers';
import { sweepSubjects, tag, byOwner, type Owner } from './helpers/subjects';
import fs from 'node:fs';

/** Material's decorative parts (src/material/{ScrollEdge,Environment}.tsx, lens/LensDefs.tsx). */
const DECORATIVE = '[data-ag-part="scroll-edge"],[data-ag-part="backdrop-media"],[data-ag-lens-defs]';

interface Probe {
  live: number;
  covered: number;
  stray: string[];
  decorative: number;
  badDecorative: string[];
}

test.describe('material coverage', () => {
  test('live ::before filters carry data-ag-surface; decorative parts are hidden and inert', async ({ page, browserName }, testInfo) => {
    test.setTimeout(30 * 60 * 1000);
    const subjects = await sweepSubjects(listSubjects);
    const fails: Array<{ owner: Owner; msg: string }> = [];
    const rows: Array<{ id: string; owner: Owner; live: number; covered: number; decorative: number }> = [];
    for (const s of subjects) {
      await page.goto(`/iframe.html?id=${s.id}&viewMode=story`);
      await page.waitForSelector('[data-ag-cert-ready]', { state: 'attached', timeout: 30_000 });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const p: Probe = await page.evaluate((decorativeSel) => {
        const describe = (el: Element) => {
          const part = el.getAttribute('data-ag-part');
          return `${el.tagName.toLowerCase()}${part ? `[data-ag-part=${part}]` : ''}${el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).join('.')}` : ''}`;
        };
        let live = 0, covered = 0;
        const stray: string[] = [];
        for (const el of document.querySelectorAll('body *')) {
          const host = getComputedStyle(el);
          if (host.display === 'none' || host.visibility === 'hidden') continue;
          const cs = getComputedStyle(el, '::before');
          const bf = cs.backdropFilter || cs.getPropertyValue('-webkit-backdrop-filter');
          if (!bf || bf === 'none') continue;
          if (cs.content === 'none' || cs.content === 'normal' || cs.display === 'none' || cs.visibility === 'hidden') continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          live += 1;
          if (el.hasAttribute('data-ag-surface')) covered += 1;
          else stray.push(describe(el));
        }
        const FOCUSABLE = 'a[href],button,input,select,textarea,iframe,audio[controls],video[controls],[contenteditable]:not([contenteditable="false"]),[tabindex]';
        const focusable = (el: Element) => {
          if (!(el instanceof HTMLElement || el instanceof SVGElement)) return false;
          if (el.matches(FOCUSABLE)) {
            const ti = el.getAttribute('tabindex');
            if (ti === null || Number(ti) >= 0) return !el.hasAttribute('disabled');
          }
          return false;
        };
        const deco = [...document.querySelectorAll(decorativeSel)];
        const badDecorative: string[] = [];
        for (const el of deco) {
          if (el.getAttribute('aria-hidden') !== 'true') badDecorative.push(`${describe(el)} not aria-hidden`);
          if (el.hasAttribute('role')) badDecorative.push(`${describe(el)} has role=${el.getAttribute('role')}`);
          if (focusable(el)) badDecorative.push(`${describe(el)} is focusable`);
          for (const d of el.querySelectorAll('*')) if (focusable(d)) badDecorative.push(`${describe(el)} contains focusable ${describe(d)}`);
        }
        return { live, covered, stray: stray.slice(0, 25), decorative: deco.length, badDecorative: badDecorative.slice(0, 25) };
      }, DECORATIVE);
      rows.push({ id: s.id, owner: s.owner, live: p.live, covered: p.covered, decorative: p.decorative });
      for (const x of p.stray) fails.push({ owner: s.owner, msg: `${tag(s)} live ::before backdrop filter without data-ag-surface: ${x}` });
      for (const x of p.badDecorative) fails.push({ owner: s.owner, msg: `${tag(s)} decorative material element: ${x}` });
    }
    const live = rows.reduce((n, r) => n + r.live, 0);
    const covered = rows.reduce((n, r) => n + r.covered, 0);
    const decorative = rows.reduce((n, r) => n + r.decorative, 0);
    fs.mkdirSync('.artifacts/mat', { recursive: true });
    fs.writeFileSync(`.artifacts/mat/a11y-coverage-${browserName}.json`, JSON.stringify({
      engine: browserName, subjects: subjects.length, live, covered,
      coverage: live ? covered / live : null, decorative, rows, byOwner: byOwner(fails),
    }, null, 2));
    testInfo.annotations.push({ type: 'note', description: `${covered}/${live} live ::before filters on data-ag-surface; ${decorative} decorative parts` });
    expect(live, 'live ::before backdrop filters observed across subjects').toBeGreaterThan(0);
    expect(decorative, 'decorative material elements observed across subjects').toBeGreaterThan(0);
    expect(fails.map((f) => f.msg), 'coverage failures').toEqual([]);
    expect(covered / live, '100% of live ::before filters carry data-ag-surface').toBe(1);
  });
});
