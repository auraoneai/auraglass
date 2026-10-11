/* CMP-047: Chip — toggle chip on Base UI Toggle (pin required by CMP-001);
   pressed/onPressedChange/disabled; leading/trailing icon slots; parts
   [root, leadingIcon, label, trailingIcon, close]. Uncontrolled default-upcoming
   usage is a plain button via Toggle's uncontrolled mode. Removable (CMP-047):
   `onRemove` renders a separate close button named "Remove {label}"
   (CONTROL_MESSAGES.removeItem); activating it moves focus to the next chip
   (previous when it was the last) before calling onRemove, so focus is never
   dropped to <body> (CMP-354). */
'use client';
import * as React from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { cn } from '../../internal/index';
import { controlMessage, type ControlMessages } from '../control-shared/messages';

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean, eventDetails: unknown) => void;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
  /** Renders the close part; called when it is activated. */
  onRemove?: (() => void) | undefined;
  /** Accessible chip name used in "Remove {label}"; defaults to string children. */
  removeLabel?: string | undefined;
  /** Message overrides (`removeItem`). */
  messages?: ControlMessages | undefined;
}

const CHIP_SELECTOR = '.ag-chip:not(:disabled)';

/** Next (else previous) enabled chip among the removable group's siblings. */
function adjacentChip(group: HTMLElement): HTMLElement | null {
  const find = (start: Element | null, step: (el: Element) => Element | null): HTMLElement | null => {
    for (let el = start; el; el = step(el)) {
      const chip = el.matches(CHIP_SELECTOR) ? el : el.querySelector(CHIP_SELECTOR);
      if (chip instanceof HTMLElement) return chip;
    }
    return null;
  };
  return (
    find(group.nextElementSibling, (el) => el.nextElementSibling) ??
    find(group.previousElementSibling, (el) => el.previousElementSibling)
  );
}

export function Chip({
  pressed,
  defaultPressed,
  onPressedChange,
  leadingIcon,
  trailingIcon,
  children,
  className,
  onRemove,
  removeLabel,
  messages,
  ref,
  ...rest
}: ChipProps & { ref?: React.Ref<HTMLButtonElement> | undefined }) {
  const groupRef = React.useRef<HTMLSpanElement>(null);
  const chip = (
    <Toggle
      {...rest}
      ref={ref}
      data-ag-part="root"
      className={cn('ag-chip', className)}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
    >
      {leadingIcon ? (
        <span data-ag-part="leading-icon" className="ag-chip-leading" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span data-ag-part="label" className="ag-chip-label">
        {children}
      </span>
      {trailingIcon ? (
        <span data-ag-part="trailing-icon" className="ag-chip-trailing" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </Toggle>
  );
  if (onRemove === undefined) return chip;
  const label = removeLabel ?? (typeof children === 'string' ? children : '');
  const handleRemove = () => {
    const group = groupRef.current;
    const next = group ? adjacentChip(group) : null;
    next?.focus();
    onRemove();
  };
  return (
    <span ref={groupRef} className="ag-chip-group">
      {chip}
      <button
        type="button"
        data-ag-part="close"
        className="ag-chip-close"
        aria-label={controlMessage('removeItem', messages, { label }).trim()}
        disabled={rest.disabled}
        onClick={handleRemove}
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}
