/* MAT-063 / MAT-14: presets API — re-exports the generated preset table.
   No persona narrative metadata is exposed here.

   `presetCss(id)` is the provider's preset resolver (ProviderMounts.presetCss):
   until OD-16 C-2 adds `data-ag-theme` to AG_ATTRIBUTES, a preset is applied
   by rendering its generated cssText (scoped to `[data-ag-root]`) in the
   provider's single <style>. Registration of this resolver is the provider
   mount seam's job (REQ-FIN-04, src/theme/mounts.ts); this module registers
   nothing at import. */
import { presets, presetCssText } from '../tokens/generated/presets';
import type { PresetId } from '../tokens/generated/presets';

export { presets, presetCssText, PRESET_SCOPE } from '../tokens/generated/presets';
export type { PresetId, ThemePreset } from '../tokens/generated/presets';

const isPresetId = (id: string): id is PresetId => Object.prototype.hasOwnProperty.call(presets, id);

/** cssText for a preset id, or null for an unknown id. */
export const presetCss = (id: string): string | null => (isPresetId(id) ? presetCssText[id] : null);
