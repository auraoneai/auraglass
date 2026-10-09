'use client';

import * as React from 'react';
import { Slider as Base } from '@base-ui/react/slider';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { sizeAttrs } from '../control-shared/size';
import type { SliderRootProps, SliderValueProps } from './Slider.types';

function SliderRoot<V extends number | number[]>({
  onValueChange,
  onValueCommitted,
  marks,
  size,
  children,
  className,
  ref,
  getAriaValueText,
  format,
  ...rest
}: SliderRootProps<V>) {
  const ariaLabel = (rest as Record<string, unknown>)['aria-label'] as string | undefined;
  const ariaLabelledby = (rest as Record<string, unknown>)['aria-labelledby'] as string | undefined;
  const initial = rest.value ?? rest.defaultValue;
  const thumbCount = Array.isArray(initial) ? Math.max(1, initial.length) : 1;
  return (
    <Base.Root
      data-ag-part="root"
      className={cn('ag-slider', className)}
      onValueChange={(v, details) => onValueChange?.(v as V, toChangeDetails(details))}
      onValueCommitted={(v, details) => onValueCommitted?.(v as V, toChangeDetails(details))}
      ref={ref}
      {...sizeAttrs(size)}
      {...rest}
    >
      {children ?? (
        <>
          <Base.Value data-ag-part="value" />
          <Base.Control data-ag-part="control">
            <Base.Track data-ag-part="track">
              <Base.Indicator data-ag-part="range" />
              {Array.from({ length: thumbCount }).map((_, i) => (
                <Base.Thumb
                  key={i}
                  data-ag-part="thumb"
                  aria-label={thumbCount === 1 ? ariaLabel : `${ariaLabel ?? 'value'} ${i + 1}`}
                  aria-labelledby={thumbCount === 1 ? ariaLabelledby : undefined}
                  {...(getAriaValueText !== undefined ? { getAriaValueText } : {})}
                  {...(format !== undefined ? { format } : {})}
                />
              ))}
            </Base.Track>
          </Base.Control>
          {marks?.map((m) => {
            const min = typeof rest.min === 'number' ? rest.min : 0;
            const max = typeof rest.max === 'number' ? rest.max : 100;
            const pct = max > min ? ((m.value - min) / (max - min)) * 100 : 0;
            return (
              <React.Fragment key={m.value}>
                <span data-ag-part="mark" data-value={m.value} style={{ insetInlineStart: `${pct}%` }} />
                {m.label !== undefined ? (
                  <span data-ag-part="mark-label" style={{ insetInlineStart: `${pct}%` }}>
                    {m.label}
                  </span>
                ) : null}
              </React.Fragment>
            );
          })}
        </>
      )}
    </Base.Root>
  );
}

function SliderValue({ className, ref }: SliderValueProps) {
  return <Base.Value data-ag-part="value" className={className} ref={ref as React.Ref<HTMLOutputElement>} />;
}

/* REQ-CMP-48: exported part wrappers (data-ag-part) so callers can compose
   the default layout themselves; getAriaValueText/format are Thumb props. */
function SliderControl({ className, children, ref }: { className?: string; children?: React.ReactNode; ref?: React.Ref<HTMLElement> }) {
  return <Base.Control data-ag-part="control" className={cn('ag-slider-control', className)} ref={ref}>{children}</Base.Control>;
}

function SliderTrack({ className, children, ref }: { className?: string; children?: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) {
  return <Base.Track data-ag-part="track" className={cn('ag-slider-track', className)} ref={ref}>{children}</Base.Track>;
}

function SliderRange({ className, ref }: { className?: string; ref?: React.Ref<HTMLDivElement> }) {
  return <Base.Indicator data-ag-part="range" className={cn('ag-slider-range', className)} ref={ref} />;
}

export interface SliderThumbPartProps {
  className?: string | undefined;
  'aria-label'?: string | undefined;
  getAriaValueText?: ((value: number, index: number) => string) | undefined;
  format?: Intl.NumberFormatOptions | undefined;
  ref?: React.Ref<HTMLElement> | undefined;
}

function SliderThumb({ className, ...rest }: SliderThumbPartProps) {
  return <Base.Thumb data-ag-part="thumb" className={cn('ag-slider-thumb', className)} {...rest} />;
}

export const Slider = {
  Root: SliderRoot,
  Value: SliderValue,
  Control: SliderControl,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
};
