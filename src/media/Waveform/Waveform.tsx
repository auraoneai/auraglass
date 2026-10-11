'use client';
/* REQ-SURF-140 — Waveform (5.1, additive): one <svg role="img">, ≤2 paths
 * split by clipPath at progress; server-renderable with peaks. */
import * as React from 'react';
import { downsamplePeaks, waveformPath } from './downsample';
import { useResolvedPreferences } from '../../theme';

export interface WaveformProps {
  peaks?: Float32Array | number[] | undefined;
  /** live single-bar mode (WaveformLevel) */
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

export const Waveform = function Waveform(props: WaveformProps & { ref?: React.Ref<SVGSVGElement> }) {
  const { ref } = props;
  const { peaks, level, progress = 0, bars = 64, label, width = 640, height = 48, className } = props;
  const { motion } = useResolvedPreferences();
  const isLevel = level !== undefined;
  const data = isLevel ? [Math.min(1, Math.max(0, level))] : downsamplePeaks(peaks ?? [], bars);
  const d = isLevel
    ? `M0 0h${width}v${height}h${-width}z`
    : waveformPath(data, data.length, width, height);
  const p = Math.min(1, Math.max(0, progress));
  const clipId = React.useId();
  const levelScale = isLevel ? Math.max(0.02, Math.min(1, Math.max(0, level))) : 1;
  const levelTransition = motion === 'calm' || motion === 'none' ? '0s' : 'var(--ag-duration-micro, 120ms)';
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
      <path d={d} fill="var(--ag-on-surface-muted, GrayText)" data-ag-part="waveform-remaining" />
      <path
        d={d}
        fill="var(--ag-on-surface, CanvasText)"
        data-ag-part="waveform-played"
        clipPath={`url(#${clipId})`}
        {...(isLevel
          ? { style: { transform: `scaleY(${levelScale})`, transformOrigin: '50% 50%', transition: `transform ${levelTransition}` } as React.CSSProperties }
          : {})}
      />
    </svg>
  );
};
