/* REQ-QUAL-73 / REQ-FIN-111 review composites (QUAL tooling for the L14 human visual review).
   One composite PNG per review item (flagship subject-state, the T0 matrix, each S1 showcase): the 8 scenes (S-42) ×
   light/dark at 1440 px, the 390 px `photo` cell, the previous approved baseline, the current capture of the same cell
   and a diff heat-map of the two (pixelmatch at VISUAL_TOLERANCE). The reviewer scores the composite against
   certification/review/visual-rubric.md and puts its sha256 in the record (review-record.schema.json
   `compositeSha256`), which binds the score to the exact pixels reviewed.

   Inputs come from a capture index `review-inputs.json` (REVIEW_INPUTS_FILE) written next to the lane captures:
     { version: 1, sha, items: [{ item: <itemId>, scenes: { <SceneId>: { light: <png>, dark: <png> } },
       mobile: <png>, baseline: <png> | null, current: <png> }] }
   PNG paths are relative to the index. A missing scene, scheme or mobile capture is an error (never a blank tile);
   `baseline: null` means the subject has no approved baseline yet (first review) and is drawn as an empty, labelled
   slot in the index, not as pixels. Tiles carry no text; `composites/index.json` lists every tile's label and box. */
import { createHash } from 'node:crypto';
import pixelmatch from 'pixelmatch';
import { SCENES, VISUAL_TOLERANCE, type SceneId } from '../../../../src/contracts/testing.ts';
import type { RgbaImage } from '../pixel/dhash.ts';
import { encodePng } from './png.ts';

export const REVIEW_INPUTS_FILE = 'review-inputs.json';
export const DESKTOP_WIDTH = 1440;
export const MOBILE_WIDTH = 390;
export const TILE_WIDTH = 480;
export const GUTTER = 8;
export const COLUMNS = 4;
const BACKGROUND = [32, 32, 36, 255] as const;

export interface CompositeInput {
  item: string;
  scenes: Record<SceneId, { light: RgbaImage; dark: RgbaImage }>;
  mobile: RgbaImage;
  baseline: RgbaImage | null;
  current: RgbaImage;
}
export interface Tile { label: string; x: number; y: number; width: number; height: number; source: { width: number; height: number } | null }
export interface Composite { item: string; png: Buffer; sha256: string; width: number; height: number; tiles: Tile[]; diffRatio: number | null }

export class CompositeInputError extends Error {
  constructor(message: string) { super(message); this.name = 'CompositeInputError'; }
}

/** Area-averaged downscale (or nearest upscale) to `width`, keeping the aspect ratio. */
export function scaleToWidth(img: RgbaImage, width: number): RgbaImage {
  const height = Math.max(1, Math.round((img.height * width) / img.width));
  const out = new Uint8Array(width * height * 4);
  const sx = img.width / width;
  const sy = img.height / height;
  for (let y = 0; y < height; y++) {
    const y0 = Math.floor(y * sy); const y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < width; x++) {
      const x0 = Math.floor(x * sx); const x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let r = 0; let g = 0; let b = 0; let a = 0; let n = 0;
      for (let yy = y0; yy < Math.min(y1, img.height); yy++) {
        for (let xx = x0; xx < Math.min(x1, img.width); xx++) {
          const i = (yy * img.width + xx) * 4;
          r += img.data[i]!; g += img.data[i + 1]!; b += img.data[i + 2]!; a += img.data[i + 3]!; n++;
        }
      }
      const o = (y * width + x) * 4;
      out[o] = Math.round(r / n); out[o + 1] = Math.round(g / n); out[o + 2] = Math.round(b / n); out[o + 3] = Math.round(a / n);
    }
  }
  return { width, height, data: out };
}

/** pixelmatch diff heat-map of the current capture against the previous baseline (same cell, same size). */
export function diffHeatmap(baseline: RgbaImage, current: RgbaImage): { image: RgbaImage; ratio: number } {
  if (baseline.width !== current.width || baseline.height !== current.height) {
    throw new CompositeInputError(`baseline ${baseline.width}x${baseline.height} and current ${current.width}x${current.height} differ in size`);
  }
  const out = new Uint8Array(current.width * current.height * 4);
  const changed = pixelmatch(baseline.data, current.data, out, current.width, current.height,
    { threshold: VISUAL_TOLERANCE.pixelmatchThreshold, includeAA: VISUAL_TOLERANCE.includeAA, alpha: 0.2, diffColor: [255, 0, 64] });
  return { image: { width: current.width, height: current.height, data: out }, ratio: changed / (current.width * current.height) };
}

