/* MAT-208/209/211/212 (REQ-MOT-36/-37/-38/-39, REQ-MAT-48): same-document
   View Transitions with a transform-only FLIP fallback.
   - data-ag-vt on participants for the duration of the transition (optics drop
     is CSS-side via :root:active-view-transition, view-transition.css §4.7)
   - types: ['ag-morph'] or ['ag-morph-calm'] under calm
   - update() runs exactly once on every path
   - AbortError / InvalidStateError are swallowed (a skipped VT is not an error)
   - after finished, data-ag-vt-settled rides for one --ag-duration-micro so the
     optics fade back in (then the attribute is removed)
   - none: update runs synchronously, no transition */
import { useId } from 'react';
import { onMotionChange, resolvedMotion } from './ticker';
import type { MotionPreference } from '../contracts/motion';
import * as React from 'react';

/* REQ-MOT-36: module-scope detection for morph components. */
export const reactViewTransition: unknown =
  (React as Record<string, unknown>).ViewTransition ??
  (React as Record<string, unknown>).unstable_ViewTransition ??
  null;

interface VTLike { finished: Promise<void>; ready?: Promise<void>; skip?: () => void }
type UpdateFn = () => void | Promise<void>;
type VTStart = (spec: { update: UpdateFn; types?: string[] } | UpdateFn) => VTLike;

const MICRO_MS = 120; // duration-micro enter 120 ms (calm cross-fade + settled fade)

function settledFlash(el: Element, microMs: number): void {
  el.setAttribute('data-ag-vt-settled', '');
  setTimeout(() => el.removeAttribute('data-ag-vt-settled'), microMs);
}

/** FLIP fallback (REQ-MOT-39): transform-only WAAPI, easing/duration read from
    the computed --ag-spring-fluid vars; optics drop during the animation. */
async function flipFallback(surfaces: Element[], update: UpdateFn): Promise<void> {
  const first = new Map<Element, DOMRect>();
  for (const el of surfaces) first.set(el, el.getBoundingClientRect());
  for (const el of surfaces) (el as HTMLElement).style.setProperty('--_ag-optics', '0');
  await update();
  const win = surfaces[0]?.ownerDocument?.defaultView;
  const cs = win ? win.getComputedStyle(surfaces[0] as Element) : null;
  const easing = cs?.getPropertyValue('--ag-spring-fluid').trim() || 'ease';
  const duration = parseFloat(cs?.getPropertyValue('--ag-spring-fluid-duration') || '450') || 450;
  const anims: Animation[] = [];
  for (const el of surfaces) {
    const f = first.get(el)!;
    const n = el.getBoundingClientRect();
    const dx = f.left - n.left;
    const dy = f.top - n.top;
    const sx = n.width > 0 ? f.width / n.width : 1;
    const sy = n.height > 0 ? f.height / n.height : 1;
    if (!dx && !dy && sx === 1 && sy === 1) continue;
    const a = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: 'top left' },
        { transform: 'translate(0px, 0px) scale(1, 1)', transformOrigin: 'top left' },
      ],
      { duration, easing, fill: 'backwards' },
    );
    anims.push(a);
  }
  const offMotion = onMotionChange(() => { for (const a of anims) a.finish(); });
  try {
    await Promise.allSettled(anims.map((a) => a.finished));
  } finally {
    offMotion();
    for (const el of surfaces) (el as HTMLElement).style.removeProperty('--_ag-optics');
  }
}

/** startMorph(update, { surfaces, name }): §4.7 imperative path. */
export async function startMorph(
  update: UpdateFn,
  opts: { surfaces?: Element[]; name?: string; motion?: MotionPreference } = {},
): Promise<void> {
  const surfaces = opts.surfaces ?? [];
  const mode = opts.motion ?? resolvedMotion();
  if (mode === 'none') {
    await update();
    return;
  }
  const doc = surfaces[0]?.ownerDocument ?? (typeof document === 'undefined' ? null : document);
  const startVT = (doc as Document & { startViewTransition?: VTStart } | null)?.startViewTransition;
  if (!startVT) {
    await flipFallback(surfaces, update);
    return;
  }
  const types = [mode === 'calm' ? 'ag-morph-calm' : 'ag-morph'];
  for (const el of surfaces) el.setAttribute('data-ag-vt', '');
  let vt: VTLike;
  try {
    vt = startVT.call(doc, { update, types });
  } catch (e) {
    // older engines take the callback form only
    if (e instanceof TypeError) {
      vt = startVT.call(doc, update);
    } else {
      for (const el of surfaces) el.removeAttribute('data-ag-vt');
      await update();
      return;
    }
  }
  try {
    await vt.finished;
  } catch (e) {
    // AbortError / InvalidStateError are ordinary skips, never surfaced
    if (!(e instanceof DOMException && (e.name === 'AbortError' || e.name === 'InvalidStateError'))) {
      for (const el of surfaces) el.removeAttribute('data-ag-vt');
      throw e;
    }
  }
  for (const el of surfaces) {
    el.removeAttribute('data-ag-vt');
    settledFlash(el, MICRO_MS);
  }
}

/* ---------- useMorphName (REQ-MOT-38) ---------- */
const liveNames = new Map<string, number>();
/** Sanitised unique morph name: `ag-<prefix>-<useId>` reduced to [a-z0-9-].
    Duplicate registration happens in an effect (StrictMode-safe); a dev-only
    console warning fires when two live surfaces share a name. */
export function useMorphName(prefix: string): string {
  const id = useId();
  const name = `ag-${prefix}-${id}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  React.useEffect(() => {
    const count = liveNames.get(name) ?? 0;
    liveNames.set(name, count + 1);
    if (process.env.NODE_ENV !== 'production' && count > 0) {
      console.warn(`[aura-glass] duplicate view-transition name "${name}" — morph surfaces must be unique`);
    }
    return () => {
      const n = liveNames.get(name) ?? 1;
      if (n <= 1) liveNames.delete(name); else liveNames.set(name, n - 1);
    };
  }, [name]);
  return name;
}
