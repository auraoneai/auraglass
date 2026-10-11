'use client';
/* REQ-SURF-140 — live level meter (client). One unclipped bar scaled by
 * `level` with transform: scaleY(level); media.css transitions transform over
 * --ag-duration-micro and drops it to 0 s under [data-ag-motion=calm|none].
 * Motion is also read here so a resolved calm|none preference stops the
 * transition even where no data-ag-motion ancestor is present. */
import * as React from 'react';
import { useResolvedPreferences } from '../../theme';

export interface WaveformLevelProps {
  /** 0..1 live level */
  level: number;
  /** required accessible name */
  label: string;
  width?: number | undefined;
  height?: number | undefined;
  className?: string | undefined;
  ref?: React.Ref<SVGSVGElement> | undefined;
}

export function WaveformLevel(props: WaveformLevelProps): React.ReactElement {
  const { ref, level, label, width = 640, height = 48, className } = props;
  const { motion } = useResolvedPreferences();
  const v = Number.isFinite(level) ? Math.min(1, Math.max(0, level)) : 0;
  const scale = Math.round(v * 10000) / 10000;
  const style: React.CSSProperties = {
    transform: `scaleY(${scale})`,
    transformOrigin: '50% 50%',
    ...(motion === 'calm' || motion === 'none' ? { transitionDuration: '0s' } : {}),
  };
  const d = `M0 0h${width}v${height}h${-width}z`;
  return (
    <svg
      ref={ref}
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      className={['ag-waveform', 'ag-waveform-level', className].filter(Boolean).join(' ')}
      data-ag-part="waveform"
      preserveAspectRatio="none"
      width="100%"
      height={height}
    >
      <path d={d} fill="currentColor" data-ag-part="waveform-remaining" />
      <path d={d} fill="currentColor" data-ag-part="waveform-level" style={style} />
    </svg>
  );
}
