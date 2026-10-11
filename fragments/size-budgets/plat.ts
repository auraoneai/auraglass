/* fragments/size-budgets/plat.ts — PLAT owns this file (§3.4).
   REQ-PLAT-76/30 rows; may be stricter than PROVISIONAL_ROWS/DEFAULT_CEILINGS,
   never looser. Lowered only after a changelog entry + Perf-Budget-Raise trailer.

   `cn` / `warnDeprecated` rows name `aura-glass/internal`. That subpath is not
   yet a public entry (package.json#exports and build/exports.manifest.json are
   FIN-A's, REQ-FIN-06); verify-size-budgets reports these two rows `pending`
   with `pendingOn` until the entry ships, and measures them as soon as it does.

   Compat rows (REQ-PLAT-76 "each compat import ≤ its target + 2 KB, reported
   separately"): derived — never hand-copied — from every stream's deprecation
   fragment (`compat` = the `aura-glass/compat` export, `replacement` = its 5.0
   target) and the owning stream's size-budget row for that target. The limit
   is the target row's limit + 2048 B, so it moves only when the target row
   moves (and the target row is ratcheted on its own). */
import type { DeprecationEntry, SizeBudgetRow } from '../../src/contracts/fragments';
import cmpDeprecations from '../deprecations/cmp';
import matDeprecations from '../deprecations/mat';
import surfDeprecations from '../deprecations/surf';
import cmpBudgets from './cmp';
import matBudgets from './mat';
import surfBudgets from './surf';

/* Mirrored in scripts/ci/verify-size-budgets.mjs (COMPAT_ROW_PREFIX): a
   fragment may only have a default export (load-fragments evaluates it). */
const COMPAT_ROW_PREFIX = 'plat:compat-';
const COMPAT_HEADROOM_BYTES = 2048;

const own: SizeBudgetRow[] = [
  { id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 512, kind: 'js' },
  { id: 'plat:warnDeprecated', import: "export { warnDeprecated } from 'aura-glass/internal'", limitBytes: 150, kind: 'js' },
  { id: 'plat:tailwind-bridge', import: 'dist/tailwind.css', limitBytes: 6144, kind: 'css' },
  { id: 'plat:compat-globals', import: 'dist/compat/globals.css', limitBytes: 1024, kind: 'css' },
];

/** Names a js budget row imports: `{ A, B as C } from '...'` -> ['A', 'B']. */
const importedNames = (row: SizeBudgetRow): string[] => {
  const m = /\{([^}]*)\}\s*from\s*['"]aura-glass(?:\/[\w./-]+)?['"]/.exec(row.import);
  if (!m) return [];
  return (m[1] ?? '').split(',').map((s) => (s.trim().split(/\s+as\s+/)[0] ?? '').trim()).filter(Boolean);
};

/** The 5.0 export a `replacement` string names: its leading identifier
   ('Popover.Positioner' -> 'Popover', 'ImageViewer from aura-glass/media' -> 'ImageViewer'). */
const replacementName = (replacement: string | null | undefined): string | null => {
  const m = /^[A-Za-z_$][\w$]*/.exec((replacement ?? '').trim());
  return m ? m[0] : null;
};

function compatRows(
  deprecations: readonly DeprecationEntry[],
  budgets: readonly SizeBudgetRow[],
): SizeBudgetRow[] {
  /* name -> the js row that budgets exactly that component: it imports the
     name AND its id names it ('Button', 'Checkbox+CheckboxGroup',
     'SB-SURF-W4-IMAGEVIEWER'). Aggregate rows ('controls-all-families') never
     stand in for a component's own row. */
  const idNames = (id: string): string[] =>
    (id.split(/[-:]/).pop() ?? '').split('+').map((s) => s.toLowerCase());
  const targets = new Map<string, SizeBudgetRow>();
  for (const row of budgets) {
    if (row.kind !== 'js') continue;
    const named = idNames(row.id);
    for (const name of importedNames(row)) {
      if (named.includes(name.toLowerCase()) && !targets.has(name)) targets.set(name, row);
    }
  }
  const out = new Map<string, SizeBudgetRow>();
  for (const dep of deprecations) {
    const compat = dep.compat;
    if (!compat || out.has(compat)) continue;
    const target = targets.get(replacementName(dep.replacement) ?? '');
    if (!target) continue;
    out.set(compat, {
      id: `${COMPAT_ROW_PREFIX}${compat}`,
      import: `export { ${compat} } from 'aura-glass/compat'`,
      limitBytes: target.limitBytes + COMPAT_HEADROOM_BYTES,
      kind: 'js',
    });
  }
  return [...out.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export default [
  ...own,
  ...compatRows(
    [...cmpDeprecations, ...matDeprecations, ...surfDeprecations] as DeprecationEntry[],
    [...cmpBudgets, ...matBudgets, ...surfBudgets] as SizeBudgetRow[],
  ),
] satisfies SizeBudgetRow[];
