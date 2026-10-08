'use client';
// src/data/table/useTableState.ts (SURF-154): every controlled/uncontrolled
// state pair collapses into one { value, set } — TanStack options read the
// resolved value; uncontrolled keeps an internal fallback.
import * as React from 'react';

export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange: ((value: T) => void) | undefined,
): [T, (v: T | ((prev: T) => T)) => void] {
  const [inner, setInner] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : inner;
  const set = React.useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(value) : v;
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange, value],
  );
  return [value, set];
}
