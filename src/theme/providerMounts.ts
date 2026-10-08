/* Internal provider mount registry. Sibling lanes register their runtime
   modules here once their files land (lane M: LensDefs, dev diagnostics;
   lane O: pointer-light installer; lane T: preset/brand css resolvers). The
   provider consumes whatever is registered — nothing registered, nothing
   mounted. No placeholders: the registry is the seam, not a stub. */
'use client';
import * as React from 'react';
import type { DomTier } from '../contracts/material';

export interface ProviderMounts {
  /** src/material/lens/LensDefs — mounted once per document unless tier is
     'standard' or 'lightweight'. */
  lensDefs?: React.ComponentType;
  /** src/material/dev diagnostics (surface counter etc.) — started once per
     document in development only. Receives the document, returns a cleanup. */
  devDiagnostics?: (doc: Document) => void | (() => void);
  /** src/motion/pointerLight installer — started once per document; the module
     applies its own enable conditions. */
  pointerLight?: (doc: Document) => void | (() => void);
  /** src/theme/presets cssText lookup for the provider's preset prop. */
  presetCss?: (id: string) => string | null | undefined;
  /** src/theme/createBrandTheme cssText lookup for the provider's brand prop. */
  brandCss?: (brand: string) => string | null | undefined;
}

let mounts: ProviderMounts = {};
const listeners = new Set<() => void>();

export const registerProviderMount = <K extends keyof ProviderMounts>(
  key: K, impl: ProviderMounts[K],
): void => {
  mounts = { ...mounts, [key]: impl };
  listeners.forEach((l) => l());
};

export const getProviderMounts = (): ProviderMounts => mounts;

export const useProviderMounts = (): ProviderMounts =>
  React.useSyncExternalStore(
    (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    () => mounts,
    () => mounts,
  );

/** LensDefs slot: renders the registered component only when tier is eligible
   ('auto' or 'enhanced' resolve enhanced-capable; 'standard'/'lightweight'
   suppress it, per REQ-MAT-36). */
export const LensDefsSlot = ({ tier }: { tier: 'auto' | DomTier }): React.ReactElement | null => {
  const m = useProviderMounts();
  if (!m.lensDefs || tier === 'standard' || tier === 'lightweight') return null;
  return React.createElement(m.lensDefs);
};
