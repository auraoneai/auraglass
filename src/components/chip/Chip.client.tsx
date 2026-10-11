/* CMP-047: Chip — toggle chip on Base UI Toggle (pin required by CMP-001);
   pressed/onPressedChange/disabled; leading/trailing icon slots; parts
   [root, leadingIcon, label, trailingIcon]. Uncontrolled default-upcoming
   usage is a plain button via Toggle's uncontrolled mode. */
'use client';
import * as React from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { cn } from '../../internal/index';

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean, eventDetails: unknown) => void;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Chip({
  pressed,
  defaultPressed,
  onPressedChange,
  leadingIcon,
  trailingIcon,
  children,
  className,
  ref,
  ...rest
}: ChipProps & { ref?: React.Ref<HTMLButtonElement> | undefined }) {
  return (
    <Toggle
      {...rest}
      ref={ref}
      data-ag-part="root"
      className={cn('ag-chip', className)}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
    >
      <span data-ag-part="hit-area" aria-hidden="true" />
      {leadingIcon ? (
        <span data-ag-part="leading-icon" className="ag-chip-leading" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span data-ag-part="label" className="ag-chip-label">
        {children}
      </span>
      {trailingIcon ? (
        <span data-ag-part="trailing-icon" className="ag-chip-trailing" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </Toggle>
  );
}
