/* REQ-QUAL-15 neon (QUAL). Per subject: ≤ `neon.maxShare` of the subject's pixels have HSV S ≥ `minSaturation` and
   V ≥ `minValue`, and the subject uses ≤ `maxHueFamilies` hue families — `hueBinDegrees`° hue bins holding
   ≥ `hueFamilyMinShare` of the subject's pixels, counting only chromatic pixels (S and V ≥ `hueFamilyMinChroma`).
   The lane evaluates neon in achromatic scenes (flat-white, flat-black) so the scene's own hues are not counted as the
   subject's palette. */
import { forEachOffset, type Rect, type Rgba } from './raster';
import type { GateResult } from './gate';

export interface NeonThresholds { maxShare: number; minSaturation: number; minValue: number; maxHueFamilies: number; hueBinDegrees: number; hueFamilyMinShare: number; hueFamilyMinChroma: number }

/** RGB 0..255 → HSV with h in degrees [0, 360), s and v in 0..1. */
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const R = r / 255; const G = g / 255; const B = b / 255;
  const max = Math.max(R, G, B); const min = Math.min(R, G, B); const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === R) h = 60 * (((G - B) / d) % 6);
    else if (max === G) h = 60 * ((B - R) / d + 2);
    else h = 60 * ((R - G) / d + 4);
  }
  if (h < 0) h += 360;
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

export function neon(capture: Rgba, subject: Rect, t: NeonThresholds): GateResult & { neonShare: number; hueFamilies: number[] } {
  const bins = new Uint32Array(Math.ceil(360 / t.hueBinDegrees));
  let neonPx = 0;
  const n = forEachOffset(capture, subject, (o) => {
    const { h, s, v } = rgbToHsv(capture.data[o]!, capture.data[o + 1]!, capture.data[o + 2]!);
    if (s >= t.minSaturation && v >= t.minValue) neonPx++;
    if (s >= t.hueFamilyMinChroma && v >= t.hueFamilyMinChroma) bins[Math.floor(h / t.hueBinDegrees) % bins.length]!++;
  });
  if (n === 0) return { gate: 'neon', status: 'fail', value: 0, limit: t.maxShare, detail: 'subject box lies outside the capture', neonShare: 0, hueFamilies: [] };
  const neonShare = neonPx / n;
  const hueFamilies = [...bins].map((c, i) => [i * t.hueBinDegrees, c / n] as const).filter(([, share]) => share >= t.hueFamilyMinShare).map(([deg]) => deg);
  const problems: string[] = [];
  if (neonShare > t.maxShare) problems.push(`${(neonShare * 100).toFixed(2)} % neon pixels (S≥${t.minSaturation} ∧ V≥${t.minValue}; ≤${t.maxShare * 100} % allowed)`);
  if (hueFamilies.length > t.maxHueFamilies) problems.push(`${hueFamilies.length} hue families at ${hueFamilies.join('°, ')}° (≤${t.maxHueFamilies} allowed)`);
  return {
    gate: 'neon', status: problems.length ? 'fail' : 'pass', value: neonShare, limit: t.maxShare,
    detail: problems.length ? problems.join('; ') : `${(neonShare * 100).toFixed(2)} % neon pixels, ${hueFamilies.length} hue families`,
    neonShare, hueFamilies,
  };
}
