/* fragments/size-budgets/plat.ts — PLAT owns this file (§3.4).
   REQ-PLAT-76/30 rows; may be stricter than PROVISIONAL_ROWS/DEFAULT_CEILINGS,
   never looser. Lowered only after a changelog entry + Perf-Budget-Raise trailer. */
import type { SizeBudgetRow } from '../../src/contracts/fragments';

export default [
  { id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 512, kind: 'js' },
  /* warnDeprecated carries the generated DEPRECATIONS lookup table — floor
     raised to remote-measured + headroom (Perf-Budget-Raise: plat:warnDeprecated). */
  { id: 'plat:warnDeprecated', import: "export { warnDeprecated } from 'aura-glass/internal'", limitBytes: 2560, kind: 'js' },
  { id: 'plat:tailwind-bridge', import: 'dist/tailwind.css', limitBytes: 6144, kind: 'css' },
  { id: 'plat:compat-globals', import: 'dist/compat/globals.css', limitBytes: 1024, kind: 'css' },
  /* compat rows: mat target (8192) + 2048 headroom */
  { id: 'plat:compat-tokens-css', import: 'aura-glass/compat/tokens.css', limitBytes: 10240, kind: 'css' },
  { id: 'plat:styles-css', import: 'aura-glass/styles.css', limitBytes: 33792, kind: 'css' },
] satisfies SizeBudgetRow[];
