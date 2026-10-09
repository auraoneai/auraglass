'use client';
/* CMP-195 (REQ-CMP-83): ref-callback that marks a popup (and its scrim via
   [data-ag-overlay-depth] siblings) data-ag-animating from the first
   data-starting-style / data-ending-style frame until transitionend or
   transitioncancel of the last transitioned property. No per-frame setState —
   the attribute flips on the DOM element directly; a MutationObserver watches
   for the starting/ending-style flip; listeners attach only while animating. */
import * as React from 'react';
import { subscribeFrame } from '../../../motion/ticker';

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

    const durationSumMs = (cs: CSSStyleDeclaration): number =>
      (cs.transitionDuration || '')
        .split(',')
        .map((d) => d.trim())
        .reduce((acc, d) => {
          const m = /^([\d.]+)(m?s)$/.exec(d);
          return acc + (m ? parseFloat(m[1]!) * (m[2] === 'ms' ? 1 : 1000) : 0);
        }, 0);

    const setAnimating = () => {
      const cs = getComputedStyle(popup);
      // Collect the property names we expect transitionend for; a property not
      // in the computed transition list ends immediately.
      const list = (cs.transitionProperty || '')
        .split(',')
        .map((p) => p.trim())
        .filter((p) => ANIMATED_PROPS.has(p));
      pendingProps = list.length ? new Set(list) : null;
      popup.addEventListener('transitionend', onDone);
      popup.addEventListener('transitioncancel', onDone);
      popup.setAttribute('data-ag-animating', '');
      /* REQ-CMP-83: no animated property or a 0ms duration sum → nothing can
         fire transitionend; clear on the next frame instead of lingering. */
      if (pendingProps === null || durationSumMs(cs) === 0) {
        const unsub = subscribeFrame(() => { unsub(); clearAnimating(); });
      }
    };

    const sync = () => {
      const animating =
        popup.hasAttribute('data-starting-style') || popup.hasAttribute('data-ending-style');
      if (animating && !popup.hasAttribute('data-ag-animating')) setAnimating();
      if (!animating && popup.hasAttribute('data-ag-animating')) {
        /* REQ-CMP-83: style flags removed and no transition pending → clear
           immediately; with pending properties, keep until transitionend. */
        if (pendingProps === null || pendingProps.size === 0) clearAnimating();
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
