/* tests/dx/registry-render.spec.ts — PLAT-370 / REQ-PLAT-97. Remote L11 subject
   (plat:test:registry): every discovered registry block + item is added with
   the packed `aura-glass-cli` (init --yes / add <item> --yes) into fresh
   Next 16 and Vite apps built against the packed `aura-glass`, served from
   the production build, and captured at 1440×900 and 390×844 (plus 360×740
   for mobile-settings) in light/dark × glass/solid.

   Setup (pack, scaffold, init, add, build) is scripts/registry/render-setup.mjs,
   run once by the CI job before this spec; its manifest records each
   item×framework outcome, and an item whose add/demo/build failed fails here
   with that reason. The packed CLI comes from this commit — never from the
   public npm registry.

   Fails on: pageerror/console.error (buffered per capture), horizontal
   overflow, layout.assert landmarks, touch targets <24px (<44px mobile),
   axe serious/critical violations, or first-render JS >60KB gz.
   Runs only on the remote Playwright runner — never on dev machines. */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createServer, type Server } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, dirname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REG_INDEX = join(ROOT, 'registry/registry.json');
const RENDER_DIR = process.env.AG_REGISTRY_RENDER_DIR ?? join(tmpdir(), 'ag-registry-render');
const MANIFEST = join(RENDER_DIR, 'manifest.json');
const JS_BUDGET_GZ = 60 * 1024;

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
  { name: 'desktop', width: 1440, height: 900, minTarget: 24 },
  { name: 'mobile', width: 390, height: 844, minTarget: 44 },
];
const XS_VIEWPORT = { name: 'mobile-xs', width: 360, height: 740, minTarget: 44 };
const MATRICES = [
  { colorScheme: 'light' as const, material: 'glass' },
  { colorScheme: 'dark' as const, material: 'glass' },
  { colorScheme: 'light' as const, material: 'solid' },
  { colorScheme: 'dark' as const, material: 'solid' },
];

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

async function applyMaterial(page: Page, material: string) {
  await page.evaluate((m) => {
    if (m === 'solid') document.documentElement.setAttribute('data-ag-transparency', 'solid');
    else document.documentElement.removeAttribute('data-ag-transparency');
  }, material);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test.describe('registry-render (L11 remote)', () => {
  test.setTimeout(600_000);

  for (const item of items) {
    test(`renders ${item.name}`, async ({ page }) => {
      // remote-only subject (plat:test:registry): a local run fails, never skips (PRD §18)
      expect(process.env.CI, 'remote-only subject: runs in GitLab plat:test:registry (CI)').toBeTruthy();
      expect(existsSync(MANIFEST), `render setup manifest missing (${MANIFEST}): run scripts/registry/render-setup.mjs first`).toBe(true);
      const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as Manifest;
      const entry = manifest.items[item.name];
      expect(entry, `${item.name} absent from the render setup manifest`).toBeTruthy();

      for (const fw of ['next', 'vite'] as const) {
        const cell = entry![fw];
        expect(cell.status, `${item.name} [${fw}] ${cell.stage ?? ''} failed:\n${cell.error ?? ''}`).toBe('built');
        const outDir = manifest.frameworks[fw]!.outDir!;
        const { base, server, resolve } = await serve(outDir);
        try {
          let errors: string[] = [];
          page.on('pageerror', (e) => errors.push(String(e)));
          page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

          const viewports = item.name === 'mobile-settings' ? [...VIEWPORTS, XS_VIEWPORT] : VIEWPORTS;
          for (const vp of viewports) {
            for (const m of MATRICES) {
              const label = `${item.name} [${fw} ${vp.name} ${m.colorScheme}/${m.material}]`;
              errors = [];
              await page.setViewportSize({ width: vp.width, height: vp.height });
              await page.emulateMedia({ colorScheme: m.colorScheme });
              await page.goto(`${base}${cell.route}`, { waitUntil: 'networkidle' });
              await applyMaterial(page, m.material);

              /* h-overflow */
              const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
              expect(overflow, `${label} h-overflow`).toBe(false);

              /* layout.assert landmarks */
              const assertPath = join(ROOT, 'registry', item.type === 'registry:block' ? 'blocks' : 'items', item.name, 'layout.assert.json');
              if (existsSync(assertPath)) {
                const assert = JSON.parse(readFileSync(assertPath, 'utf8')) as { landmarks?: string[] };
                for (const lm of assert.landmarks ?? []) {
                  const found = await page.evaluate((l) => !!document.querySelector(l === 'main' ? 'main, [role="main"]' : `[role="${l}"], ${l}`), lm);
                  expect(found, `${label} missing landmark ${lm}`).toBe(true);
                }
              }

              /* touch targets */
              const small = await page.evaluate((min) => [...document.querySelectorAll('button, a[href], input, select, [role="button"], [role="tab"]')]
                .filter((el) => { const r = (el as HTMLElement).getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < min || r.height < min); })
                .map((el) => el.outerHTML.slice(0, 120)), vp.minTarget);
              expect(small, `${label} touch targets < ${vp.minTarget}px`).toEqual([]);

              /* axe serious/critical */
              const axe = await new AxeBuilder({ page }).analyze();
              const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.length} node(s)`);
              expect(serious, `${label} axe serious/critical`).toEqual([]);

              /* first-render JS <= 60KB gz, gzipped from the served build files */
              const jsUrls = await page.evaluate(() => performance.getEntriesByType('resource')
                .map((r) => r.name).filter((n) => /\.m?js(\?|$)/.test(n)));
              let gz = 0;
              for (const u of new Set(jsUrls)) {
                const file = resolve(new URL(u).pathname);
                if (file) gz += gzipSync(readFileSync(file)).length;
              }
              expect(gz, `${label} first-render JS ${gz}B gz > ${JS_BUDGET_GZ}B`).toBeLessThanOrEqual(JS_BUDGET_GZ);

              /* capture for pixel-gate analysis */
              const shot = await page.screenshot({ fullPage: false });
              await test.info().attach(`${fw}-${vp.name}-${m.colorScheme}-${m.material}.png`, { body: shot, contentType: 'image/png' });
              expect(shot.length).toBeGreaterThan(0);

              expect(errors, `${label} console/page errors`).toEqual([]);
            }
          }
        } finally {
          page.removeAllListeners('pageerror');
          page.removeAllListeners('console');
          server.close();
        }
      }
    });
  }
});
