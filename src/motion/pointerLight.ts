/* MAT-205/206 (REQ-MOT-40/-41/-42, REQ-MAT-49): pointer light.
   One passive pointermove + one pointerleave listener per Document, ref-counted.
   Per ticker frame the nearest [data-ag-pointer-light] ancestor gets one
   setProperty('--_ag-pointer', '<x>% <y>%') (1 decimal); rect is cached on
   pointerenter and invalidated on scroll/resize; removed on leave.
   No React. Installs only while pointerLightActive() — resolved motion full,
   transparency glass, (hover:hover) and (pointer:fine), tier standard|enhanced —
   and never under [data-ag-highlights] or forced colours (REQ-MAT-45). */
import { resolvedMotion, subscribeFrame } from './ticker';
import type { ResolvedPreferences } from '../contracts/preferences';

export interface PointerLightPrefs {
  motion?: 'full' | 'calm' | 'none';
  transparency?: string;
  /** PreferenceValues['forcedColors'] (store OS signal); true disables pointer light. */
  forcedColors?: boolean;
}
export type PointerLightWindow = Pick<Window, 'matchMedia'>;

/** Forced colours (REQ-MAT-45 / REQ-MOT-113) as seen from the document: the
    pre-paint script and the store resolve transparency to 'solid' as an
    absolute floor under `forced-colors: active`, so a non-glass
    data-ag-transparency on the root means pointer light must stay off. The
    store's own `forcedColors` signal arrives through `prefs.forcedColors`. */
function transparencyFloorBlocks(d: Document | null | undefined): boolean {
  const t = d?.documentElement?.getAttribute('data-ag-transparency');
  return t !== null && t !== undefined && t !== 'glass';
}

/** REQ-MOT-41: active only under full motion + glass transparency +
    hover-capable fine pointer + standard|enhanced tier; [data-ag-highlights]
    present on the document disables it regardless of preferences.
    REQ-MAT-45: false under forced colours (prefs.forcedColors, or the solid
    transparency floor the document carries when prefs omit transparency). */
export function pointerLightActive(
  prefs: (Pick<ResolvedPreferences, 'motion' | 'transparency'> & { forcedColors?: boolean }) | PointerLightPrefs,
  tier: string,
  win: PointerLightWindow | null | undefined,
  d?: Document | null,
): boolean {
  if (prefs.forcedColors === true) return false;
  if (prefs.motion !== undefined && prefs.motion !== 'full') return false;
  if (prefs.transparency !== undefined && prefs.transparency !== 'glass') return false;
  if (tier !== 'standard' && tier !== 'enhanced') return false;
  if (win && !win.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
  const dd = d ?? (typeof document === 'undefined' ? null : document);
  if (dd?.documentElement?.hasAttribute('data-ag-highlights')) return false;
  if (prefs.transparency === undefined && transparencyFloorBlocks(dd)) return false;
  if (prefs.motion === undefined && resolvedMotion(dd) !== 'full') return false;
  return true;
}

interface DocState {
  refs: number;
  targets: Set<Element>;
  move: (e: Event) => void;
  leave: (e: Event) => void;
  scroll: () => void;
  unsubscribeFrame: () => void;
  pending: { x: number; y: number; target: Element } | null;
  rects: WeakMap<Element, DOMRect>;
}

const states = new WeakMap<Document, DocState>();

const fmt = (v: number) => `${Math.round(v * 10) / 10}%`;

function install(d: Document): DocState {
  let rects = new WeakMap<Element, DOMRect>();
  const state: DocState = {
    refs: 0, targets: new Set(), rects, pending: null,
    move: (e: Event) => {
      const pe = e as PointerEvent;
      const target = (pe.target as Element | null)?.closest?.('[data-ag-pointer-light]');
      if (!target) return;
      state.targets.add(target);
      state.pending = { x: pe.clientX, y: pe.clientY, target };
    },
    leave: (e: Event) => {
      const el = (e.target as Element | null)?.closest?.('[data-ag-pointer-light]');
      if (!el) return;
      (el as HTMLElement).style?.removeProperty('--_ag-pointer');
      rects.delete(el);
      state.targets.delete(el);
      if (state.pending?.target === el) state.pending = null;
    },
    scroll: () => { rects = new WeakMap(); state.rects = rects; },
    // scroll/resize invalidates the cached rects
    unsubscribeFrame: () => {},
  };
  // write at most one setProperty per frame, on the pending target only
  state.unsubscribeFrame = subscribeFrame(() => {
    const p = state.pending;
    if (!p) return;
    state.pending = null;
    // REQ-MAT-45: forced colours (solid floor on the root) writes nothing and
    // drops any light already applied before the floor changed.
    if (transparencyFloorBlocks(d)) {
      (p.target as HTMLElement).style?.removeProperty('--_ag-pointer');
      return;
    }
    let rect = state.rects.get(p.target);
    if (!rect) {
      rect = p.target.getBoundingClientRect();
      state.rects.set(p.target, rect);
    }
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((p.x - rect.left) / rect.width) * 100;
    const y = ((p.y - rect.top) / rect.height) * 100;
    (p.target as HTMLElement).style?.setProperty('--_ag-pointer', `${fmt(x)} ${fmt(y)}`);
  });
  d.addEventListener('pointermove', state.move, { passive: true });
  d.addEventListener('pointerleave', state.leave, { passive: true });
  d.addEventListener('scroll', state.scroll, { passive: true, capture: true });
  d.defaultView?.addEventListener('resize', state.scroll, { passive: true });
  return state;
}

/** Ref-counted install: N installs keep exactly one listener pair alive. */
export function installPointerLight(d: Document): () => void {
  let state = states.get(d);
  if (!state) { state = install(d); states.set(d, state); }
  state.refs += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.refs -= 1;
    if (state.refs <= 0) {
      d.removeEventListener('pointermove', state.move);
      d.removeEventListener('pointerleave', state.leave);
      d.removeEventListener('scroll', state.scroll, true);
      d.defaultView?.removeEventListener('resize', state.scroll);
      state.unsubscribeFrame();
      states.delete(d);
    }
  };
}
