/* CMP-302/CMP-423: Separator on Base UI Separator (hairline token).
   decorative → role='none'; semantic → role='separator' + aria-orientation +
   data-orientation. */
import * as React from 'react';
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from '../../internal/index';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Purely visual separators are hidden from assistive tech. */
  decorative?: boolean;
}

export function Separator({
  orientation = 'horizontal',
  decorative,
  className,
  ref,
  ...rest
}: SeparatorProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <BaseSeparator
      {...rest}
      ref={ref}
      orientation={orientation}
      data-ag-part="root"
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={cn('ag-separator', className)}
    />
  );
}
