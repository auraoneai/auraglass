/* tests/perf/qual/instrument.js — REQ-QUAL-42/-43 page instrumentation (QUAL, L10; FIN-446).
   `agInstrument` is installed with page.addInitScript before any page script runs (it is self-contained: Playwright
   serialises the function source). It wraps, on the page's own window:
     window/document addEventListener + removeEventListener   live listener registry, deduplicated exactly like the DOM
                                                              (type + callback + capture), honouring `once` and `signal`
     requestAnimationFrame / cancelAnimationFrame             pending callbacks + every request with its timestamp
     setInterval / clearInterval (+ clearTimeout)             live intervals (the HTML timer id pool is shared)
     MutationObserver / ResizeObserver / IntersectionObserver live observers: observing ≥1 target, not disconnected,
                                                              still reachable (WeakRef — a collected observer is gone)
     HTMLCanvasElement / OffscreenCanvas getContext           every WebGL context created, for the context budget
   and exposes window.__agInstrument.snapshot(webglSinceMs?) (WebGL contexts created at/after webglSinceMs when given). Nothing here asserts; the specs evaluate the snapshots
   (tests/perf/qual/invariants.mjs). The same function runs under jsdom in tests/perf/qual/invariants.test.mjs. */

export function agInstrument() {
  const w = window;
  if (w.__agInstrument) return;
  const I = {
    targets: { window: [], document: [] },
    raf: new Map(),           // id -> requested-at
    rafRequests: [],          // timestamps of every request (page code only)
    intervals: new Map(),     // id -> created-at
    observers: [],            // { kind, ref: WeakRef, state }
    webgl: [],                // { canvas: WeakRef|null, ctx: WeakRef, type, offscreen }
  };
  w.__agInstrument = I;
  const now = () => (w.performance && w.performance.now ? w.performance.now() : Date.now());

  /* ---- event listeners on window and document ---- */
  const captureOf = (opts) => (typeof opts === 'boolean' ? opts : !!(opts && opts.capture));
  const install = (name, target) => {
    const reg = I.targets[name];
    const origAdd = target.addEventListener;
    const origRemove = target.removeEventListener;
    const find = (type, fn, capture) => reg.findIndex((e) => e.type === type && e.fn === fn && e.capture === capture);
    const drop = (entry) => { const i = reg.indexOf(entry); if (i >= 0) reg.splice(i, 1); };
    target.addEventListener = function addEventListener(type, fn, opts) {
      const self = this == null ? w : this;     // an unqualified global call has no receiver (WebIDL: the global)
      const result = origAdd.call(self, type, fn, opts);
      if (self === target && fn && !(opts && typeof opts === 'object' && opts.signal && opts.signal.aborted)) {
        const capture = captureOf(opts);
        if (find(String(type), fn, capture) < 0) {
          const entry = { type: String(type), fn, capture, at: now() };
          reg.push(entry);
          if (opts && typeof opts === 'object') {
            if (opts.once) origAdd.call(target, type, () => drop(entry), { once: true, capture });
            if (opts.signal) opts.signal.addEventListener('abort', () => drop(entry), { once: true });
          }
        }
      }
      return result;
    };
    target.removeEventListener = function removeEventListener(type, fn, opts) {
      const self = this == null ? w : this;
      if (self === target && fn) {
        const i = find(String(type), fn, captureOf(opts));
        if (i >= 0) reg.splice(i, 1);
      }
      return origRemove.call(self, type, fn, opts);
    };
  };
  install('window', w);
  install('document', w.document);

  /* ---- requestAnimationFrame ---- */
  if (typeof w.requestAnimationFrame === 'function') {
    const origRaf = w.requestAnimationFrame.bind(w);
    const origCaf = w.cancelAnimationFrame.bind(w);
    w.requestAnimationFrame = function requestAnimationFrame(cb) {
      const at = now();
      I.rafRequests.push(at);
      const id = origRaf((t) => { I.raf.delete(id); cb(t); });
      I.raf.set(id, at);
      return id;
    };
    w.cancelAnimationFrame = function cancelAnimationFrame(id) { I.raf.delete(id); origCaf(id); };
  }

  /* ---- intervals ---- */
  const origSI = w.setInterval.bind(w);
  const origCI = w.clearInterval.bind(w);
  const origCT = w.clearTimeout.bind(w);
  w.setInterval = function setInterval(fn, ms, ...rest) { const id = origSI(fn, ms, ...rest); I.intervals.set(id, now()); return id; };
  w.clearInterval = function clearInterval(id) { I.intervals.delete(id); origCI(id); };
  w.clearTimeout = function clearTimeout(id) { I.intervals.delete(id); origCT(id); };

  /* ---- observers ---- */
  const hasWeakRef = typeof w.WeakRef === 'function';
  const weak = (o) => (hasWeakRef ? new w.WeakRef(o) : { deref: () => o });
  for (const kind of ['MutationObserver', 'ResizeObserver', 'IntersectionObserver']) {
    const Orig = w[kind];
    if (typeof Orig !== 'function') continue;
    const Wrapped = class extends Orig {
      constructor(...args) {
        super(...args);
        const state = { targets: new Set(), disconnected: false };
        Object.defineProperty(this, '__agState', { value: state });
        I.observers.push({ kind, ref: weak(this), state });
      }
      observe(target, ...rest) {
        const r = super.observe(target, ...rest);
        this.__agState.targets.add(target);
        this.__agState.disconnected = false;
        return r;
      }
      disconnect() { this.__agState.targets.clear(); this.__agState.disconnected = true; return super.disconnect(); }
    };
    if (typeof Orig.prototype.unobserve === 'function') {
      Wrapped.prototype.unobserve = function unobserve(target) { this.__agState.targets.delete(target); return Orig.prototype.unobserve.call(this, target); };
    }
    Object.defineProperty(Wrapped, 'name', { value: kind });
    w[kind] = Wrapped;
  }

  /* ---- WebGL contexts ---- */
  const GL = /^(webgl2?|experimental-webgl)$/;
  const wrapGetContext = (proto, offscreen) => {
    if (!proto || typeof proto.getContext !== 'function') return;
    const orig = proto.getContext;
    proto.getContext = function getContext(type, ...rest) {
      const ctx = orig.call(this, type, ...rest);
      if (ctx && GL.test(String(type)) && !I.webgl.some((x) => x.ctx.deref() === ctx)) {
        I.webgl.push({ canvas: weak(this), ctx: weak(ctx), type: String(type), offscreen, at: now() });
      }
      return ctx;
    };
  };
  if (w.HTMLCanvasElement) wrapGetContext(w.HTMLCanvasElement.prototype, false);
  if (w.OffscreenCanvas) wrapGetContext(w.OffscreenCanvas.prototype, true);

  /* ---- snapshot ---- */
  I.snapshot = function snapshot(webglSinceMs) {
    const listeners = {};
    for (const name of Object.keys(I.targets)) {
      const byType = {};
      for (const e of I.targets[name]) byType[e.type] = (byType[e.type] || 0) + 1;
      listeners[name] = byType;
    }
    const observers = { MutationObserver: 0, ResizeObserver: 0, IntersectionObserver: 0 };
    for (const o of I.observers) {
      if (o.state.disconnected || o.state.targets.size === 0) continue;
      if (!o.ref.deref()) continue;
      observers[o.kind] += 1;
    }
    const webgl = [];
    for (const g of I.webgl) {
      if (typeof webglSinceMs === 'number' && g.at < webglSinceMs) continue;
      const ctx = g.ctx.deref();
      if (!ctx) continue;
      const canvas = g.canvas ? g.canvas.deref() : null;
      const lost = typeof ctx.isContextLost === 'function' ? ctx.isContextLost() : false;
      const rect = canvas && !g.offscreen && canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : null;
      webgl.push({
        type: g.type, offscreen: g.offscreen, lost,
        connected: !!(canvas && !g.offscreen && canvas.isConnected),
        backing: canvas ? { width: canvas.width, height: canvas.height } : null,
        css: rect ? { width: rect.width, height: rect.height } : null,
      });
    }
    return {
      at: now(),
      listeners,
      pendingRaf: I.raf.size,
      rafRequests: I.rafRequests.length,
      intervals: I.intervals.size,
      observers,
      webgl,
    };
  };
  /** rAF requests made by page code at or after `sinceMs` (performance.now() clock). */
  I.rafRequestsSince = function rafRequestsSince(sinceMs) { return I.rafRequests.filter((t) => t >= sinceMs).length; };
}
