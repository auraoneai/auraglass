/* REQ-QUAL-02 (QUAL). The inventory gate over the real ENTRIES: every value export is classified,
   except pre-existing offenders in other streams' files listed in the expiring baseline
   (PRD-F §4.3 rule 3, `packages/qa/baselines/inventory.json`, rows keyed by entry + name). */
import { ENTRIES } from '../../../../src/contracts/entries.ts';
import { baselineFailures, checkBaseline, type BaselineRow } from '../evidence/expiringBaseline.ts';
import { loadComponentMetas } from '../resolve/componentMetas.ts';
import { collectInventory, type Inventory, type UnclassifiedExport } from './buildInventory.ts';

export const INVENTORY_BASELINE = 'packages/qa/baselines/inventory.json';

const key = (entry: string, name: string): string => `${entry}\u0000${name}`;

export function sourceInventory(root: string): Inventory & { unclassified: UnclassifiedExport[] } {
  return collectInventory({ root, entries: ENTRIES, metas: loadComponentMetas(root) });
}

/** Returns the inventory; throws listing new offenders, stale/expired/malformed baseline rows. */
export function checkSourceInventory(root: string, baseline: unknown[], scope: string | undefined): Inventory & { baselined: UnclassifiedExport[] } {
  const inv = sourceInventory(root);
  const check = checkBaseline(baseline, inv.unclassified, (r: BaselineRow) => key(r.entry ?? '', r.name ?? ''), (u) => key(u.entry, u.name), scope);
  const failures = baselineFailures('inventory', check, (u) => `unclassified-export ${u.entry} ${u.name} (${u.declaration})`);
  if (failures.length) throw new Error(`inventory: ${failures.length} failure(s)\n  - ${failures.join('\n  - ')}`);
  return { items: inv.items, entries: inv.entries, baselined: inv.unclassified };
}
