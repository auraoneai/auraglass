/* MAT-144 — dev-only surface counter, started by the A11Y provider (A11Y-029).
   Counts elements in the viewport whose ::before backdropFilter is not none;
   warns once per threshold crossing. Never writes attributes or styles. */
import { warnOnce } from './warnings';

interface CountReport {
  blurring: number;
  refracting: number;
  refractingArea: number;
  maxNesting: number;
  violations: string[];
}

const isVisible = (el: Element): boolean => {
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  return r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
};

const liveDepth = (el: Element): number => {
  let depth = 0;
  let p = el.parentElement;
  while (p) {
    if (p.classList.contains('ag-surface')
      && getComputedStyle(p, '::before').backdropFilter !== 'none') depth += 1;
    p = p.parentElement;
  }
  return depth;
};

function count(root: ParentNode): CountReport {
  const surfaces = [...root.querySelectorAll('.ag-surface')].filter(isVisible);
  let refracting = 0;
  let refractingArea = 0;
  let maxNesting = 0;
  const violations: string[] = [];
  const vw = document.documentElement.clientWidth || 1;
  const vh = document.documentElement.clientHeight || 1;

  for (const el of surfaces) {
    const bf = getComputedStyle(el, '::before').backdropFilter;
    if (bf === 'none') continue;
    const blurMatch = /blur\(\s*(\d+(?:\.\d+)?)px/.exec(bf);
    const blurPx = blurMatch ? Number(blurMatch[1]) : 0;
    if (blurPx > 32) violations.push('blur-32');
    const r = el.getBoundingClientRect();
    if (blurPx > 12 && r.width >= vw * 0.95 && r.height >= vh * 0.95) {
      violations.push('full-viewport-blur');
    }
    if (el.hasAttribute('data-ag-refraction')) {
      refracting += 1;
      refractingArea += (r.width * r.height) / (vw * vh);
    }
    const d = liveDepth(el);
    if (d > maxNesting) maxNesting = d;
    if (el.hasAttribute('data-ag-allow-nested') && d >= 2) {
      violations.push(`allowNested-depth:${d}`);
    }
  }
  return { blurring: surfaces.filter((el) => getComputedStyle(el, '::before').backdropFilter !== 'none').length,
    refracting, refractingArea, maxNesting, violations };
}

function check(root: ParentNode): void {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const cap = coarse ? 3 : 6;
  const report = count(root);
  const anchor = root instanceof Document ? root.documentElement : (root as Element);

  if (report.blurring > cap) {
    warnOnce(anchor, `counter-blur-${cap}`,
      `[aura-glass] ${report.blurring} live backdrop filters in the viewport (cap ${cap}); demote surfaces or raise the floor`);
  }
  if (report.refracting > 2) {
    warnOnce(anchor, 'counter-refract',
      `[aura-glass] ${report.refracting} refracting surfaces in the viewport (cap 2)`);
  }
  if (report.refractingArea > 0.25) {
    warnOnce(anchor, 'counter-refract-area',
      `[aura-glass] refracting surfaces cover ${(report.refractingArea * 100).toFixed(0)}% of the viewport (cap 25%)`);
  }
  if (report.violations.includes('blur-32')) {
    warnOnce(anchor, 'counter-blur32', '[aura-glass] a surface uses backdrop blur above 32px');
  }
  if (report.violations.includes('full-viewport-blur')) {
    warnOnce(anchor, 'counter-fullblur', '[aura-glass] a full-viewport surface uses backdrop blur above 12px');
  }
  if (report.maxNesting > 1) {
    warnOnce(anchor, 'counter-nesting', `[aura-glass] live backdrop nesting depth ${report.maxNesting} exceeds 1`);
  }
  const allowNested = report.violations.find((v) => v.startsWith('allowNested-depth:'));
  if (allowNested) {
    warnOnce(anchor, 'counter-allowNested',
      `[aura-glass] allowNested at depth ${allowNested.split(':')[1]}`);
  }
}

/** Dev-only entry point used by the A11Y provider. Idempotent. */
export function startSurfaceCounter(root: ParentNode = document): () => void {
  if (process.env.NODE_ENV === 'production') return () => undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 0));
      idle(() => check(root));
    }, 500);
  };

  schedule(); // after mount
  const observer = new MutationObserver(schedule);
  observer.observe(root instanceof Document ? root.documentElement : (root as Element), {
    childList: true, subtree: true, attributes: true,
  });
  return () => {
    observer.disconnect();
    if (timer) clearTimeout(timer);
  };
}
