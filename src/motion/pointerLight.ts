/* MAT-205/206 (REQ-MOT-40/-41/-42, REQ-MAT-49): pointer light.
   One passive pointermove + one capture-phase pointerleave listener per
   Document, ref-counted. The shared ticker is subscribed only while a target
   is hovered (REQ-MAT-46). Per frame the nearest [data-ag-pointer-light] ancestor gets one
   setProperty('--_ag-pointer', '<x>% <y>%') (1 decimal); rect is cached on
   pointerenter and invalidated on scroll/resize; removed on leave.
   No React. Installs only while pointerLightActive() — resolved motion full,
   transparency glass, (hover:hover) and (pointer:fine), tier standard|enhanced —
   and never under [data-ag-highlights] (root or any ancestor of the target) or
   forced colours (REQ-MAT-45). */
import { resolvedMotion, subscribeFrame } from './ticker';
import { readPointerSignal } from '../theme/preferences/media';
import type { ResolvedPreferences } from '../contracts/preferences';

export interface PointerLightPrefs {
  motion?: 'full' | 'calm' | 'none';
  transparency?: string;
  /** PreferenceValues['forcedColors'] (store OS signal); true disables pointer light. */
  forcedColors?: boolean;
}
/** The window whose input capability is read through the preference store's
    shared media registry (src/theme/preferences/media.ts). */
export type PointerLightWindow = Window;

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
  if (win && !readPointerSignal(win, 'fineHover')) return false;
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
  /** Releases the frame subscription; a no-op while none is held. */
  unsubscribeFrame: () => void;
  pending: { x: number; y: number; target: Element } | null;
  rects: WeakMap<Element, DOMRect>;
}

const states = new WeakMap<Document, DocState>();

const fmt = (v: number) => `${Math.round(v * 10) / 10}%`;

const HIGHLIGHTS = '[data-ag-highlights]';
const TARGET = '[data-ag-pointer-light]';

function install(d: Document): DocState {
  let rects = new WeakMap<Element, DOMRect>();
  let subscribed = false;
  const clear = (el: Element) => {
    (el as HTMLElement).style?.removeProperty('--_ag-pointer');
    rects.delete(el);
    state.targets.delete(el);
    if (state.pending?.target === el) state.pending = null;
  };
  // REQ-MAT-46: the frame subscription exists only while a target is being
  // hovered — taken on the first move over a target, released on the first
  // frame with nothing pending — so no library rAF runs after settle.
  const release = () => {
    if (!subscribed) return;
    subscribed = false;
    unsubscribe();
  };
  let unsubscribe: () => void = () => {};
  // write at most one setProperty per frame, on the pending target only
  const frame = () => {
    const p = state.pending;
    if (!p) { release(); return; }
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
  };
  const state: DocState = {
    refs: 0, targets: new Set(), rects, pending: null,
    move: (e: Event) => {
      const pe = e as PointerEvent;
      const target = (pe.target as Element | null)?.closest?.(TARGET);
      if (!target) return;
      // REQ-MAT-49: [data-ag-highlights] (reduced highlights) on any ancestor,
      // not only the root, disables pointer light for that subtree.
      if (target.closest(HIGHLIGHTS)) {
        if (state.targets.has(target)) clear(target);
        return;
      }
      state.targets.add(target);
      state.pending = { x: pe.clientX, y: pe.clientY, target };
      if (!subscribed) {
        subscribed = true;
        unsubscribe = subscribeFrame(frame);
      }
    },
    // pointerleave does not bubble: this is a capture-phase listener on the
    // document, so it sees each element's own leave. Only a leave whose target
    // is a pointer-light element clears it (leaving a child stays inside).
    leave: (e: Event) => {
      const el = e.target as Element | null;
      if (!el || typeof el.matches !== 'function' || !el.matches(TARGET)) return;
      clear(el);
    },
    scroll: () => { rects = new WeakMap(); state.rects = rects; },
    // scroll/resize invalidates the cached rects
    unsubscribeFrame: () => release(),
  };
  d.addEventListener('pointermove', state.move, { passive: true });
  d.addEventListener('pointerleave', state.leave, { passive: true, capture: true });
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
      d.removeEventListener('pointerleave', state.leave, true);
      d.removeEventListener('scroll', state.scroll, true);
      d.defaultView?.removeEventListener('resize', state.scroll);
      state.unsubscribeFrame();
      states.delete(d);
    }
  };
}
