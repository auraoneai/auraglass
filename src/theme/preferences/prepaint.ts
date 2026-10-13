/* MAT-273/REQ-MAT-59: the pre-paint routine. Bundled + minified by
   scripts/mat/build-prepaint-script.mjs into src/theme/generated/prepaint-script.ts
   and inlined by <AuraGlassScript/>; REQ-MAT-59 budgets the emitted body at
   1 536 B (the build enforces its ceiling, see build-prepaint-script.mjs) and
   its execution at <= 1 ms on the mid-tier mobile profile, so this file is kept
   at the semantic minimum. Reads the persisted record, the six OS media
   queries and CSS.supports, resolves every axis through resolve.ts
   (resolvePaintCore, the tuple form of the store's resolvePaint), detects the
   engine through engine.ts (the store's detector), and stamps data-ag-* +
   --ag-glass-opacity on <html> before first paint.
   Execution cost on a cold page load is dominated by V8 lazily compiling each
   function the body reaches, so the routine uses loops instead of helper
   closures and callbacks (resolvePaintCore follows the same rule), and it
   skips the pointer query unless deviceMemory <= 2 (the only consumer of
   the coarse-pointer signal is the lightweight-tier heuristic).
   Tier (applied by resolvePaintCore's paint mode): written when it resolves
   to 'lightweight' (saveData, deviceMemory <= 2 with a coarse pointer, or a
   persisted/app value) or when a persisted/app value names
   'standard'/'enhanced'; otherwise left unset. An 'unknown' engine caps the
   tier at 'standard'. The legacy 4.x key is migrated by the preference
   store, not here. */
import { detectEngine } from './engine';
import { PAINT_KEYS, resolvePaintCore } from './resolve';
import type { PreferenceInput } from './types';

export interface PrepaintArgs {
  storageKey?: string;
  defaults?: PreferenceInput;
}

type W = Window & {
  matchMedia?: (q: string) => { matches?: boolean } | null;
  CSS?: { supports?: (property: string, value: string) => boolean };
  navigator?: Window['navigator'] & {
    userAgentData?: { brands?: readonly { brand: string }[] } | null;
    deviceMemory?: number; connection?: { saveData?: boolean } | null;
  };
};

/* The six OS queries in OsSignals order, comma-packed (no query contains a
   comma); the middle four take the shared `prefers-` prefix at the call
   (keeps the REQ-MAT-59 body small). The two-valued features use the boolean
   context, which matches exactly their non-default value (`(forced-colors)`
   = active, `(prefers-reduced-motion)` = reduce, likewise transparency). */
const QUERIES = 'forced-colors,contrast: more,reduced-transparency,reduced-motion,color-scheme: dark,pointer: coarse'.split(',');
const AG = 'data-ag-';
export const auraGlassPrepaint = (w: W, d: Document, a: PrepaintArgs = {}): void => {
  try {
    const nav = (w.navigator ?? {}) as NonNullable<W['navigator']>;
    // matchMedia/CSS.supports do not throw for these well-formed queries; a
    // missing API reads as false (no OS signal, no backdrop-filter => solid).
    // The sixth query (pointer) is read only when deviceMemory <= 2: its
    // sole consumer is the lightweight-tier heuristic, which already fails
    // without low memory, so the common case saves one matchMedia call.
    const lowMem = nav.deviceMemory != null && nav.deviceMemory <= 2;
    const m: boolean[] = [];
    for (const q of QUERIES) m.push(m.length === 5 && !lowMem ? false : !!w.matchMedia?.(`(${m.length % 5 ? 'prefers-' : ''}${q})`)?.matches);
    // Property-support probe (REQ-MAT-18): the two-argument form with the
    // keyword value carries no design literal.
    let bf = false;
    for (const p of ['', '-webkit-']) bf ||= !!w.CSS?.supports?.(`${p}backdrop-filter`, 'none');
    let rec: PreferenceInput = {};
    try {
      rec = JSON.parse(w.localStorage.getItem(a.storageKey ?? 'ag:prefs:v1') as string) || {};
    } catch { /* unreadable storage */ }

    const engine = detectEngine(nav);
    // Positional core (resolve.ts): the tier slot already carries the
    // REQ-MAT-59 write rule ('' omits it; unknown engine caps enhanced).
    // saveData/deviceMemory go in raw: the core only truthiness-tests them.
    const t = resolvePaintCore(
      ...(m as [boolean, boolean, boolean, boolean, boolean, boolean]),
      bf, nav.connection?.saveData, nav.deviceMemory,
      a.defaults ?? {}, rec, engine === 'unknown',
    );
    const el = d.documentElement;
    el.setAttribute(AG + 'engine', engine);
    // Slots 0-4 are the axes, 6 the tier ('' omits it); 5 is glassOpacity,
    // written as a style property below, never as an attribute.
    for (let i = 0; i < 7; i++) if (i !== 5 && t[i]) el.setAttribute(AG + PAINT_KEYS[i], t[i] as string);
    // The write site re-checks motion itself (REQ-FIN-12): a resolver result
    // pairing allowContinuous with reduced motion never reaches <html>.
    if (t[7] && t[2] === 'full') el.setAttribute(AG + 'continuous', 'on');
    el.style.setProperty('--ag-glass-opacity', '' + t[5]);
  } catch {
    /* pre-paint must never throw: without attributes every rung still works */
  }
};
