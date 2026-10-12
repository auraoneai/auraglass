'use client';
/* CMP-195 (REQ-CMP-83): ref-callback that marks a popup (and its scrim via
   [data-ag-overlay-depth] siblings) data-ag-animating from the first
   data-starting-style / data-ending-style frame until transitionend or
   transitioncancel of the last transitioned property. No per-frame setState —
   the attribute flips on the DOM element directly; a MutationObserver watches
   transitionstart/run events mark the start and a one-shot frame poll watches
   the starting/ending-style flip — no MutationObserver is held on the popup.
   Keyframe-driven overlays (Toast enter/exit) are covered the same way:
   animationstart marks, animationend/animationcancel clears. */
import * as React from 'react';
import { subscribeFrame } from '../../../motion/ticker';
import { setAnimating as markAnimating } from '../../../material/stateAttributes';

const ANIMATED_PROPS = new Set(['transform', 'opacity', 'translate', 'scale', 'rotate']);

export function useOverlayAnimating(): React.RefCallback<HTMLElement> {
  return React.useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const popup = node;
    let pendingProps: Set<string> | null = null;
    let unsubStyle: (() => void) | null = null;
    let unsubZero: (() => void) | null = null;

    const clearAnimating = () => {
      pendingProps = null;
      unsubZero?.();
      unsubZero = null;
      unsubStyle?.();
      unsubStyle = null;
      markAnimating(popup, false);
      popup.removeEventListener('transitionend', onDone);
      popup.removeEventListener('transitioncancel', onDone);
    };

    /* keyframe animations on the popup itself (not on descendants) */
    const onAnimStart = (e: AnimationEvent) => {
      if (e.target !== popup) return;
      markAnimating(popup, true);
    };
    const onAnimDone = (e: AnimationEvent) => {
      if (e.target !== popup) return;
      if (pendingProps && pendingProps.size > 0) return; // a transition is still running
      clearAnimating();
    };

    const onDone = (e: TransitionEvent) => {
      if (pendingProps) {
        pendingProps.delete(e.propertyName);
        if (pendingProps.size > 0) return;
      }
      clearAnimating();
    };

    const setAnimating = () => {
      markAnimating(popup, true);
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
      const hasDuration = (cs.transitionDuration || '').split(',').some((d) => parseFloat(d) > 0);
      if (!pendingProps || !hasDuration) {
        unsubZero = subscribeFrame(() => clearAnimating());
      }
    };

    // REQ-CMP-16: no MutationObserver — transition events mark the start,
    // a one-shot subscribeFrame poll watches BU's starting/ending-style
    // attribute removal (capped ~1s of frames), then everything releases.
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
    popup.addEventListener('animationstart', onAnimStart);
    popup.addEventListener('animationend', onAnimDone);
    popup.addEventListener('animationcancel', onAnimDone);
    if (popup.hasAttribute('data-starting-style') || popup.hasAttribute('data-ending-style')) onStart();

    return () => {
      popup.removeEventListener('transitionstart', onStart);
      popup.removeEventListener('transitionrun', onStart);
      popup.removeEventListener('animationstart', onAnimStart);
      popup.removeEventListener('animationend', onAnimDone);
      popup.removeEventListener('animationcancel', onAnimDone);
      clearAnimating();
    };
  }, []);
}
