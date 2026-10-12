/* CMP-114 compat: LiquidGlassBadgeCluster (4.x) -> Badge (5.0), DEP-C0236.
   warnDeprecated fires at call time, once per page load per symbol;
   unmappable props drop with a single warning; never throws.
   Mapping: items -> one neutral Badge per item (selected -> info intent and
   aria-pressed, as 4.x set it); maxCollapsed/expanded/onExpandedChange keep
   the 4.x collapse: the first `maxCollapsed` items show and a "+N" button
   toggles expansion; selectionMode -> data-selection-mode; className and
   the remaining div attributes pass through to the group wrapper.
   Dropped: materialVariant (5.0 Badge has no material). */
'use client';
import * as React from 'react';
import { cn, warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge/Badge';

const DEP = 'DEP-C0236';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface LiquidGlassBadgeClusterItem {
  id: string;
  label: string;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
}

export interface LiquidGlassBadgeClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  items: readonly LiquidGlassBadgeClusterItem[];
  expanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
  maxCollapsed?: number | undefined;
  selectionMode?: 'none' | 'single' | 'multiple' | undefined;
  materialVariant?: 'regular' | 'clear' | undefined;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Badge}. */
export function LiquidGlassBadgeCluster({
  items,
  expanded = false,
  onExpandedChange,
  maxCollapsed = 3,
  selectionMode = 'none',
  materialVariant,
  className,
  ref,
  ...rest
}: LiquidGlassBadgeClusterProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  warnDeprecated(DEP);
  if (materialVariant !== undefined) drop('materialVariant');
  const visible = expanded ? items : items.slice(0, maxCollapsed);
  const hiddenCount = Math.max(items.length - visible.length, 0);
  return (
    <div
      role="group"
      {...rest}
      ref={ref}
      data-selection-mode={selectionMode}
      className={cn('ag-badge-cluster', className)}
    >
      {visible.map((item) => (
        <Badge
          key={item.id}
          intent={item.selected ? 'info' : 'neutral'}
          aria-pressed={item.selected}
          aria-disabled={item.disabled || undefined}
        >
          {item.label}
        </Badge>
      ))}
      {hiddenCount > 0 ? (
        <button type="button" aria-expanded={expanded} onClick={() => onExpandedChange?.(!expanded)}>
          +{hiddenCount}
        </button>
      ) : null}
    </div>
  );
}
