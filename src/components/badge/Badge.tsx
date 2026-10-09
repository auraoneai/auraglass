/* CMP-301/CMP-421: Badge — flat server leaf. intent neutral|info|success|
   warning|danger → data-ag-intent; `dot` renders the indicator dot; `count`
   with `max` clamps to "<max>+"; `label` supplies a VisuallyHidden text for
   iconless assistive naming. Opaque tint, no material. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  intent?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  /** Render the standalone status dot instead of a pill. */
  dot?: boolean;
  count?: number;
  /** Maximum shown before clamping to "<max>+" (default 99). */
  max?: number;
  /** Accessible label when content alone is insufficient (e.g. dot/count). */
  label?: string;
}

export function Badge({
  intent = 'neutral',
  dot,
  count,
  max = 99,
  label,
  children,
  className,
  ref,
  ...rest
}: BadgeProps & { ref?: React.Ref<HTMLSpanElement> | undefined }) {
  const clamped = count !== undefined && max !== undefined && count > max ? `${max}+` : count;
  return (
    <span
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-intent={intent}
      data-ag-dot={dot ? '' : undefined}
      className={cn('ag-badge', dot ? 'ag-badge-dot' : 'ag-badge-pill', className)}
    >
      {label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
      {dot ? null : (
        <span data-ag-part="label" className="ag-badge-label">
          {clamped !== undefined ? clamped : children}
        </span>
      )}
    </span>
  );
}
