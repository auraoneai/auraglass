import * as React from 'react';
import { cn } from '../../internal';

/** @tier Certified. Server-safe: no hooks, no 'use client'.
   REQ-CMP-39: flat — no SurfaceGroup wrapper; data-orientation (Base-UI
   convention, matches radio-group/slider/separator); joined styling via the
   ag-button-group--attached class instead of data-ag-attached. */
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
    <div
      {...rest}
      role="group"
      data-ag-part="root"
      data-orientation={orientation}
      className={cn('ag-button-group', attached && 'ag-button-group--attached', className)}
      ref={ref}
    >
      {React.Children.map(children, (child) => (
        <span data-ag-part="item">{child}</span>
      ))}
    </div>
  );
}
