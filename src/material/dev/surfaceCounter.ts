/* MAT-144 / REQ-MAT-38 — dev-only surface counter, started by the provider in
   development only (src/theme/mounts.ts guards the import on NODE_ENV, so a
   production consumer bundle contains neither this module nor its messages).
   After mount and on requestIdleCallback after mutations (500 ms debounce) it
   counts visible surfaces whose ::before backdropFilter is not none and warns
   once per threshold crossing: each check re-arms when its condition stops
   holding, so falling back under a cap and crossing it again warns again.
   Never writes attributes or styles. */
'use client';
import { describeElement } from './warnings';

interface CountReport {
  blurring: number;
  refracting: number;
  refractingArea: number;
  maxNesting: number;
  /** first offending element per element-level check */
  blur32: Element | null;
  fullViewportBlur: Element | null;
  deepNested: Element | null;
  allowNested: { el: Element; depth: number } | null;
}

const isVisible = (el: Element): boolean => {
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  return r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
};

const liveFilter = (el: Element): boolean =>
  (getComputedStyle(el, '::before').backdropFilter || 'none') !== 'none';

const liveDepth = (el: Element): number => {
  let depth = 0;
  let p = el.parentElement;
  while (p) {
    if (p.classList.contains('ag-surface') && liveFilter(p)) depth += 1;
    p = p.parentElement;
  }
  return depth;
};

function count(root: ParentNode): CountReport {
  const surfaces = [...root.querySelectorAll('.ag-surface')].filter(isVisible);
  const vw = document.documentElement.clientWidth || 1;
  const vh = document.documentElement.clientHeight || 1;
  const report: CountReport = {
    blurring: 0, refracting: 0, refractingArea: 0, maxNesting: 0,
    blur32: null, fullViewportBlur: null, deepNested: null, allowNested: null,
  };

  for (const el of surfaces) {
    if (!liveFilter(el)) continue;
    report.blurring += 1;
    const bf = getComputedStyle(el, '::before').backdropFilter;
    const blurMatch = /blur\(\s*(\d+(?:\.\d+)?)px/.exec(bf);
    const blurPx = blurMatch ? Number(blurMatch[1]) : 0;
    if (blurPx > 32) report.blur32 ??= el;
    const r = el.getBoundingClientRect();
    if (blurPx > 12 && r.width >= vw * 0.95 && r.height >= vh * 0.95) report.fullViewportBlur ??= el;
    if (el.hasAttribute('data-ag-refraction')) {
      report.refracting += 1;
      report.refractingArea += (r.width * r.height) / (vw * vh);
    }
    const d = liveDepth(el);
    if (d > report.maxNesting) report.maxNesting = d;
    if (d > 1) report.deepNested ??= el;
    if (el.hasAttribute('data-ag-allow-nested') && d >= 2 && !report.allowNested) {
      report.allowNested = { el, depth: d };
    }
  }
  return report;
}

/** One checker per started counter: `active` holds the keys whose condition
    held at the last check (already warned for this crossing). */
function createChecker(root: ParentNode): () => void {
  const active = new Set<string>();
  const crossing = (key: string, holds: boolean, message: () => string): void => {
    if (!holds) { active.delete(key); return; }
    if (active.has(key)) return;
    active.add(key);
    console.warn(message());
  };

  return () => {
    const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const cap = coarse ? 3 : 6;
    const r = count(root);
    crossing(`blur-cap-${cap}`, r.blurring > cap, () =>
      `[aura-glass] ${r.blurring} live backdrop filters in the viewport (cap ${cap}); demote surfaces or raise the floor`);
    // the other pointer's cap re-arms (its condition is not being evaluated)
    active.delete(`blur-cap-${coarse ? 6 : 3}`);
    crossing('refract', r.refracting > 2, () =>
      `[aura-glass] ${r.refracting} refracting surfaces in the viewport (cap 2)`);
    crossing('refract-area', r.refractingArea > 0.25, () =>
      `[aura-glass] refracting surfaces cover ${(r.refractingArea * 100).toFixed(0)}% of the viewport (cap 25%)`);
    crossing('blur32', r.blur32 !== null, () =>
      `[aura-glass] a surface uses backdrop blur above 32px at ${describeElement(r.blur32!)}`);
    crossing('full-viewport-blur', r.fullViewportBlur !== null, () =>
      `[aura-glass] a full-viewport surface uses backdrop blur above 12px at ${describeElement(r.fullViewportBlur!)}`);
    crossing('nesting', r.maxNesting > 1, () =>
      `[aura-glass] live backdrop nesting depth ${r.maxNesting} exceeds 1 at ${describeElement(r.deepNested!)}`);
    crossing('allowNested', r.allowNested !== null, () =>
      `[aura-glass] allowNested at depth ${r.allowNested!.depth} at ${describeElement(r.allowNested!.el)}`);
  };
}

/** Dev-only entry point used by the provider. Returns its cleanup. */
export function startSurfaceCounter(root: ParentNode = document): () => void {
  if (process.env.NODE_ENV === 'production') return () => undefined;
  const check = createChecker(root);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 0));
      idle(() => { if (!stopped) check(); });
    }, 500);
  };

  schedule(); // after mount
  const observer = new MutationObserver(schedule);
  observer.observe(root instanceof Document ? root.documentElement : (root as Element), {
    childList: true, subtree: true, attributes: true,
  });
  return () => {
    stopped = true;
    observer.disconnect();
    if (timer) clearTimeout(timer);
  };
}
