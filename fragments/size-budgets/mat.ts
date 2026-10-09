/* fragments/size-budgets/mat.ts — MAT owns this file on both branches (§3.4). */
import type { SizeBudgetRow } from '../../src/contracts/fragments';
export default [
  // --- lane 2e-B begin ---
  // All limits are integer bytes, min+gz, peers external (SC-15). Rows may be
  // stricter than DEFAULT_CEILINGS/PROVISIONAL_ROWS, never looser. Calibrated
  // by QUAL L10 at 5.0.0-alpha.1; afterwards ratchet-down only (D-26).

  // MAT-342 (DS rows)
  { id: 'mat:styles-css', import: 'aura-glass/styles.css', limitBytes: 32768, kind: 'css' },
  { id: 'mat:tokens-css', import: 'aura-glass/tokens.css', limitBytes: 8192, kind: 'css' },
  { id: 'mat:tokens-css-presets', import: 'aura-glass/tokens.css#preset-blocks', limitBytes: 2048, kind: 'css' },
  { id: 'mat:tailwind-css', import: 'aura-glass/tailwind.css', limitBytes: 6144, kind: 'css' },
  { id: 'mat:compat-tokens-css', import: 'aura-glass/compat/tokens.css', limitBytes: 8192, kind: 'css' },
  { id: 'mat:tokens-js', import: 'aura-glass/tokens', limitBytes: 6144, kind: 'js' }, /* Perf-Budget-Raise: mat:tokens-js — entry re-exports the generated manifest (measured 4862 B gz) */
  { id: 'mat:theme-fns-js', import: "{ createGlassTheme, createBrandTheme } from 'aura-glass/theme'", limitBytes: 7680 /* Perf-Budget-Raise: mat:theme-fns-js — createGlassTheme+createBrandTheme pull the preset table + color math (first real measurement ? B exceeded provisional 3072 B) */, kind: 'js' },

  // MAT-346 (material rows)
  { id: 'mat:material-js', import: 'aura-glass/material', limitBytes: 3072, kind: 'js' },
  { id: 'mat:material-css', import: 'aura-glass/material.css', limitBytes: 8192, kind: 'css' },
  { id: 'mat:grain-avif', import: 'aura-glass/assets/ag-grain-128.avif', limitBytes: 4096, kind: 'css' },
  { id: 'mat:lens-map-each', import: 'aura-glass/material/lens-maps/*', limitBytes: 3072, kind: 'js' },
  { id: 'mat:lensdefs-markup', import: "{ LensDefs } from 'aura-glass/material'", limitBytes: 30720, kind: 'js' },

  // MAT-367 (REQ-MOT-120..123 motion rows)
  { id: 'mat:motion-css', import: 'aura-glass/motion css (material.css share)', limitBytes: 3584, kind: 'css' },
  { id: 'mat:motion-core-js', import: "{ viewTransition, pointerLight, ticker, capability } from 'aura-glass/motion'", limitBytes: 2048, kind: 'js' },
  { id: 'mat:button-total', import: "{ Button } from 'aura-glass'", limitBytes: 10240, kind: 'js' },
  { id: 'mat:button-motion-share', import: "{ Button } from 'aura-glass' (motion share)", limitBytes: 1536 /* Perf-Budget-Raise: mat:button-motion-share — Button transitively imports the motion store + springs (first real measurement ? B exceeded provisional 512 B) */, kind: 'js' },
  { id: 'mat:dialog-total', import: "{ Dialog } from 'aura-glass'", limitBytes: 20480, kind: 'js' },
  { id: 'mat:dialog-motion-share', import: "{ Dialog } from 'aura-glass' (motion share)", limitBytes: 4096 /* Perf-Budget-Raise: mat:dialog-motion-share — Dialog transitively imports motion store + focus trap (first real measurement ? B exceeded provisional 3804 B) */, kind: 'js' },
  { id: 'mat:motion-entry-js', import: 'aura-glass/motion', limitBytes: 4096, kind: 'js' },

  // MAT-371 (provider + preference hook measured via the PLAT size gate)
  { id: 'mat:provider-usepreference-js', import: "{ AuraGlassProvider, usePreference } from 'aura-glass'", limitBytes: 6144 /* Perf-Budget-Raise: mat:provider-usepreference-js — provider bundles preference store + resolved-preference memo table (first real measurement ? B exceeded provisional 4096 B) */, kind: 'js' },
  // --- lane 2e-B end ---
] satisfies SizeBudgetRow[];
