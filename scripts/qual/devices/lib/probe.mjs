/* In-page rAF probe (REQ-QUAL-48). `pageProbe` is serialised with
   Function.prototype.toString and evaluated inside the device browser (WebDriver
   execute/async on Safari, CDP Runtime.evaluate on Android Chrome), so it must
   not reference anything outside its own body. It records raw rAF timestamps
   and, where the engine supports it, long-animation-frame entries; statistics
   are computed on the host from the raw data (lib/gate.mjs). */

export function pageProbe(opts) {
  var o = opts || {};
  var windowMs = o.windowMs || 5000;
  var settleMs = o.settleMs == null ? 500 : o.settleMs;
  var w = window;
  var doc = w.document;

  function wait(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }
  function isScrollable(el) {
    if (!el || el.scrollHeight <= el.clientHeight + 1) return false;
    var oy = w.getComputedStyle(el).overflowY;
    return oy === 'auto' || oy === 'scroll' || el === doc.scrollingElement;
  }
  function findScroller() {
    if (o.scrollSelector) {
      var picked = doc.querySelector(o.scrollSelector);
      if (isScrollable(picked)) return picked;
    }
    var best = null;
    var all = doc.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (isScrollable(el) && (!best || el.scrollHeight - el.clientHeight > best.scrollHeight - best.clientHeight)) best = el;
    }
    if (!best && isScrollable(doc.scrollingElement)) best = doc.scrollingElement;
    return best;
  }
  function openDialogs() {
    return doc.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog[open]').length;
  }
  function escape() {
    var t = doc.activeElement || doc.body;
    var init = { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true };
    t.dispatchEvent(new KeyboardEvent('keydown', init));
    t.dispatchEvent(new KeyboardEvent('keyup', init));
  }

  return (doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve())
    .then(function () { return wait(settleMs); })
    .then(function () {
      var result = {
        timestamps: [],
        loaf: null,
        interaction: o.interaction,
        driven: 0,
        error: null,
        certReady: !!doc.querySelector('[data-ag-cert-ready]'),
        userAgent: w.navigator.userAgent,
        devicePixelRatio: w.devicePixelRatio,
        viewport: { width: w.innerWidth, height: w.innerHeight },
      };
      var po = null;
      try {
        var types = (w.PerformanceObserver && w.PerformanceObserver.supportedEntryTypes) || [];
        if (types.indexOf('long-animation-frame') >= 0) {
          result.loaf = [];
          po = new w.PerformanceObserver(function (list) {
            var es = list.getEntries();
            for (var i = 0; i < es.length; i++) {
              result.loaf.push({ startTime: es[i].startTime, duration: es[i].duration, blockingDuration: es[i].blockingDuration || 0 });
            }
          });
          po.observe({ type: 'long-animation-frame', buffered: false });
        }
      } catch (e) {
        result.loaf = null;
      }

      var scroller = null;
      var trigger = null;
      var dir = 1;
      if (o.interaction === 'scroll') {
        scroller = findScroller();
        if (!scroller) result.error = 'no-scroll-range';
      } else if (o.interaction === 'open-close') {
        trigger = doc.querySelector(o.triggerSelector || '[aria-haspopup="dialog"], [data-ag-part="trigger"]');
        if (!trigger) result.error = 'no-dialog-trigger';
      } else {
        result.error = 'unknown-interaction:' + o.interaction;
      }

      var start = null;
      var lastToggle = -Infinity;
      var stepPx = o.scrollStepPx || 12;
      return new Promise(function (resolve) {
        function frame(t) {
          if (start === null) start = t;
          result.timestamps.push(t);
          if (scroller) {
            var max = scroller.scrollHeight - scroller.clientHeight;
            var next = scroller.scrollTop + dir * stepPx;
            if (next >= max || next <= 0) dir = -dir;
            scroller.scrollTop = Math.max(0, Math.min(max, next));
            result.driven++;
          } else if (trigger && t - lastToggle >= 1000) {
            lastToggle = t;
            if (openDialogs()) escape(); else trigger.click();
            result.driven++;
          }
          if (t - start < windowMs) w.requestAnimationFrame(frame);
          else {
            if (po) po.disconnect();
            resolve(result);
          }
        }
        if (result.error) {
          if (po) po.disconnect();
          resolve(result);
        } else {
          w.requestAnimationFrame(frame);
        }
      });
    });
}

/** Source evaluated by CDP Runtime.evaluate (awaitPromise, returnByValue). */
export function cdpExpression(opts) {
  return `(${pageProbe.toString()})(${JSON.stringify(opts)})`;
}

/** Script for W3C WebDriver "Execute Async Script"; the callback is the last argument. */
export function webdriverAsyncScript() {
  return `var done = arguments[arguments.length - 1];
(${pageProbe.toString()})(arguments[0]).then(done, function (e) { done({ timestamps: [], loaf: null, error: 'probe-threw:' + String(e && e.message || e) }); });`;
}
