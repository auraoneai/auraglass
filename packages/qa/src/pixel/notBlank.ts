/* REQ-QUAL-15 not blank (QUAL). The subject must visibly paint something over the scene: the maximum per-channel
   deviation between the capture and the scene-only capture (subject `visibility:hidden`) inside the subject's box is
   ≥ `notBlank.minDeviation` levels. */
import { assertSameSize, channelDelta, forEachOffset, type Rect, type Rgba } from './raster';
import { gate, type GateResult } from './gate';

export function notBlank(capture: Rgba, sceneOnly: Rgba, subject: Rect, t: { minDeviation: number }): GateResult {
  assertSameSize(capture, sceneOnly, 'not-blank');
  let max = 0;
  const n = forEachOffset(capture, subject, (o) => { const d = channelDelta(capture.data, sceneOnly.data, o); if (d > max) max = d; });
  if (n === 0) return { gate: 'not-blank', status: 'fail', value: 0, limit: t.minDeviation, detail: 'subject box lies outside the capture' };
  return gate('not-blank', max >= t.minDeviation, max, t.minDeviation, `max deviation from the scene ${max} levels (≥${t.minDeviation} required) over ${n} px`);
}
