'use client';
/* MAT-141 — reads <html data-ag-tier> through useSyncExternalStore. One
   module-level MutationObserver is created on the first subscribe and
   disconnected when the last subscriber unmounts. Server snapshot: 'standard'.
   'cinematic' is never returned (labs-only value). */
import { useSyncExternalStore } from 'react';
import type { DomTier, Tier } from '../contracts/material';

const DOM_TIERS: readonly DomTier[] = ['lightweight', 'standard', 'enhanced'];

let observer: MutationObserver | null = null;
let listeners = new Set<() => void>();

function notify(): void {
  for (const cb of listeners) cb();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  if (!observer && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(notify);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ag-tier'],
    });
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

function getSnapshot(): Tier {
  const value = document.documentElement.getAttribute('data-ag-tier');
  return (DOM_TIERS as readonly string[]).includes(value ?? '') ? (value as Tier) : 'standard';
}

function getServerSnapshot(): Tier {
  return 'standard';
}

export function useMaterialTier(): Tier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
