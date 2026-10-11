// tests/e2e/surf/clear-over-media/text-contrast.spec.ts — REQ-SURF-188
// (REQ-FIN-90, AC-FIN-90). L6 environment lane, remote only (registered in
// fragments/lanes/surf.ts W4; project surf:clear-over-media in
// fragments/playwright/surf.json).
//
// Every SURF subject in QUAL's subject index (storybook-static/cert-manifest.json,
// REPORTS.subjects) is rendered over every certification scene × scheme ×
// transparency rung × viewport width from MAT's pixel-contrast contract; the
// engine axis is the Playwright project the lane runs under. For every visible
// text run the spec resolves the text colour, then repaints the page with all
// text transparent and grades the text colour against every backdrop pixel
// behind the run's glyph boxes (worst sample per run, MAT-315). 0 failures is
// the only pass. The rows are written as evidence under
// .artifacts/surf/<job>/clear-over-media/.
//
// No SURF subject in the index is a failure, never a pass: until QUAL's
// cert-manifest generator lists SURF owners, this spec is red by design.
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gotoStory, listSubjects } from '../../../helpers';
import { SCENES, type SceneId } from '../../../../src/contracts/testing';
import type { Scheme } from '../../../../src/contracts/preferences';
import type { Transparency } from '../../../../src/contracts/material';
import { MATRIX, gradeRun, type Rgba, type RunVerdict } from './contrast';

const SCHEMES = MATRIX.schemes as Scheme[];
const RUNGS = MATRIX.transparency as Transparency[];
const WIDTHS = MATRIX.viewports;
const HEIGHT: Record<number, number> = { 1440: 900, 390: 844 };
/** Long stories are measured one viewport at a time; this bounds runaway (e.g. infinite-feed) stories and is reported. */
const MAX_VIEWPORTS = 8;

const EVIDENCE_DIR = join(
  process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts',
  'surf',
  process.env.CI_JOB_NAME_SLUG ?? 'local',
  'clear-over-media',
);

interface CollectedRun {
  text: string;
  color: Rgba;
  fontSizePx: number;
  fontWeight: number;
  rects: Array<{ x: number; y: number; w: number; h: number }>;
}

interface Row extends RunVerdict {
  storyId: string;
  subject: string;
  viewport: number;
  background: SceneId;
  mode: 'default';
  engine: string;
  scheme: Scheme;
  transparency: Transparency;
  tier: string | null;
}

const HIDE_TEXT_ID = 'ag-surf-clear-over-media-hide-text';
const HIDE_TEXT_CSS = `*, *::before, *::after, *::placeholder, *::marker {
  color: transparent !important; -webkit-text-fill-color: transparent !important;
  text-shadow: none !important; text-decoration-color: transparent !important;
  caret-color: transparent !important; transition: none !important; }`;

const twoFrames = (page: Page) =>
  page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));

/** Settles finite animations (infinite ones keep running and are sampled as they are). */
async function settle(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      const t = a.effect?.getComputedTiming();
      if (t && Number.isFinite(t.endTime as number)) a.finish();
    }
  });
  await twoFrames(page);
}

/** Visible text runs inside the story root, with resolved sRGB colour and viewport-clipped glyph boxes. */
function collectRuns(page: Page): Promise<CollectedRun[]> {
  return page.evaluate(() => {
    const root = document.querySelector('#storybook-root') ?? document.body;
    const probe = document.createElement('canvas');
    probe.width = 1;
    probe.height = 1;
    const ctx = probe.getContext('2d', { willReadFrequently: true })!;
    // Resolves any CSS colour syntax (oklch, color-mix, color(srgb …)) to 8-bit sRGB + alpha.
    const toRgba = (css: string): [number, number, number, number] => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
    };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);
    const out: Array<{ text: string; color: [number, number, number, number]; fontSizePx: number; fontWeight: number;
      rects: Array<{ x: number; y: number; w: number; h: number }> }> = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      const el = node.parentElement;
      if (!el || SKIP.has(el.tagName)) continue;
      // WCAG 1.4.3 exempts inactive UI and text that is not presented.
      if (el.closest('[aria-hidden="true"], [inert], :disabled, [aria-disabled="true"]')) continue;
      const visible = typeof el.checkVisibility === 'function'
        ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, opacityProperty: true, visibilityProperty: true } as CheckVisibilityOptions)
        : getComputedStyle(el).visibility !== 'hidden';
      if (!visible) continue;
      // Effective alpha: text colour alpha × every ancestor opacity.
      let opacity = 1;
      // Clip box: intersection of every overflow-clipping ancestor and the viewport.
      let clip = { l: 0, t: 0, r: vw, b: vh };
      for (let a: Element | null = el; a && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        opacity *= parseFloat(cs.opacity) || 0;
        if (a !== el && (cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || cs.contain.includes('paint'))) {
          const b = a.getBoundingClientRect();
          clip = { l: Math.max(clip.l, b.left), t: Math.max(clip.t, b.top), r: Math.min(clip.r, b.right), b: Math.min(clip.b, b.bottom) };
        }
      }
      if (opacity === 0) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()]
        .map((r) => {
          const l = Math.max(r.left, clip.l);
          const t = Math.max(r.top, clip.t);
          return { x: l, y: t, w: Math.min(r.right, clip.r) - l, h: Math.min(r.bottom, clip.b) - t };
        })
        // ≥2 px boxes: visually-hidden (1 px clip) text is not presented visually.
        .filter((r) => r.w >= 2 && r.h >= 2);
      if (rects.length === 0) continue;
      const cs = getComputedStyle(el);
      const rgba = toRgba(cs.color);
      out.push({
        text: text.slice(0, 80),
        color: [rgba[0], rgba[1], rgba[2], rgba[3] * opacity],
        fontSizePx: parseFloat(cs.fontSize),
        fontWeight: parseInt(cs.fontWeight, 10) || 400,
        rects,
      });
    }
    return out;
  });
}

