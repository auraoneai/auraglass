/* MAT-203 (REQ-MOT-33/-128), MAT-215 (REQ-MOT-26/-34/-116).
   Internal frame runtime — one shared rAF, dt capped at 50 ms, zero subscribers
   stops the loop, hidden document pauses it, elements tracked by the shared
   IntersectionObserver get skipped while offscreen. The same observer is the sole
   writer of data-ag-offscreen (SC-21). No React, no state — this module is never
   re-exported from a package entry. */

export type FrameCallback = (dtMs: number, nowMs: number) => void;

const MAX_DT_MS = 50;

const subs = new Set<{ cb: FrameCallback; el?: Element }>();
const offscreen = new WeakSet<Element>();
let rafId: number | null = null;
let lastNow = 0;
let visibilityHooked = false;

const doc = () => (typeof document === 'undefined' ? null : document);

/* ---------- shared IntersectionObserver: sole owner of data-ag-offscreen ---------- */
let io: IntersectionObserver | null = null;
const observer = (): IntersectionObserver | null => {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          offscreen.delete(e.target);
          e.target.removeAttribute('data-ag-offscreen');
        } else {
          offscreen.add(e.target);
          e.target.setAttribute('data-ag-offscreen', '');
        }
      }
    });
  }
  return io;
};

/** Observe an element; sole writer of data-ag-offscreen. Returns unobserve. */
export function observeOffscreen(el: Element): () => void {
  const obs = observer();
  if (!obs) return () => {};
  obs.observe(el);
  return () => {
    obs.unobserve(el);
    offscreen.delete(el);
  };
}

/* ---------- shared rAF ---------- */
function tick(now: number) {
  const dt = Math.min(now - lastNow, MAX_DT_MS);
  lastNow = now;
  for (const s of [...subs]) {
    if (s.el && offscreen.has(s.el)) continue;
    s.cb(dt, now);
  }
  rafId = subs.size ? requestAnimationFrame(tick) : null;
}

function onVisibility() {
  const d = doc();
  if (!d) return;
  if (d.hidden && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  } else if (!d.hidden && subs.size && rafId === null) {
    lastNow = 0;
    rafId = requestAnimationFrame(tick);
  }
}

/** Subscribe to the shared frame loop. opts.element skips cb while offscreen. */
export function subscribeFrame(cb: FrameCallback, opts?: { element?: Element }): () => void {
  const sub: { cb: FrameCallback; el?: Element } = { cb };
  if (opts?.element) {
    sub.el = opts.element;
    observer()?.observe(opts.element);
  }
  subs.add(sub);
  const d = doc();
  if (d && !visibilityHooked) {
    d.addEventListener('visibilitychange', onVisibility);
    visibilityHooked = true;
  }
  if (typeof requestAnimationFrame !== 'undefined' && rafId === null && !d?.hidden) {
    lastNow = 0;
    rafId = requestAnimationFrame(tick);
  }
  return () => {
    subs.delete(sub);
    if (sub.el) io?.unobserve(sub.el);
    if (subs.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

/* ---------- resolved-motion read + change notification (REQ-MOT-26/-116) ---------- */
export type ResolvedMotion = 'full' | 'calm' | 'none';

/** Resolved motion for the document: the provider's attribute wins; the OS floor
   applies only when no attribute is set (S-12 mirror). */
export function resolvedMotion(d?: Document | null): ResolvedMotion {
  const dd = d ?? doc();
  const attr = dd?.documentElement?.getAttribute('data-ag-motion');
  if (attr === 'none' || attr === 'calm' || attr === 'full') return attr;
  const mq = dd?.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)');
  return mq?.matches ? 'calm' : 'full';
}

let mo: MutationObserver | null = null;
const motionCbs = new Set<(m: ResolvedMotion) => void>();
function notifyMotion() {
  const m = resolvedMotion();
  for (const cb of [...motionCbs]) cb(m);
}
/** Notify when the resolved motion changes (store until 2d-P lands;
    MutationObserver on documentElement's data-ag-motion is the shipping path). */
export function onMotionChange(cb: (m: ResolvedMotion) => void): () => void {
  motionCbs.add(cb);
  const d = doc();
  if (d && !mo && typeof MutationObserver !== 'undefined') {
    mo = new MutationObserver((records) => {
      if (records.some((r) => r.attributeName === 'data-ag-motion')) notifyMotion();
    });
    mo.observe(d.documentElement, { attributes: true, attributeFilter: ['data-ag-motion'] });
  }
  return () => {
    motionCbs.delete(cb);
    if (motionCbs.size === 0 && mo) { mo.disconnect(); mo = null; }
  };
}

/* ---------- tween (REQ-MOT-26/-34) ---------- */
export interface TweenOptions {
  duration?: number;                       // ms; default duration-medium 320
  format?: (v: number) => string;          // default: rounded integer
  motion?: ResolvedMotion;                 // override for tests; default resolvedMotion()
}
export interface TweenHandle { cancel(): void; readonly finished: Promise<void> }

/** Tween a numeric textContent through the shared ticker. Under calm/none the
    final value is written immediately. cancel() jumps to the final value. */
export function tween(el: Element, from: number, to: number, opts: TweenOptions = {}): TweenHandle {
  const fmt = opts.format ?? ((v: number) => String(Math.round(v)));
  const duration = opts.duration ?? 320;
  const mode = opts.motion ?? resolvedMotion();
  const done = () => { el.textContent = fmt(to); };
  if (mode !== 'full' || duration <= 0) {
    done();
    return { cancel: () => {}, finished: Promise.resolve() };
  }
  let elapsed = 0;
  let resolveDone!: () => void;
  const finished = new Promise<void>((r) => { resolveDone = r; });
  el.textContent = fmt(from);
  const unsub = subscribeFrame((dt) => {
    elapsed += dt;
    const t = Math.min(elapsed / duration, 1);
    // ease-out: value approaches `to`; linear is fine for counters (contract keeps
    // opacity-scale work in CSS; this helper only formats textContent)
    el.textContent = fmt(from + (to - from) * t);
    if (t >= 1) { unsub(); resolveDone(); }
  }, { element: el });
  // mid-tween preference change: jump to final within one frame
  const offMotion = onMotionChange(() => { unsub(); done(); resolveDone(); });
  return {
    cancel: () => { unsub(); offMotion(); done(); resolveDone(); },
    finished,
  };
}

/* ---------- announceFinal (REQ-MOT-116) ---------- */
/** Update an aria-live=polite aria-atomic=true region once (no per-frame spam). */
export function announceFinal(region: Element, text: string): void {
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.textContent = text;
}
