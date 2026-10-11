/* src/compat/mat/createBrandGlassTheme.ts — REQ-MAT-16 / REQ-FIN-52 (FIN-D D.3-12).
   MAT-066: createBrandGlassTheme is the 4.x name for createBrandTheme. It lives
   only in the MAT compat surface (aura-glass/compat), not aura-glass/theme, and
   warns once per process through warnDeprecated (DEP-M0969). */

import { warnDeprecated } from "../../internal/warnDeprecated";
import { createBrandTheme, type CreateBrandThemeOptions } from "../../theme/createBrandTheme";
import type { GlassTheme } from "../../theme/createGlassTheme";
import type { Oklch } from "../../theme/color";

/** DEP-M row for `createBrandGlassTheme` (fragments/deprecations/mat.ts). */
export const CREATE_BRAND_GLASS_THEME_DEP_ID = "DEP-M0969";

export interface CreateBrandGlassThemeOptions extends CreateBrandThemeOptions {
  id?: string;
  name?: string;
}

/** @deprecated use createBrandTheme from aura-glass/theme. Removed at 5.0 (DS-109). */
export const createBrandGlassTheme = (
  brandColor: string | Oklch,
  options: CreateBrandGlassThemeOptions = {}
): GlassTheme => {
  warnDeprecated(CREATE_BRAND_GLASS_THEME_DEP_ID);
  return createBrandTheme(brandColor, options);
};
