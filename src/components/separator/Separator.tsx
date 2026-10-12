/* CMP-302/CMP-423: Separator (hairline token) as owned markup.
   @base-ui/react/separator ships a client directive, so composing it would
   turn this rsc:server leaf into a client module (CMP-302: use owned markup
   to stay rsc:server). Base UI's Separator is a bare <div role=separator
   aria-orientation>; this renders the same element directly.
   decorative → role='none' + aria-hidden; semantic → role='separator' +
   aria-orientation + data-orientation. */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of the rule. */
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
}: SeparatorProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={cn('ag-separator', className)}
    />
  );
}
