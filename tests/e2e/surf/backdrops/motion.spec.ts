// motion.spec.ts — REQ-SURF-157 (MED-72), lane L9 via project surf:backdrops.
// The video backdrop never autoplays: by default it stays paused on its poster;
// with the continuous gate open it plays only while it intersects and the tab
// is visible (pause within 250 ms otherwise); reduced motion keeps the poster;
// the WCAG 2.2.2 control exists only while playing or user-paused and toggles
// playback through aria-pressed. A missing story is a failure, never a skip.
import { test, expect, type Page } from '@playwright/test';
import { openBackdrop, setHidden } from '../_support/backdrop';

const video = (page: Page) => page.locator('.ag-backdrop video');
const pause = (page: Page) => page.locator('[data-ag-part="backdrop-pause"]');
const isPaused = (page: Page) => video(page).evaluate((v: HTMLVideoElement) => v.paused);

/** Resolves with ms from now until the video reports paused (polled per frame). */
const msUntilPaused = (page: Page) =>
  video(page).evaluate((v: HTMLVideoElement) => new Promise<number>((resolve) => {
    const t0 = performance.now();
    const poll = () => (v.paused ? resolve(performance.now() - t0) : requestAnimationFrame(poll));
    poll();
  }));

test.describe('backdrop video motion (REQ-SURF-157)', () => {
  test.describe.configure({ timeout: 60_000 });

  test('default: no autoplay — paused with its poster after 2 s, metadata only, no control', async ({ page }) => {
    await openBackdrop(page, 'video');
    await expect(video(page)).toHaveAttribute('poster', /\/scenes\/video-frame\.jpg$/);
    await expect(video(page)).toHaveAttribute('preload', 'metadata');
    expect(await video(page).evaluate((v: HTMLVideoElement) => v.autoplay)).toBe(false);
    await page.waitForTimeout(2_000);
    expect(await isPaused(page)).toBe(true);
    // never started: the poster is what is painted
    expect(await video(page).evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0);
    await expect(pause(page)).toHaveCount(0);
  });

  test('gate open: plays while visible; scrolling out pauses within 250 ms; scrolling back resumes', async ({ page }) => {
    await openBackdrop(page, 'video-continuous');
    expect(await page.evaluate(() => !!document.querySelector('[data-ag-continuous="on"]'))).toBe(true);
    await expect.poll(() => isPaused(page), { timeout: 10_000 }).toBe(false);
    await expect(pause(page)).toHaveCount(1);
    await expect(pause(page)).toHaveAccessibleName('Pause background video');
    await expect(pause(page)).toHaveAttribute('aria-pressed', 'false');

    const elapsed = msUntilPaused(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    expect(await elapsed).toBeLessThanOrEqual(250);
    await expect(pause(page)).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => isPaused(page), { timeout: 10_000 }).toBe(false);
  });

  test('gate open: a hidden tab pauses within 250 ms', async ({ page }) => {
    await openBackdrop(page, 'video-continuous');
    await expect.poll(() => isPaused(page), { timeout: 10_000 }).toBe(false);
    const elapsed = msUntilPaused(page);
    await setHidden(page, true);
    expect(await elapsed).toBeLessThanOrEqual(250);
    await setHidden(page, false);
    await expect.poll(() => isPaused(page), { timeout: 10_000 }).toBe(false);
  });

  test('reduced motion: the gate stays closed and the poster stays up', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openBackdrop(page, 'video-continuous');
    await page.waitForTimeout(2_000);
    expect(await isPaused(page)).toBe(true);
    expect(await video(page).evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0);
    await expect(video(page)).toHaveAttribute('poster', /video-frame\.jpg$/);
    await expect(pause(page)).toHaveCount(0);
  });

  test('the pause control toggles aria-pressed and playback, keeping its name', async ({ page }) => {
    await openBackdrop(page, 'video-continuous');
    await expect.poll(() => isPaused(page), { timeout: 10_000 }).toBe(false);
    await pause(page).focus();
    // visible on focus (chrome thin)
    await expect.poll(() => pause(page).evaluate((b) => Number(getComputedStyle(b).opacity))).toBe(1);
    await pause(page).click();
    await expect(pause(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(pause(page)).toHaveAccessibleName('Pause background video');
    await expect.poll(() => isPaused(page)).toBe(true);
    await page.waitForTimeout(1_000);
    expect(await isPaused(page)).toBe(true);
    await pause(page).click();
    await expect(pause(page)).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(() => isPaused(page), { timeout: 10_000 }).toBe(false);
  });
});
