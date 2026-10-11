/* CMP-299: Container — T0 server layout. size sm|md|lg|xl|full maps to
   max-inline-size tokens; padding via space tokens; declares
   container-type: inline-size with container-name ag-container so descendants'
   container queries (Grid responsive columns, DescriptionList stacking) resolve
   against it. */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Space-token padding on the inline axis (block padding follows size). */
  padding?: number | string;
}

const MAX: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'var(--_ag-container-sm, 40rem)',
  md: 'var(--_ag-container-md, 48rem)',
  lg: 'var(--_ag-container-lg, 64rem)',
  xl: 'var(--_ag-container-xl, 80rem)',
  full: '100%',
};

export function Container({
  size = 'lg',
  padding,
  className,
  style,
  ref,
  ...rest
}: ContainerProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-size={size}
      className={cn('ag-container', className)}
      style={{
        maxInlineSize: MAX[size],
        marginInline: 'auto',
        paddingInline: typeof padding === 'number' ? `var(--ag-space-${padding})` : padding,
        containerType: 'inline-size',
        containerName: 'ag-container',
        ...style,
      }}
    />
  );
}
