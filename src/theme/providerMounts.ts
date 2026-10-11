/* Internal provider mount registry. The production implementations (LensDefs,
   dev diagnostics, gated pointer-light installer, preset/brand css resolvers)
   are registered by src/theme/mounts.ts when the first AuraGlassProvider
   renders (REQ-FIN-04) — never at import. The provider consumes whatever is
   registered; tests and embedders may register their own implementation
   first. No placeholders: the registry is the seam, not a stub. */
'use client';
import * as React from 'react';
import type { DomTier } from '../contracts/material';
import { useResolvedPreferences } from './preferences/usePreference';

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

/** LensDefs slot: renders the registered component only when the tier setting
   is eligible — 'enhanced', or 'auto' (also when the prop is undefined) unless
   the store resolved the capability floor 'lightweight'. 'standard' and
   'lightweight' suppress it (REQ-MAT-36). */
export const LensDefsSlot = (
  { tier = 'auto' }: { tier?: 'auto' | DomTier | undefined },
): React.ReactElement | null => {
  const m = useProviderMounts();
  const resolved = useResolvedPreferences();
  if (!m.lensDefs || tier === 'standard' || tier === 'lightweight') return null;
  if (tier === 'auto' && resolved.tier === 'lightweight') return null;
  return React.createElement(m.lensDefs);
};
