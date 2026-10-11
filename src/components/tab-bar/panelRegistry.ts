'use client';
/* SURF-051: Tabs.Panel <-> TabBar(semantics='tabs') panel registry.
   Tabs.Root and TabBar.Root share the nearest registry (whichever is
   outermost creates it), so panels register whether they render inside the
   bar or as siblings of it under one Tabs.Root. Registration is a ref-set
   written in layout effects — it never re-renders the bar. */
import { createContext, useContext, useRef } from 'react';

export interface PanelRegistry {
  readonly panels: ReadonlySet<string>;
  register(value: string): () => void;
}

export function createPanelRegistry(): PanelRegistry {
  const counts = new Map<string, number>();
  const panels = new Set<string>();
  return {
    panels,
    register(value) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
      panels.add(value);
      return () => {
        const n = (counts.get(value) ?? 1) - 1;
        if (n <= 0) {
          counts.delete(value);
          panels.delete(value);
        } else counts.set(value, n);
      };
    },
  };
}

export const PanelRegistryContext = createContext<PanelRegistry | null>(null);

/** The enclosing registry, or a stable one owned by the caller. */
export function useOwnOrOuterPanelRegistry(): PanelRegistry {
  const outer = useContext(PanelRegistryContext);
  const own = useRef<PanelRegistry | null>(null);
  if (outer) return outer;
  own.current ??= createPanelRegistry();
  return own.current;
}
