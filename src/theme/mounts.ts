/* REQ-FIN-04 / MAT-04: production registrations for the provider mount seam.
   Imported once from ./index so importing the theme surface mounts the runtime
   pieces (LensDefs, pointer-light, dev diagnostics, preset/brand css). Each
   registration is the real module — nothing is a placeholder. */
'use client';
import { registerProviderMount } from './providerMounts';
import { LensDefs } from '../material/lens/LensDefs';
import { installPointerLight } from '../motion/pointerLight';
import { startSurfaceCounter } from '../material/dev/surfaceCounter';
import { presets } from './presets';
import { createBrandTheme } from './createBrandTheme';
import type { PresetId } from './presets';

registerProviderMount('lensDefs', LensDefs);
registerProviderMount('pointerLight', (doc) => installPointerLight(doc));
registerProviderMount('devDiagnostics', (doc) => startSurfaceCounter(doc.body));
registerProviderMount('presetCss', (id) => {
  const p = presets[id as PresetId];
  return p ? createBrandTheme(p.accent, { preset: p.id }).cssText : null;
});
registerProviderMount('brandCss', (brand) => createBrandTheme(brand).cssText);
