/* GlassChip — 4.x compat adapter (REQ-SURF-13, DEP-S0218) → Chip. children
   (legacy label/text accepted), selected/onSelect(selected) →
   selected/onSelectedChange (selectable when either is given), removable +
   onRemove → onRemove, disabled, size xs → sm; variant success/warning/
   error/info → intent (other variants are neutral). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Chip } from '../../../data/chip';

export interface GlassChipProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  text?: React.ReactNode;
  variant?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  removable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onRemove?: (event?: React.MouseEvent) => void;
  onSelect?: (selected: boolean) => void;
  className?: string;
  [legacy: string]: unknown;
}

const INTENT: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  success: 'success', warning: 'warning', error: 'danger', info: 'info',
};

/**
 * 4.x `GlassChip` compat adapter (DEP-S0218).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Chip from aura-glass/data}.
 */
export function GlassChip(props: GlassChipProps) {
  warnDeprecated('DEP-S0218');
  const { children, label, text, variant, size, removable, selected, disabled, onRemove, onSelect, className } = props;
  const selectable = selected !== undefined || onSelect !== undefined;
  return (
    <Chip
      {...(selectable ? { selectable: true, selected: selected ?? false, onSelectedChange: (v: boolean) => onSelect?.(v) } : {})}
      {...(onRemove || removable ? { onRemove: () => onRemove?.() } : {})}
      {...(variant && INTENT[variant] ? { intent: INTENT[variant] } : {})}
      {...(size ? { size: size === 'xs' ? 'sm' : size } : {})}
      {...(disabled ? { disabled: true } : {})}
      {...(className ? { className } : {})}
    >
      {children ?? label ?? text}
    </Chip>
  );
}
