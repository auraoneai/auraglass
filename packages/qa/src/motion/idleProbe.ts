/* REQ-QUAL-23 (FIN-440): page-side settled-idle probe used by the L9 motion
   lane (certification/lanes/motion.spec.ts) and the SSR lane.

   installIdleProbe() and readIdleProbe() are passed to Playwright as functions
   (page.addInitScript / page.evaluate), so each body is self-contained: no
   imports, no closures over module scope. They are also called directly in
   jsdom by packages/qa/test/settled-idle.selftest.test.ts.

   The probe tracks what is *still scheduled* (pending rAF ids, live interval
   ids), what *ran* (rAF callbacks fired since a mark), the running/infinite
   Web Animations, elements whose computed will-change is not `auto`, and the
   time of the last transitionend/animationend so the lane can wait for
   "500 ms after the last transitionend without input". */

export interface IdleAnimation {
  /** tag#id.class of the effect target, or null for a non-element target */
  target: string | null;
  /** animated CSS properties (from the keyframes) */
  properties: string[];
  playState: string;
  infinite: boolean;
}

export interface IdleSnapshot {
  /** rAF callbacks requested and neither fired nor cancelled */
  pendingRaf: number;
  /** rAF callbacks fired since the last mark (installIdleProbe or markIdleProbe) */
  rafFired: number;
  /** setInterval ids not cleared */
  intervals: number;
  /** document.getAnimations() with playState === 'running' */
  running: IdleAnimation[];
  /** elements (incl. ::before/::after hosts) whose computed will-change is not `auto` */
  willChange: string[];
  /** ms since the last transitionend/animationend on the document (Infinity if none) */
  sinceLastEnd: number;
}

interface ProbeState {
  pending: Set<number>;
  intervals: Set<number>;
  rafFired: number;
  lastEnd: number;
}

/** Installs the probe on `win` (defaults to the global window). Idempotent. */
export function installIdleProbe(target?: Window): void {
  const w = (target ?? window) as Window & { __agIdleProbe?: ProbeState };
  if (w.__agIdleProbe) return;
  const state: ProbeState = { pending: new Set(), intervals: new Set(), rafFired: 0, lastEnd: -1 };
  w.__agIdleProbe = state;
  const raf = w.requestAnimationFrame.bind(w);
  const caf = w.cancelAnimationFrame.bind(w);
  const si = w.setInterval.bind(w) as (h: TimerHandler, ms?: number, ...a: unknown[]) => number;
  const ci = w.clearInterval.bind(w);
  const ct = w.clearTimeout.bind(w);
  w.requestAnimationFrame = (cb: FrameRequestCallback): number => {
    const id: number = raf((t: number) => {
      state.pending.delete(id);
      state.rafFired++;
      cb(t);
    });
    state.pending.add(id);
    return id;
  };
  w.cancelAnimationFrame = (id: number): void => {
    state.pending.delete(id);
    caf(id);
  };
  w.setInterval = ((h: TimerHandler, ms?: number, ...a: unknown[]) => {
    const id = si(h, ms, ...a);
    state.intervals.add(id);
    return id;
  }) as typeof w.setInterval;
  w.clearInterval = (id?: number): void => {
    if (id !== undefined) state.intervals.delete(id);
    ci(id);
  };
  // HTML timers share one id pool: clearTimeout(intervalId) also stops an interval.
  w.clearTimeout = (id?: number): void => {
    if (id !== undefined) state.intervals.delete(id);
    ct(id);
  };
  const onEnd = () => { state.lastEnd = w.performance.now(); };
  w.document.addEventListener('transitionend', onEnd, true);
  w.document.addEventListener('animationend', onEnd, true);
}

/** Resets the rAF-fired counter (start of an observation window). */
export function markIdleProbe(target?: Window): void {
  const w = (target ?? window) as Window & { __agIdleProbe?: ProbeState };
  if (!w.__agIdleProbe) throw new Error('idle probe not installed (installIdleProbe must run before page scripts)');
  w.__agIdleProbe.rafFired = 0;
}

