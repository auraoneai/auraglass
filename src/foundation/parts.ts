/* CMP foundation parts (CMP-008): re-exports the S-33 part-name grammar and adds a
   dev-only assertPartName(). There is no closed vocabulary — any kebab-case name is
   valid; COMMON_PARTS is only the shared conventional set. */
import { COMMON_PARTS, PART_NAME_RE } from '../contracts/components';
import type { AgPart } from '../contracts/components';

export { COMMON_PARTS, PART_NAME_RE };
export type { AgPart };

/** Dev-only: throws when a data-ag-part value is not kebab-case per PART_NAME_RE. */
export function assertPartName(name: string): asserts name is AgPart {
  if (process.env.NODE_ENV === 'production') return;
  if (!PART_NAME_RE.test(name)) {
    throw new Error(
      `aura-glass: invalid data-ag-part ${JSON.stringify(name)} — must match ${PART_NAME_RE} (kebab-case, S-33)`,
    );
  }
}

/** Kebab-cases a compound part key ('ItemIndicator' -> 'item-indicator'). */
export function partNameOf(partKey: string): AgPart {
  const name = partKey.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  assertPartName(name);
  return name;
}
