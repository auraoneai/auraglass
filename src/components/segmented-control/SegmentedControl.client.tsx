'use client';
import * as React from 'react';
import { stateRender, toDataState } from '../../foundation/state';
import { RadioGroup as BUGroup } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';
import { materialProps } from '../../material';
import { setMovingOptics, surfaceGroupAttributes, viewTransitionParticipantAttributes } from '../../material/stateAttributes';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { useControllableWarning } from '../../foundation/controllable';
import { startMorph, useMorphName } from '../../motion';
import { resolvedMotion, subscribeFrame } from '../../motion/ticker';
import { withMorph } from '../control-shared/morph';
import type {
  SegmentedControlRootProps,
  SegmentedControlItemProps,
  SegmentedControlIndicatorProps,
} from './SegmentedControl.types';

function SegmentedControlIndicator({ children, className, ref }: SegmentedControlIndicatorProps) {
  /* REQ-MAT-48: morph owner — sanitised useId() name, participant marker and,
     on React 19.3+, <ViewTransition share="ag-morph">. */
  const morphName = useMorphName('segmented-indicator');
  return withMorph(
    morphName,
    <span
      {...materialProps({ layer: 'transient', thickness: 'thin', shape: 'concentric' })}
      {...viewTransitionParticipantAttributes()}
      data-ag-part="indicator"
      aria-hidden="true"
      className={className}
      style={{ viewTransitionName: morphName }}
      ref={ref}
    >
      {children}
    </span>,
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
   width CSS vars. One ResizeObserver on the root. A change moves the indicator
   by View Transition when the engine has one (S-13 startMorph; MAT drops
   optics during it), otherwise by the CSS transition (--ag-spring-snappy over
   --ag-duration-small). While it moves the indicator carries data-ag-animating
   + data-ag-allow-nested (its own glass); both clear on transitionend.
   Calm/none jump. */
/* one-shot next-frame via the motion ticker (REQ-MOT-65) */
function nextFrame(cb: () => void): () => void {
  const off = subscribeFrame(() => { off(); cb(); });
  return off;
}

function motionAt(el: Element): 'full' | 'calm' | 'none' {
  const attr = el.closest('[data-ag-motion]')?.getAttribute('data-ag-motion');
  if (attr === 'full' || attr === 'calm' || attr === 'none') return attr;
  return resolvedMotion(el.ownerDocument);
}

function indicatorOf(root: HTMLElement): HTMLElement | null {
  for (const child of Array.from(root.children)) {
    if (child instanceof HTMLElement && child.dataset['agPart'] === 'indicator') return child;
  }
  return null;
}

/** Moves the indicator to the newly checked item (REQ-CMP-42). */
function moveIndicator(root: HTMLElement): void {
  const indicator = indicatorOf(root);
  const mode = motionAt(root);
  if (!indicator || mode !== 'full') {
    measureIntoRoot(root);
    return;
  }
  setMovingOptics(indicator, true);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    indicator.removeEventListener('transitionend', onEnd);
    indicator.removeEventListener('transitioncancel', onEnd);
    setMovingOptics(indicator, false);
  };
  const onEnd = (e: Event) => {
    if (e.target === indicator) finish();
  };
  const doc = root.ownerDocument as Document & { startViewTransition?: unknown };
  if (typeof doc.startViewTransition === 'function') {
    startMorph(() => { measureIntoRoot(root); }, { surfaces: [indicator], motion: mode }).then(finish, finish);
    return;
  }
  indicator.addEventListener('transitionend', onEnd);
  indicator.addEventListener('transitioncancel', onEnd);
  measureIntoRoot(root);
  /* nothing to animate (same geometry, or no CSS transition engine): settle now */
  nextFrame(() => {
    const running = typeof indicator.getAnimations === 'function' ? indicator.getAnimations().length : 0;
    if (running === 0) finish();
  });
}

function measureIntoRoot(root: HTMLElement | null) {
  if (!root) return;
  const checked = root.querySelector<HTMLElement>("[data-ag-part='item'][aria-checked='true']");
  if (!checked) return;
  const rr = root.getBoundingClientRect();
  const r = checked.getBoundingClientRect();
  const s = root.style;
  s.setProperty('--_ag-seg-x', `${r.left - rr.left}px`);
  s.setProperty('--_ag-seg-y', `${r.top - rr.top}px`);
  s.setProperty('--_ag-seg-w', `${r.width}px`);
  s.setProperty('--_ag-seg-h', `${r.height}px`);
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
    /* Measure synchronously at attach; ResizeObserver's initial observation
       re-measures at the next rendering opportunity, so mount schedules no
       frame of its own (0 rAF/timers at idle, REQ-SURF perf table). */
    measureIntoRoot(el);
    return () => {
      ro?.disconnect();
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
      <BUGroup
        {...rest}
        {...materialProps({
          layer: 'chrome',
          variant,
          thickness: thickness ?? 'regular',
          ...(orientation === 'horizontal' ? { shape: 'capsule' as const } : {}),
          ...(prominent === true ? { prominent } : {}),
          ...(refraction === true ? { refraction } : {}),
        })}
        {...surfaceGroupAttributes(undefined)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v, eventDetails) => {
          const el = measureRef.current;
          /* REQ-CMP-42: Base UI commits aria-checked after this callback, so
             the move measures on the next frame. */
          if (el) nextFrame(() => moveIndicator(el));
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
