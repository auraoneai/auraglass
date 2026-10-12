// topbar.visual.spec.ts — REQ-SURF-36 L6 `topbar__*` cells (remote Playwright
// lane only; never run on a developer Mac).
//
// Cells: topbar__inline, topbar__overlay, topbar__solid, topbar__forced-colors,
// each at 320 and 1440 px. Every cell renders a named AppShell story, proves
// its environment took effect, then asserts the REQ-SURF-36 property it covers
// from the rendered page (computed style, geometry and the captured pixels of
// the bar's bottom edge). No committed screenshot baseline is involved: each
// cell's capture is written to
// .artifacts/surf/<CI_JOB_NAME_SLUG>/topbar/<cell>__<width>.png as evidence.
// The subject is resolved from the Storybook subject index; a missing story
// fails the cell.
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gotoStory, listSubjects } from '../../../helpers';

const WIDTHS = [320, 1440] as const;
const BAR = '.ag-app-shell [data-ag-part="top-bar"]';
const EVIDENCE = join(
  process.cwd(),
  process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts',
  'surf',
  process.env.CI_JOB_NAME_SLUG ?? 'topbar-visual',
  'topbar',
);

async function storyId(suffix: 'default' | 'overlay-top-bar'): Promise<string> {
  const subjects = await listSubjects({ owner: 'SURF' });
  const hit = subjects.find((s) => s.subject === 'AppShell' && s.id.endsWith(`--${suffix}`));
  if (!hit) throw new Error(`AppShell story '--${suffix}' is not registered`);
  return hit.id;
}

async function open(page: Page, width: number, suffix: 'default' | 'overlay-top-bar', env: { transparency?: 'solid' } = {}) {
  await page.setViewportSize({ width, height: width < 600 ? 640 : 900 });
  await gotoStory(page, await storyId(suffix), env);
  await expect(page.locator(BAR)).toHaveCount(1);
}

async function evidence(page: Page, cell: string, width: number): Promise<Buffer> {
  const png = await page.locator(BAR).screenshot({ animations: 'disabled', caret: 'hide' });
  mkdirSync(EVIDENCE, { recursive: true });
  writeFileSync(join(EVIDENCE, `topbar__${cell}__${width}.png`), png);
  return png;
}

/** Shared at every width: no horizontal page overflow; the title is one line. */
async function commonChecks(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const title = await page.locator(`${BAR} [data-ag-part="top-bar-title"], ${BAR} .ag-top-bar__title`).first().evaluate((el) => {
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    return { whiteSpace: cs.whiteSpace, textOverflow: cs.textOverflow, lines: Math.round(el.getBoundingClientRect().height / lh) };
  });
  expect(title.whiteSpace).toBe('nowrap');
  expect(title.textOverflow).toBe('ellipsis');
  expect(title.lines).toBeLessThanOrEqual(1);
}

test.describe('L6 topbar__* cells (REQ-SURF-36)', () => {
  for (const width of WIDTHS) {
    test(`topbar__inline @ ${width}: own row, scroll padding 0`, async ({ page }) => {
      await open(page, width, 'default');
      await expect(page.locator(BAR)).toHaveAttribute('data-ag-placement', 'inline');
      const m = await page.evaluate((sel) => {
        const bar = document.querySelector(sel)!;
        const main = document.querySelector('.ag-app-shell [data-ag-slot="main"], .ag-app-shell main')!;
        const frame = bar.closest('.ag-app-shell__frame')!;
        return {
          pad: getComputedStyle(frame).getPropertyValue('--ag-scroll-padding-top').trim(),
          barBottom: bar.getBoundingClientRect().bottom,
          mainTop: main.getBoundingClientRect().top,
        };
      }, BAR);
      expect(m.pad).toBe('0px');
      expect(m.mainTop).toBeGreaterThanOrEqual(m.barBottom - 0.5);
      await commonChecks(page);
      await evidence(page, 'inline', width);
    });

    test(`topbar__overlay @ ${width}: focus never under the bar; center hides below 600`, async ({ page }) => {
      await open(page, width, 'overlay-top-bar');
      await expect(page.locator(BAR)).toHaveAttribute('data-ag-placement', 'overlay');
      const bar = page.locator(BAR);
      // a deep row: focusing it scrolls Main; scroll padding keeps it clear of the bar
      const row = page.getByRole('link', { name: 'Row 30', exact: true });
      await row.focus();
      const [barBox, rowBox] = [await bar.boundingBox(), await row.boundingBox()];
      expect(barBox && rowBox).toBeTruthy();
      expect(rowBox!.y).toBeGreaterThanOrEqual(barBox!.y + barBox!.height - 0.5);
      const pad = await page.evaluate((sel) => {
        const el = document.querySelector(sel)!;
        const frame = el.closest('.ag-app-shell__frame')!;
        return parseFloat(getComputedStyle(frame).getPropertyValue('--ag-scroll-padding-top'));
      }, BAR);
      expect(pad).toBeGreaterThan(barBox!.height - 0.5);
      const center = page.locator(`${BAR} .ag-top-bar__center`);
      if (width < 600) await expect(center).toBeHidden();
      else await expect(center).toBeVisible();
      await commonChecks(page);
      await evidence(page, 'overlay', width);
    });

    test(`topbar__solid @ ${width}: no shadow under data-ag-transparency=solid`, async ({ page }) => {
      await open(page, width, 'overlay-top-bar', { transparency: 'solid' });
      await expect(page.locator('html')).toHaveAttribute('data-ag-transparency', 'solid');
      const shadow = await page.locator(BAR).evaluate((el) => getComputedStyle(el).boxShadow);
      expect(shadow).toBe('none');
      await commonChecks(page);
      await evidence(page, 'solid', width);
    });

    test(`topbar__forced-colors @ ${width}: visible bottom edge`, async ({ page }) => {
      await page.emulateMedia({ forcedColors: 'active' });
      await open(page, width, 'default');
      expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
      const edge = await page.locator(BAR).evaluate((el) => {
        const cs = getComputedStyle(el);
        return { width: parseFloat(cs.borderBlockEndWidth), style: cs.borderBlockEndStyle };
      });
      expect(edge.style).toBe('solid');
      expect(edge.width).toBeGreaterThanOrEqual(1);
      await commonChecks(page);
      // pixels: the bar's last device row is the edge colour, distinct from
      // the row just above it inside the bar.
      const png = await evidence(page, 'forced-colors', width);
      const rows = await page.evaluate(async (b64) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const x = Math.floor(img.width / 2);
        const px = (y: number) => [...ctx.getImageData(x, y, 1, 1).data.slice(0, 3)];
        return { last: px(img.height - 1), inner: px(Math.max(0, img.height - 4)) };
      }, png.toString('base64'));
      const diff = rows.last.reduce((s, v, i) => s + Math.abs(v - rows.inner[i]!), 0);
      expect(diff).toBeGreaterThan(60);
    });
  }
});
