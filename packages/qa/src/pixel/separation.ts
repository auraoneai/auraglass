/* REQ-QUAL-15 separation (QUAL). A surface must separate from what is behind it: ≥ `separation.minShare` of the
   surface's pixels differ from the surface-hidden capture by > `separation.minDelta` levels (largest channel delta). */
import { assertSameSize, channelDelta, forEachOffset, type Rect, type Rgba } from './raster';
import { gate, type GateResult } from './gate';

export function separation(capture: Rgba, surfaceHidden: Rgba, surface: Rect, t: { minShare: number; minDelta: number }): GateResult {
  assertSameSize(capture, surfaceHidden, 'separation');
  let differing = 0;
  const n = forEachOffset(capture, surface, (o) => { if (channelDelta(capture.data, surfaceHidden.data, o) > t.minDelta) differing++; });
  if (n === 0) return { gate: 'separation', status: 'fail', value: 0, limit: t.minShare, detail: 'surface box lies outside the capture' };
  const share = differing / n;
  return gate('separation', share >= t.minShare, share, t.minShare,
    `${(share * 100).toFixed(1)} % of surface pixels differ by >${t.minDelta} levels from the surface-hidden capture (≥${t.minShare * 100} % required)`);
}
