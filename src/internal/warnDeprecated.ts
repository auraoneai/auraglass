/* S-37 + REQ-PLAT-26. warnDeprecated: dev-only, once-per-id, no listeners or
   timers at import. The outermost AuraGlassProvider calls
   `setDeprecationMode(deprecations ?? 'warn')` in a layout effect (REQ-FIN-04),
   so `<AuraGlassProvider deprecations="silent">` silences every warning. */
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
  // Rows already end in '.'; strip trailing periods so the sentence ends once.
  const message = row.message.replace(/\.+$/, '');
  console.warn(
    `[aura-glass] ${row.id} (since ${row.since}, removed in ${row.removeIn}): ${message}.${codemod} ${row.doc}`,
  );
}