function blit(dst: RgbaImage, src: RgbaImage, x: number, y: number): void {
  for (let row = 0; row < src.height; row++) {
    const s = row * src.width * 4;
    const d = ((y + row) * dst.width + x) * 4;
    (dst.data as Uint8Array).set(src.data.subarray(s, s + src.width * 4), d);
  }
}

function checkInput(input: CompositeInput): void {
  const problems: string[] = [];
  for (const scene of SCENES) {
    const s = input.scenes?.[scene];
    for (const scheme of ['light', 'dark'] as const) {
      const img = s?.[scheme];
      if (!img) problems.push(`${scene}/${scheme} capture missing`);
      else if (img.width !== DESKTOP_WIDTH) problems.push(`${scene}/${scheme} is ${img.width}px wide, expected ${DESKTOP_WIDTH}`);
    }
  }
  const extra = Object.keys(input.scenes ?? {}).filter((k) => !(SCENES as readonly string[]).includes(k));
  if (extra.length) problems.push(`unknown scene(s) ${extra.join(', ')}`);
  if (!input.mobile) problems.push('390 photo capture missing');
  else if (input.mobile.width !== MOBILE_WIDTH) problems.push(`mobile capture is ${input.mobile.width}px wide, expected ${MOBILE_WIDTH}`);
  if (!input.current) problems.push('current capture (diff head) missing');
  if (problems.length) throw new CompositeInputError(`${input.item}: ${problems.join('; ')}`);
}

/** Builds one review composite. Deterministic: the same inputs give the same PNG bytes and sha256. */
export function buildComposite(input: CompositeInput): Composite {
  checkInput(input);
  const tiles: Array<{ label: string; image: RgbaImage | null; source: RgbaImage | null }> = [];
  for (const scene of SCENES) {
    for (const scheme of ['light', 'dark'] as const) {
      const src = input.scenes[scene][scheme];
      tiles.push({ label: `${scene} ${scheme} @${DESKTOP_WIDTH}`, image: scaleToWidth(src, TILE_WIDTH), source: src });
    }
  }
  tiles.push({ label: `photo @${MOBILE_WIDTH}`, image: input.mobile.width > TILE_WIDTH ? scaleToWidth(input.mobile, TILE_WIDTH) : input.mobile, source: input.mobile });
  let diffRatio: number | null = null;
  if (input.baseline) {
    const diff = diffHeatmap(input.baseline, input.current);
    diffRatio = diff.ratio;
    tiles.push({ label: 'previous baseline', image: scaleToWidth(input.baseline, TILE_WIDTH), source: input.baseline });
    tiles.push({ label: 'current', image: scaleToWidth(input.current, TILE_WIDTH), source: input.current });
    tiles.push({ label: 'diff heat-map', image: scaleToWidth(diff.image, TILE_WIDTH), source: diff.image });
  } else {
    tiles.push({ label: 'previous baseline (none approved yet)', image: null, source: null });
    tiles.push({ label: 'current', image: scaleToWidth(input.current, TILE_WIDTH), source: input.current });
    tiles.push({ label: 'diff heat-map (no baseline)', image: null, source: null });
  }
  // Row-major grid; each row is as tall as its tallest tile.
  const rows: Array<typeof tiles> = [];
  for (let i = 0; i < tiles.length; i += COLUMNS) rows.push(tiles.slice(i, i + COLUMNS));
  const rowHeights = rows.map((r) => Math.max(GUTTER, ...r.map((t) => t.image?.height ?? 0)));
  const width = COLUMNS * TILE_WIDTH + (COLUMNS + 1) * GUTTER;
  const height = rowHeights.reduce((n, h) => n + h, 0) + (rows.length + 1) * GUTTER;
  const canvas: RgbaImage = { width, height, data: new Uint8Array(width * height * 4) };
  for (let i = 0; i < width * height; i++) (canvas.data as Uint8Array).set(BACKGROUND, i * 4);
  const placed: Tile[] = [];
  let y = GUTTER;
  rows.forEach((row, r) => {
    row.forEach((t, c) => {
      const x = GUTTER + c * (TILE_WIDTH + GUTTER);
      if (t.image) blit(canvas, t.image, x, y);
      placed.push({ label: t.label, x, y, width: t.image?.width ?? TILE_WIDTH, height: t.image?.height ?? 0,
        source: t.source ? { width: t.source.width, height: t.source.height } : null });
    });
    y += rowHeights[r]! + GUTTER;
  });
  const png = encodePng(canvas);
  return { item: input.item, png, sha256: createHash('sha256').update(png).digest('hex'), width, height, tiles: placed, diffRatio };
}
