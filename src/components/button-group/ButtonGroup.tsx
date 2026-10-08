import * as React from 'react';
import { SurfaceGroup } from '../../material';
import { cn } from '../../internal';

/** @tier Certified. Server-safe: no hooks, no 'use client'. */
type Labeled =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type ButtonGroupProps = Labeled & {
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Visually join children (default true). Concentric shape via CSS only — no roving focus. */
  attached?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement> | undefined;
};

export function ButtonGroup({
  orientation = 'horizontal',
  attached = true,
  className,
  children,
  ref,
  ...rest
}: ButtonGroupProps) {
  return (
    <SurfaceGroup className={cn('ag-button-group-surface')}>
      <div
        {...rest}
        role="group"
        data-ag-part="root"
        data-ag-orientation={orientation}
        data-ag-attached={attached ? '' : undefined}
        className={cn('ag-button-group', className)}
        ref={ref}
      >
        {React.Children.map(children, (child, i) => (
          <span data-ag-part="item">{child}</span>
        ))}
      </div>
    </SurfaceGroup>
  );
}
