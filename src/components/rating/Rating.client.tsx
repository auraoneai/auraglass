/* CMP-316: Rating — own role='radiogroup' with roving tabindex; Arrow keys
   (RTL-aware), Home/End; readOnly → aria-readonly and no interaction;
   `allowHalf` selects half steps by click position / Shift+Arrow. */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number, details: { event: React.SyntheticEvent | KeyboardEvent }) => void;
  max?: number;
  allowHalf?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  /** Item glyph; default renders the css star. */
  icon?: React.ReactNode;
  'aria-label'?: string;
}

function isRtl(el: HTMLElement | null): boolean {
  const host = el?.closest('[dir]');
  return host?.getAttribute('dir') === 'rtl';
}

export function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  allowHalf,
  readOnly,
  disabled,
  icon,
  className,
  ref,
  'aria-label': ariaLabel,
  ...rest
}: RatingProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value ?? uncontrolled;
  const step = allowHalf ? 0.5 : 1;
  const interactive = !readOnly && !disabled;

  const groupRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = (node: HTMLDivElement | null) => {
    groupRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  const commit = (next: number, ev: React.SyntheticEvent | KeyboardEvent) => {
    const clamped = Math.min(max, Math.max(0, Math.round(next / step) * step));
    if (clamped === current) return;
    if (value === undefined) setUncontrolled(clamped);
    onValueChange?.(clamped, { event: ev });
    // REQ-CMP-123: focus follows value — move to the newly-checked radio.
    if (clamped > 0) {
      const target = groupRef.current?.querySelector<HTMLElement>(`[data-ag-value="${Math.ceil(clamped)}"]`);
      target?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rtl = isRtl(e.currentTarget);
    if (e.key === 'Home') { e.preventDefault(); commit(step, e); return; }
    if (e.key === 'End') { e.preventDefault(); commit(max, e); return; }
    const delta = e.shiftKey && allowHalf ? 0.5 : 1;
    const forward = rtl ? -1 : 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); commit(current + delta * (e.key === 'ArrowUp' ? 1 : forward), e); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); commit(current - delta * (e.key === 'ArrowDown' ? 1 : forward), e); }
  };

  const onItemClick = (index: number, e: React.MouseEvent<HTMLElement>) => {
    if (!interactive) return;
    let v = index;
    if (allowHalf) {
      const rect = e.currentTarget.getBoundingClientRect();
      const rtl = isRtl(e.currentTarget);
      const leftHalf = rtl ? e.clientX > rect.left + rect.width / 2 : e.clientX < rect.left + rect.width / 2;
      if (leftHalf) v = index - 0.5;
    }
    commit(v, e);
  };

  return (
    <div
      {...rest}
      ref={setRefs}
      role="radiogroup"
      aria-label={ariaLabel ?? 'Rating'}
      aria-readonly={readOnly || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive ? undefined : readOnly ? 0 : undefined}
      onKeyDown={onKeyDown}
      data-ag-part="root"
      data-ag-readonly={readOnly ? '' : undefined}
      className={cn('ag-rating', className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const v = i + 1;
        const filled = current >= v - (allowHalf ? 0.5 : 0);
        const half = allowHalf && current === v - 0.5;
        const checked = current >= v - (allowHalf ? 0.5 : 0) && current <= v;
        // REQ-CMP-123 roving tabindex: checked item 0, others -1; when nothing
        // is checked the first item takes the group tab stop.
        const roving = interactive ? (checked || (current <= 0 && v === 1) ? 0 : -1) : -1;
        const fractional = current % 1 !== 0;
        return (
          <span
            key={v}
            role="radio"
            aria-checked={checked}
            aria-posinset={v}
            aria-setsize={max}
            aria-label={checked && fractional ? `${current} of ${max}` : `${v} of ${max}`}
            tabIndex={roving}
            onClick={(e) => onItemClick(v, e)}
            data-ag-part="item"
            data-ag-value={v}
            data-state={filled ? 'on' : 'off'}
            data-ag-half={half ? '' : undefined}
            className={cn('ag-rating-item', filled ? 'ag-rating-item-on' : undefined)}
          >
            {icon ?? '★'}
          </span>
        );
      })}
    </div>
  );
}
