/* tests/dx/registry-render.spec.ts — PLAT-370 / REQ-PLAT-97. Remote L11 subject
   (plat:test:registry, fragments/lanes/plat.ts): every discovered registry
   block + item is added with the packed `aura-glass-cli` (init --yes /
   add <item> --yes) into fresh Next 16 and Vite apps built against the packed
   `aura-glass`, served from the production build, and captured at 1440×900 and
   390×844 (plus 360×740 for mobile-settings) in light/dark × glass/solid.
   Runs in Chromium and WebKit (tests/dx/registry.playwright.config.ts).

   Setup (pack, scaffold, init, add, build) is scripts/registry/render-setup.mjs,
   run once by the CI job before this spec; an item whose add/demo/build failed
   fails here with that reason. The packed CLI comes from this commit.

   Per capture it fails on: pageerror/console.error (buffered per capture),
   horizontal overflow, the landmark set (blocks: banner, navigation, main and
   one h1, or the set named in layout.assert.json), layout.assert.json
   geometric predicates, touch targets <24 px (<44 px for primary controls at a
   mobile viewport), a visible control not reachable with Tab, axe
   serious/critical (colour contrast on), first-render JS >60 KB gz, and the
   pixel gates of tests/dx/lib/pixel-gates.ts (not blank, surface separation,
   rendered-pixel text contrast, glass density ≤0.3, material presence). Per
   framework it also runs axe under forced colors, prefers-contrast: more and
   reduced motion, and (Chromium, CDP) allows ≤2 long tasks >50 ms at 4× CPU.

   The pass flag is the conjunction of every assertion: afterEach writes one
   record per (item, project) with Playwright's final status for CI_COMMIT_SHA
   (never the GitHub SHA variable); scripts/registry/certification.mjs aggregates them and
   scripts/registry/build.mjs --certification sets meta.auraglass.certified.
   Runs only on the remote Playwright runner — never on dev machines. */
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createServer, type Server } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, dirname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import {
  CONTROL_SELECTOR, PRIMARY_MOBILE_CONTROLS, TAB_STOP_SELECTOR, evalPredicate, landmarkSelector, predicatesFor, requiredLandmarks,
  type LayoutAssert,
} from './lib/layout-assert';
import {
  failed, glassDensity, glassOverNothing, lumaStats, notBlank, separation, solidHasNoBlur, worstTextContrast,
  type Frame, type GateResult,
} from './lib/pixel-gates';
import {
  HIDE_ALL_CSS, activeTabStop, installLongTaskProbe, markSurfaces, markTabStops, probeBackdrops, probeBoxes, probeLandmarks,
  probeTextRuns, probeTouchTargets,
} from './lib/registry-probes';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REG_INDEX = join(ROOT, 'registry/registry.json');
const RENDER_DIR = process.env.AG_REGISTRY_RENDER_DIR ?? join(tmpdir(), 'ag-registry-render');
const MANIFEST = join(RENDER_DIR, 'manifest.json');
const CERT_DIR = process.env.AG_REGISTRY_CERT_DIR ?? join(RENDER_DIR, 'certification');
const SHA = process.env.CI_COMMIT_SHA ?? null;
const JS_BUDGET_GZ = 60 * 1024;
const MAX_LONG_TASKS = 2;

interface Item { name: string; type: string }
interface Cell { status: string; stage?: string; error?: string; route?: string }
interface Manifest {
  frameworks: Record<string, { status: string; outDir?: string; error?: string }>;
  items: Record<string, { next: Cell; vite: Cell }>;
}

const items: Item[] = existsSync(REG_INDEX)
  ? ((JSON.parse(readFileSync(REG_INDEX, 'utf8')).items ?? []) as Item[]).filter((i) => i.type === 'registry:block' || i.type === 'registry:item')
  : [];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];
const XS_VIEWPORT = { name: 'mobile-xs', width: 360, height: 740, mobile: true };
const MATRICES = [
  { colorScheme: 'light' as const, material: 'glass' as const },
  { colorScheme: 'dark' as const, material: 'glass' as const },
  { colorScheme: 'light' as const, material: 'solid' as const },
  { colorScheme: 'dark' as const, material: 'solid' as const },
];
const EMULATIONS = [
  { name: 'forced-colors', media: { forcedColors: 'active' as const }, query: '(forced-colors: active)' },
  { name: 'prefers-contrast-more', media: { contrast: 'more' as const }, query: '(prefers-contrast: more)' },
  { name: 'reduced-motion', media: { reducedMotion: 'reduce' as const }, query: '(prefers-reduced-motion: reduce)' },
];
const NO_EMULATION = { forcedColors: null, contrast: null, reducedMotion: null } as const;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain',
};

