/* REQ-MAT-65 (D.3-39): rendered-pixel text contrast over the catalogue.
   Contract: tests/a11y/pixel-contrast.contract.json (MAT-315).
   Matrix: 8 scenes x 3 engines x light/dark x glass/tinted/solid x
   default/more/forced x 1440/390. The engine axis is the Playwright project
   (mat:a11y-pixel-contrast-{chromium,webkit,firefox}); this file declares one
   test per scheme x transparency x mode x viewport and iterates every scene
   for every subject from listSubjects() (S-40; one story per flagship or
   MAT-owned subject).
   Method per cell: every text node is wrapped in a measuring span; shot A is
   the page as rendered, shot B its text-hidden twin (the spans at opacity 0,
   which also holds under forced colours). For each visible text run the
   backdrop is the median-luminance pixel of B inside the run's box; the text
   colour is the resolved colour (canvas-normalised, ancestor opacity applied)
   composited over that backdrop; the glyph core read from A vs B is recorded
   alongside. Need: body 4.5, large 3, contrast=more 7. A row is the worst run
   of a (subject, cell); a cell whose mode the engine did not apply fails.
   Rows are written per test to .artifacts/mat/pixel-contrast-parts/<engine>/;
   scripts/mat/a11y-pixel-contrast.mjs --merge builds
   .artifacts/mat/<job>/a11y-pixel-contrast.json and validates it fail-closed.
   Remote only (GitLab .ag-playwright); never run on a workstation. */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';
import { listSubjects, gotoStory } from '../../../helpers';
import { sweepSubjects, onePerSubject, tag, type Subject } from '../../../e2e/mat/helpers/subjects';
import type { SceneId } from '../../../../src/contracts/testing';
import type { Transparency } from '../../../../src/contracts/material';
import type { Scheme } from '../../../../src/contracts/preferences';
import {
  loadContract, contrast, composite, hex, medianPixel, glyphCore, requiredRatio,
} from '../../../../scripts/mat/a11y-pixel-contrast.mjs';

const CONTRACT = loadContract(process.cwd());
const M = CONTRACT.matrix;
const PARTS = process.env.MAT_PIXEL_PARTS_DIR ?? '.artifacts/mat/pixel-contrast-parts';
const HEIGHT: Record<number, number> = { 1440: 900, 390: 844 };

interface Run {
  text: string; rect: { x: number; y: number; width: number; height: number };
  rgba: [number, number, number, number]; alpha: number; fontSizePx: number; fontWeight: number;
}

/** Wrap every visible text node in a measuring span; return the runs inside the viewport. */
async function collectRuns(page: Page): Promise<Run[]> {
  return page.evaluate(() => {
    const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'OPTION', 'TITLE', 'TEMPLATE']);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = n.parentElement;
      if (!p || SKIP.has(p.tagName) || p.closest('svg') || !(n.textContent ?? '').trim()) continue;
      nodes.push(n as Text);
    }
    const cvs = document.createElement('canvas');
    cvs.width = 1; cvs.height = 1;
    const ctx = cvs.getContext('2d', { willReadFrequently: true })!;
    const rgba = (c: string): [number, number, number, number] => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
    };
    const vw = window.innerWidth, vh = window.innerHeight;
    const out: Array<{ text: string; rect: { x: number; y: number; width: number; height: number };
      rgba: [number, number, number, number]; alpha: number; fontSizePx: number; fontWeight: number }> = [];
    for (const n of nodes) {
      const span = document.createElement('span');
      span.setAttribute('data-ag-pixel-run', '');
      n.parentNode!.insertBefore(span, n);
      span.appendChild(n);
      const cs = getComputedStyle(span);
      if (cs.visibility !== 'visible') continue;
      const r = span.getBoundingClientRect();
      const x0 = Math.max(0, r.left), y0 = Math.max(0, r.top);
      const x1 = Math.min(vw, r.right), y1 = Math.min(vh, r.bottom);
      if (x1 - x0 < 1 || y1 - y0 < 1) continue;
      let opacity = 1;
      for (let el: Element | null = span; el; el = el.parentElement) opacity *= Number(getComputedStyle(el).opacity || '1');
      const fill = cs.getPropertyValue('-webkit-text-fill-color');
      const c = rgba(fill && fill !== cs.color && !/^(currentcolor)?$/i.test(fill) ? fill : cs.color);
      out.push({
        text: (n.textContent ?? '').trim().slice(0, 80),
        rect: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 },
        rgba: c, alpha: c[3] * opacity,
        fontSizePx: parseFloat(cs.fontSize), fontWeight: Number(cs.fontWeight) || 400,
      });
    }
    return out;
  });
}

const settle = (page: Page) => page.evaluate(async () => {
  await document.fonts.ready;
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
});

const MODE_QUERY: Record<string, { q: string; want: boolean }[]> = {
  default: [{ q: '(prefers-contrast: more)', want: false }, { q: '(forced-colors: active)', want: false }],
  more: [{ q: '(prefers-contrast: more)', want: true }],
  forced: [{ q: '(forced-colors: active)', want: true }],
};

