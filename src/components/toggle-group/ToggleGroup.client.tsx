'use client';
import * as React from 'react';
import { ToggleGroup as BaseGroup } from '@base-ui/react/toggle-group';
import { Toggle } from '@base-ui/react/toggle';
import { cn } from '../../internal';
import { toChangeDetails } from '../../foundation';
import type { ChangeDetails } from '../../contracts/components';
import { useControllableWarning } from '../../foundation/controllable';

export interface ToggleGroupRootProps {
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onValueChange?: ((value: string[], details: ChangeDetails) => void) | undefined;
  /** Allow multiple pressed items (default false — single-select clears the others). */
  multiple?: boolean | undefined;
  /** Roving-focus wrap-around (default true — REQ-CMP-38). */
  loop?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export interface ToggleGroupItemProps {
  value: string;
  disabled?: boolean | undefined;
  /** Keep the item focusable when disabled (REQ-CMP-38). */
  focusableWhenDisabled?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement> | undefined;
}

function ToggleGroupRoot({
  value,
  defaultValue,
  onValueChange,
  multiple,
  loop = true,
  orientation = 'horizontal',
  disabled,
  className,
  children,
  ref,
}: ToggleGroupRootProps) {
  useControllableWarning('ToggleGroup', 'value', value);
  return (
    <BaseGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v, eventDetails) => onValueChange?.(v as string[], toChangeDetails(eventDetails))}
      multiple={multiple}
      loopFocus={loop}
      orientation={orientation}
      disabled={disabled}
      data-ag-part="root"
      className={cn('ag-toggle-group', className)}
      ref={ref}
    >
      {children}
    </BaseGroup>
  );
}

function ToggleGroupItem({ value, disabled, focusableWhenDisabled, className, children, ref }: ToggleGroupItemProps) {
  return (
    <Toggle
      value={value}
      disabled={disabled}
      focusableWhenDisabled={focusableWhenDisabled}
      data-ag-part="item"
      className={cn('ag-toggle-item', className)}
      ref={ref}
    >
      {children}
    </Toggle>
  );
}

export const ToggleGroup = { Root: ToggleGroupRoot, Item: ToggleGroupItem };
