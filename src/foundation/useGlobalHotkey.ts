'use client';
/* Foundation seam (CMP-owned): one document-level hotkey listener per caller.
   Global keydown listeners are banned inside src/components/** (overlay
   dismissal belongs to the LayerStack), so components that legitimately need
   a hotkey (CommandPalette's ⌘K) go through this seam — the single sanctioned
   place outside the lint scope. */
import * as React from 'react';

export function useGlobalHotkey(onKey: (event: KeyboardEvent) => void, enabled = true): void {
  const ref = React.useRef(onKey);
  React.useEffect(() => {
    ref.current = onKey;
  });
  React.useEffect(() => {
    if (!enabled) return undefined;
    const handler = (e: KeyboardEvent): void => ref.current(e);
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [enabled]);
}