/** Reads the probe. Throws when the probe is missing or the engine lacks
    document.getAnimations (every certified engine has it). */
export function readIdleProbe(target?: Window): IdleSnapshot {
  const w = (target ?? window) as Window & { __agIdleProbe?: ProbeState };
  const state = w.__agIdleProbe;
  if (!state) throw new Error('idle probe not installed (installIdleProbe must run before page scripts)');
  const doc = w.document;
  if (typeof doc.getAnimations !== 'function') throw new Error('document.getAnimations is not available in this engine');
  const describe = (el: Element | null): string | null => {
    if (!el) return null;
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
    const part = el.getAttribute('data-ag-part');
    return `${el.tagName.toLowerCase()}${id}${cls}${part ? `[data-ag-part=${part}]` : ''}`;
  };
  const running: IdleAnimation[] = [];
  for (const a of doc.getAnimations()) {
    if (a.playState !== 'running') continue;
    const effect = a.effect as KeyframeEffect | null;
    const timing = effect?.getComputedTiming();
    const props = new Set<string>();
    const tp = (a as unknown as { transitionProperty?: string }).transitionProperty;
    if (tp) props.add(tp);
    for (const kf of effect?.getKeyframes?.() ?? []) {
      for (const k of Object.keys(kf)) {
        if (k !== 'offset' && k !== 'easing' && k !== 'composite' && k !== 'computedOffset') props.add(k);
      }
    }
    running.push({
      target: describe((effect?.target as Element | null) ?? null),
      properties: [...props].sort(),
      playState: a.playState,
      infinite: timing?.iterations === Infinity,
    });
  }
  const willChange: string[] = [];
  for (const el of doc.querySelectorAll('*')) {
    for (const pseudo of [null, '::before', '::after'] as const) {
      const v = w.getComputedStyle(el, pseudo).willChange;
      if (v && v !== 'auto') willChange.push(`${describe(el)}${pseudo ?? ''} will-change:${v}`);
    }
  }
  return {
    pendingRaf: state.pending.size,
    rafFired: state.rafFired,
    intervals: state.intervals.size,
    running,
    willChange,
    sinceLastEnd: state.lastEnd < 0 ? Infinity : w.performance.now() - state.lastEnd,
  };
}

export interface SettledIdleRules {
  /** meta marks continuous indeterminate progress (REQ-QUAL-23 exception) */
  indeterminate?: boolean;
  /** reducedMotion: 'reduce' was emulated */
  reducedMotion?: boolean;
}

/** REQ-QUAL-23 settled-idle verdict over a snapshot: 0 pending rAF, 0 intervals,
    0 infinite animations, except an indeterminate-progress subject may keep ≤1
    infinite animation on transform/opacity only (0 under reduced motion).
    Returns human-readable violations; [] means settled. */
export function settledIdleViolations(s: IdleSnapshot, rules: SettledIdleRules = {}): string[] {
  const out: string[] = [];
  if (s.pendingRaf !== 0) out.push(`pending rAF: ${s.pendingRaf} (expected 0)`);
  if (s.intervals !== 0) out.push(`live intervals: ${s.intervals} (expected 0)`);
  const infinite = s.running.filter((a) => a.infinite);
  const allowance = rules.indeterminate && !rules.reducedMotion ? 1 : 0;
  const compositorOnly = (a: IdleAnimation) =>
    a.properties.length > 0 && a.properties.every((p) => p === 'transform' || p === 'opacity');
  if (infinite.length > allowance || infinite.some((a) => allowance > 0 && !compositorOnly(a))) {
    out.push(`infinite animations: ${infinite.map((a) => `${a.target ?? '?'} {${a.properties.join(',')}}`).join('; ')}`
      + ` (allowed ${allowance}${allowance ? ', transform/opacity only' : ''})`);
  }
  return out;
}
