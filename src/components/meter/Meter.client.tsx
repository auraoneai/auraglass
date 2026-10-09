/* CMP-312: Meter on BU Meter. role='meter' with aria-valuemin/max/now;
   low/high/optimum derive data-ag-intent (danger < low, warning < high,
   success at/above optimum when set); `label` is required; content-sunken
   track. parts [root, track, indicator, label, value]. */
'use client';
import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';

const SUNKEN = materialProps({ layer: 'content', content: 'content-sunken' });

export interface MeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  /** Required accessible name. */
  label: string;
  showValue?: boolean;
  format?: Intl.NumberFormatOptions;
}

function intentFor(v: number, { low, high, optimum }: { low?: number | undefined; high?: number | undefined; optimum?: number | undefined }): 'danger' | 'warning' | 'success' {
  if (optimum !== undefined) {
    return optimum >= (low ?? -Infinity) ? (v >= optimum ? 'success' : v >= (low ?? -Infinity) ? 'warning' : 'danger')
      : (v <= optimum ? 'success' : v <= (high ?? Infinity) ? 'warning' : 'danger');
  }
  if (low !== undefined && v < low) return 'danger';
  if (high !== undefined && v < high) return 'warning';
  return 'success';
}

export function Meter({
  value,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  label,
  showValue,
  format,
  children,
  className,
  ref,
  ...rest
}: MeterProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  if (process.env.NODE_ENV !== 'production' && label === undefined) {
    console.error('[aura-glass] Meter: `label` is required.');
  }
  return (
    <BaseMeter.Root
      {...rest}
      ref={ref}
      value={value}
      min={min}
      max={max}
      format={format}
      aria-label={label}
      data-ag-part="root"
      data-ag-intent={intentFor(value, { low, high, optimum })}
      className={cn('ag-meter', className)}
    >
      <BaseMeter.Label data-ag-part="label" className="ag-meter-label">
        {label}
      </BaseMeter.Label>
      <BaseMeter.Track {...SUNKEN} data-ag-part="track" className={cn('ag-meter-track', SUNKEN.className)}>
        <BaseMeter.Indicator data-ag-part="indicator" className="ag-meter-indicator" />
      </BaseMeter.Track>
      {showValue ? (
        <BaseMeter.Value data-ag-part="value" className="ag-meter-value" />
      ) : null}
      {children}
    </BaseMeter.Root>
  );
}
