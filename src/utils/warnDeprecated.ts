/* REQ-PLAT-58 — 4.x warnDeprecated: once-per-load Set, REQ-PLAT-26
   format, no-op in production and under deprecations="silent". */
import { DEPRECATIONS_4X } from "./deprecations.generated";

type Mode = "warn" | "silent";
let mode: Mode = "warn";
export function setDeprecationMode(m: Mode) {
  mode = m;
}
export function getDeprecationMode(): Mode {
  return mode;
}

const warned = new Set<string>();
const BY_ID = new Map<string, (typeof DEPRECATIONS_4X)[number]>(
  DEPRECATIONS_4X.map((e) => [e.id as string, e] as const)
);

/** Warn once per deprecation id, in the REQ-PLAT-26 format. */
export function warnDeprecated(id: string): void {
  if (process.env.NODE_ENV === "production" || mode === "silent") return;
  if (warned.has(id)) return;
  warned.add(id);
  const e = BY_ID.get(id);
  const what = e ? `'${e.symbol}' (${e.entry})` : id;
  const since = e
    ? `since ${e.since}, removed in ${e.removeIn}`
    : "since 4.2.0, removed in 5.0.0";
  const msg = e?.message ? ` — ${e.message}` : "";
  const doc = e?.doc ? ` (see ${e.doc})` : "";
  // eslint-disable-next-line no-console
  console.warn(`[aura-glass] ${id} ${what} is deprecated ${since}${msg}${doc}`);
}
