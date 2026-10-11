'use client';
/* Foundation seam (REQ-CMP-12): document-wide hotkeys without a document
   listener of their own. Global keydown listeners are banned inside
   src/components/** and src/primitives/** (overlay dismissal belongs to the
   LayerStack), and AC-FIN-07 allows no document listener in src/foundation.
   Components that legitimately need a hotkey (CommandPalette's mod+K, FIN-F)
   subscribe here; the handler rides the LayerStack's single per-document
   capture-phase input dispatcher (src/theme/layers/layerInput.ts), so the
   document keeps exactly one keydown listener however many callers mount. */
import * as React from 'react';
import { layerInputFor } from '../theme/layers/layerInput';

export function useGlobalHotkey(onKey: (event: KeyboardEvent) => void, enabled = true): void {
  const ref = React.useRef(onKey);
  React.useEffect(() => {
    ref.current = onKey;
  });
  React.useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined;
    return layerInputFor(document).on('keydown', (e) => ref.current(e as KeyboardEvent));
  }, [enabled]);
}
