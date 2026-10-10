'use client';
/* CMP-001 seam: the only place outside this directory that may touch the Base
   UI Toggle pin. src/data/chip composes this wrapper; Base UI imports are
   confined to src/components/** and src/foundation/** (REQ-CMP-01). Props are
   AuraGlass-owned so the emitted d.ts never names Base UI. */
import * as React from 'react';
import { Toggle } from '@base-ui/react/toggle';

export interface ChipToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'defaultValue' | 'value'> {
  pressed?: boolean | undefined;
  defaultPressed?: boolean | undefined;
  onPressedChange?: ((pressed: boolean, eventDetails: unknown) => void) | undefined;
  disabled?: boolean | undefined;
  /** Identifies the toggle inside a toggle group. */
  value?: string | undefined;
  className?: string | undefined;
  ref?: React.Ref<HTMLButtonElement> | undefined;
  [dataAttr: `data-${string}`]: string | number | boolean | undefined;
}

export function ChipToggle(props: ChipToggleProps) {
  return <Toggle {...props} />;
}
