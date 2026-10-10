/* REQ-FIN-04 (MAT-36/-38/-49/-55): production registrations for the provider
   mount seam (src/theme/providerMounts.ts). Side-effect free: importing this
   module registers nothing, adds no listener and starts no timer. The
   registrations run when the first AuraGlassProvider renders
   (`ensureProviderMounts()`), so `import 'aura-glass/theme'` stays inert and the
   side-effect import gate keeps reporting 0. Every registration is the real
   module; nothing here is a placeholder. */
'use client';
import { getProviderMounts, registerProviderMount } from './providerMounts';
import type { ProviderMounts } from './providerMounts';
import { LensDefs } from '../material/lens/LensDefs';
import { installPointerLight, pointerLightActive } from '../motion/pointerLight';
import type { PointerLightWindow } from '../motion/pointerLight';
import { startSurfaceCounter } from '../material/dev/surfaceCounter';
import { presets } from './presets';
import type { PresetId } from './presets';
import { createBrandTheme } from './createBrandTheme';

/** Attributes whose change can flip the pointer-light enable conditions. */
const POINTER_LIGHT_ATTRS = [
  'data-ag-pointer-light', 'data-ag-motion', 'data-ag-transparency', 'data-ag-tier', 'data-ag-highlights',
];
const FINE_HOVER = '(hover: hover) and (pointer: fine)';

/** Pointer light installs only while a `[data-ag-pointer-light]` element exists
   and `pointerLightActive()` holds (resolved motion full, transparency glass,
   standard|enhanced tier, fine hover pointer, no [data-ag-highlights]). The
   conditions are re-evaluated on DOM/attribute changes and on pointer-media
   changes; the installer is released as soon as they stop holding. */
export const gatedPointerLight = (doc: Document): (() => void) => {
  const win = doc.defaultView;
  const media: PointerLightWindow | null = win && typeof win.matchMedia === 'function' ? win : null;
  let release: (() => void) | null = null;

  const evaluate = (): void => {
    const html = doc.documentElement;
    const transparency = html.getAttribute('data-ag-transparency');
    const want = doc.querySelector('[data-ag-pointer-light]') !== null
      && pointerLightActive(
        transparency === null ? {} : { transparency },
        html.getAttribute('data-ag-tier') ?? 'standard',
        media,
        doc,
      );
    if (want && release === null) release = installPointerLight(doc);
    else if (!want && release !== null) { release(); release = null; }
  };

  const MO = (win as (Window & { MutationObserver?: typeof MutationObserver }) | null)?.MutationObserver
    ?? (typeof MutationObserver === 'undefined' ? undefined : MutationObserver);
  const observer = MO ? new MO(evaluate) : null;
  observer?.observe(doc.documentElement, {
    subtree: true, childList: true, attributes: true, attributeFilter: POINTER_LIGHT_ATTRS,
  });
  const mql = media ? media.matchMedia(FINE_HOVER) : null;
  mql?.addEventListener?.('change', evaluate);
  evaluate();

  return () => {
    observer?.disconnect();
    mql?.removeEventListener?.('change', evaluate);
    if (release !== null) { release(); release = null; }
  };
};

const presetCss = (id: string): string | null => {
  const p = (presets as Record<string, (typeof presets)[PresetId] | undefined>)[id];
  return p ? createBrandTheme(p.accent, { preset: p.id }).cssText : null;
};

const brandCss = (brand: string): string => createBrandTheme(brand).cssText;

/** The production implementation of every provider mount key. */
export const PRODUCTION_MOUNTS: Required<ProviderMounts> = {
  lensDefs: LensDefs,
  pointerLight: gatedPointerLight,
  // dev only: the provider starts it only when NODE_ENV !== 'production', and
  // startSurfaceCounter itself is inert in production builds.
  devDiagnostics: (doc: Document) => startSurfaceCounter(doc),
  presetCss,
  brandCss,
};

let ensured = false;

/** Registers the production mounts once per module instance, at provider
   render. Keys a caller registered earlier (tests, embedders) are kept. */
export function ensureProviderMounts(): void {
  if (ensured) return;
  ensured = true;
  const current = getProviderMounts();
  if (current.lensDefs === undefined) registerProviderMount('lensDefs', PRODUCTION_MOUNTS.lensDefs);
  if (current.pointerLight === undefined) registerProviderMount('pointerLight', PRODUCTION_MOUNTS.pointerLight);
  if (current.devDiagnostics === undefined) registerProviderMount('devDiagnostics', PRODUCTION_MOUNTS.devDiagnostics);
  if (current.presetCss === undefined) registerProviderMount('presetCss', PRODUCTION_MOUNTS.presetCss);
  if (current.brandCss === undefined) registerProviderMount('brandCss', PRODUCTION_MOUNTS.brandCss);
}
