'use client';
/* useControllableValue (REQ-SURF-102/104): controlled/uncontrolled value pair.
   Controlled when `value !== undefined`; the setter always reports through
   `onChange` and only stores internally when uncontrolled. */
import { useCallback, useState } from 'react';

export function useControllableValue<T>(
  value: T | undefined,
  defaultValue: T,
  onChange: ((v: T) => void) | undefined,
): [T, (v: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const set = useCallback(
    (v: T) => {
      if (!controlled) setInternal(v);
      onChange?.(v);
    },
    [controlled, onChange],
  );
  return [current, set];
}
