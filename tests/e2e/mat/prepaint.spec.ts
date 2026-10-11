/* MAT-287 / REQ-MAT-59 (FIN-D D.3-35): pre-paint from the BUILT package.
   <AuraGlassScript/> is imported from aura-glass/theme (package self-reference
   through the exports map => dist/theme/public.js) and server-rendered with a
   CSP nonce; the page carries the built aura-glass/tokens.css and
   aura-glass/material.css. The spec never skips: a missing dist/ (no
   plat:build:dist artifact) fails it.

   Per engine (chromium, webkit, firefox projects), 20 reloads each with a
   persisted {transparency:'solid'}:
   - the pre-paint script stamps data-ag-transparency=solid and the engine
     the shared detector reports for that browser;
   - 0 blur frames: every rAF-sampled frame, from the first, shows
     backdrop-filter: none on every surface's ::before (where the material
     paints its backdrop optics);
   - CLS 0: layout-shift entries sum to exactly 0 where the engine exposes
     them (Chromium), and on every engine no surface box moves between the
     first frame and settle.
   A glass control (no persisted record) proves the probe sees real blur. */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const ROOT = process.cwd();
const pkgRequire = createRequire(join(ROOT, 'package.json'));
const NONCE = 'c29tZS1ub25jZQ';
const RELOADS = 20;
const FRAMES = 30;

interface Built { scriptTag: string; css: string }
let built: Built | null = null;

/** Loads AuraGlassScript and the stylesheets from the built package; throws
   (never skips) when dist/ is absent. */
async function loadBuilt(): Promise<Built> {
  if (built) return built;
  const themeEntry = pkgRequire.resolve('aura-glass/theme');
  const theme = (await import(pathToFileURL(themeEntry).href)) as {
    AuraGlassScript: (p: { nonce?: string; storageKey?: string }) => unknown;
  };
  expect(typeof theme.AuraGlassScript, 'aura-glass/theme exports AuraGlassScript').toBe('function');
  const scriptTag = renderToStaticMarkup(
    createElement(theme.AuraGlassScript as never, { nonce: NONCE, storageKey: 'ag:prefs:v1' }),
  );
  expect(scriptTag.startsWith(`<script nonce="${NONCE}">`), 'one inline <script nonce>').toBe(true);
  const css = ['aura-glass/tokens.css', 'aura-glass/material.css']
    .map((s) => readFileSync(pkgRequire.resolve(s), 'utf8'))
    .join('\n');
  built = { scriptTag, css };
  return built;
}

const page = (b: Built): string => `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width">
${b.scriptTag}
<style nonce="${NONCE}">${b.css}</style>
<style nonce="${NONCE}">body{margin:0;background:linear-gradient(90deg,red,blue)}.ag-surface{display:block;margin:16px;min-height:80px;padding:12px}</style>
</head><body>
<div class="ag-surface" data-ag-surface="card">surface</div>
<div class="ag-surface" data-ag-surface="panel">surface 2</div>
</body></html>`;

const ENGINE_FOR: Record<string, string> = { chromium: 'chromium', webkit: 'webkit', firefox: 'gecko' };

type Probe = { frames: { bf: string[]; boxes: string[] }[]; cls: number; clsSupported: boolean };

const INIT_PROBE = (frames: number) => {
  const w = window as unknown as { __probe: Probe };
  w.__probe = { frames: [], cls: 0, clsSupported: false };
  const sample = () => {
    const els = Array.from(document.querySelectorAll('[data-ag-surface]'));
    w.__probe.frames.push({
      bf: els.map((el) => {
        const cs = getComputedStyle(el, '::before');
        return cs.backdropFilter || cs.getPropertyValue('-webkit-backdrop-filter') || '';
      }),
      boxes: els.map((el) => {
        const r = el.getBoundingClientRect();
        return `${r.x},${r.y},${r.width},${r.height}`;
      }),
    });
    if (w.__probe.frames.length < frames) requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
  if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
    w.__probe.clsSupported = true;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) w.__probe.cls += (e as unknown as { value: number }).value;
    }).observe({ type: 'layout-shift', buffered: true });
  }
};

