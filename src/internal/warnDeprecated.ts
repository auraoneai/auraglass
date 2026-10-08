/* S-37 + REQ-PLAT-26. warnDeprecated: dev-only, once-per-id, no listeners or
   timers at import. CP-PLAT-3 adds `setDeprecationMode` to the contract — until
   that PR merges the mode is 'warn' and passing 'silent' is inert. */
import { DEPRECATIONS } from './deprecations.generated';

export type DeprecationMode = 'warn' | 'silent';
let mode: DeprecationMode = 'warn';
const warned = new Set<string>();

export function setDeprecationMode(next: DeprecationMode): void {
  mode = next;
}

/** Call-time warning. `id` is a DEP-<stream><nnnn> key of the generated table. */
export function warnDeprecated(id: string): void {
  if (process.env.NODE_ENV === 'production' || mode === 'silent') return;
  if (warned.has(id)) return;
  warned.add(id);
  const row = DEPRECATIONS[id];
  if (!row) {
    console.warn(`[aura-glass] ${id} is deprecated; see deprecations.json`);
    return;
  }
  const codemod = row.codemod
    ? ` Codemod: npx @auraglass/cli migrate 4to5 --transform ${row.codemod}.`
    : '';
  console.warn(
    `[aura-glass] ${row.id} (since ${row.since}, removed in ${row.removeIn}): ${row.message}.${codemod} ${row.doc}`,
  );
}
