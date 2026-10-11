'use client';
import * as React from 'react';
import { RadioGroup as BUGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { materialProps, SurfaceGroup } from '../../material';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import type {
  SegmentedControlRootProps,
  SegmentedControlItemProps,
  SegmentedControlIndicatorProps,
} from './SegmentedControl.types';

function SegmentedControlIndicator({ children, className, ref }: SegmentedControlIndicatorProps) {
  return (
    <span data-ag-part="indicator" aria-hidden="true" className={className} ref={ref}>
      {children}
    </span>
  );
}
SegmentedControlIndicator.displayName = 'SegmentedControl.Indicator';

/* REQ-CMP-41: a consumer-supplied Indicator replaces the auto-rendered one. */
function hasCustomIndicator(children: React.ReactNode): boolean {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === SegmentedControlIndicator) found = true;
  });
  return found;
}

const SEGMENT_SELECT_WARNED = new WeakSet<Element>();

function SegmentedControlRoot({
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  orientation = 'horizontal',
  variant = 'regular',
  thickness,
  prominent,
  refraction,
  name,
  disabled,
  className,
  children,
  ref,
  ...rest
}: SegmentedControlRootProps) {
  /* Dev-only: >5 segments at ~390px → recommend Select (stripped in production). */
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return;
    const el = measureRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const count = React.Children.count(children);
    const ro = new ResizeObserver(([entry]) => {
      if (
        count > 5 &&
        entry !== undefined &&
        entry.contentRect.width <= 390 &&
        !SEGMENT_SELECT_WARNED.has(el)
      ) {
        SEGMENT_SELECT_WARNED.add(el);
        // eslint-disable-next-line no-console
        console.warn(
          '[aura-glass] SegmentedControl with more than 5 items at ≤390px — prefer Select.',
        );
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const setRefs = (el: HTMLDivElement | null) => {
    measureRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <SurfaceGroup className="ag-segmented-surface">
      <BUGroup
        {...rest}
        {...materialProps({
          layer: 'chrome',
          variant,
          ...(thickness !== undefined ? { thickness } : {}),
          ...(prominent === true ? { prominent } : {}),
          ...(refraction === true ? { refraction } : {}),
        })}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v, eventDetails) => onValueChange?.(v as string, toChangeDetails(eventDetails))}
        name={name}
        disabled={disabled}
        data-ag-part="root"
        data-ag-size={size}
        data-orientation={orientation}
        className={cn('ag-segmented-control', className)}
        ref={setRefs}
      >
        {hasCustomIndicator(children) ? null : <span data-ag-part="indicator" aria-hidden="true" />}
        {children}
      </BUGroup>
    </SurfaceGroup>
  );
}

function SegmentedControlItem({ value, disabled, title, className, children, ref }: SegmentedControlItemProps) {
  return (
    <Radio.Root
      value={value}
      disabled={disabled}
      title={title}
      data-ag-part="item"
      className={cn('ag-segmented-item', className)}
      ref={ref}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      <span data-ag-part="item-label">{children}</span>
    </Radio.Root>
  );
}

export const SegmentedControl = {
  Root: SegmentedControlRoot,
  Item: SegmentedControlItem,
  Indicator: SegmentedControlIndicator,
};
