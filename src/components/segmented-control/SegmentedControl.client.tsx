'use client';
import * as React from 'react';
import { RadioGroup as BUGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { materialProps, SurfaceGroup } from '../../material';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { startMorph } from '../../motion';
import { subscribeFrame } from '../../motion/ticker';
import type {
  SegmentedControlRootProps,
  SegmentedControlItemProps,
} from './SegmentedControl.types';

const SEGMENT_SELECT_WARNED = new WeakSet<Element>();

/* REQ-CMP-42: measure the checked item, drive the indicator via transform +
   width CSS vars. One ResizeObserver on the root; animated via S-13
   startMorph (native View Transition when available, FLIP otherwise), or the
   CSS transition under [data-ag-animating]. Calm/none jumps. */
/* one-shot next-frame via the motion ticker (REQ-MOT-65) */
function nextFrame(cb: () => void): () => void {
  const off = subscribeFrame(() => { off(); cb(); });
  return off;
}

function measureIntoRoot(root: HTMLElement | null) {
  if (!root) return;
  const checked = root.querySelector<HTMLElement>("[data-ag-part='item'][data-checked]");
  if (!checked) return;
  const rr = root.getBoundingClientRect();
  const r = checked.getBoundingClientRect();
  const s = root.style;
  s.setProperty('--ag-seg-x', `${r.left - rr.left}px`);
  s.setProperty('--ag-seg-y', `${r.top - rr.top}px`);
  s.setProperty('--ag-seg-w', `${r.width}px`);
  s.setProperty('--ag-seg-h', `${r.height}px`);
}

function SegmentedControlRoot({
  value,
  defaultValue,
  onValueChange,
  size = 'md',
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

  /* REQ-CMP-42: one ResizeObserver on the root keeps the indicator measured
     to the checked item; initial measure jumps (no animating flag). */
  React.useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measureIntoRoot(el));
    ro?.observe(el);
    measureIntoRoot(el);
    const off = nextFrame(() => measureIntoRoot(el));
    return () => { ro?.disconnect(); off(); };
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
        onValueChange={(v, eventDetails) => {
          const el = measureRef.current;
          if (el) {
            /* REQ-CMP-42: data-ag-animating until transitionend; S-13
               startMorph when the engine supports it, else CSS transition. */
            el.setAttribute('data-ag-animating', '');
            const finish = () => el.removeAttribute('data-ag-animating');
            nextFrame(() => {
              startMorph(() => { measureIntoRoot(el); }, { surfaces: [el] })
                .then(finish, finish);
            });
            el.addEventListener('transitionend', finish, { once: true });
          }
          onValueChange?.(v as string, toChangeDetails(eventDetails));
        }}
        name={name}
        disabled={disabled}
        data-ag-part="root"
        data-ag-size={size}
        className={cn('ag-segmented-control', className)}
        ref={setRefs}
      >
        <span
          data-ag-part="indicator"
          aria-hidden="true"
          {...materialProps({ layer: 'transient', thickness: 'thin' })}
        />
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
      <span data-ag-part="item-label">{children}</span>
    </Radio.Root>
  );
}

export const SegmentedControl = {
  Root: SegmentedControlRoot,
  Item: SegmentedControlItem,
};
