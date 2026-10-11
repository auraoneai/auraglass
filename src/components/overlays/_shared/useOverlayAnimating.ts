'use client';
/* CMP-195 (REQ-CMP-83): ref-callback that marks a popup (and its scrim via
   [data-ag-overlay-depth] siblings) data-ag-animating from the first
   data-starting-style / data-ending-style frame until transitionend or
   transitioncancel of the last transitioned property. No per-frame setState —
   the attribute flips on the DOM element directly; a MutationObserver watches
   transitionstart/run events mark the start and a one-shot frame poll watches
   the starting/ending-style flip — no MutationObserver is held on the popup. */
import * as React from 'react';
import { subscribeFrame } from '../../../motion/ticker';

const ANIMATED_PROPS = new Set(['transform', 'opacity', 'translate', 'scale', 'rotate']);

export function useOverlayAnimating(): React.RefCallback<HTMLElement> {
  return React.useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const popup = node;
    let pendingProps: Set<string> | null = null;
    let unsubStyle: (() => void) | null = null;

    const clearAnimating = () => {
      pendingProps = null;
      unsubStyle?.();
      unsubStyle = null;
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

    // REQ-CMP-16: no MutationObserver — transition events mark the start,
    // a one-shot subscribeFrame poll watches BU's starting/ending-style
    // attribute removal (capped ~1s of frames), then everything releases.
    // REQ-CMP-83: flags removed → clear (no lingering marker).
    const watchStyleFlags = () => {
      unsubStyle?.();
      let frames = 0;
      const unsub = subscribeFrame(() => {
        frames += 1;
        if ((!popup.hasAttribute('data-starting-style') && !popup.hasAttribute('data-ending-style')) || frames > 60) {
          clearAnimating();
        }
      });
      unsubStyle = unsub;
    };

    const onStart = () => {
      if (!popup.hasAttribute('data-ag-animating')) setAnimating();
      watchStyleFlags();
    };

    popup.addEventListener('transitionstart', onStart);
    popup.addEventListener('transitionrun', onStart);
    if (popup.hasAttribute('data-starting-style') || popup.hasAttribute('data-ending-style')) onStart();

    return () => {
      popup.removeEventListener('transitionstart', onStart);
      popup.removeEventListener('transitionrun', onStart);
      clearAnimating();
    };
  }, []);
}
