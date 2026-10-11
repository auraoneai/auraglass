/* fragments/css/plat.ts — PLAT owns this file on both branches (§3.4). */
import type { CssFragment } from '../../src/contracts/fragments';

export default [
  // ag.reset is PLAT's layer: the compat css files normalize host css before tokens.
  { file: 'src/compat/css/reset.css', layer: 'ag.reset', bundle: 'styles.css', order: 10 },
  { file: 'src/compat/css/globals.css', layer: 'ag.compat', bundle: 'styles.css', order: 10 },
  { file: 'src/compat/css/globals.css', layer: 'ag.compat', bundle: 'compat/globals.css', order: 10 },
] satisfies CssFragment[];
