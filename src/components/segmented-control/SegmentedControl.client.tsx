'use client';
import * as React from 'react';
import { stateRender, toDataState } from '../../foundation/state';
import { RadioGroup as BUGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { materialProps, SurfaceGroup } from '../../material';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { useControllableWarning } from '../../foundation/controllable';
import { startMorph } from '../../motion';
import { subscribeFrame } from '../../motion/ticker';
import type {
  SegmentedControlRootProps,
  SegmentedControlItemProps,
  SegmentedControlIndicatorProps,
} from './SegmentedControl.types';

function SegmentedControlIndicator({ children, className, ref }: SegmentedControlIndicatorProps) {
  return (
    <span {...materialProps({ layer: 'transient', thickness: 'thin' })} data-ag-part="indicator" aria-hidden="true" className={className} ref={ref}>
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
  const checked = root.querySelector<HTMLElement>("[data-ag-part='item'][aria-checked='true']");
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
  useControllableWarning('SegmentedControl', 'value', value);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = React.useCallback((el: HTMLDivElement | null) => {
    measureRef.current = el;
    const refCleanup = typeof ref === 'function' ? ref(el) : undefined;
    if (ref && typeof ref !== 'function') ref.current = el;
    if (!el) return;
    const count = React.Children.count(children);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(([entry]) => {
      measureIntoRoot(el);
      if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') &&
          count > 5 && entry && entry.contentRect.width <= 390 && !SEGMENT_SELECT_WARNED.has(el)) {
        SEGMENT_SELECT_WARNED.add(el);
        console.warn('[aura-glass] SegmentedControl with more than 5 items at ≤390px — prefer Select.');
      }
    });
    ro?.observe(el);
    measureIntoRoot(el);
    const off = nextFrame(() => measureIntoRoot(el));
    return () => {
      ro?.disconnect();
      off();
      measureRef.current = null;
      if (typeof refCleanup === 'function') refCleanup();
      else if (typeof ref === 'function') ref(null);
      else if (ref) ref.current = null;
    };
  }, [children, ref]);

  React.useEffect(() => {
    measureIntoRoot(measureRef.current);
  }, [value]);

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
        data-orientation={orientation}
        className={cn('ag-segmented-control', className)}
        ref={setRefs}
      >
        {hasCustomIndicator(children) ? null : <SegmentedControlIndicator />}
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
      title={title ?? (typeof children === 'string' ? children : undefined)}
      data-ag-part="item"
      className={cn('ag-segmented-item', className)}
      ref={ref}
      render={stateRender<{ checked: boolean }>((s) => toDataState({ checked: s.checked }), undefined)}
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
