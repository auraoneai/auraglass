/* REQ-QUAL-15 (QUAL). Loader + shape check for certification/thresholds.json. A missing or mistyped key throws: a
   gate never falls back to a built-in number. `thresholdsSha256` is recorded in every L6 lane manifest. */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const THRESHOLDS_FILE = 'certification/thresholds.json';

export type FrameFillKind = 'component' | 'lab' | 'matrix' | 'scene' | 'showcase';

export interface Thresholds {
  version: 1;
  notBlank: { minDeviation: number };
  separation: { minShare: number; minDelta: number };
  frameFill: Record<FrameFillKind, number>;
  density: { max: number };
  neon: { maxShare: number; minSaturation: number; minValue: number; maxHueFamilies: number; hueBinDegrees: number; hueFamilyMinShare: number; hueFamilyMinChroma: number };
  intentDeltaE: number;
  ocr: { psm: number; upscale: number; minConfidence: number; normal: number; large: number; contrastMore: number; largePx: number; largeBoldPx: number; largeBoldWeight: number; glyphMinDelta: number };
  materialPresence: { maxStageSigma: number; minSceneSigma: number; regularMinDelta: number; floorSlack: number };
  preference: { contrastMoreMinShare: number; contrastMoreTarget: number; tintedMinSigmaCut: number };
  layout: { containmentSlackPx: number; targetMin: number; targetMinSm: number; targetSpacingSm: number; focusMinContrast: number; productViewport: { width: number; height: number } };
}

const SHAPE: Record<string, readonly string[] | 'number'> = {
  notBlank: ['minDeviation'],
  separation: ['minShare', 'minDelta'],
  frameFill: ['component', 'lab', 'matrix', 'scene', 'showcase'],
  density: ['max'],
  neon: ['maxShare', 'minSaturation', 'minValue', 'maxHueFamilies', 'hueBinDegrees', 'hueFamilyMinShare', 'hueFamilyMinChroma'],
  intentDeltaE: 'number',
  ocr: ['psm', 'upscale', 'minConfidence', 'normal', 'large', 'contrastMore', 'largePx', 'largeBoldPx', 'largeBoldWeight', 'glyphMinDelta'],
  materialPresence: ['maxStageSigma', 'minSceneSigma', 'regularMinDelta', 'floorSlack'],
  preference: ['contrastMoreMinShare', 'contrastMoreTarget', 'tintedMinSigmaCut'],
  layout: ['containmentSlackPx', 'targetMin', 'targetMinSm', 'targetSpacingSm', 'focusMinContrast'],
};

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Validates a parsed thresholds document; throws listing every bad key. */
export function parseThresholds(raw: unknown, file = THRESHOLDS_FILE): Thresholds {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object') throw new Error(`${file}: not an object`);
  const o = raw as Record<string, unknown>;
  if (o.version !== 1) errors.push('version must be 1');
  for (const [k, spec] of Object.entries(SHAPE)) {
    if (spec === 'number') { if (!isNum(o[k])) errors.push(`${k} must be a number`); continue; }
    const sec = o[k] as Record<string, unknown> | undefined;
    if (!sec || typeof sec !== 'object') { errors.push(`${k} missing`); continue; }
    for (const f of spec) if (!isNum(sec[f])) errors.push(`${k}.${f} must be a number`);
  }
  const vp = (o.layout as { productViewport?: { width?: unknown; height?: unknown } } | undefined)?.productViewport;
  if (!vp || !isNum(vp.width) || !isNum(vp.height)) errors.push('layout.productViewport must be {width, height}');
  if (errors.length) throw new Error(`${file}: ${errors.join('; ')}`);
  return raw as Thresholds;
}

export function loadThresholds(root: string): { thresholds: Thresholds; sha256: string } {
  const buf = readFileSync(join(root, THRESHOLDS_FILE));
  return { thresholds: parseThresholds(JSON.parse(buf.toString('utf8'))), sha256: createHash('sha256').update(buf).digest('hex') };
}
