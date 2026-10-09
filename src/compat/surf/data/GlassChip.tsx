'use client';
import { warnDeprecated } from '../../../internal';
import { Chip } from '../../../data/chip';
import type { ChipProps } from '../../../data/chip';

/** @deprecated GlassChipProps DEP-S0649 since 4.2.0, removed in 6.0.0. */
export type GlassChipProps = {
  label?: React.ReactNode;
  text?: React.ReactNode;
  selected?: boolean;
  onSelect?: (pressed: boolean) => void;
  onRemove?: () => void;
  color?: string;
} & Omit<ChipProps, 'selected' | 'onSelectedChange'>;

export function GlassChip(props: GlassChipProps) {
  warnDeprecated('DEP-S0649');
  const { label, text, selected, onSelect, onRemove, color, children, ...rest } = props;
  return (
    <Chip {...rest} selected={selected} onSelectedChange={(v: boolean) => onSelect?.(v)} onRemove={onRemove}>
      {children ?? label ?? text}
    </Chip>
  );
}
