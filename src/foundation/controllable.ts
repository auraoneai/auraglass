'use client';

/** useControllableWarning — dev-only controlled/uncontrolled switch guard for a
 * controlled prop (value|checked|pressed|open). Warns once per component+prop
 * when the prop flips between defined and undefined across renders (CMP-096).
 * Call at the top of every controllable root with that family's controlled prop. */
import * as React from 'react';
import { warnControlledSwitch } from '../components/control-shared/value';

export function useControllableWarning(
  component: string,
  prop: 'value' | 'checked' | 'pressed' | 'open',
  controlledValue: unknown,
): void {
  if (process.env.NODE_ENV === 'production') return;
  const was = React.useRef(controlledValue !== undefined);
  warnControlledSwitch(component, prop, was.current, controlledValue !== undefined);
  was.current = controlledValue !== undefined;
}