/** Repaints with all text transparent and returns the packed backdrop pixels behind each run. */
async function sampleBackdrops(page: Page, runs: CollectedRun[]): Promise<number[][]> {
  await page.evaluate(({ id, css }) => {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }, { id: HIDE_TEXT_ID, css: HIDE_TEXT_CSS });
  await twoFrames(page);
  const png = (await page.screenshot({ scale: 'css', animations: 'allow', caret: 'hide' })).toString('base64');
  await page.evaluate((id) => document.getElementById(id)?.remove(), HIDE_TEXT_ID);
  return page.evaluate(async ({ png: data, rects }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);
    const { data: px, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    return rects.map((boxes) => {
      const seen = new Set<number>();
      for (const b of boxes) {
        const x0 = Math.max(0, Math.floor(b.x));
        const y0 = Math.max(0, Math.floor(b.y));
        const x1 = Math.min(width, Math.ceil(b.x + b.w));
        const y1 = Math.min(height, Math.ceil(b.y + b.h));
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const i = (y * width + x) * 4;
            seen.add((px[i]! << 16) | (px[i + 1]! << 8) | px[i + 2]!);
          }
        }
      }
      return [...seen];
    });
  }, { png, rects: runs.map((r) => r.rects) });
}

test.describe('SURF clear-over-media text contrast (REQ-SURF-188, L6)', () => {
  test('the contract matrix covers every certification scene', () => {
    expect([...MATRIX.scenes].sort()).toEqual([...SCENES].sort());
  });

  for (const scene of SCENES) {
    for (const scheme of SCHEMES) {
      for (const transparency of RUNGS) {
        test(`${scene} · ${scheme} · ${transparency}`, async ({ page, browserName }, testInfo) => {
          const all = await listSubjects({ owner: 'SURF' });
          // One story per SURF subject: the flagship-tagged story when present, else the subject's first story.
          const bySubject = new Map<string, (typeof all)[number]>();
          for (const s of all) {
            const prev = bySubject.get(s.subject);
            if (!prev || (!prev.tags.includes('flagship') && s.tags.includes('flagship'))) bySubject.set(s.subject, s);
          }
          const stories = [...bySubject.values()];
          expect(stories.length, 'QUAL subject index lists 0 SURF subjects (cert-manifest owner discovery)').toBeGreaterThan(0);
          test.setTimeout(stories.length * WIDTHS.length * 45_000);

          const rows: Row[] = [];
          const truncated: string[] = [];
          for (const width of WIDTHS) {
            await page.setViewportSize({ width, height: HEIGHT[width] ?? 900 });
            for (const story of stories) {
              await test.step(`${story.id} @${width}`, async () => {
                await gotoStory(page, story.id, { scene, scheme, transparency });
                await page.evaluate(() => window.scrollTo(0, 0));
                const tier = await page.evaluate(() =>
                  document.querySelector('[data-ag-tier]')?.getAttribute('data-ag-tier') ?? null);
                for (let vp = 0; vp < MAX_VIEWPORTS; vp++) {
                  await settle(page);
                  const runs = await collectRuns(page);
                  const backdrops = runs.length ? await sampleBackdrops(page, runs) : [];
                  runs.forEach((run, i) => {
                    rows.push({
                      ...gradeRun({ ...run, backdrop: backdrops[i]! }),
                      storyId: story.id, subject: story.subject, viewport: width, background: scene,
                      mode: 'default', engine: browserName, scheme, transparency, tier,
                    });
                  });
                  const more = await page.evaluate(() => {
                    const el = document.scrollingElement ?? document.documentElement;
                    if (el.scrollTop + window.innerHeight >= el.scrollHeight - 1) return false;
                    window.scrollBy(0, window.innerHeight);
                    return true;
                  });
                  if (!more) break;
                  if (vp === MAX_VIEWPORTS - 1) truncated.push(`${story.id}@${width}`);
                }
              });
            }
          }

          const failures = rows.filter((r) => r.fail);
          const report = { version: 1, req: 'REQ-SURF-188', lane: 'L6', project: testInfo.project.name, engine: browserName,
            scene, scheme, transparency, widths: WIDTHS, subjects: stories.length, runs: rows.length,
            failures: failures.length, truncated, rows };
          mkdirSync(EVIDENCE_DIR, { recursive: true });
          const file = join(EVIDENCE_DIR, `${testInfo.project.name.replace(/[^\w-]+/g, '_')}-${scene}-${scheme}-${transparency}.json`);
          writeFileSync(file, JSON.stringify(report, null, 2));
          await testInfo.attach('clear-over-media.json', { path: file, contentType: 'application/json' });

          expect(rows.length, 'no visible SURF text run was measured').toBeGreaterThan(0);
          expect(
            failures.map((f) => `${f.storyId}@${f.viewport} "${f.text}" ${f.color}/${f.alpha} on ${f.bg}: ${f.worstRatio} < ${f.need}`),
          ).toEqual([]);
        });
      }
    }
  }
});
