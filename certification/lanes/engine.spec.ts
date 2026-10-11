/* G-18 / REQ-QUAL-22 (FIN-440) — L8 engine-specific lane.

   One test per subject; the body applies the rule of the engine it runs in
   (the chromium, webkit and firefox projects each run every test):
   - WebKit: for each standard-tier [data-ag-surface], a 32×32 CSS-px probe
     in the interior (≥8 px from the edges and from text rects) over the
     hf-pattern scene shows σ(L) reduced ≥60 % against the same probe with
     the surface hidden, and -webkit-backdrop-filter resolves to a value;
   - Gecko: 0 url() backdrop values anywhere; subjects with refraction
     capture equal to their standard-tier capture within diff ratio 0.001
     (lens inert) and are never blank;
   - Chromium (enhanced tier): every [data-ag-part="bezel"] rect intersects
     0 text client rects.
   Negative/positive controls: stories/qual/fixtures/WebkitBackdrop.stories.tsx.
   Browser lane: GitLab CI / gated remote runner only. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { gotoStory } from '../../tests/helpers';
import { decodePng, diffRatio, luminanceSigma, notUniform } from './_fixtures/pixels';
import { pendingOrFail } from './_fixtures/pending';
import { ROOT, fixtureStory, laneSubjects, onePerSubject, type SubjectStory } from './_fixtures/subjects';

const PROBE = 32;
const EDGE = 8;
const MIN_SIGMA_CUT = 0.6;
/** below this σ(L) the probe is not over a high-frequency backdrop at all */
const MIN_BACKDROP_SIGMA = 10;
const REFRACTION_PARITY = 0.001;

type Engine = 'chromium' | 'webkit' | 'firefox';

function hfPatternScene(): void {
  const manifest = JSON.parse(readFileSync(join(ROOT, 'certification/scenes/scenes.manifest.json'), 'utf8')) as unknown;
  const has = Array.isArray(manifest)
    ? manifest.some((e) => (e as { id?: string }).id === 'hf-pattern')
    : typeof manifest === 'object' && manifest !== null && ('hf-pattern' in manifest
      || (Array.isArray((manifest as { scenes?: unknown[] }).scenes)
        && (manifest as { scenes: Array<{ id?: string }> }).scenes.some((e) => e.id === 'hf-pattern')));
  if (!has) pendingOrFail('certification/scenes/scenes.manifest.json has no hf-pattern scene', 'G-11 scenes');
}

async function scenePainted(page: Page): Promise<void> {
  const painted = await page.evaluate(() => document.querySelector('[data-ag-backdrop]') !== null);
  if (!painted) pendingOrFail('the preview paints no scene ([data-ag-backdrop] absent)', 'G-07 StoryRoot/Environment');
}

/** Probe squares (page CSS px) inside each visible surface, avoiding edges and text. */
async function surfaceProbes(page: Page): Promise<Array<{ index: number; label: string; probe: { x: number; y: number } | null; webkitBackdrop: string }>> {
  return page.evaluate(({ size, edge }) => {
    const textRects = (root: Element) => {
      const out: DOMRect[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) out.push(r);
      }
      return out;
    };
    return [...document.querySelectorAll('[data-ag-surface]')].map((el, index) => {
      const r = el.getBoundingClientRect();
      const label = `${el.tagName.toLowerCase()}${el.getAttribute('data-ag-part') ? `[data-ag-part=${el.getAttribute('data-ag-part')}]` : ''}#${index}`;
      const webkitBackdrop = getComputedStyle(el).getPropertyValue('-webkit-backdrop-filter').trim();
      const texts = textRects(el).map((t) => ({ l: t.left - edge, t: t.top - edge, r: t.right + edge, b: t.bottom + edge }));
      const x0 = Math.max(r.left + edge, 0);
      const y0 = Math.max(r.top + edge, 0);
      const x1 = Math.min(r.right - edge, window.innerWidth) - size;
      const y1 = Math.min(r.bottom - edge, window.innerHeight) - size;
      for (let y = y0; y <= y1; y += 4) {
        for (let x = x0; x <= x1; x += 4) {
          const hit = texts.some((t) => x < t.r && x + size > t.l && y < t.b && y + size > t.t);
          if (!hit) return { index, label, probe: { x: Math.round(x), y: Math.round(y) }, webkitBackdrop };
        }
      }
      return { index, label, probe: null, webkitBackdrop };
    });
  }, { size: PROBE, edge: EDGE });
}

async function webkitViolations(page: Page, context: BrowserContext): Promise<{ violations: string[]; measured: number }> {
  const violations: string[] = [];
  let measured = 0;
  await page.addStyleTag({ content: '[data-ag-g18-hidden]{opacity:0 !important}' });
  for (const s of await surfaceProbes(page)) {
    if (!s.webkitBackdrop || s.webkitBackdrop === 'none') violations.push(`${s.label}: -webkit-backdrop-filter resolves to "${s.webkitBackdrop || 'none'}"`);
    if (!s.probe) continue;
    const clip = { x: s.probe.x, y: s.probe.y, width: PROBE, height: PROBE };
    const shot = { clip, animations: 'disabled' as const, caret: 'hide' as const };
    const visible = luminanceSigma(await decodePng(context, await page.screenshot(shot)));
    await page.evaluate((i) => document.querySelectorAll('[data-ag-surface]')[i]?.setAttribute('data-ag-g18-hidden', ''), s.index);
    const hidden = luminanceSigma(await decodePng(context, await page.screenshot(shot)));
    await page.evaluate((i) => document.querySelectorAll('[data-ag-surface]')[i]?.removeAttribute('data-ag-g18-hidden'), s.index);
    measured++;
    if (hidden < MIN_BACKDROP_SIGMA) {
      violations.push(`${s.label}: backdrop under the probe is flat (σ ${hidden.toFixed(1)} < ${MIN_BACKDROP_SIGMA}) — hf-pattern not behind the surface`);
    } else if (1 - visible / hidden < MIN_SIGMA_CUT) {
      violations.push(`${s.label}: σ(L) cut ${((1 - visible / hidden) * 100).toFixed(1)} % < 60 % (visible ${visible.toFixed(1)}, hidden ${hidden.toFixed(1)})`);
    }
  }
  return { violations, measured };
}

