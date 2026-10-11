/* MAT-143 — dev-mode warnings. warnOnce deduplicates per (element, key) via a
   WeakMap of element -> issued keys; every call site is wrapped in
   process.env.NODE_ENV !== 'production'. */
const issued = new WeakMap<Element, Set<string>>();

export function warnOnce(el: Element | null, key: string, message: string): void {
  if (process.env.NODE_ENV === 'production' || !el) return;
  let seen = issued.get(el);
  if (!seen) {
    seen = new Set();
    issued.set(el, seen);
  }
  if (seen.has(key)) return;
  seen.add(key);
  console.warn(message);
}

/** Short selector for warning messages. */
function describe(el: Element): string {
  const parts: string[] = [];
  if (el.classList?.length) parts.push(`.${[...el.classList].join('.')}`);
  const layer = el.getAttribute('data-ag-layer');
  if (layer) parts.push(`[data-ag-layer=${layer}]`);
  return parts.join('') || el.tagName.toLowerCase();
}

/** Depth of `el` inside ancestor [data-ag-surface] hosts. */
function surfaceDepth(el: Element): number {
  let depth = 0;
  let p = el.parentElement;
  while (p) {
    if (p.hasAttribute('data-ag-surface')) depth += 1;
    p = p.parentElement;
  }
  return depth;
}

/** Mount-time element checks run by Surface in development only. */
export function warnSurface(element: HTMLElement | null): void {
  if (process.env.NODE_ENV === 'production' || !element) return;

  const layer = element.getAttribute('data-ag-layer') ?? 'chrome';
  const variant = element.getAttribute('data-ag-variant');

  if (variant === 'clear') {
    let el: Element | null = element.parentElement;
    let backdrop: string | null = null;
    while (el) {
      backdrop = el.getAttribute('data-ag-backdrop');
      if (backdrop) break;
      el = el.parentElement;
    }
    if (!backdrop || backdrop === 'auto') {
      warnOnce(element, 'clear-backdrop',
        '[aura-glass] variant="clear" requires a declared backdrop; rendering as "regular"');
    }
  }

  if (element.hasAttribute('data-ag-refraction') && layer !== 'chrome') {
    warnOnce(element, 'refraction-layer',
      `[aura-glass] refraction is ignored on layer="${layer}"`);
  }

  if (element.hasAttribute('data-ag-allow-nested')) {
    const depth = surfaceDepth(element);
    if (depth >= 2) {
      warnOnce(element, 'allowNested-depth',
        `[aura-glass] allowNested at depth ${depth} at ${describe(element)}`);
    }
  }
}
