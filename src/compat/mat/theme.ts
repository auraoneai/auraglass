/* src/compat/mat/theme.ts — REQ-MAT-15 / REQ-FIN-52 (FIN-D D.3-11).
   The 4.x `createGlassThemeCssVars` lives only in the MAT compat surface; it
   is not part of `aura-glass/theme` (REQ-MAT-22 entry parity). Self-contained
   on purpose: it takes the structural slice of a GlassTheme it reads, so the
   compat module never pulls theme internals into its import closure. */

/** The part of `GlassTheme['tokens']` the 4.x `--glass-theme-*` map reads. */
export interface GlassThemeCssVarsInput {
  tokens: {
    color: { canvas: { light: string; dark: string }; accent: string; onAccent: string };
    density: { scale: number };
  };
}

const warned = new Set<string>();
const devWarn = (key: string, msg: string): void => {
  if (warned.has(key)) return;
  warned.add(key);
  if (typeof console !== "undefined") console.warn(msg);
};

/** @deprecated createGlassThemeCssVars is the 4.x --glass-theme-* output; use
 *  createGlassTheme(...).vars instead. Removed at 5.0 (DS-109). */
export const createGlassThemeCssVars = (theme: GlassThemeCssVarsInput): Record<string, string> => {
  devWarn(
    "createGlassThemeCssVars",
    "createGlassThemeCssVars is deprecated; use createGlassTheme(...).vars (--ag-*) instead."
  );
  return {
    "--glass-theme-brand": theme.tokens.color.accent,
    "--glass-theme-accent": theme.tokens.color.accent,
    "--glass-theme-background": theme.tokens.color.canvas.light,
    "--glass-theme-surface": theme.tokens.color.canvas.dark,
    "--glass-theme-text": theme.tokens.color.onAccent,
    "--glass-theme-density-scale": String(theme.tokens.density.scale),
  };
};
