'use client';
/* SURF-051: Tabs.Panel <-> TabBar(semantics='tabs') panel registry.
   Tabs.Root and TabBar.Root share the nearest registry (whichever is
   outermost creates it), so panels register whether they render inside the
   bar or as siblings of it under one Tabs.Root. Registration is a ref-set
   written in layout effects — it never re-renders the bar. */
import { createContext, useContext, useLayoutEffect, useRef } from 'react';

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

export const PanelRegistryContext = /*#__PURE__*/ createContext<PanelRegistry | null>(null);

/** REQ-SURF-51: true inside a Tabs.Root. A TabBar(semantics='tabs') outside
    one supplies its own Base UI Tabs root so its tabs still rove/select. */
export const TabsRootPresenceContext = /*#__PURE__*/ createContext(false);

/** The enclosing registry, or a stable one owned by the caller. */
export function useOwnOrOuterPanelRegistry(): PanelRegistry {
  const outer = useContext(PanelRegistryContext);
  const own = useRef<PanelRegistry | null>(null);
  if (outer) return outer;
  own.current ??= createPanelRegistry();
  return own.current;
}

/** Register a Tabs.Panel value so TabBar semantics='tabs' can validate it
    (layout effect: registered before the bar's post-commit check). */
export function useTabBarPanel(value: string): void {
  const registry = useContext(PanelRegistryContext);
  useLayoutEffect(() => (registry ? registry.register(value) : undefined), [registry, value]);
}
