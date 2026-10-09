'use client';

import * as React from 'react';
import { Checkbox as Base } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseGroup } from '@base-ui/react/checkbox-group';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { sizeAttrs } from '../control-shared/size';
import type { CheckboxGroupProps, CheckboxProps } from './Checkbox.types';

function CheckIcon() {
  return (
    <svg data-ag-part="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
    </svg>
  );
}
function MixedIcon() {
  return (
    <svg data-ag-part="icon" aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8h9" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/** Checkbox — 'use client' leaf on BU Checkbox.Root + Indicator (REQ-CMP-52..54). */
export function Checkbox({
  size,
  onCheckedChange,
  children,
  className,
  indeterminate,
  ref,
  ...rest
}: CheckboxProps) {
  return (
    <Base.Root
      data-ag-part="root"
      className={cn('ag-checkbox', className)}
      indeterminate={indeterminate}
      onCheckedChange={(c, details) => onCheckedChange?.(c, toChangeDetails(details))}
      ref={ref}
      {...sizeAttrs(size)}
      {...rest}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      <Base.Indicator keepMounted data-ag-part="indicator">
        {indeterminate ? <MixedIcon /> : <CheckIcon />}
      </Base.Indicator>
      {children}
    </Base.Root>
  );
}

/** CheckboxGroup — flat wrapper over BU CheckboxGroup (REQ-CMP-52). */
export function CheckboxGroup({ onValueChange, children, className, ref, ...rest }: CheckboxGroupProps) {
  return (
    <BaseGroup
      data-ag-part="root"
      className={cn('ag-checkbox-group', className)}
      onValueChange={(v, details) => onValueChange?.(v, toChangeDetails(details))}
      ref={ref}
      {...rest}
    >
      {children}
    </BaseGroup>
  );
}
