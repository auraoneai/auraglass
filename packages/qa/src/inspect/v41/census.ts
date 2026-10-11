/// <reference path="../../types/playwright-core-utils-bundle.d.ts" />
/* REQ-QUAL-32 (QUAL, FIN-434) — ported 4.x measurement layer: whole-viewport colour census.
   Verbatim port of v4.1.0:tests/visual/design-system/token-purity-layout-audit.spec.ts (= legacy/tests/visual/design-system/token-purity-layout-audit.spec.ts at 21044a761)
   lines 2103-2227. Read from the tag, never imported; only `export`, imports, type-only `!`/tuple assertions (strict tsconfig; erased at compile time) and this header were added. */
import type { Page } from '@playwright/test';
import { PNG } from 'playwright-core/lib/utilsBundle';
import type { ViewportColorCensus } from './types';

export const inspectViewportColorCensus = async (
  page: Page
): Promise<ViewportColorCensus> => {
  const buffer = await page.screenshot({
    animations: "disabled",
    fullPage: false,
  });
  const png = PNG.sync.read(buffer);
  const step = Math.max(2, Math.floor(Math.min(png.width, png.height) / 180));
  const columns = Math.ceil(png.width / step);
  const rows = Math.ceil(png.height / step);
  const coloredGrid = new Uint8Array(columns * rows);
  let sampledPixels = 0;
  let coloredPixels = 0;
  let tintedNeutralPixels = 0;
  let coolPixels = 0;
  let warmPixels = 0;
  let chromaSum = 0;
  let neutralChromaSum = 0;
  for (let gy = 0, y = 0; y < png.height; gy += 1, y += step) {
    for (let gx = 0, x = 0; x < png.width; gx += 1, x += step) {
      const offset = (y * png.width + x) * 4;
      const r = png.data[offset]!;
      const g = png.data[offset + 1]!;
      const b = png.data[offset + 2]!;
      const a = png.data[offset + 3]! / 255;
      if (a < 0.1) continue;
      sampledPixels += 1;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const chroma = max - min;
      const light = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      chromaSum += chroma;
      const colored = chroma >= 14;
      if (colored) {
        coloredPixels += 1;
        coloredGrid[gy * columns + gx] = 1;
      }
      // Tint hidden in a nominally white material is more subtle: restrict
      // this census to light pixels and use a lower chroma threshold.
      if (light >= 148 && chroma >= 8) {
        tintedNeutralPixels += 1;
        neutralChromaSum += chroma;
      }
      const coolDelta = b - r + Math.max(0, g - r) * 0.45;
      const warmDelta = r - b + Math.max(0, r - g) * 0.35;
      if (chroma >= 8 && coolDelta >= 7) coolPixels += 1;
      if (chroma >= 8 && warmDelta >= 7) warmPixels += 1;
    }
  }
  const seen = new Uint8Array(coloredGrid.length);
  let localizedColoredRegions = 0;
  for (let index = 0; index < coloredGrid.length; index += 1) {
    if (!coloredGrid[index] || seen[index]) continue;
    let regionSize = 0;
    const queue = [index];
    seen[index] = 1;
    while (queue.length) {
      const current = queue.pop()!;
      regionSize += 1;
      const x = current % columns;
      const y = Math.floor(current / columns);
      for (const next of [
        current - 1,
        current + 1,
        current - columns,
        current + columns,
      ]) {
        if (
          next < 0 ||
          next >= coloredGrid.length ||
          seen[next] ||
          !coloredGrid[next]
        )
          continue;
        const nx = next % columns;
        const ny = Math.floor(next / columns);
        if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue;
        seen[next] = 1;
        queue.push(next);
      }
    }
    if (regionSize >= 4) localizedColoredRegions += 1;
  }
  const coloredAreaRatio = coloredPixels / Math.max(1, sampledPixels);
  const tintedNeutralRatio = tintedNeutralPixels / Math.max(1, sampledPixels);
  const coolRatio = coolPixels / Math.max(1, sampledPixels);
  const warmRatio = warmPixels / Math.max(1, sampledPixels);
  const dominantCast =
    coolRatio >= 0.12 && coolRatio > warmRatio * 1.35
      ? "cool"
      : warmRatio >= 0.12 && warmRatio > coolRatio * 1.35
        ? "warm"
        : coloredAreaRatio >= 0.16
          ? "mixed"
          : "neutral";
  return {
    sampledPixels,
    coloredPixels,
    coloredAreaRatio,
    tintedNeutralPixels,
    tintedNeutralRatio,
    coolPixels,
    warmPixels,
    dominantCast,
    meanChroma: chromaSum / Math.max(1, sampledPixels),
    meanNeutralChroma: neutralChromaSum / Math.max(1, tintedNeutralPixels),
    localizedColoredRegions,
  };
};

export const checkViewportColorCensus = (census: ViewportColorCensus): string[] => {
  const failures: string[] = [];
  // Tiny localized semantic/media accents are allowed; broad tint is not.
  if (
    census.coloredAreaRatio > 0.18 ||
    census.tintedNeutralRatio > 0.28 ||
    (census.dominantCast !== "neutral" && census.meanChroma > 9)
  ) {
    failures.push(
      `whole-viewport problematic tint: dominantCast=${census.dominantCast} coloredAreaRatio=${census.coloredAreaRatio.toFixed(3)} tintedNeutralRatio=${census.tintedNeutralRatio.toFixed(3)} meanChroma=${census.meanChroma.toFixed(1)} meanNeutralChroma=${census.meanNeutralChroma.toFixed(1)} localizedColoredRegions=${census.localizedColoredRegions} sampledPixels=${census.sampledPixels}`
    );
  }
  return failures;
};
