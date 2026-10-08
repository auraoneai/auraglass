/**
 * Reduced-motion test utilities (PLAT-097).
 *
 * `mockReducedMotion(reduce)` rebinds window.matchMedia so
 * `(prefers-reduced-motion: reduce)` reports the given state for the rest of
 * the test (restore with the returned disposer or `restoreReducedMotion`).
 *
 * `expectSettledVisible(el)` asserts every text-bearing descendant has
 * opacity 1 (or unset) and an identity transform — the reduced-motion
 * visibility invariant: nothing may settle invisible for users who asked for
 * reduced motion.
 */

type MediaQueryListeners = Array<(e: { matches: boolean }) => void>;

let motionListeners: MediaQueryListeners = [];
let originalMatchMedia: typeof window.matchMedia | undefined;
let currentReduced = false;

function makeMql(query: string): MediaQueryList {
  const reducedQuery = /prefers-reduced-motion\s*:\s*reduce/.test(query);
  return {
    matches: reducedQuery ? currentReduced : false,
    media: query,
    onchange: null,
    addListener: (cb: (e: { matches: boolean }) => void) => {
      motionListeners.push(cb);
    },
    removeListener: (cb: (e: { matches: boolean }) => void) => {
      motionListeners = motionListeners.filter((l) => l !== cb);
    },
    addEventListener: (
      _type: string,
      cb: (e: { matches: boolean }) => void
    ) => {
      motionListeners.push(cb);
    },
    removeEventListener: (
      _type: string,
      cb: (e: { matches: boolean }) => void
    ) => {
      motionListeners = motionListeners.filter((l) => l !== cb);
    },
    dispatchEvent: () => true,
  } as unknown as MediaQueryList;
}

/**
 * Force the prefers-reduced-motion media query to `reduce`. Returns a dispose
 * function; also restores on `restoreReducedMotion()`.
 */
export function mockReducedMotion(reduce: boolean): () => void {
  if (typeof window === "undefined") return () => {};
  if (!originalMatchMedia) {
    originalMatchMedia = window.matchMedia;
  }
  currentReduced = reduce;
  window.matchMedia = ((query: string) =>
    makeMql(query)) as typeof window.matchMedia;
  return restoreReducedMotion;
}

/** Flip the mocked preference and notify registered listeners. */
export function setReducedMotion(reduce: boolean): void {
  currentReduced = reduce;
  motionListeners.forEach((l) => l({ matches: reduce }));
}

/** Restore the environment's original matchMedia. */
export function restoreReducedMotion(): void {
  if (typeof window !== "undefined" && originalMatchMedia) {
    window.matchMedia = originalMatchMedia;
    originalMatchMedia = undefined;
  }
  motionListeners = [];
  currentReduced = false;
}

const TEXTUAL = /[^\s]/;

/** Collect descendants (incl. the element itself) whose text has real characters. */
function textBearingElements(root: Element): Element[] {
  const out: Element[] = [];
  const walk = (el: Element) => {
    const own = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && TEXTUAL.test(n.textContent || "")
    );
    if (own) out.push(el);
    el.childNodes.forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) walk(n as Element);
    });
  };
  walk(root);
  return out;
}

/**
 * Assert the element and all text-bearing descendants settled visible:
 * computed opacity is 1 (or unset) and transform is none/identity.
 * Call after mockReducedMotion(true) + flushing act()/timers.
 */
export function expectSettledVisible(el: Element): void {
  const win = el.ownerDocument?.defaultView || window;
  const subjects = [el, ...textBearingElements(el)];
  for (const node of subjects) {
    const style = win.getComputedStyle(node);
    const opacity = style.opacity === "" ? "1" : style.opacity;
    expect(opacity).toBe("1");
    const transform = style.transform;
    // Allowed: unset/identity, inert rest transforms (translateZ(0), sub-4px
    // offsets such as a switch thumb at rest). Disallowed: transforms that hide
    // the node — scale ~0 or a large translate — which is the stuck-at-initial
    // shape this guard exists for.
    let ok =
      transform === "" ||
      transform === "none" ||
      transform === "matrix(1, 0, 0, 1, 0, 0)";
    if (!ok) {
      const m = /^matrix\((.+)\)$/.exec(transform);
      if (m) {
        const nums = m[1].split(",").map((n) => parseFloat(n.trim()));
        const [a, b, c, d, e, f2] = nums;
        const scale = Math.hypot(a, b) * Math.hypot(c, d);
        const offset = Math.max(Math.abs(e), Math.abs(f2));
        ok = scale > 0.01 && offset <= 4;
      } else {
        const t = transform.replace(/\s/g, "");
        ok =
          t === "translateZ(0)" ||
          t === "translate3d(0,0,0)" ||
          /^translate[XY]?\((-?[0-3](?:\.[0-9]+)?|4(?:\.0+)?)(px)?\)$/.test(
            t
          ) ||
          /^translate3d\(-?[0-3](?:\.[0-9]+)?(px)?,-?[0-3](?:\.[0-9]+)?(px)?,/.test(
            t
          );
      }
    }
    expect(ok).toBe(true);
  }
}
