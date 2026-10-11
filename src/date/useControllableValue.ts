'use client';
/* useControllableValue (REQ-SURF-102/104): controlled/uncontrolled value pair.
   Controlled when `value !== undefined`; the setter always reports through
   `onChange` and only stores internally when uncontrolled. */
import { useCallback, useState } from 'react';
import { raChangeDetails } from './shared';
import type { toChangeDetails } from '../foundation';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

export function useControllableValue<T>(
  value: T | undefined,
  defaultValue: T,
  onChange: ((v: T, details: ChangeDetails) => void) | undefined,
): [T, (v: T, details?: ChangeDetails) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const set = useCallback(
    (v: T, details: ChangeDetails = raChangeDetails()) => {
      if (!controlled) setInternal(v);
      onChange?.(v, details);
    },
    [controlled, onChange],
  );
  return [current, set];
}
