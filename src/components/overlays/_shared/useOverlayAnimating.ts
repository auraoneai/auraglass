'use client';
/* CMP-195 (REQ-CMP-83): ref-callback that marks a popup (and its scrim via
   [data-ag-overlay-depth] siblings) data-ag-animating from the first
   data-starting-style / data-ending-style frame until transitionend or
   transitioncancel of the last transitioned property. No per-frame setState —
   the attribute flips on the DOM element directly; a MutationObserver watches
   for the starting/ending-style flip; listeners attach only while animating. */
import * as React from 'react';

const ANIMATED_PROPS = new Set(['transform', 'opacity', 'translate', 'scale', 'rotate']);

export function useOverlayAnimating(): React.RefCallback<HTMLElement> {
  return React.useCallback((node: HTMLElement | null) => {
    if (!node || typeof MutationObserver === 'undefined') return;

    const popup = node;
    let mo: MutationObserver | null = null;
    let pendingProps: Set<string> | null = null;

    const clearAnimating = () => {
      pendingProps = null;
      popup.removeAttribute('data-ag-animating');
      popup.removeEventListener('transitionend', onDone);
      popup.removeEventListener('transitioncancel', onDone);
    };

    const onDone = (e: TransitionEvent) => {
      if (pendingProps) {
        pendingProps.delete(e.propertyName);
        if (pendingProps.size > 0) return;
      }
      clearAnimating();
    };

    const setAnimating = () => {
      popup.setAttribute('data-ag-animating', '');
      // Collect the property names we expect transitionend for; a property not
      // in the computed transition list ends immediately.
      const list = (getComputedStyle(popup).transitionProperty || '')
        .split(',')
        .map((p) => p.trim())
        .filter((p) => ANIMATED_PROPS.has(p));
      pendingProps = list.length ? new Set(list) : null;
      popup.addEventListener('transitionend', onDone);
      popup.addEventListener('transitioncancel', onDone);
    };

    const sync = () => {
      const animating =
        popup.hasAttribute('data-starting-style') || popup.hasAttribute('data-ending-style');
      if (animating && !popup.hasAttribute('data-ag-animating')) setAnimating();
      if (!animating && popup.hasAttribute('data-ag-animating')) {
        // Style flip ended but transitions may still be finishing; keep until
        // transitionend of the last property — no-op here by design.
      }
    };

    mo = new MutationObserver(sync);
    mo.observe(popup, { attributes: true, attributeFilter: ['data-starting-style', 'data-ending-style'] });
    sync();

    return () => {
      mo?.disconnect();
      clearAnimating();
    };
  }, []);
}
