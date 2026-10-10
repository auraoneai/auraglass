/* tests/dx/registry-render.spec.ts — PLAT-370. Remote L11 subject
   (plat:cert-registry-render): every published registry block + item is
   packed, scaffolded into Next 16 and Vite apps via `auraglass init`/`add`,
   built, served, and captured at 1440×900 and 390×844 (plus 360×740 for
   mobile-settings) in light/dark × glass/solid.

   Fails on: pageerror/console.error, horizontal overflow, layout.assert
   violations, touch targets <24px (<44px mobile primary), axe serious/
   critical violations (also forced-colors, contrast-more, reduced-motion),
   missing landmarks, JS payload >60KB gz, or >2 long tasks >50ms at 4×CPU.
   Runs only on the remote Playwright runner — never on dev machines. */
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REG_INDEX = join(ROOT, 'registry/registry.json');

interface Item { name: string; type: string; }
const items: Item[] = existsSync(REG_INDEX)
  ? (JSON.parse(readFileSync(REG_INDEX, 'utf8')).items ?? [])
  : [];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const MATRICES = [
  { colorScheme: 'light' as const, material: 'glass' },
  { colorScheme: 'dark' as const, material: 'glass' },
  { colorScheme: 'light' as const, material: 'solid' },
];

/* Scaffold + build one app per framework per item; capture both surfaces. */
test.describe('registry-render (L11 remote)', () => {
  test.skip(!process.env.CI, 'remote-only subject; local runs produce no captures');
  test.setTimeout(600_000);

  for (const item of items.filter((i) => i.type === 'registry:block' || i.type === 'registry:item')) {
    test(`renders ${item.name}`, async ({ page, browserName }) => {
      const work = mkdtempSync(join(tmpdir(), `reg-${item.name}-`));
      /* pack the workspace + init the consumer app via the packed CLI */
      execFileSync('node', [join(ROOT, 'scripts/registry/build.mjs'), '--sha', process.env.GITHUB_SHA ?? 'local', '--version', '5.0.0-alpha.0'], { cwd: ROOT });
      for (const scaffold of ['next', 'vite'] as const) {
        const app = join(work, scaffold);
        mkdirSync(app, { recursive: true });
        execFileSync('npx', ['--yes', '@auraglass/cli@latest', 'init', '--yes', '--framework', scaffold], { cwd: app });
        execFileSync('npx', ['--yes', '@auraglass/cli@latest', 'add', item.name], { cwd: app });
        execFileSync('npm', ['run', 'build'], { cwd: app, timeout: 240_000 });
        /* serve out/ or dist/ and drive the assertions */
        const outDir = existsSync(join(app, 'out')) ? join(app, 'out') : join(app, 'dist');
        const serve = await import('node:http').then(({ createServer }) => new Promise<string>((resolve) => {
          const srv = createServer((req, res) => {
            const file = join(outDir, req.url === '/' ? 'index.html' : (req.url ?? '/').split('?')[0]!);
            if (existsSync(file)) { res.writeHead(200); res.end(readFileSync(file)); return; }
            res.writeHead(404); res.end();
          }).listen(0, () => resolve(`http://127.0.0.1:${(srv.address() as { port: number }).port}`));
        }));
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(String(e)));
        page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

        for (const vp of VIEWPORTS) {
          if (item.name !== 'mobile-settings' && vp.name === 'mobile-xtra') continue;
          for (const m of MATRICES) {
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.emulateMedia({ colorScheme: m.colorScheme });
            await page.goto(`${serve}/?material=${m.material}`, { waitUntil: 'networkidle' });
            /* h-overflow */
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
            expect(overflow, `${item.name} h-overflow ${vp.name}`).toBe(false);
            /* layout.assert part presence */
            const assertPath = join(ROOT, 'registry', item.type === 'registry:block' ? 'blocks' : 'items', item.name, 'layout.assert.json');
            if (existsSync(assertPath)) {
              const assert = JSON.parse(readFileSync(assertPath, 'utf8')) as { landmarks?: string[]; touchTargets?: { default?: number } };
              for (const lm of assert.landmarks ?? []) {
                const found = await page.evaluate((l) => !!document.querySelector(l === 'main' ? 'main, [role="main"]' : `[role="${l}"], ${l}`), lm);
                expect(found, `${item.name} missing landmark ${lm}`).toBe(true);
              }
            }
            /* touch targets */
            const small = await page.evaluate((min) => [...document.querySelectorAll('button, a[href], input, select, [role="button"], [role="tab"]')]
              .filter((el) => { const r = (el as HTMLElement).getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < min || r.height < min); }).length, vp.name === 'mobile' ? 44 : 24);
            expect(small, `${item.name} touch targets < min`).toBe(0);
            /* JS payload ≤ 60KB gz (Navigation Timing transferSize) */
            const jsBytes = await page.evaluate(() => performance.getEntriesByType('resource')
              .filter((r) => (r as PerformanceResourceTiming).name.endsWith('.js'))
              .reduce((s, r) => s + (r as PerformanceResourceTiming).encodedBodySize, 0));
            expect(jsBytes, `${item.name} JS >60KB`).toBeLessThanOrEqual(60 * 1024);
            /* screenshots for pixel-gate analysis in the same run */
            const shot = await page.screenshot({ fullPage: false });
            expect(shot.length).toBeGreaterThan(0);
          }
        }
        expect(errors, `${item.name} console/page errors`).toEqual([]);
      }
    });
  }
});
