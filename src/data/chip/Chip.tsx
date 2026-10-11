'use client';
/* Chip (SURF-257, REQ-SURF-88): CMP ChipToggle (the REQ-CMP-01 Base UI Toggle
   seam) when selectable, static span otherwise; separate remove button
   (≥44px coarse hit). The chip itself is a MAT `content` surface
   (content-raised) via materialProps — never a data-ag-material attribute. */
import * as React from 'react';
import { ChipToggle } from '../../components/chip/ChipToggle';
import { materialProps } from '../../material';

export interface ChipProps {
  children: React.ReactNode;
  /** Plain-text name of the chip. Names the remove button ("Remove {label}")
      when `children` is not a string. */
  label?: string | undefined;
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

const CONTENT_MATERIAL = materialProps({ layer: 'content', content: 'content-raised' });

export function Chip({
  children,
  label,
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
  const removeWord = labels?.remove ?? 'Remove';
  const name = label ?? (typeof children === 'string' ? children : undefined);
  const cls = `ag-surface ag-chip${className ? ` ${className}` : ''}`;
  const chip = selectable ? (
    <ChipToggle
      {...CONTENT_MATERIAL}
      pressed={selected}
      defaultPressed={defaultSelected}
      onPressedChange={(p) => onSelectedChange?.(p)}
      disabled={disabled}
      data-ag-part="chip"
      data-ag-intent={intent}
      data-ag-size={size}
      className={cls}
    >
      {children}
    </ChipToggle>
  ) : (
    <span
      {...CONTENT_MATERIAL}
      data-ag-part="chip"
      data-ag-intent={intent}
      data-ag-size={size}
      data-disabled={disabled || undefined}
      className={cls}
    >
      {children}
    </span>
  );
  if (onRemove === undefined) return chip;
  if (process.env['NODE_ENV'] === 'development' && name === undefined) {
    console.warn('[auraglass] Chip: pass `label` when children is not a string so the remove button has a name.');
  }
  return (
    <span className="ag-chip-group">
      {chip}
      <button
        type="button"
        data-ag-part="chip-remove"
        className="ag-chip__remove"
        aria-label={`${removeWord}${name !== undefined ? ` ${name}` : ''}`}
        disabled={disabled}
        onClick={onRemove}
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}
