/* REQ-QUAL-15 frame fill (QUAL). The content box ([data-ag-story-content] union of painted descendants, measured
   in-page) covers ≥3 % of the frame for kinds component/lab and ≥25 % for matrix/scene/showcase. Pure geometry. */
import type { FrameFillKind } from './thresholds';
import type { Rect } from './raster';
import { gate, type GateResult } from './gate';

export function frameFill(content: Rect, frame: { width: number; height: number }, kind: FrameFillKind, t: Record<FrameFillKind, number>): GateResult {
  const min = t[kind];
  if (min === undefined) throw new Error(`frame-fill: unknown story kind '${kind}'`);
  const x0 = Math.max(0, content.x); const y0 = Math.max(0, content.y);
  const x1 = Math.min(frame.width, content.x + content.w); const y1 = Math.min(frame.height, content.y + content.h);
  const area = x1 > x0 && y1 > y0 ? (x1 - x0) * (y1 - y0) : 0;
  const share = area / (frame.width * frame.height);
  return gate('frame-fill', share >= min, share, min, `content box covers ${(share * 100).toFixed(2)} % of the frame (kind ${kind}: ≥${min * 100} % required)`);
}
