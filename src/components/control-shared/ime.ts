/* REQ-CMP-62: IME composition guard — suppress onValueChange during a
   composition, forward once on compositionend; block Enter submits while
   composing (isComposing || keyCode 229). */
import * as React from 'react';

export function useImeGuard<V>(forward: (v: V, details: unknown) => void) {
  const composing = React.useRef(false);
  const lastRef = React.useRef<{ v: V; d: unknown } | null>(null);
  return {
    composingRef: composing,
    wrapChange(v: V, details: unknown) {
      if (composing.current) {
        lastRef.current = { v, d: details };
        return;
      }
      forward(v, details);
    },
    onCompositionStart() {
      composing.current = true;
      lastRef.current = null;
    },
    onCompositionEnd() {
      composing.current = false;
      const p = lastRef.current;
      lastRef.current = null;
      if (p) forward(p.v, p.d);
    },
    onKeyDown(e: React.KeyboardEvent) {
      const ne = e.nativeEvent as KeyboardEvent & { keyCode?: number };
      if ((ne.isComposing || ne.keyCode === 229) && e.key === 'Enter') {
        e.preventDefault();
      }
    },
  };
}
