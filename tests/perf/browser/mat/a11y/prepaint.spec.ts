/* REQ-MAT-59 (FIN-D D.3-35): pre-paint execution budget, <= 1 ms on the
   mid-tier mobile profile (Chromium, 390x844 mobile viewport, 4x CPU
   throttle via CDP — the Lighthouse mid-tier mobile slowdown). The script is
   <AuraGlassScript/> from the BUILT package (aura-glass/theme => dist/), with a
   persisted record so the full resolution path runs. Timing brackets the
   inline script with performance.now() marks in sibling scripts; the p95 over
   30 reloads must be within the budget row prepaint.exec.midTierMobile
   (tests/perf/harness/budgets.json when PERF lands it, else
   tests/perf/browser/mat/budgets.mat.json; missing both fails closed). Remote
   only; never skips — a missing dist/ fails the spec. */
import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const ROOT = process.cwd();
const pkgRequire = createRequire(join(ROOT, 'package.json'));
const PERF_BUDGETS = join(ROOT, 'tests/perf/harness/budgets.json');
const MAT_BUDGETS = join(ROOT, 'tests/perf/browser/mat/budgets.mat.json');
const NONCE = 'cHJlcGFpbnQtcGVyZg';
const RELOADS = 30;

interface BudgetRow { value: number; unit: string; req?: string }
const budget = (key: string): number => {
  const files = [PERF_BUDGETS, MAT_BUDGETS].filter(existsSync);
  expect(files.length, 'budget source missing (perf harness or mat fragment) — fails closed').toBeGreaterThan(0);
  for (const f of files) {
    const json = JSON.parse(readFileSync(f, 'utf8')) as { budgets?: Record<string, BudgetRow | number> };
    const row = json.budgets?.[key];
    if (row !== undefined) return typeof row === 'number' ? row : row.value;
  }
  throw new Error(`budget ${key} missing from ${files.join(', ')}`);
};

const p95 = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(0.95 * s.length))]!;
};

test.describe('prepaint perf (mid-tier mobile)', () => {
  // Firefox has no isMobile emulation; it only reaches this spec via the root
  // projects and runs it with the mobile viewport alone.
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: async ({ browserName }, provide) => { await provide(browserName !== 'firefox'); },
    hasTouch: true,
  });

  test('AuraGlassScript executes in <= 1 ms p95 (mid-tier mobile: 4x CPU on Chromium)', async ({ page, context, browserName }) => {
    const limit = budget('prepaint.exec.midTierMobile');
    expect(limit).toBe(1);

    const theme = (await import(pathToFileURL(pkgRequire.resolve('aura-glass/theme')).href)) as {
      AuraGlassScript: (p: { nonce?: string }) => unknown;
    };
    const tag = renderToStaticMarkup(createElement(theme.AuraGlassScript as never, { nonce: NONCE }));
    expect(tag.startsWith(`<script nonce="${NONCE}">`)).toBe(true);
    const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<script nonce="${NONCE}">window.__t0=performance.now()</script>
${tag}
<script nonce="${NONCE}">window.__t1=performance.now()</script>
</head><body><div class="ag-surface" data-ag-surface="card">surface</div></body></html>`;

    await context.addInitScript(() => {
      localStorage.setItem('ag:prefs:v1', JSON.stringify({
        transparency: 'tinted', contrast: 'more', motion: 'calm', scheme: 'dark',
        density: 'compact', tier: 'enhanced', glassOpacity: 0.5, allowContinuous: true,
      }));
    });
    await page.route('http://ag-prepaint-perf.test/**', (route) => route.fulfill({
      status: 200,
      contentType: 'text/html',
      headers: { 'Content-Security-Policy': `script-src 'nonce-${NONCE}'` },
      body: html,
    }));
    // CPU throttling is a CDP facility: the mid-tier profile (the budget's
    // definition, project mat:prepaint-perf) is Chromium. Other engines that
    // pick this spec up (root projects) are held to the same 1 ms unthrottled.
    const throttled = browserName === 'chromium';
    if (throttled) {
      const session = await context.newCDPSession(page);
      await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }

    const samples: number[] = [];
    for (let i = 0; i < RELOADS; i += 1) {
      await page.goto('http://ag-prepaint-perf.test/');
      const r = await page.evaluate(() => {
        const w = window as unknown as { __t0?: number; __t1?: number };
        return {
          t0: w.__t0, t1: w.__t1,
          transparency: document.documentElement.getAttribute('data-ag-transparency'),
        };
      });
      expect(r.transparency, 'the pre-paint script ran').toBe('tinted');
      expect(typeof r.t0).toBe('number');
      expect(typeof r.t1).toBe('number');
      samples.push(r.t1! - r.t0!);
    }
    const value = p95(samples);
    test.info().annotations.push({
      type: 'perf',
      description: `prepaint.exec p95=${value.toFixed(3)} ms over ${RELOADS} reloads (${browserName}, ${throttled ? '4x CPU' : 'unthrottled'}, 390x844)`,
    });
    expect(value, 'prepaint p95 execution (ms)').toBeLessThanOrEqual(limit);
  });
});
