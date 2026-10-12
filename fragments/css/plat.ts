/* fragments/css/plat.ts — PLAT owns this file on both branches (§3.4). */
import type { CssFragment } from '../../src/contracts/fragments';

export default [
  // ag.reset is PLAT's layer: the compat css files normalize host css before tokens.
  { file: 'src/compat/css/reset.css', layer: 'ag.reset', bundle: 'styles.css', order: 10 },
  // compat/globals.css ships only as its own opt-in bundle: h1-h6/.flex/.grid never reach
  // styles.css (REQ-PLAT-74 "no global subject outside compat/globals.css", REQ-PLAT-30).
  { file: 'src/compat/css/globals.css', layer: 'ag.compat', bundle: 'compat/globals.css', order: 10 },
] satisfies CssFragment[];
