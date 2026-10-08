'use client';

import * as React from 'react';
import { Switch as Base } from '@base-ui/react/switch';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { sizeAttrs } from '../control-shared/size';
import type { SwitchProps } from './Switch.types';

/** Switch — 'use client' leaf on BU Switch.Root + Thumb (REQ-CMP-45..47).
 * root is the track; thumb is the transient part. */
export function Switch({ size, onCheckedChange, children, className, ref, ...rest }: SwitchProps) {
  return (
    <Base.Root
      data-ag-part="root"
      className={cn('ag-switch', className)}
      onCheckedChange={(c, details) => onCheckedChange?.(c, toChangeDetails(details))}
      ref={ref}
      {...sizeAttrs(size)}
      {...rest}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      <Base.Thumb data-ag-part="thumb" />
      {children}
    </Base.Root>
  );
}
