/* fragments/size-budgets/plat.ts — PLAT owns this file (§3.4).
   REQ-PLAT-76/30 rows; may be stricter than PROVISIONAL_ROWS/DEFAULT_CEILINGS,
   never looser. Lowered only after a changelog entry + Perf-Budget-Raise trailer. */
import type { DeprecationEntry, SizeBudgetRow } from '../../src/contracts/fragments';
import cmpRows from './cmp';
import matRows from './mat';
import surfRows from './surf';
import cmpDeps from '../deprecations/cmp';
import matDeps from '../deprecations/mat';
import surfDeps from '../deprecations/surf';
import compatCmp from '../../etc/api/compat.cmp.exports.json';
import compatMat from '../../etc/api/compat.mat.exports.json';
import compatSurf from '../../etc/api/compat.surf.exports.json';

/* REQ-PLAT-30: compat size is reported separately — each
   `import { X } from 'aura-glass/compat'` is budgeted at its 5.0 target's row
   + 2 KB gz. The target is the replacement named by X's deprecation entry
   (compat != null); its row is the stream's `{ <Target> } from 'aura-glass…'`
   js row. Derived, so a compat export or target row added later gets its
   row automatically; exports whose target has no 5.0 row yet get none (the
   target's owner adds that row first). */
const COMPAT_HEADROOM_BYTES = 2048;

const TARGET_ROWS = new Map<string, SizeBudgetRow>();
for (const row of [...cmpRows, ...matRows, ...surfRows] as readonly SizeBudgetRow[]) {
  /* A target row is a `{ <Target> } from 'aura-glass…'` re-export, or a
     statement measuring a namespace member (`export const <Target> = Ns.Part`)
     for targets that are not named entry exports. */
  const name = row.kind === 'js'
    ? (/^\{\s*(\w+)\s*\}\s+from\s+'aura-glass(?:\/[\w-]+)?'$/.exec(row.import)?.[1]
      ?? /export const (\w+) =/.exec(row.import)?.[1])
    : undefined;
  if (name && !TARGET_ROWS.has(name)) TARGET_ROWS.set(name, row);
}
const ENTRIES = [...cmpDeps, ...matDeps, ...surfDeps] as readonly DeprecationEntry[];
/** The entry's replacement targets: 'Menu.Item' -> ['Menu']; a composite
 *  'Thread + Message + Composer from aura-glass/ai' names all three — the
 *  adapter composes them, so its ceiling is the sum of their rows (an upper
 *  bound on their union; shared code is counted in each row already). A
 *  composite part with no row yet contributes nothing (its owner adds the
 *  row first, as for single targets); the primary target must have a row. */
const targetsOf = (replacement: string | null): string[] => {
  const head = (replacement ?? '').split(/\s+from\s+/)[0];
  return head.split('+').map((part) => /^[A-Z]\w*/.exec(part.trim())?.[0]).filter((n): n is string => !!n);
};

const compatRows: SizeBudgetRow[] = [...new Set([...compatCmp.exports, ...compatMat.exports, ...compatSurf.exports])]
  .sort()
  .flatMap((name) => {
    const entry = ENTRIES.find((e) => e.symbol === name && e.compat != null);
    /* dedupe: 'Sidebar + Sidebar.Nav' names one row twice */
    const targets = entry ? [...new Set(targetsOf(entry.replacement))].map((t) => TARGET_ROWS.get(t)) : [];
    if (!targets.length || !targets[0]) return [];
    const limitBytes = targets.reduce((sum, t) => sum + (t?.limitBytes ?? 0), 0) + COMPAT_HEADROOM_BYTES;
    return [{ id: `plat:compat:${name}`, import: `{ ${name} } from 'aura-glass/compat'`, limitBytes, kind: 'js' as const }];
  });

export default [
  { id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 512, kind: 'js' },
  { id: 'plat:warnDeprecated', import: "export { warnDeprecated } from 'aura-glass/internal'", limitBytes: 150, kind: 'js' },
  { id: 'plat:tailwind-bridge', import: 'dist/tailwind.css', limitBytes: 6144, kind: 'css' },
  { id: 'plat:compat-globals', import: 'dist/compat/globals.css', limitBytes: 1024, kind: 'css' },
  ...compatRows,
] satisfies SizeBudgetRow[];