async function run(
  browser: import('@playwright/test').Browser,
  persisted: Record<string, unknown> | null,
  reloads: number,
): Promise<Array<Probe & { transparency: string | null; engine: string | null }>> {
  const b = await loadBuilt();
  const context = await browser.newContext();
  if (persisted) {
    await context.addInitScript((rec) => {
      localStorage.setItem('ag:prefs:v1', JSON.stringify(rec));
    }, persisted);
  }
  await context.addInitScript(INIT_PROBE, FRAMES);
  const p = await context.newPage();
  await p.route('http://ag-prepaint.test/**', (route) => route.fulfill({
    status: 200,
    contentType: 'text/html',
    headers: { 'Content-Security-Policy': `script-src 'nonce-${NONCE}'; style-src 'nonce-${NONCE}'` },
    body: page(b),
  }));
  const out: Array<Probe & { transparency: string | null; engine: string | null }> = [];
  for (let i = 0; i < reloads; i += 1) {
    await p.goto('http://ag-prepaint.test/canary');
    await p.waitForFunction((n) => (window as unknown as { __probe: Probe }).__probe.frames.length >= n, FRAMES);
    out.push(await p.evaluate(() => ({
      ...(window as unknown as { __probe: Probe }).__probe,
      transparency: document.documentElement.getAttribute('data-ag-transparency'),
      engine: document.documentElement.getAttribute('data-ag-engine'),
    })));
  }
  await context.close();
  return out;
}

test.describe('prepaint (built package)', () => {
  test('glass control: the probe observes real backdrop blur without a persisted record', async ({ browser }) => {
    const [r] = await run(browser, null, 1);
    expect(r!.transparency).toBe('glass');
    const first = r!.frames.find((f) => f.bf.length > 0);
    expect(first?.bf.length, 'surfaces present in the sampled frames').toBe(2);
    for (const bf of first!.bf) expect(bf, 'glass ::before carries a backdrop filter').toMatch(/blur\(/);
  });

  test(`persisted solid: 0 blur frames and CLS 0 across ${RELOADS} reloads`, async ({ browser, browserName }) => {
    const runs = await run(browser, { transparency: 'solid' }, RELOADS);
    expect(runs).toHaveLength(RELOADS);
    let blurFrames = 0;
    let framesSeen = 0;
    let clsTotal = 0;
    const clsSupported: boolean[] = [];
    for (const [i, r] of runs.entries()) {
      expect(r.transparency, `reload ${i}: data-ag-transparency`).toBe('solid');
      expect(r.engine, `reload ${i}: data-ag-engine`).toBe(ENGINE_FOR[browserName]);
      expect(r.frames.length, `reload ${i}: sampled frames`).toBeGreaterThanOrEqual(FRAMES);
      // Frames sampled before the parser reached <body> have no surface and
      // cannot show blur; from the first frame that has the surfaces on,
      // every frame must have both.
      const firstWithSurfaces = r.frames.findIndex((f) => f.bf.length > 0);
      expect(firstWithSurfaces, `reload ${i}: surfaces appear within the sampled frames`).toBeGreaterThanOrEqual(0);
      const frames = r.frames.slice(firstWithSurfaces);
      for (const f of frames) {
        expect(f.bf.length, `reload ${i}: surfaces in every frame`).toBe(2);
        framesSeen += 1;
        blurFrames += f.bf.some((bf) => bf !== 'none') ? 1 : 0;
      }
      expect(frames[0]!.boxes, `reload ${i}: no surface moved after the first painted frame`)
        .toEqual(frames[frames.length - 1]!.boxes);
      clsTotal += r.cls;
      clsSupported.push(r.clsSupported);
    }
    // Layout-shift entries are exposed by Chromium (required there); wherever
    // they exist the summed CLS must be exactly 0. Every engine is also held
    // to the geometric no-shift check above.
    if (browserName === 'chromium') expect(clsSupported.every(Boolean), 'Chromium exposes layout-shift').toBe(true);
    expect(clsTotal, 'CLS summed over all reloads').toBe(0);
    expect(framesSeen).toBeGreaterThanOrEqual(RELOADS * (FRAMES - 2));
    expect(blurFrames, `blur frames across ${RELOADS} reloads`).toBe(0);
  });
});
