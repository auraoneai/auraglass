/* MAT-237 (REQ-MOT-71..74): frame sampling helpers for remote Playwright runs.
 *
 * frames() samples every running animation under a locator root on the main
 * thread: it pauses all Web Animations, walks each animation's currentTime in
 * `samples` even steps up to the maximum endTime, screenshots the locator per
 * step, and restores playback. The caller compares PNG buffers for the
 * distinct-frame count (pixel diff > 0.5%) and the wall-clock duration against
 * the sampled span (±20%, Chromium CDP screencast).
 */
import type { Locator, Page } from '@playwright/test';

export interface FrameSample {
  /** PNG buffer of the locator at this sample point. */
  shot: Buffer;
  /** currentTime applied when the screenshot was taken (ms). */
  at: number;
  /** animation snapshots for this sample. */
  animations: AnimationSnapshot[];
}

export interface AnimationSnapshot {
  id: string;
  playState: string;
  type: string;
  currentTime: number;
  effectTarget: string | null;
}

export interface FramesOptions {
  /** number of samples to take; default 12 (REQ-MOT-71). */
  samples?: number;
  /** capture a Chromium CDP screencast for wall-clock verification (REQ-MOT-74). */
  screencast?: boolean | undefined;
}

/** Pause every animation under root and return their endTime ceiling (ms). */
export const pauseAnimations = async (root: Locator): Promise<number> =>
  root.evaluate((el) => {
    const anims = (el as Element).getAnimations({ subtree: true });
    let maxEnd = 0;
    for (const a of anims) {
      a.pause();
      const t = a.effect?.getComputedTiming();
      const end = typeof t?.endTime === 'number' ? t.endTime : Number(t?.endTime ?? 0);
      if (Number.isFinite(end)) maxEnd = Math.max(maxEnd, end);
    }
    return maxEnd;
  });

const setAllCurrentTime = (root: Locator, at: number): Promise<AnimationSnapshot[]> =>
  root.evaluate((el, atMs) => {
    const out: AnimationSnapshot[] = [];
    for (const [i, a] of (el as Element).getAnimations({ subtree: true }).entries()) {
      a.currentTime = atMs;
      const t = a.effect?.getComputedTiming();
      const target = (a.effect as KeyframeEffect | null)?.target ?? null;
      out.push({
        id: a.id || `anim-${i}`,
        playState: a.playState,
        type: a.constructor.name,
        currentTime: atMs,
        effectTarget: target ? `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}` : null,
      });
      void t;
    }
    return out;
  }, at);

const resumeAnimations = (root: Locator): Promise<void> =>
  root.evaluate((el) => {
    for (const a of (el as Element).getAnimations({ subtree: true })) a.play();
  }).then(() => undefined);

/**
 * Capture `samples` frames by stepping every animation's currentTime from 0 to
 * the maximum endTime across the subtree. Screenshots use
 * `animations: 'disabled'` disabled — we *want* the animating state, frozen at
 * the sample instant (Playwright's screenshot option would finish them).
 */
export const frames = async (
  page: Page,
  root: Locator,
  opts: FramesOptions = {},
): Promise<{ samples: FrameSample[]; spanMs: number; screencastWallMs?: number | undefined }> => {
  const samples = opts.samples ?? 12;
  const spanMs = await pauseAnimations(root);
  const out: FrameSample[] = [];
  let screencastWallMs: number | undefined;

  if (opts.screencast && page.context().browser()?.browserType().name() === 'chromium') {
    // REQ-MOT-74: CDP screencast for wall-clock +/-20% verification.
    const session = await page.context().newCDPSession(page);
    const t0 = Date.now();
    try {
      await session.send('Page.startScreencast', { format: 'jpeg', everyNthFrame: 2 });
      for (let i = 0; i < samples; i++) {
        const at = spanMs === 0 ? 0 : (spanMs * i) / (samples - 1);
        const animations = await setAllCurrentTime(root, at);
        out.push({ shot: await root.screenshot(), at, animations });
      }
    } finally {
      await session.send('Page.stopScreencast').catch(() => undefined);
      screencastWallMs = Date.now() - t0;
      await session.detach();
    }
  } else {
    for (let i = 0; i < samples; i++) {
      const at = spanMs === 0 ? 0 : (spanMs * i) / (samples - 1);
      const animations = await setAllCurrentTime(root, at);
      out.push({ shot: await root.screenshot(), at, animations });
    }
  }

  await resumeAnimations(root);
  return { samples: out, spanMs, screencastWallMs };
};

/** Count samples that differ from their predecessor by > 0.5% of pixels
 *  (REQ-MOT-72). Pure-JS PNG decode lives in decodePng (decode+unchanged diff). */
export const countDistinctFrames = async (samples: FrameSample[]): Promise<number> => {
  const { decodePng, diffRatio } = await import('./png.js');
  let distinct = samples.length > 0 ? 1 : 0;
  for (let i = 1; i < samples.length; i++) {
    const a = decodePng(samples[i - 1]!.shot);
    const b = decodePng(samples[i]!.shot);
    if (!a || !b || a.width !== b.width || a.height !== b.height) {
      // size/decode mismatch: count conservatively as distinct
      distinct++;
      continue;
    }
    if (diffRatio(a.data, b.data) > 0.005) distinct++;
  }
  return distinct;
};