for (const scheme of M.schemes) for (const transparency of M.transparency) for (const mode of M.modes) for (const viewport of M.viewports) {
  test(`pixel contrast ${scheme}/${transparency}/${mode}/${viewport}`, async ({ browser, browserName }) => {
    test.setTimeout(60 * 60 * 1000);
    const subjects: Subject[] = onePerSubject(await sweepSubjects(listSubjects, 'pr'));
    const context = await browser.newContext({
      viewport: { width: viewport, height: HEIGHT[viewport] ?? 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      contrast: mode === 'more' ? 'more' : 'no-preference',
      forcedColors: mode === 'forced' ? 'active' : 'none',
    });
    const page = await context.newPage();
    const rows: Array<Record<string, unknown>> = [];
    try {
      for (const s of subjects) {
        for (const scene of M.scenes) {
          await gotoStory(page, s.id, {
            scheme: scheme as Scheme, transparency: transparency as Transparency, scene: scene as SceneId,
            ...(mode === 'more' ? { contrast: 'more' as const } : {}),
          });
          const applied = await page.evaluate((qs) => qs.every(({ q, want }) => window.matchMedia(q).matches === want), MODE_QUERY[mode]!);
          const tier = await page.evaluate(() =>
            document.querySelector('[data-ag-root]')?.getAttribute('data-ag-tier') ?? document.documentElement.getAttribute('data-ag-tier') ?? 'unknown');
          await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' });
          const runs = await collectRuns(page);
          await settle(page);
          const shotA = PNG.sync.read(await page.screenshot({ animations: 'disabled', caret: 'hide' }));
          await page.addStyleTag({ content: '[data-ag-pixel-run]{opacity:0!important}' });
          await settle(page);
          const shotB = PNG.sync.read(await page.screenshot({ animations: 'disabled', caret: 'hide' }));
          const base = {
            storyId: s.id, subject: s.subject, owner: s.owner, flagship: s.tags.includes('flagship'),
            viewport, background: scene, scene, mode, engine: browserName, scheme, transparency, tier,
          };
          if (!applied) {
            rows.push({ ...base, text: null, color: null, alpha: null, bg: null, ratio: null, worstRatio: null, need: null, runs: runs.length,
              fail: true, reason: `${mode} media emulation not applied by ${browserName}` });
            continue;
          }
          if (shotA.width !== shotB.width || shotA.height !== shotB.height) throw new Error(`${tag(s)} twin screenshot size mismatch`);
          let worst: Record<string, unknown> | null = null;
          let worstMargin = Infinity;
          const ratios: number[] = [];
          for (const run of runs) {
            const bg = medianPixel(shotB.data, shotB.width, run.rect);
            if (!bg) continue;
            const core = glyphCore(shotA.data, shotB.data, shotA.width, run.rect);
            const rgb = [run.rgba[0], run.rgba[1], run.rgba[2]];
            // gradient/clip text resolves to alpha 0 yet paints: fall back to its rendered core
            const fg = run.alpha > 0 ? composite(rgb, Math.min(1, run.alpha), bg) : core;
            if (!fg) continue; // alpha 0 and no painted pixel: the run is not visible
            const ratio = contrast(fg, bg);
            const need = requiredRatio({ mode, fontSizePx: run.fontSizePx, fontWeight: run.fontWeight }, CONTRACT.thresholds);
            ratios.push(ratio);
            const margin = ratio / need;
            if (margin < worstMargin) {
              worstMargin = margin;
              worst = {
                text: run.text, color: hex(rgb), alpha: Number(run.alpha.toFixed(3)), bg: hex(bg),
                worstRatio: Number(ratio.toFixed(3)), renderedRatio: core ? Number(contrast(core, bg).toFixed(3)) : null,
                need, fontSizePx: run.fontSizePx, fontWeight: run.fontWeight, fail: ratio < need,
              };
            }
          }
          ratios.sort((a, b) => a - b);
          rows.push(worst
            ? { ...base, ...worst, ratio: Number((ratios[Math.floor(ratios.length / 2)] ?? 0).toFixed(3)), runs: ratios.length }
            : { ...base, text: null, color: null, alpha: null, bg: null, ratio: null, worstRatio: null, need: null, runs: 0, fail: false });
        }
      }
    } finally {
      await context.close();
      const dir = path.join(PARTS, browserName);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${scheme}-${transparency}-${mode}-${viewport}.json`), JSON.stringify({ rows }, null, 1));
    }
    const fails = rows.filter((r) => r.fail === true)
      .map((r) => `[${r.owner} ${r.subject} ${r.storyId}] ${r.scene}: "${r.text ?? ''}" ${r.worstRatio ?? '-'} < ${r.need ?? '-'}${r.reason ? ` (${r.reason})` : ''}`);
    expect(rows.length, 'rows measured').toBe(subjects.length * M.scenes.length);
    expect(fails, `failing text-contrast rows at ${scheme}/${transparency}/${mode}/${viewport} on ${browserName}`).toEqual([]);
  });
}
