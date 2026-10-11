import * as React from 'react';

/** Controlled/uncontrolled carousel index — the hook the compound parts and
 * consumers share. */
export function useCarouselIndex(
  { count, index, defaultIndex, onIndexChange }: {
    count: number; index?: number | undefined; defaultIndex?: number | undefined;
    onIndexChange?: ((i: number) => void) | undefined;
  },
): [number, (i: number) => void] {
  const controlled = index !== undefined;
  const [inner, setInner] = React.useState(defaultIndex ?? 0);
  const current = controlled ? index! : inner;
  const set = React.useCallback((i: number) => {
    const n = Math.min(count - 1, Math.max(0, i));
    if (!controlled) setInner(n);
    onIndexChange?.(n);
  }, [controlled, count, onIndexChange]);
  return [current, set];
}
