// waveform-modes.spec.ts — SURF-479 (REQ-SURF-140): Waveform renders labelled
// peaks split at progress; WaveformLevel scales one unclipped bar by `level`;
// forced colors paint CanvasText / GrayText.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function open(page: Page, story: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'Waveform' && s.id.endsWith(`--${story}`));
  expect(subject, `Waveform ${story} story registered in the subject index`).toBeTruthy();
  await gotoStory(page, subject!.id);
  const wave = page.locator('svg[data-ag-part="waveform"]');
  await expect(wave).toBeVisible();
  return wave;
}

const systemColor = (page: Page, keyword: string) => page.evaluate((k) => {
  const probe = document.createElement('span');
  probe.style.color = k;
  probe.style.setProperty('forced-color-adjust', 'none');
  document.body.append(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c;
}, keyword);

test.describe('waveform modes (SURF-479, REQ-SURF-140)', () => {
  test('peaks: one labelled svg role=img, 2 paths, played path clipped at progress', async ({ page }) => {
    const wave = await open(page, 'half-progress');
    await expect(wave).toHaveAttribute('role', 'img');
    await expect(wave).toHaveAttribute('aria-label', 'Voice waveform');
    await expect(wave.locator('path')).toHaveCount(2);
    const clip = await wave.evaluate((svg) => {
      const played = svg.querySelector('[data-ag-part="waveform-played"]')!;
      const id = played.getAttribute('clip-path')!.slice(5, -1);
      return svg.querySelector(`clipPath[id="${id}"] rect`)!.getAttribute('width');
    });
    expect(Number(clip)).toBe(320);
  });

  test('level: the bar is unclipped and scaled to the level', async ({ page }) => {
    const wave = await open(page, 'live-level');
    const bar = wave.locator('[data-ag-part="waveform-level"]');
    await expect(bar).toBeVisible();
    expect(await bar.getAttribute('clip-path')).toBeNull();
    const m = await bar.evaluate((el) => getComputedStyle(el).transform);
    // matrix(a, b, c, d, e, f): d is the Y scale
    const d = Number(m.match(/^matrix\(([^)]+)\)$/)![1]!.split(',')[3]);
    expect(d).toBeCloseTo(0.6, 3);
    const box = await bar.boundingBox();
    const svgBox = await wave.boundingBox();
    expect(box!.height).toBeCloseTo(svgBox!.height * 0.6, 0);
  });

  test('forced colors: played/level CanvasText, remaining GrayText', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    const wave = await open(page, 'half-progress');
    const canvasText = await systemColor(page, 'CanvasText');
    const grayText = await systemColor(page, 'GrayText');
    const fills = await wave.evaluate((svg) => ({
      played: getComputedStyle(svg.querySelector('[data-ag-part="waveform-played"]')!).fill,
      remaining: getComputedStyle(svg.querySelector('[data-ag-part="waveform-remaining"]')!).fill,
    }));
    expect(fills.played).toBe(canvasText);
    expect(fills.remaining).toBe(grayText);
  });
});
