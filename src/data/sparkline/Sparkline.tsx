/* Sparkline (SURF-173, REQ-SURF-91): server component — no directive, no hooks.
   Own linear scale; degenerate cases render honestly; aria-label on the svg
   carries the data summary. */
import * as React from 'react';
import { linearScale } from './scale';

export interface SparklineProps {
  data: readonly (number | null)[];
  /** Non-material look (S-30): emitted as data-ag-appearance. Default 'line'. */
  appearance?: 'line' | 'area' | 'bar' | undefined;
  width?: number | string | undefined;
  height?: number | undefined;
  intent?: 'neutral' | 'info' | 'success' | 'danger' | undefined;
  min?: number | undefined;
  max?: number | undefined;
  showLastPoint?: boolean | undefined;
  /** Required unless aria-hidden; the svg accessible name carries the summary. */
  label?: string | undefined;
  'aria-hidden'?: boolean | undefined;
  locale?: string | undefined;
}

function summarize(
  label: string,
  points: readonly number[],
  locale: string,
): string {
  if (points.length === 0) return `${label}: no data`;
  const fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  return `${label}: ${points.length} points, from ${fmt.format(points[0]!)} to ${fmt.format(
    points[points.length - 1]!,
  )}, low ${fmt.format(lo)}, high ${fmt.format(hi)}`;
}

export function Sparkline({
  data,
  appearance = 'line',
  width = '100%',
  height = 32,
  intent = 'neutral',
  min,
  max,
  showLastPoint = false,
  label,
  'aria-hidden': ariaHidden,
  locale = 'en-US',
}: SparklineProps) {
  const clean = data.map((v) => (v !== null && Number.isFinite(v) ? v : null));
  if (process.env['NODE_ENV'] === 'development' && data.some((v) => v !== null && !Number.isFinite(v))) {
    console.warn('[auraglass] Sparkline: NaN/Infinity values render as gaps.');
  }
  const points = clean.filter((v): v is number => v !== null);
  const lo = min ?? (points.length ? Math.min(...points) : 0);
  const hi = max ?? (points.length ? Math.max(...points) : 1);
  const pad = 1.5;
  const W = 100;
  const H = height;
  const x = linearScale([0, Math.max(clean.length - 1, 1)], [pad, W - pad]);
  const y = linearScale([lo, hi], [H - pad, pad]);

  let body: React.ReactNode = null;
  if (points.length === 1) {
    const i = clean.indexOf(points[0]!);
    body = <circle cx={x(i)} cy={y(points[0]!)} r={2} className="ag-sparkline__dot" />;
  } else if (appearance === 'bar') {
    const bw = (W - pad * 2) / Math.max(clean.length, 1);
    body = clean.map((v, i) =>
      v === null ? null : (
        <rect
          key={i}
          x={x(i) - bw / 2}
          y={Math.min(y(v), y(0) ?? H)}
          width={Math.max(bw - 1, 1)}
          height={Math.abs(y(v) - y(Math.max(lo, 0))) || 1}
          className="ag-sparkline__bar"
        />
      ),
    );
  } else {
    const segs: string[] = [];
    const lone: number[] = [];
    let seg: string[] = [];
    clean.forEach((v, i) => {
      if (v === null) {
        if (seg.length > 1) segs.push(seg.join(' '));
        else if (seg.length === 1) lone.push(i - 1);
        seg = [];
      } else {
        seg.push(`${seg.length === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(v).toFixed(2)}`);
      }
    });
    if (seg.length > 1) segs.push(seg.join(' '));
    else if (seg.length === 1) lone.push(clean.length - 1);
    body = (
      <>
        {appearance === 'area' &&
          segs.map((d, i) => (
            <path
              key={`a${i}`}
              d={`${d}L${W - pad},${H - pad}L${pad},${H - pad}Z`}
              className="ag-sparkline__area"
            />
          ))}
        {segs.map((d, i) => (
          <path key={`l${i}`} d={d} className="ag-sparkline__line" fill="none" />
        ))}
        {lone.map((i) => (
          <circle key={`p${i}`} cx={x(i)} cy={y(clean[i]!)} r={2} className="ag-sparkline__dot" />
        ))}
        {showLastPoint && points.length > 0 ? (
          <circle
            cx={x(clean.length - 1)}
            cy={y(points[points.length - 1]!)}
            r={2}
            className="ag-sparkline__dot"
          />
        ) : null}
      </>
    );
  }

  const name = label !== undefined ? summarize(label, points, locale) : undefined;
  return (
    <svg
      role={ariaHidden === true ? undefined : 'img'}
      aria-label={ariaHidden === true ? undefined : name}
      aria-hidden={ariaHidden === true ? true : undefined}
      data-ag-part="sparkline"
      data-ag-intent={intent}
      data-ag-appearance={appearance}
      className="ag-sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      {body}
    </svg>
  );
}
