'use client';

import * as React from 'react';
import { Switch as Base } from '@base-ui/react/switch';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { stateRender, toDataState } from '../../foundation/state';
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
      render={stateRender<{ checked: boolean }>(
        (s) => toDataState({ checked: s.checked }),
        (rest as { render?: React.ComponentProps<typeof Base.Root>['render'] }).render,
      )}
      {...rest}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      <Base.Thumb
        data-ag-part="thumb"
        render={stateRender<{ checked: boolean }>((s) => toDataState({ checked: s.checked }), undefined)}
      />
      {children}
    </Base.Root>
  );
}
