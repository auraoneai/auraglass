'use client';

import * as React from 'react';
import { useControllableWarning } from '../../foundation/controllable';
import { Slider as Base } from '@base-ui/react/slider';
import { DirectionProvider, useDirection } from '@base-ui/react/direction-provider';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { materialProps } from '../../material';
import { subscribeFrame } from '../../motion/ticker';
import { sizeAttrs } from '../control-shared/size';
import type { SliderRootProps, SliderValueProps } from './Slider.types';

/* REQ-CMP-49: the track is a content-sunken well; the thumb is a transient
   surface. The thumb sits inside the track surface, so the MAT nesting rule
   keeps it opaque (no backdrop) at rest. Only while dragging does it carry
   data-ag-allow-nested, which re-enables its own transient glass. Component
   CSS never declares backdrop-filter (REQ-CMP-54). */
const TRACK_MATERIAL = materialProps({ layer: 'content', content: 'content-sunken' });
const THUMB_MATERIAL = materialProps({ layer: 'transient', thickness: 'thin' });
const THUMB_MATERIAL_DRAGGING = materialProps({ layer: 'transient', thickness: 'thin', allowNested: true });

type ThumbRenderProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined };
const renderThumb = (props: ThumbRenderProps, state: { dragging: boolean }) => (
  <div {...props} {...(state.dragging ? THUMB_MATERIAL_DRAGGING : THUMB_MATERIAL)} />
);

/* REQ-CMP-50: Base UI ignores the DOM dir attribute for key mirroring. The
   direction is the closest [dir] ancestor of the slider (measured after
   mount, so it follows a dir="rtl" container as well as <html dir>), falling
   back to an enclosing DirectionProvider; SSR renders the provider value.
   It is re-measured when focus or a pointer enters the slider, so a dir
   change made after mount applies before the next key or drag. */
function useResolvedDirection(): ['ltr' | 'rtl', React.RefCallback<HTMLElement>] {
  const contextDir = useDirection();
  const [domDir, setDomDir] = React.useState<'ltr' | 'rtl' | null>(null);
  const measure = React.useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const attr = node.parentElement?.closest('[dir]')?.getAttribute('dir');
    setDomDir(attr === 'rtl' || attr === 'ltr' ? attr : null);
  }, []);
  return [domDir ?? contextDir, measure];
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
}

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
  useControllableWarning('Slider', 'value', rest.value);
  const [dir, measureDir] = useResolvedDirection();
  const rootRef = React.useCallback(
    (node: HTMLDivElement | null) => { measureDir(node); assignRef(ref, node); },
    [measureDir, ref],
  );
  const ariaLabel = (rest as Record<string, unknown>)['aria-label'] as string | undefined;
  const ariaLabelledby = (rest as Record<string, unknown>)['aria-labelledby'] as string | undefined;
  const initial = rest.value ?? rest.defaultValue;
  const thumbCount = Array.isArray(initial) ? Math.max(1, initial.length) : 1;
  const latest = React.useRef<{ value: V; details: ReturnType<typeof toChangeDetails> } | null>(null);
  const frameOff = React.useRef<(() => void) | null>(null);
  const changeCallback = React.useRef(onValueChange);
  React.useLayoutEffect(() => { changeCallback.current = onValueChange; }, [onValueChange]);
  const flush = () => {
    frameOff.current?.();
    frameOff.current = null;
    const pending = latest.current;
    latest.current = null;
    if (pending) changeCallback.current?.(pending.value, pending.details);
  };
  React.useEffect(() => () => { frameOff.current?.(); latest.current = null; }, []);
  const handleChange = (value: V, eventDetails: unknown) => {
    const details = toChangeDetails(eventDetails);
    if (details.reason === 'pointer') {
      latest.current = { value, details };
      // no `??=`: React Compiler cannot lower logical assignment (REQ-CMP-24).
      if (frameOff.current === null) frameOff.current = subscribeFrame(flush);
    } else {
      flush();
      onValueChange?.(value, details);
    }
  };
  return (
    <DirectionProvider direction={dir}>
      <Base.Root
        data-ag-part="root"
      className={cn('ag-slider', className)}
      onValueChange={(v, details) => handleChange(v as V, details)}
      onValueCommitted={(v, details) => { flush(); onValueCommitted?.(v as V, toChangeDetails(details)); }}
      ref={rootRef}
      onFocusCapture={(e: React.FocusEvent<HTMLDivElement>) => measureDir(e.currentTarget)}
      onPointerDownCapture={(e: React.PointerEvent<HTMLDivElement>) => measureDir(e.currentTarget)}
      {...(format !== undefined ? { format } : {})}
      {...sizeAttrs(size)}
      {...rest}
    >
      {children ?? (
        <>
          <Base.Value data-ag-part="value" />
          <Base.Control data-ag-part="control">
            <Base.Track data-ag-part="track" {...TRACK_MATERIAL}>
              <Base.Indicator data-ag-part="range" />
              {Array.from({ length: thumbCount }).map((_, i) => (
                <Base.Thumb
                  key={i}
                  data-ag-part="thumb"
                  render={renderThumb}
                  aria-label={thumbCount === 1 ? ariaLabel : `${ariaLabel ?? 'value'} ${i + 1}`}
                  aria-labelledby={thumbCount === 1 ? ariaLabelledby : undefined}
                  {...(getAriaValueText !== undefined
                    ? { getAriaValueText: (_formatted: string, value: number, index: number) => getAriaValueText(value, index) }
                    : {})}
                >
                  <span data-ag-part="hit-area" aria-hidden="true" />
                </Base.Thumb>
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
    </DirectionProvider>
  );
}

function SliderValue({ className, ref }: SliderValueProps) {
  return <Base.Value data-ag-part="value" className={className} ref={ref as React.Ref<HTMLOutputElement>} />;
}

/* REQ-CMP-48: exported part wrappers (data-ag-part) so callers can compose
   the default layout themselves. getAriaValueText is a Thumb prop; number
   formatting (`format`/`locale`) is configured on Slider.Root. */
function SliderControl({ className, children, ref }: { className?: string; children?: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) {
  return <Base.Control data-ag-part="control" className={cn('ag-slider-control', className)} ref={ref}>{children}</Base.Control>;
}

function SliderTrack({ className, children, ref }: { className?: string; children?: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) {
  return <Base.Track data-ag-part="track" {...TRACK_MATERIAL} className={cn('ag-slider-track', className)} ref={ref}>{children}</Base.Track>;
}

function SliderRange({ className, ref }: { className?: string; ref?: React.Ref<HTMLDivElement> }) {
  return <Base.Indicator data-ag-part="range" className={cn('ag-slider-range', className)} ref={ref} />;
}

export interface SliderThumbPartProps {
  className?: string | undefined;
  'aria-label'?: string | undefined;
  getAriaValueText?: ((value: number, index: number) => string) | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

function SliderThumb({ className, getAriaValueText, ...rest }: SliderThumbPartProps) {
  return (
    <Base.Thumb
      data-ag-part="thumb"
      render={renderThumb}
      className={cn('ag-slider-thumb', className)}
      {...(getAriaValueText !== undefined
        ? { getAriaValueText: (_formatted: string, value: number, index: number) => getAriaValueText(value, index) }
        : {})}
      {...rest}
    />
  );
}

export const Slider = {
  Root: SliderRoot,
  Value: SliderValue,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
};

/** Internal part (not contract surface, REQ-CMP-06): in-repo composition only. */
export { SliderControl };
