/* CMP-311: Progress + ProgressRing on BU Progress. role='progressbar' with
   aria-valuemin/max/now; value={null} → indeterminate (BU data-state);
   ProgressRing is the first public circular export (CircularProgress absorbed).
   parts [root, track, indicator, label, value]. */
'use client';
import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';

const SUNKEN = materialProps({ layer: 'content', content: 'content-sunken' });

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** 0..max, or null for indeterminate. */
  value?: number | null;
  min?: number;
  max?: number;
  /** 'linear' (default) or 'ring' — the circular form (CircularProgress absorbed). */
  appearance?: 'linear' | 'ring';
  /** Ring only: diameter in px. */
  size?: number;
  /** Ring only: stroke width in px. */
  thickness?: number;
  label?: string;
  /** Show the formatted value at the end of the track. */
  showValue?: boolean;
  format?: Intl.NumberFormatOptions;
}

export function Progress(props: ProgressProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  if (props.appearance === 'ring') {
    return <RingBody {...props} />;
  }
  const {
    value = null,
    min = 0,
    max = 100,
    label,
    showValue = true,
    format,
    children,
    className,
    ref,
    ...rest
  } = props;
  return (
    <BaseProgress.Root
      {...rest}
      ref={ref}
      value={value}
      min={min}
      max={max}
      format={format}
      aria-label={label ?? rest['aria-label'] ?? 'Progress'}
      data-ag-part="root"
      className={cn('ag-progress', className)}
    >
      {label ? (
        <BaseProgress.Label data-ag-part="label" className="ag-progress-label">
          {label}
        </BaseProgress.Label>
      ) : null}
      <BaseProgress.Track {...SUNKEN} data-ag-part="track" className={cn('ag-progress-track', SUNKEN.className)}>
        <BaseProgress.Indicator data-ag-part="indicator" className="ag-progress-indicator" />
      </BaseProgress.Track>
      {showValue ? (
        <BaseProgress.Value data-ag-part="value" className="ag-progress-value" />
      ) : null}
      {children}
    </BaseProgress.Root>
  );
}

/** Internal ring body for appearance='ring' (REQ-CMP-117). */
function RingBody({
  value = null,
  min = 0,
  max = 100,
  label,
  showValue = true,
  format,
  size = 40,
  thickness = 4,
  className,
  ref,
  ...rest
}: ProgressProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const frac = value === null ? null : Math.min(1, Math.max(0, (value - min) / Math.max(1e-9, max - min)));
  return (
    <BaseProgress.Root
      {...rest}
      ref={ref}
      value={value}
      min={min}
      max={max}
      format={format}
      aria-label={label ?? rest['aria-label'] ?? 'Progress'}
      data-ag-part="root"
      className={cn('ag-progress-ring', className)}
    >
      {label ? (
        <BaseProgress.Label data-ag-part="label" className="ag-progress-label">
          {label}
        </BaseProgress.Label>
      ) : null}
      <svg
        data-ag-part="track"
        className="ag-progress-ring-track"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={thickness} className="ag-progress-ring-trace" />
        <circle
          data-ag-part="indicator"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={frac === null ? circumference * 0.75 : circumference * (1 - frac)}
          className={cn('ag-progress-ring-indicator', frac === null ? 'ag-progress-ring-indeterminate' : undefined)}
        />
      </svg>
      {showValue ? (
        <BaseProgress.Value data-ag-part="value" className="ag-progress-value" />
      ) : null}
    </BaseProgress.Root>
  );
}
