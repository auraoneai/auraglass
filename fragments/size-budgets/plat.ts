/* fragments/size-budgets/plat.ts — PLAT owns this file (§3.4).
   REQ-PLAT-76/30 rows; may be stricter than PROVISIONAL_ROWS/DEFAULT_CEILINGS,
   never looser. Lowered only after a changelog entry + Perf-Budget-Raise trailer. */
import type { SizeBudgetRow } from '../../src/contracts/fragments';

export default [
  /* REQ-PLAT-76: 'aura-glass/internal' is not a public entry — the verifier's
     one explicit internal-row allowance maps it to src/internal and measures
     the production bundle (warnDeprecated is dev-only by contract). */
  { id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 512, kind: 'js' },
  /* Raised 150 -> 5632 by impl2/24 (Perf-Budget-Raise: plat:warnDeprecated,
     see docs/size-budgets.changelog.md): first real measurement of this row
     is 5333 B gz — esbuild retains the generated deprecations lookup table
     even with the dev-only body eliminated. The PRD's 150 B needs a
     warnDeprecated restructure (register-the-table) tracked as remaining
     REQ-PLAT-76 work; until then this row ratchets down only. */
  { id: 'plat:warnDeprecated', import: "export { warnDeprecated } from 'aura-glass/internal'", limitBytes: 5632, kind: 'js' },
  { id: 'plat:tailwind-bridge', import: 'dist/tailwind.css', limitBytes: 6144, kind: 'css' },
  { id: 'plat:compat-globals', import: 'dist/compat/globals.css', limitBytes: 1024, kind: 'css' },
] satisfies SizeBudgetRow[];
