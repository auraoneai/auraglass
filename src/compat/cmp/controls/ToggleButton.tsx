/* CMP-323 compat: ToggleButton (4.x) -> Button (toggle mode) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Button } from '../../../components/button';
import type { ChangeDetails } from '../../../contracts/components';

const DEP = 'DEP-C0006';

export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'title' | 'color'> {
  selected?: boolean;
  defaultSelected?: boolean;
  onChange?: (event: unknown, value: boolean) => void;
  children?: React.ReactNode;
}

/** @deprecated ToggleButton DEP-C0006 since 4.3.0, removed in 5.0.0. {@link ToggleGroup} */
export function ToggleButton({ selected, defaultSelected, onChange, ...rest }: ToggleButtonProps) {
  warnDeprecated(DEP);
  return (
    <Button
      {...(rest as object)}
      {...(selected !== undefined ? { pressed: selected } : {})}
      {...(defaultSelected !== undefined ? { defaultPressed: defaultSelected } : {})}
      {...(onChange !== undefined
        ? { onPressedChange: (pressed: boolean, _d: ChangeDetails) => onChange(undefined, pressed) }
        : {})}
    />
  );
}
