'use client';

import * as React from 'react';
import { Slider as Base } from '@base-ui/react/slider';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { subscribeFrame } from '../../motion/ticker';
import { sizeAttrs } from '../control-shared/size';

/* REQ-CMP-51: coalesce pointer-driven onValueChange to one call per frame.
   Latest value lives in a ref; a pending subscribeFrame fires it. Keyboard
   reasons forward synchronously; onValueCommitted flushes pending first. */
function isPointerReason(reason: string | undefined): boolean {
  return reason === 'drag' || reason === 'pointer' || reason === 'track-press' || reason === 'track';
}
import type { SliderRootProps, SliderValueProps } from './Slider.types';

function SliderRoot<V extends number | number[]>({
  onValueChange,
  onValueCommitted,
  marks,
  size,
  children,
  className,
  ref,
  ...rest
}: SliderRootProps<V>) {
  const ariaLabel = (rest as Record<string, unknown>)['aria-label'] as string | undefined;
  const ariaLabelledby = (rest as Record<string, unknown>)['aria-labelledby'] as string | undefined;
  const initial = rest.value ?? rest.defaultValue;
  const thumbCount = Array.isArray(initial) ? Math.max(1, initial.length) : 1;

  const latest = React.useRef<{ value: V; details: ReturnType<typeof toChangeDetails> } | null>(null);
  const frameOff = React.useRef<(() => void) | null>(null);
  const flush = () => {
    frameOff.current?.();
    frameOff.current = null;
    const p = latest.current;
    latest.current = null;
    if (p) onValueChange?.(p.value, p.details);
  };
  React.useEffect(() => () => frameOff.current?.(), []);

  const handleChange = (v: V, eventDetails: unknown) => {
    const details = toChangeDetails(eventDetails);
    if (isPointerReason(details.reason)) {
      latest.current = { value: v, details };
      frameOff.current ??= subscribeFrame(flush);
      return;
    }
    onValueChange?.(v, details);
  };
  const handleCommitted = (v: V, eventDetails: unknown) => {
    flush();
    onValueCommitted?.(v, toChangeDetails(eventDetails));
  };

  return (
    <Base.Root
      data-ag-part="root"
      className={cn('ag-slider', className)}
      onValueChange={(v, details) => handleChange(v as V, details)}
      onValueCommitted={(v, details) => handleCommitted(v as V, details)}
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

export const Slider = { Root: SliderRoot, Value: SliderValue };
