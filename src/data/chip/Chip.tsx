'use client';
/* Chip (SURF-257, REQ-SURF-88): Base UI Toggle when selectable, static span
   otherwise; separate remove button (≥44px coarse hit). */
import * as React from 'react';
import { Toggle } from '@base-ui/react/toggle';

export interface ChipProps {
  children: React.ReactNode;
  selectable?: boolean | undefined;
  selected?: boolean | undefined;
  defaultSelected?: boolean | undefined;
  onSelectedChange?: ((selected: boolean) => void) | undefined;
  onRemove?: (() => void) | undefined;
  intent?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  disabled?: boolean | undefined;
  labels?: { remove?: string | undefined } | undefined;
  className?: string | undefined;
}

export function Chip({
  children,
  selectable = false,
  selected,
  defaultSelected,
  onSelectedChange,
  onRemove,
  intent = 'neutral',
  size = 'md',
  disabled = false,
  labels,
  className,
}: ChipProps) {
  const label = labels?.remove ?? 'Remove';
  const text = typeof children === 'string' ? children : undefined;
  const chip = selectable ? (
    <Toggle
      pressed={selected}
      defaultPressed={defaultSelected}
      onPressedChange={(p) => onSelectedChange?.(p)}
      disabled={disabled}
      data-ag-part="chip"
      data-ag-intent={intent}
      data-ag-size={size}
      className={`ag-chip${className ? ` ${className}` : ''}`}
    >
      {children}
    </Toggle>
  ) : (
    <span
      data-ag-part="chip"
      data-ag-intent={intent}
      data-ag-size={size}
      data-disabled={disabled || undefined}
      className={`ag-chip${className ? ` ${className}` : ''}`}
    >
      {children}
    </span>
  );
  if (onRemove === undefined) return chip;
  return (
    <span className="ag-chip-group">
      {chip}
      <button
        type="button"
        data-ag-part="chip-remove"
        className="ag-chip__remove"
        aria-label={`${label}${text !== undefined ? ` ${text}` : ''}`}
        disabled={disabled}
        onClick={onRemove}
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}
