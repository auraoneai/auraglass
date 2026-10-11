/* CMP-041: AvatarGroup — non-interactive collection of avatar elements.
   `max` clamps visible items; overflow renders an item labelled 'N more'.
   Children overlap via a negative logical margin token. Server component. */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum items rendered before the overflow '+N' item. */
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export function AvatarGroup({
  max,
  size = 'md',
  children,
  className,
  ref,
  ...rest
}: AvatarGroupProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const clamped = typeof max === 'number' && max >= 0 && items.length > max;
  const shown = clamped ? items.slice(0, Math.max(0, max)) : items;
  const rest0 = items.length - shown.length;
  return (
    <div {...rest} ref={ref} data-ag-part="root" data-ag-size={size} className={cn('ag-avatar-group', className)}>
      {shown.map((child, i) => (
        <span data-ag-part="item" className="ag-avatar-group-item" key={(child as React.ReactElement).key ?? i}>
          {child}
        </span>
      ))}
      {rest0 > 0 ? (
        <span data-ag-part="value" className="ag-avatar-group-value" role="img" aria-label={`${rest0} more`}>
          +{rest0}
        </span>
      ) : null}
    </div>
  );
}
