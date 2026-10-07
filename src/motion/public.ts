/* @ag-contract-seed: MAT-owned. Frozen public surface of `aura-glass/motion` (ENTRIES).
   Every export throws `Error('aura-glass/motion: not yet implemented (seed)')` when called;
   this module imports nothing from the optional `motion` peer (§4.10). */
const seeded = (): never => {
  throw new Error('aura-glass/motion: not yet implemented (seed)');
};

export const MotionProvider = seeded as (props: { children?: unknown }) => unknown;
export const toMotionTransition = seeded as (...args: unknown[]) => unknown;
export const useDragDetents = seeded as (...args: unknown[]) => unknown;
export const useMomentum = seeded as (...args: unknown[]) => unknown;
export const SharedLayout = seeded as (props: { children?: unknown }) => unknown;
export const Shared = seeded as (props: Record<string, unknown>) => unknown;
export const magnetic = seeded as (...args: unknown[]) => unknown;
