/* REQ-QUAL-11 (FIN-449): the deterministic page init shared by every lane fixture.
   Pure and self-contained so Playwright can serialise it into page.addInitScript; it must not close over
   anything. `Date.now()` and `new Date()` are frozen at FIXED_EPOCH_ISO; `new Date(x)` keeps its argument;
   Math.random is a seeded mulberry32 stream. */
export const FIXED_EPOCH_ISO = '2026-03-02T09:30:00Z';
export const FIXED_EPOCH_MS = Date.parse(FIXED_EPOCH_ISO);
export const DEFAULT_SEED = 0x5eed2026;

export interface DeterminismOptions { epochMs: number; seed: number }

export function determinismInit({ epochMs, seed }: DeterminismOptions): void {
  const g = globalThis as unknown as { Date: DateConstructor; Math: Math; __agDeterminism?: DeterminismOptions };
  if (g.__agDeterminism) return;
  g.__agDeterminism = { epochMs, seed };
  const RealDate = g.Date;
  function FrozenDate(this: unknown, ...args: unknown[]): unknown {
    if (!new.target) return new RealDate(epochMs).toString();
    return args.length === 0 ? new RealDate(epochMs) : new (RealDate as unknown as new (...a: unknown[]) => Date)(...args);
  }
  FrozenDate.prototype = RealDate.prototype;
  Object.defineProperties(FrozenDate, {
    now: { value: () => epochMs, writable: true, configurable: true },
    parse: { value: RealDate.parse, writable: true, configurable: true },
    UTC: { value: RealDate.UTC, writable: true, configurable: true },
  });
  g.Date = FrozenDate as unknown as DateConstructor;
  let state = seed >>> 0;
  g.Math.random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