/** Static production server over a build output dir (path-contained). */
function serve(outDir: string): Promise<{ base: string; server: Server; resolve: (urlPath: string) => string | null }> {
  const resolve = (urlPath: string): string | null => {
    let p = normalize(join(outDir, decodeURIComponent(urlPath.split('?')[0] ?? '/')));
    if (p !== outDir && !p.startsWith(outDir + sep)) return null;
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    return existsSync(p) && statSync(p).isFile() ? p : null;
  };
  return new Promise((done) => {
    const server = createServer((req, res) => {
      const file = resolve(req.url ?? '/');
      if (!file) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
    }).listen(0, '127.0.0.1', () => done({ base: `http://127.0.0.1:${(server.address() as { port: number }).port}`, server, resolve }));
  });
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts?.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
}

async function applyMaterial(page: Page, material: string) {
  await page.evaluate((m) => {
    if (m === 'solid') document.documentElement.setAttribute('data-ag-transparency', 'solid');
    else document.documentElement.removeAttribute('data-ag-transparency');
  }, material);
  await settle(page);
}

/** CSS-px screenshot decoded to RGBA on a separate blank page (the subject page is never touched). */
async function capture(page: Page, decoder: Page): Promise<Frame> {
  const png = await page.screenshot({ scale: 'css', animations: 'disabled', caret: 'hide' });
  const { b64, width, height } = await decoder.evaluate(async (src) => {
    const img = new Image();
    img.src = `data:image/png;base64,${src}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, img.width, img.height).data;
    let s = '';
    for (let i = 0; i < d.length; i += 0x8000) s += String.fromCharCode(...d.subarray(i, i + 0x8000));
    return { b64: btoa(s), width: img.width, height: img.height };
  }, png.toString('base64'));
  return { data: new Uint8ClampedArray(Buffer.from(b64, 'base64')), width, height };
}

async function captureWith(page: Page, decoder: Page, css: string): Promise<Frame> {
  const handle = await page.addStyleTag({ content: css });
  await settle(page);
  try { return await capture(page, decoder); } finally {
    await handle.evaluate((el) => (el as Element).remove());
    await settle(page);
  }
}

/** §15.2 pixel gates for one capture. */
async function pixelGates(page: Page, decoder: Page, material: 'glass' | 'solid', viewport: { width: number; height: number }): Promise<{ results: GateResult[]; shot: Frame }> {
  const results: GateResult[] = [];
  const shot = await capture(page, decoder);
  const backdrop = await captureWith(page, decoder, HIDE_ALL_CSS);
  const full = { x: 0, y: 0, w: shot.width, h: shot.height };
  results.push(notBlank(shot, backdrop, full));
  results.push(worstTextContrast(shot, (await page.evaluate(probeTextRuns)).map((r) => ({ ...r, rect: { x: r.rect.x, y: r.rect.y, w: r.rect.width, h: r.rect.height } }))));
  const blurred = await page.evaluate(probeBackdrops);
  results.push(glassDensity(blurred, viewport));
  if (material === 'solid') results.push(solidHasNoBlur(blurred.length));

  /* separation (+ glass over nothing for top-level glass): one capture per nesting depth, hiding exactly that depth. */
  const surfaces = await page.evaluate(markSurfaces);
  const backdropSigma = lumaStats(backdrop, full).sigma;
  for (const depth of [...new Set(surfaces.map((s) => s.depth))].sort((a, b) => a - b)) {
    const at = surfaces.filter((s) => s.depth === depth);
    const hidden = await captureWith(page, decoder, at.map((s) => `[data-ag-qa-surface="${s.index}"]`).join(', ') + ' { visibility: hidden !important; }');
    for (const s of at) {
      const box = { x: s.rect.x, y: s.rect.y, w: s.rect.width, h: s.rect.height };
      const sep = separation(shot, hidden, box);
      results.push({ ...sep, detail: `${s.label}: ${sep.detail}` });
      if (material === 'glass' && depth === 0 && s.glass) results.push(glassOverNothing(hidden, box, backdropSigma, s.label));
    }
  }
  return { results, shot };
}

function loadLayoutAssert(item: Item): LayoutAssert | null {
  const p = join(ROOT, 'registry', item.type === 'registry:block' ? 'blocks' : 'items', item.name, 'layout.assert.json');
  return existsSync(p) ? (JSON.parse(readFileSync(p, 'utf8')) as LayoutAssert) : null;
}

async function tabUnreachable(page: Page): Promise<string[]> {
  const stops = await page.evaluate(markTabStops, TAB_STOP_SELECTOR);
  const seen = new Set<number>();
  for (let i = 0; i < stops.length + 10 && seen.size < stops.length; i++) {
    await page.keyboard.press('Tab');
    const at = await page.evaluate(activeTabStop);
    if (at !== null) seen.add(at);
  }
  return stops.filter((_, i) => !seen.has(i));
}

test.afterEach(async ({}, testInfo) => {
  const item = testInfo.annotations.find((a) => a.type === 'registry-item')?.description;
  if (!item) return;
  mkdirSync(CERT_DIR, { recursive: true });
  const status = testInfo.status === 'passed' && testInfo.expectedStatus === 'passed' ? 'passed' : (testInfo.status ?? 'unknown');
  writeFileSync(join(CERT_DIR, `${item}--${testInfo.project.name}.json`), `${JSON.stringify({ item, project: testInfo.project.name, sha: SHA, status, retry: testInfo.retry })}\n`);
});

test.describe('registry-render (L11 remote)', () => {
  test.setTimeout(20 * 60_000);

  for (const item of items) {
    test(`renders ${item.name}`, async ({ page, context, browserName }) => {
      test.info().annotations.push({ type: 'registry-item', description: item.name });
      // remote-only subject (plat:test:registry): a local run fails, never skips (PRD §18)
      expect(process.env.CI, 'remote-only subject: runs in GitLab plat:test:registry (CI)').toBeTruthy();
      expect(SHA, 'CI_COMMIT_SHA unset: the certification record needs the commit under test').toBeTruthy();
      expect(existsSync(MANIFEST), `render setup manifest missing (${MANIFEST}): run scripts/registry/render-setup.mjs first`).toBe(true);
      const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as Manifest;
      const entry = manifest.items[item.name];
      expect(entry, `${item.name} absent from the render setup manifest`).toBeTruthy();

      const kind = item.type === 'registry:block' ? 'block' : 'item';
      const la = loadLayoutAssert(item);
      const { landmarks, oneH1 } = requiredLandmarks(kind, la);
      const minTarget = la?.touchTargets?.default ?? 24;
      const minPrimary = la?.touchTargets?.mobilePrimary ?? 44;
      await page.addInitScript(installLongTaskProbe);
      const decoder = await (context as BrowserContext).newPage();

      try {
        for (const fw of ['next', 'vite'] as const) {
          const cell = entry![fw];
          expect(cell.status, `${item.name} [${fw}] ${cell.stage ?? ''} failed:\n${cell.error ?? ''}`).toBe('built');
          const outDir = manifest.frameworks[fw]!.outDir!;
          const { base, server, resolve } = await serve(outDir);
          const url = `${base}${cell.route}`;
          let errors: string[] = [];
          page.on('pageerror', (e) => errors.push(String(e)));
          page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
          try {
            const viewports = item.name === 'mobile-settings' ? [...VIEWPORTS, XS_VIEWPORT] : VIEWPORTS;
            for (const vp of viewports) {
              for (const m of MATRICES) {
                const label = `${item.name} [${browserName} ${fw} ${vp.name} ${m.colorScheme}/${m.material}]`;
                errors = [];
                await page.setViewportSize({ width: vp.width, height: vp.height });
                await page.emulateMedia({ colorScheme: m.colorScheme, ...NO_EMULATION });
                await page.goto(url, { waitUntil: 'networkidle' });
                await applyMaterial(page, m.material);

                /* h-overflow */
                const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
                expect.soft(overflow, `${label} h-overflow`).toBe(false);

                /* landmark set + one h1 */
                const lm = await page.evaluate(probeLandmarks, Object.fromEntries(landmarks.map((l) => [l, landmarkSelector(l)])));
                expect.soft(landmarks.filter((l) => !lm.found[l]), `${label} missing landmarks`).toEqual([]);
                if (oneH1) expect.soft(lm.h1, `${label} must have exactly one h1`).toBe(1);

                /* layout.assert geometric predicates */
                const preds = predicatesFor(la, vp.width);
                if (preds.length) {
                  const boxes = await page.evaluate(probeBoxes, la!.boxes ?? {});
                  const bad = preds.map((p) => evalPredicate(p.assert, boxes)).filter((r) => !r.pass).map((r) => r.detail);
                  expect.soft(bad, `${label} layout.assert predicates`).toEqual([]);
                }

                /* touch targets */
                const small = await page.evaluate(probeTouchTargets, { controls: CONTROL_SELECTOR, primary: PRIMARY_MOBILE_CONTROLS, min: minTarget, minPrimary: vp.mobile ? minPrimary : 0 });
                expect.soft(small, `${label} touch targets`).toEqual([]);

                /* axe serious/critical (colour contrast on) */
                const axe = await new AxeBuilder({ page }).analyze();
                const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.length} node(s)`);
                expect.soft(serious, `${label} axe serious/critical`).toEqual([]);

                /* first-render JS <= 60KB gz, gzipped from the served build files */
                const jsUrls = await page.evaluate(() => performance.getEntriesByType('resource').map((r) => r.name).filter((n) => /\.m?js(\?|$)/.test(n)));
                let gz = 0;
                for (const u of new Set(jsUrls)) {
                  const file = resolve(new URL(u).pathname);
                  if (file) gz += gzipSync(readFileSync(file)).length;
                }
                expect.soft(gz, `${label} first-render JS ${gz}B gz > ${JS_BUDGET_GZ}B`).toBeLessThanOrEqual(JS_BUDGET_GZ);

                /* pixel gates */
                const { results } = await pixelGates(page, decoder, m.material, vp);
                expect.soft(failed(results).map((r) => `${r.gate}: ${r.detail}`), `${label} pixel gates`).toEqual([]);
                const shot = await page.screenshot();
                await test.info().attach(`${browserName}-${fw}-${vp.name}-${m.colorScheme}-${m.material}.png`, { body: shot, contentType: 'image/png' });

                /* keyboard: every visible tab stop is reachable with Tab */
                expect.soft(await tabUnreachable(page), `${label} controls not reachable with Tab`).toEqual([]);

                expect.soft(errors, `${label} console/page errors`).toEqual([]);
              }
            }

            /* preference emulations at 1440 (axe legs) */
            await page.setViewportSize({ width: 1440, height: 900 });
            for (const em of EMULATIONS) {
              const label = `${item.name} [${browserName} ${fw} ${em.name}]`;
              errors = [];
              await page.emulateMedia({ colorScheme: 'light', ...NO_EMULATION, ...em.media });
              await page.goto(url, { waitUntil: 'networkidle' });
              await settle(page);
              if (browserName === 'chromium') expect.soft(await page.evaluate((q) => matchMedia(q).matches, em.query), `${label} emulation did not apply`).toBe(true);
              const axe = await new AxeBuilder({ page }).analyze();
              expect.soft(axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.length} node(s)`), `${label} axe serious/critical`).toEqual([]);
              expect.soft(errors, `${label} console/page errors`).toEqual([]);
            }
            await page.emulateMedia({ colorScheme: 'light', ...NO_EMULATION });

            /* <= 2 long tasks > 50 ms at 4x CPU throttle (CDP: Chromium) */
            if (browserName === 'chromium') {
              const cdp = await context.newCDPSession(page);
              await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
              try {
                await page.goto(url, { waitUntil: 'networkidle' });
                await page.waitForTimeout(1000);
                const tasks = await page.evaluate(() => ((window as unknown as { __agLongTasks?: number[] }).__agLongTasks ?? []).filter((d) => d > 50));
                expect.soft(tasks.length, `${item.name} [${fw}] long tasks >50 ms at 4× CPU: ${tasks.map((d) => Math.round(d)).join(', ')}`).toBeLessThanOrEqual(MAX_LONG_TASKS);
              } finally {
                await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
                await cdp.detach();
              }
            }
          } finally {
            page.removeAllListeners('pageerror');
            page.removeAllListeners('console');
            server.close();
          }
        }
      } finally {
        await decoder.close();
      }
    });
  }
});
