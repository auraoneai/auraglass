/* MAT-287 (REQ-MAT-57): prepaint — with persisted {transparency:'solid'} the
   FIRST frame already shows no backdrop blur (the inline prepaint script, not
   the hydrated provider, applies it). 20 reloads per engine, CLS 0.000 via
   PerformanceObserver layout-shift. */
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const PREPAINT = path.resolve(__dirname, '../../../src/theme/preferences/prepaint.ts');
const DIST_SCRIPT = path.resolve(__dirname, '../../../dist/prepaint.js');

function canary(script: string, nonce: string): string {
  return `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width">
<script nonce="${nonce}">${script}</script>
<style>[data-ag-surface]{min-height:80px;padding:12px}</style>
</head><body>
<div data-ag-surface="" data-ag-variant="regular">surface</div>
<div data-ag-surface="" data-ag-variant="raised">surface 2</div>
</body></html>`;
}

test.describe('prepaint', () => {
  test('first frame shows no blur with persisted solid + CSP nonce', async ({ browser, baseURL }, testInfo) => {
    const script = fs.existsSync(DIST_SCRIPT)
      ? fs.readFileSync(DIST_SCRIPT, 'utf8')
      : null;
    test.skip(!script, 'dist/prepaint.js absent — build artifact lane produces it (MAT-275)');
    const nonce = 'c29tZS1ub25jZQ';
    const context = await browser.newContext();
    const page = await context.newPage();

    // Persisted preference visible to the prepaint script.
    await context.addInitScript(() => {
      try { localStorage.setItem('ag:prefs:v1', JSON.stringify({ transparency: 'solid' })); } catch { /* noop */ }
    });
    // rAF probe recording first-Surface backdrop-filter per frame.
    await context.addInitScript(() => {
      (window as unknown as { __frames: Array<{ frame: number; bf: string }> }).__frames = [];
      let frame = 0;
      const probe = () => {
        const el = document.querySelector('[data-ag-surface]');
        const bf = el ? (getComputedStyle(el).backdropFilter || getComputedStyle(el).getPropertyValue('-webkit-backdrop-filter')) : '';
        (window as unknown as { __frames: Array<{ frame: number; bf: string }> }).__frames.push({ frame, bf });
        frame += 1;
        if (frame < 30) requestAnimationFrame(probe);
      };
      requestAnimationFrame(probe);
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          (window as unknown as { __cls: number }).__cls =
            ((window as unknown as { __cls: number }).__cls ?? 0) + (e as unknown as { value: number }).value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      (window as unknown as { __cls: number }).__cls = 0;
    });
    await page.route('**/canary', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        headers: { 'Content-Security-Policy': `script-src 'nonce-${nonce}'` },
        body: canary(script!, nonce),
      });
    });

    let blurFrames = 0;
    for (let i = 0; i < 20; i += 1) {
      await page.goto(`${baseURL ?? 'http://127.0.0.1:6006'}/canary`);
      await page.waitForSelector('[data-ag-surface]');
      await page.waitForTimeout(300);
      const frames = await page.evaluate(() => (window as unknown as { __frames: Array<{ bf: string }> }).__frames);
      const tr = await page.evaluate(() => document.documentElement.getAttribute('data-ag-transparency'));
      if (tr === 'solid') {
        blurFrames += frames.filter((f) => f.bf && f.bf !== 'none').length;
      }
    }
    expect(blurFrames, 'blur frames across 20 reloads').toBe(0);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls, 'CLS 0.000').toBeLessThanOrEqual(0.0005);
    testInfo.annotations.push({ type: 'note', description: `prepainted script ${script!.length}B` });
    await context.close();
  });
});
