/* REQ-SURF-140 — Waveform (5.1, additive; NOT in the ./media barrel until the
 * contract-v1.2 5.1 PR): one <svg role="img">, ≤2 paths split by a clipPath at
 * `progress`. Server module: no 'use client', no hooks — renders with `peaks`
 * under renderToString. Live `level` mode lives in the client WaveformLevel. */
import * as React from 'react';
import { downsamplePeaks, waveformPath } from './downsample';
import { WaveformLevel } from './WaveformLevel';

export interface WaveformProps {
  peaks?: Float32Array | number[] | undefined;
  /** live single-bar mode — rendered by the client WaveformLevel */
  level?: number | undefined;
  progress?: number | undefined;
  /** columns; default 64, clamped 8–256 */
  bars?: number | undefined;
  /** required accessible name */
  label: string;
  width?: number | undefined;
  height?: number | undefined;
  className?: string | undefined;
}

/* Deterministic clip id (no useId: this is a server module). It encodes the
 * only inputs of the clip geometry, so two equal ids always describe the same
 * rectangle. */
const clipIdOf = (width: number, height: number, p: number) =>
  `ag-waveform-clip-${Math.round(width * 1000)}-${Math.round(height * 1000)}-${Math.round(p * 10000)}`;

export const Waveform = function Waveform(props: WaveformProps & { ref?: React.Ref<SVGSVGElement> }) {
  const { ref, peaks, level, progress = 0, bars = 64, label, width = 640, height = 48, className } = props;
  if (level !== undefined) {
    return <WaveformLevel ref={ref} level={level} label={label} width={width} height={height} className={className} />;
  }
  const cols = downsamplePeaks(peaks ?? [], bars);
  const d = waveformPath(cols, cols.length, width, height);
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const clipId = clipIdOf(width, height, p);
  return (
    <svg
      ref={ref}
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      className={['ag-waveform', className].filter(Boolean).join(' ')}
      data-ag-part="waveform"
      preserveAspectRatio="none"
      width="100%"
      height={height}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={width * p} height={height} />
        </clipPath>
      </defs>
      <path d={d} fill="currentColor" data-ag-part="waveform-remaining" />
      <path d={d} fill="currentColor" data-ag-part="waveform-played" clipPath={`url(#${clipId})`} />
    </svg>
  );
};