async function urlBackdrops(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll('*')) {
      for (const pseudo of [null, '::before', '::after'] as const) {
        const cs = getComputedStyle(el, pseudo);
        const v = `${cs.backdropFilter} ${cs.getPropertyValue('-webkit-backdrop-filter')}`;
        if (v.includes('url(')) out.push(`${el.tagName.toLowerCase()}${pseudo ?? ''}: ${v.trim()}`);
      }
    }
    return out;
  });
}

async function bezelTextIntersections(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const texts: Array<{ r: DOMRect; text: string }> = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.textContent?.trim();
      if (!text) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) texts.push({ r, text: text.slice(0, 40) });
    }
    const out: string[] = [];
    document.querySelectorAll('[data-ag-part="bezel"]').forEach((bezel, i) => {
      const b = bezel.getBoundingClientRect();
      for (const t of texts) {
        if (b.left < t.r.right && b.right > t.r.left && b.top < t.r.bottom && b.bottom > t.r.top) {
          out.push(`bezel#${i} intersects text "${t.text}"`);
        }
      }
    });
    return out;
  });
}

async function geckoViolations(page: Page, context: BrowserContext, story: SubjectStory): Promise<string[]> {
  const v = (await urlBackdrops(page)).map((x) => `url() backdrop applied: ${x}`);
  const hasRefraction = await page.evaluate(() => document.querySelector('[data-ag-refraction]') !== null);
  if (!hasRefraction) return v;
  const root = page.locator('#storybook-root');
  const enhanced = await decodePng(context, await root.screenshot({ animations: 'disabled', caret: 'hide' }));
  await gotoStory(page, story.id, { tier: 'standard' });
  const standard = await decodePng(context, await root.screenshot({ animations: 'disabled', caret: 'hide' }));
  if (!notUniform(enhanced)) v.push('refraction capture is blank (uniform)');
  if (enhanced.width !== standard.width || enhanced.height !== standard.height) {
    v.push(`refraction capture ${enhanced.width}x${enhanced.height} vs standard ${standard.width}x${standard.height}`);
  } else {
    const ratio = await diffRatio(enhanced, standard);
    if (ratio > REFRACTION_PARITY) v.push(`refraction differs from standard: diff ratio ${ratio.toFixed(5)} > ${REFRACTION_PARITY}`);
  }
  return v;
}

/** The current engine's rule for one story; the page must already show it. */
async function engineRule(engine: Engine, page: Page, context: BrowserContext, story: SubjectStory): Promise<string[]> {
  if (engine === 'webkit') return (await webkitViolations(page, context)).violations;
  if (engine === 'firefox') return geckoViolations(page, context, story);
  return bezelTextIntersections(page);
}

const envFor = (engine: Engine) => (engine === 'webkit'
  ? { tier: 'standard' as const, scene: 'hf-pattern' as const }
  : { tier: 'enhanced' as const });

test.describe('L8 engine-specific (REQ-QUAL-22)', () => {
  test('every subject satisfies this engine\'s rule', async ({ page, context, browserName }, testInfo) => {
    test.setTimeout(30 * 60_000);
    const engine = browserName as Engine;
    if (engine === 'webkit') hfPatternScene();
    const stories = await onePerSubject(await laneSubjects());
    const failures: Record<string, string[]> = {};
    for (const story of stories) {
      try {
        await gotoStory(page, story.id, envFor(engine));
        if (engine === 'webkit') await scenePainted(page);
        const v = await engineRule(engine, page, context, story);
        if (v.length) failures[`${story.subject} (${story.id})`] = v;
      } catch (e) {
        if ((e as Error).name === 'AgPendingProducer') throw e;
        failures[`${story.subject} (${story.id})`] = [`lane error: ${(e as Error).message}`];
      }
    }
    await testInfo.attach(`engine-${engine}.json`, { body: JSON.stringify({ engine, subjects: stories.map((s) => s.id), failures }, null, 2), contentType: 'application/json' });
    expect(stories.length).toBeGreaterThan(0);
    expect(failures).toEqual({});
  });

  test('controls: the WebKit probe rejects a surface without -webkit-backdrop-filter and accepts one with it', async ({ page, context, browserName }) => {
    const engine = browserName as Engine;
    const missing = await fixtureStory('qual-fixtures-webkit-backdrop--missing-webkit-prefix');
    const prefixed = await fixtureStory('qual-fixtures-webkit-backdrop--with-webkit-prefix');
    await gotoStory(page, prefixed.id, envFor(engine));
    if (engine === 'webkit') {
      const ok = await webkitViolations(page, context);
      expect(ok.measured).toBe(1);
      expect(ok.violations).toEqual([]);
      await gotoStory(page, missing.id, envFor(engine));
      const bad = await webkitViolations(page, context);
      expect(bad.measured).toBe(1);
      expect(bad.violations.join('\n')).toMatch(/σ\(L\) cut|-webkit-backdrop-filter resolves/);
    } else {
      // engines without the prefixed property: both fixtures blur, and this engine's own rule holds on them
      expect(await engineRule(engine, page, context, prefixed)).toEqual([]);
      await gotoStory(page, missing.id, envFor(engine));
      expect(await engineRule(engine, page, context, missing)).toEqual([]);
    }
  });
});
