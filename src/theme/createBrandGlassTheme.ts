/* REQ-MAT-16 (FIN-D D.3-12): createBrandGlassTheme moved to
   src/compat/mat/createBrandGlassTheme.ts (aura-glass/compat) and is no longer
   part of the aura-glass/theme public surface (src/theme/public.ts). This
   re-export only keeps src/theme/index.ts (FIN-A, REQ-FIN-04) compiling until
   FIN-A drops its `createBrandGlassTheme` line; FIN-D then deletes this file. */
export {
  createBrandGlassTheme,
  type CreateBrandGlassThemeOptions,
} from "../compat/mat/createBrandGlassTheme";
