/* CMP-311: Progress on BU Progress. role='progressbar' with aria-valuemin/max/now;
   value={null} → indeterminate (BU data-state); appearance='ring' renders the
   circular variant (the 4.x ProgressRing/CircularProgress folded here).
   parts [root, track, indicator, label, value]. */
'use client';
import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from '../../internal/index';

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'onChange'> {
  /** 0..max, or null for indeterminate. */
  value?: number | null;
  min?: number;
  max?: number;
  label?: string;
  /** Show the formatted value at the end of the track. */
  showValue?: boolean;
  format?: Intl.NumberFormatOptions;
  /** 'bar' renders the linear track; 'ring' renders a circular svg track. */
  appearance?: 'bar' | 'ring';
  /** Ring diameter in px (appearance='ring' only). */
  size?: number;
  /** Ring stroke width in px (appearance='ring' only). */
  thickness?: number;
}

export function Progress({
  value = null,
  min = 0,
  max = 100,
  label,
  showValue = true,
  format,
  appearance = 'bar',
  size = 40,
  thickness = 4,
  children,
  className,
  ref,
  ...rest
}: ProgressProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const labelEl = label ? (
    <BaseProgress.Label data-ag-part="label" className="ag-progress-label">
      {label}
    </BaseProgress.Label>
  ) : null;
  const valueEl = showValue ? (
    <BaseProgress.Value data-ag-part="value" className="ag-progress-value" />
  ) : null;
  if (appearance === 'ring') {
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
        data-ag-appearance="ring"
        className={cn('ag-progress-ring', className)}
      >
        {labelEl}
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
        {valueEl}
      </BaseProgress.Root>
    );
  }
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
      data-ag-appearance="bar"
      className={cn('ag-progress', className)}
    >
      {labelEl}
      <BaseProgress.Track data-ag-part="track" className="ag-progress-track">
        <BaseProgress.Indicator data-ag-part="indicator" className="ag-progress-indicator" />
      </BaseProgress.Track>
      {valueEl}
      {children}
    </BaseProgress.Root>
  );
}

