'use client';
/* Chip (SURF-257, REQ-SURF-88): CMP ChipToggle (the REQ-CMP-01 Base UI Toggle
   seam) when selectable, static span otherwise; separate remove button
   (≥44px coarse hit). The chip itself is a MAT `content` surface
   (content-raised) via materialProps — never a material data attribute (banned by the contract). */
import * as React from 'react';
import { ChipToggle } from '../../components/chip/ChipToggle';
import { materialProps } from '../../material';

export interface ChipProps {
  /** Content rendered inside the component. */
  children: React.ReactNode;
  /** Plain-text name of the chip. Names the remove button ("Remove {label}")
      when `children` is not a string. */
  label?: string | undefined;
  /** Makes the chip a toggle. */
  selectable?: boolean | undefined;
  /** Controlled selected state. Pair with `onSelectedChange`. */
  selected?: boolean | undefined;
  /** Initial selected state when uncontrolled. */
  defaultSelected?: boolean | undefined;
  /** Called with the next selected state. */
  onSelectedChange?: ((selected: boolean) => void) | undefined;
  /** Called when the remove button is pressed; the button is shown only when set. */
  onRemove?: (() => void) | undefined;
  /** Status tint. */
  intent?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined;
  /** Chip size. */
  size?: 'sm' | 'md' | 'lg' | undefined;
  /** Disables interaction. */
  disabled?: boolean | undefined;
  /** Overrides for the built-in, localizable UI strings. */
  labels?: { remove?: string | undefined } | undefined;
  /** Class name merged onto the root element. */
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
