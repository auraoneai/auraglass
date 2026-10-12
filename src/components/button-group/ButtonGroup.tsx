import * as React from 'react';
import { cn } from '../../internal';

/** @tier Certified. Server-safe: no hooks, no 'use client'.
   REQ-CMP-39: flat — no SurfaceGroup wrapper; data-orientation (Base-UI
   convention, matches radio-group/slider/separator); joined styling via the
   ag-button-group--attached class instead of data-attached. */
type Labeled =
  | {
    /** Accessible name, required when there is no visible label. */
    'aria-label': string;
    /** Id of the element that provides the accessible name. */
    'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type ButtonGroupProps = Labeled & {
  /** Direction in which the buttons are laid out. */
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Visually join children (default true). Concentric shape via CSS only — no roving focus. */
  attached?: boolean | undefined;
  /** Class name merged onto the root element. */
  className?: string | undefined;
  /** Content rendered inside the component. */
  children?: React.ReactNode;
  /** Ref to the rendered root element. */
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
