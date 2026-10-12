/* CMP-316 / REQ-CMP-123: Rating — an owned role='radiogroup' over Base UI
   `Radio` items with roving tabindex; Arrow keys (RTL-aware), Home/End;
   readOnly → aria-readonly and no interaction; `allowHalf` selects half steps
   by click position / Shift+Arrow.

   The group is owned (not Base UI RadioGroup) because a rating value can be
   fractional (3.5 checks item 4 and reads "3.5 of 5") and its keys step by
   halves; RadioGroup's composite would commit whole item values on focus.
   Each item is a standalone `Radio.Root` (role=radio, aria-checked, data-
   checked/unchecked, the hidden input, Space activation through Base UI's
   button). Outside a RadioGroup, Base UI derives `checked` as
   `value === ''` (RadioRoot.js: `groupContext ? checkedValue === value :
   value === ''`), so the checked item is given the empty value and every
   other item its ordinal. */
'use client';
import * as React from 'react';
import { Radio } from '@base-ui/react/radio';
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
      const target = groupRef.current?.querySelector<HTMLElement>(`[data-value="${Math.ceil(clamped)}"]`);
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
    // a keyboard (Space) activation has detail 0 and no pointer position: it
    // selects the whole item
    if (allowHalf && e.detail !== 0) {
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
      data-readonly={readOnly ? '' : undefined}
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
          <Radio.Root
            key={v}
            value={checked ? '' : String(v)}
            readOnly={readOnly}
            disabled={disabled}
            aria-posinset={v}
            aria-setsize={max}
            aria-label={checked && fractional ? `${current} of ${max}` : `${v} of ${max}`}
            tabIndex={roving}
            onClick={(e: React.MouseEvent<HTMLElement>) => onItemClick(v, e)}
            data-ag-part="item"
            data-value={v}
            data-state={filled ? 'on' : 'off'}
            data-half={half ? '' : undefined}
            className={cn('ag-rating-item', filled ? 'ag-rating-item-on' : undefined)}
          >
            {icon ?? '★'}
          </Radio.Root>
        );
      })}
    </div>
  );
}
