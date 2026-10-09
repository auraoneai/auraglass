'use client';

import * as React from 'react';
import { RadioGroup as BaseGroup } from '@base-ui/react/radio-group';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import { sizeAttrs } from '../control-shared/size';
import type { RadioGroupProps, RadioItemProps } from './RadioGroup.types';

function RadioGroupRoot({ onValueChange, children, className, ref, size, orientation, ...rest }: RadioGroupProps) {
  return (
    <BaseGroup
      data-ag-part="root"
      data-orientation={orientation ?? 'horizontal'}
      className={cn('ag-radio-group', className)}
      onValueChange={(v, details) => onValueChange?.(String(v), toChangeDetails(details))}
      ref={ref}
      {...sizeAttrs(size)}
      {...rest}
    >
      {children}
    </BaseGroup>
  );
}

function RadioItem({ children, className, ref, ...rest }: RadioItemProps) {
  return (
    <BaseRadio.Root data-ag-part="item" className={cn('ag-radio-item', className)} ref={ref} {...rest}>
      <span data-ag-part="hit-area" aria-hidden="true" />
      <BaseRadio.Indicator keepMounted data-ag-part="indicator" />
      {children !== undefined && children !== null ? <span data-ag-part="label">{children}</span> : null}
    </BaseRadio.Root>
  );
}

export const RadioGroup = { Root: RadioGroupRoot, Item: RadioItem };
/** Radio is the flat alias of RadioGroup.Item (root export name per CMP-142). */
export const Radio = RadioItem;
