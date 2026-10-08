/* MAT-066: createBrandGlassTheme is the 4.x name for createBrandTheme.
   One-time dev warning; moved to aura-glass/compat at 5.0 (DS-109). */

import { createBrandTheme, type CreateBrandThemeOptions } from "./createBrandTheme";
import type { GlassTheme } from "./createGlassTheme";
import type { Oklch } from "./color";

let warned = false;

export interface CreateBrandGlassThemeOptions extends CreateBrandThemeOptions {
  id?: string;
  name?: string;
}

/** @deprecated use createBrandTheme. */
export const createBrandGlassTheme = (
  brandColor: string | Oklch,
  options: CreateBrandGlassThemeOptions = {}
): GlassTheme => {
  if (!warned) {
    warned = true;
    if (typeof console !== "undefined")
      console.warn("createBrandGlassTheme is deprecated; use createBrandTheme");
  }
  return createBrandTheme(brandColor, options);
};
