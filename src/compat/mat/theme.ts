/* src/compat/mat/theme.ts — REQ-MAT-15 / REQ-FIN-52 (FIN-D D.3-11).
   The 4.x `createGlassThemeCssVars` lives only in the MAT compat surface; it
   is not part of `aura-glass/theme` (REQ-MAT-22 entry parity). Self-contained
   on purpose: it takes the structural slice of a GlassTheme it reads, so the
   compat module never pulls theme internals into its import closure. It
   warns once through warnDeprecated (DEP-M0970), like every compat export
   (REQ-PLAT-30). */
import { warnDeprecated } from "../../internal/warnDeprecated";

/** fragments/deprecations/mat.ts row for the 4.x --glass-theme-* output. */
export const CREATE_GLASS_THEME_CSS_VARS_DEP_ID = "DEP-M0970";

/** The part of `GlassTheme['tokens']` the 4.x `--glass-theme-*` map reads. */
export interface GlassThemeCssVarsInput {
  tokens: {
    color: { canvas: { light: string; dark: string }; accent: string; onAccent: string };
    density: { scale: number };
  };
}

/** @deprecated createGlassThemeCssVars is the 4.x --glass-theme-* output; use
 *  createGlassTheme(...).vars instead. Removed at 5.0 (DS-109). */
export const createGlassThemeCssVars = (theme: GlassThemeCssVarsInput): Record<string, string> => {
  warnDeprecated(CREATE_GLASS_THEME_CSS_VARS_DEP_ID);
  return {
    "--glass-theme-brand": theme.tokens.color.accent,
    "--glass-theme-accent": theme.tokens.color.accent,
    "--glass-theme-background": theme.tokens.color.canvas.light,
    "--glass-theme-surface": theme.tokens.color.canvas.dark,
    "--glass-theme-text": theme.tokens.color.onAccent,
    "--glass-theme-density-scale": String(theme.tokens.density.scale),
  };
};
