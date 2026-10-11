/* REQ-QUAL-15 layout overlap/overflow + REQ-QUAL-18 containment, targets and focus (QUAL, FIN-430).

   Port of the 4.1 `collectLayoutIssues` (v4.1.0 tests/visual/design-system/token-purity-layout-audit.spec.ts:1107-1515,
   read from the tag, never imported). The 4.x function measured and judged in one page.evaluate; here it is split so
   the judgement is unit-testable: `collectLayoutSnapshot` (in-page, self-contained, pass by value to page.evaluate)
   records geometry, `analyseLayout` (pure) returns the same issue types with the same tolerances:
   horizontal-overflow, zero-size-glass-surface, glass-surface-overflow, glass-surface-vertical-clipping,
   text-truncation, interactive-overlap, visual-control-collision, control-spacing.
   5.x changes: a surface is `[data-ag-surface]` or any element with computed backdrop-filter ≠ none (the 4.x
   `glass-*` class heuristics are gone with the 4.x classes); the walk is scoped to the story root plus portal/layer roots
   instead of <body>, which also removes the Storybook-chrome exclusions.

   REQ-QUAL-18 (pure parts; the lane captures): `containment` (scrollWidth ≤ clientWidth + 1 with every ancestor
   overflow-x clipping disabled), `rightEdgeTouched` (no subject pixel in the right-most device-pixel column),
   `targetSizes` (≥44×44 CSS px, or ≥24×24 with WCAG 2.5.8 spacing when the control declares `data-ag-size="sm"`),
   `focusIndicator` (indicator pixels — focused vs unfocused capture — ≥3:1 against the adjacent pixels). */
import { assertSameSize, channelDelta, contrastRatio, medianRgb, type Rect, type Rgb, type Rgba } from '../pixel/raster';
import type { GateResult } from '../pixel/gate';

export interface LayoutIssue { type: string; detail: string }

export interface SnapSurface { desc: string; box: Rect; scrollW: number; clientW: number; scrollH: number; clientH: number; overflowX: string; overflowY: string; svg: boolean; range: boolean; divider: boolean }
export interface SnapText { desc: string; box: Rect; scrollW: number; clientW: number; scrollH: number; clientH: number; lineClamp: number; lineClampTruncated: boolean; insideScroll: boolean; clippedByAncestor: boolean }
export interface SnapNode { id: number; ancestors: number[]; desc: string; box: Rect }
export interface SnapControl extends SnapNode { region: SnapNode }
export interface LayoutSnapshot { doc: { scrollWidth: number; clientWidth: number }; surfaces: SnapSurface[]; texts: SnapText[]; controls: SnapControl[] }

/** In-page. Geometry for `analyseLayout` under `rootSelector` (+ portal/layer roots). Self-contained: no outer refs. */
export function collectLayoutSnapshot(rootSelector: string): LayoutSnapshot {
  const ids = new Map<Element, number>();
  const idOf = (el: Element): number => { let v = ids.get(el); if (v === undefined) { v = ids.size; ids.set(el, v); } return v; };
  const ancestorsOf = (el: Element): number[] => { const out: number[] = []; for (let p = el.parentElement; p; p = p.parentElement) out.push(idOf(p)); return out; };
  const rect = (r: DOMRect): Rect => ({ x: r.left, y: r.top, w: r.width, h: r.height });
  const describe = (node: Element): string => {
    const id = node.id ? `#${node.id}` : '';
    const attrs = [...node.attributes].filter((a) => a.name.startsWith('data-ag-') || a.name === 'role' || a.name === 'aria-label')
      .slice(0, 4).map((a) => (a.value ? `[${a.name}="${a.value.slice(0, 24)}"]` : `[${a.name}]`)).join('');
    return `${node.tagName.toLowerCase()}${id}${attrs}`.slice(0, 180);
  };
  const hidden = (node: Element): boolean => {
    for (let c: Element | null = node; c && c !== document.documentElement; c = c.parentElement) {
      const s = getComputedStyle(c);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity || '1') <= 0.01 || c.hasAttribute('hidden')) return true;
    }
    return false;
  };
  const backdrop = (s: CSSStyleDeclaration): string => {
    const p = s.getPropertyValue('-webkit-backdrop-filter');
    return p && p !== 'none' ? p : s.getPropertyValue('backdrop-filter') || 'none';
  };
  const visuallyHiddenText = (node: Element): boolean => {
    for (let c: Element | null = node; c && c !== document.body; c = c.parentElement) {
      const s = getComputedStyle(c); const b = c.getBoundingClientRect();
      if (b.width <= 1 && b.height <= 1 && ['absolute', 'fixed'].includes(s.position) && ['hidden', 'clip'].includes(s.overflowX)
        && ['hidden', 'clip'].includes(s.overflowY) && (s.clip !== 'auto' || s.clipPath !== 'none' || s.whiteSpace === 'nowrap')) return true;
    }
    return false;
  };
  const inViewport = (b: DOMRect): boolean => !(b.right <= 0 || b.bottom <= 0 || b.left >= innerWidth || b.top >= innerHeight);
  const roots = [document.querySelector(rootSelector), ...document.querySelectorAll('[data-ag-portal-root], [data-ag-layer-root]')].filter((r): r is Element => !!r);
  const all: Element[] = [];
  const seen = new Set<Element>();
  for (const r of roots) for (const el of [r, ...r.querySelectorAll('*')]) if (!seen.has(el)) { seen.add(el); all.push(el); }
  const stop = document.body.parentElement;

  const surfaces: SnapSurface[] = [];
  for (const node of all) {
    if (hidden(node)) continue;
    const s = getComputedStyle(node); const b = node.getBoundingClientRect();
    if (!inViewport(b)) continue;
    if (!node.hasAttribute('data-ag-surface') && backdrop(s) === 'none') continue;
    const tag = node.tagName.toLowerCase();
    surfaces.push({ desc: describe(node), box: rect(b), scrollW: node.scrollWidth, clientW: node.clientWidth, scrollH: node.scrollHeight, clientH: node.clientHeight,
      overflowX: s.overflowX, overflowY: s.overflowY, svg: node.closest('svg') !== null, range: node instanceof HTMLInputElement && node.type === 'range',
      divider: (tag === 'div' || tag === 'span') && (b.width <= 2 || b.height <= 2) });
  }

  const texts: SnapText[] = [];
  for (const node of all) {
    if (hidden(node) || visuallyHiddenText(node)) continue;
    const direct = [...node.childNodes].some((c) => c.nodeType === Node.TEXT_NODE && Boolean(c.textContent?.trim()));
    if (!direct && !(node instanceof HTMLInputElement && node.type !== 'range') && !(node instanceof HTMLTextAreaElement)) continue;
    const b = node.getBoundingClientRect();
    if (b.width <= 0 || b.height <= 0) continue;
    const s = getComputedStyle(node);
    const parsed = Number.parseInt(s.getPropertyValue('-webkit-line-clamp').trim(), 10);
    const lineClamp = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    let lineClampTruncated = false;
    if (lineClamp > 0 && node instanceof HTMLElement) {
      const clone = node.cloneNode(true) as HTMLElement;
      clone.style.cssText += ['position:fixed!important', 'left:-10000px!important', 'top:0!important', 'visibility:hidden!important',
        'pointer-events:none!important', `width:${b.width}px!important`, 'height:auto!important', 'max-height:none!important',
        'overflow:visible!important', '-webkit-line-clamp:unset!important'].join(';');
      document.body.appendChild(clone);
      lineClampTruncated = clone.scrollHeight > node.clientHeight + 2 || clone.scrollWidth > node.clientWidth + 2;
      clone.remove();
    }
    let insideScroll = false; let clippedByAncestor = false;
    for (let a: Element | null = node; a && a !== stop; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (['auto', 'scroll'].includes(as.overflowX) || ['auto', 'scroll'].includes(as.overflowY)) { insideScroll = true; break; }
      if (a !== node) {
        const ab = a.getBoundingClientRect();
        const cx = ['hidden', 'clip'].includes(as.overflowX); const cy = ['hidden', 'clip'].includes(as.overflowY);
        if ((cx && (b.left < ab.left - 2 || b.right > ab.right + 2)) || (cy && (b.top < ab.top - 2 || b.bottom > ab.bottom + 2))) clippedByAncestor = true;
      }
    }
    texts.push({ desc: describe(node), box: rect(b), scrollW: node.scrollWidth, clientW: node.clientWidth, scrollH: node.scrollHeight, clientH: node.clientHeight,
      lineClamp, lineClampTruncated, insideScroll, clippedByAncestor });
  }

  const controls: SnapControl[] = [];
  const sel = 'button, [href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
  for (const node of all) {
    if (!node.matches(sel)) continue;
    const b = node.getBoundingClientRect(); const s = getComputedStyle(node);
    if (b.width <= 0 || b.height <= 0 || hidden(node) || s.pointerEvents === 'none') continue;
    if (node instanceof HTMLInputElement && node.type === 'hidden') continue;
    if (node.matches(':disabled') || node.getAttribute('aria-disabled') === 'true') continue;
    if (!inViewport(b)) continue;
    // painted hit region around the control (4.x paintedControlBox): up to 4 ancestors that paint and stay control-sized
    let chosen: Element = node; let chosenBox = b;
    let cur: Element | null = node;
    for (let depth = 0; cur && depth < 4; depth++, cur = cur.parentElement) {
      const cb = cur.getBoundingClientRect(); const cs = getComputedStyle(cur);
      const painted = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || Number.parseFloat(cs.borderTopWidth || '0') > 0;
      if (painted && cb.width <= Math.max(b.width * 8, 560) && cb.height <= Math.max(b.height * 3, 96)) { chosen = cur; chosenBox = cb; }
    }
    controls.push({ id: idOf(node), ancestors: ancestorsOf(node), desc: describe(node), box: rect(b),
      region: { id: idOf(chosen), ancestors: ancestorsOf(chosen), desc: describe(chosen), box: rect(chosenBox) } });
  }
  const de = document.documentElement;
  return { doc: { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth }, surfaces, texts, controls };
}

const contains = (a: SnapNode, b: SnapNode): boolean => b.ancestors.includes(a.id);
const f1 = (n: number): string => n.toFixed(1);

/** Pure judgement of a snapshot — the 4.1 rules and tolerances (2 px; 8 px control breathing space). */
export function analyseLayout(s: LayoutSnapshot): LayoutIssue[] {
  const issues: LayoutIssue[] = [];
  if (s.doc.scrollWidth > s.doc.clientWidth + 2) issues.push({ type: 'horizontal-overflow', detail: `documentElement scrollWidth=${s.doc.scrollWidth} clientWidth=${s.doc.clientWidth}` });
  for (const n of s.surfaces) {
    if ((n.box.w === 0 || n.box.h === 0) && !n.svg && !n.divider) issues.push({ type: 'zero-size-glass-surface', detail: n.desc });
    if (n.scrollW > n.clientW + 2 && n.overflowX !== 'auto' && n.overflowX !== 'scroll' && !n.svg) issues.push({ type: 'glass-surface-overflow', detail: `${n.desc} scrollWidth=${n.scrollW} clientWidth=${n.clientW}` });
    if (n.scrollH > n.clientH + 2 && n.overflowY !== 'auto' && n.overflowY !== 'scroll' && !n.svg && !n.range) issues.push({ type: 'glass-surface-vertical-clipping', detail: `${n.desc} scrollHeight=${n.scrollH} clientHeight=${n.clientH}` });
  }
  for (const t of s.texts) {
    if (t.box.w <= 0 || t.box.h <= 0) continue;
    const clippedX = t.scrollW > t.clientW + 2; const clippedY = t.scrollH > t.clientH + 2;
    if (!t.insideScroll && (clippedX || clippedY || t.clippedByAncestor || t.lineClampTruncated)) {
      issues.push({ type: 'text-truncation', detail: `${t.desc} scroll=${t.scrollW}x${t.scrollH} client=${t.clientW}x${t.clientH} lineClamp=${t.lineClamp} lineClampTruncated=${t.lineClampTruncated} clippedByAncestor=${t.clippedByAncestor}` });
    }
  }
  const c = s.controls;
  for (let i = 0; i < c.length; i++) {
    for (let j = i + 1; j < c.length; j++) {
      const A = c[i]!; const B = c[j]!;
      if (contains(A, B) || contains(B, A)) continue;
      const ox = Math.max(0, Math.min(A.box.x + A.box.w, B.box.x + B.box.w) - Math.max(A.box.x, B.box.x));
      const oy = Math.max(0, Math.min(A.box.y + A.box.h, B.box.y + B.box.h) - Math.max(A.box.y, B.box.y));
      if (ox > 2 && oy > 2) issues.push({ type: 'interactive-overlap', detail: `${A.desc} <-> ${B.desc} overlap=${f1(ox)}x${f1(oy)}px` });
    }
  }
  const keys = new Set<string>();
  for (let i = 0; i < c.length; i++) {
    for (let j = i + 1; j < c.length; j++) {
      const a = c[i]!.region; const b = c[j]!.region;
      if (a.id === b.id || contains(a, b) || contains(b, a)) continue;
      const hx = Math.max(0, Math.min(a.box.x + a.box.w, b.box.x + b.box.w) - Math.max(a.box.x, b.box.x));
      const align = hx / Math.max(1, Math.min(a.box.w, b.box.w));
      const gap = Math.max(0, Math.max(a.box.y, b.box.y) - Math.min(a.box.y + a.box.h, b.box.y + b.box.h));
      if (align < 0.25 || gap >= 8) continue;
      const key = [a.desc, b.desc].sort().join(' <-> ');
      if (keys.has(key)) continue;
      keys.add(key);
      issues.push({ type: gap === 0 ? 'visual-control-collision' : 'control-spacing',
        detail: `${key} verticalGap=${f1(gap)}px required>=8px horizontalAlignment=${(align * 100).toFixed(0)}%` });
    }
  }
  return issues;
}

// ---- REQ-QUAL-18 containment -----------------------------------------------------------------------------------------

/** In-page: disables overflow-x clipping on every ancestor of the story root (inline style, restored by
    `restoreAncestorOverflow`) and returns the root's scroll/client widths. Self-contained. */
export function measureContainment(rootSelector: string): { scrollWidth: number; clientWidth: number; ancestorsUnclipped: number } | null {
  const root = document.querySelector(rootSelector) as HTMLElement | null;
  if (!root) return null;
  let n = 0;
  for (let a = root.parentElement; a; a = a.parentElement) {
    const cs = getComputedStyle(a);
    if (cs.overflowX === 'hidden' || cs.overflowX === 'clip') {
      a.setAttribute('data-qa-overflow-x', a.style.getPropertyValue('overflow-x') || '-');
      a.style.setProperty('overflow-x', 'visible', 'important');
      n++;
    }
  }
  return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, ancestorsUnclipped: n };
}

export function restoreAncestorOverflow(): void {
  for (const a of document.querySelectorAll<HTMLElement>('[data-qa-overflow-x]')) {
    const prev = a.getAttribute('data-qa-overflow-x');
    if (prev === '-') a.style.removeProperty('overflow-x'); else a.style.setProperty('overflow-x', prev ?? '');
    a.removeAttribute('data-qa-overflow-x');
  }
}

export function containment(m: { scrollWidth: number; clientWidth: number } | null, t: { containmentSlackPx: number }): GateResult {
  if (!m) return { gate: 'containment', status: 'fail', detail: '[data-ag-story-content] missing' };
  const pass = m.scrollWidth <= m.clientWidth + t.containmentSlackPx;
  return { gate: 'containment', status: pass ? 'pass' : 'fail', value: m.scrollWidth, limit: m.clientWidth + t.containmentSlackPx,
    detail: `[data-ag-story-content] scrollWidth ${m.scrollWidth} vs clientWidth ${m.clientWidth} (+${t.containmentSlackPx}) with ancestor overflow-x clipping disabled` };
}

/** A subject pixel touches the right edge when the right-most device column differs from the scene-only capture. */
export function rightEdgeTouched(capture: Rgba, sceneOnly: Rgba, minDelta: number): GateResult {
  assertSameSize(capture, sceneOnly, 'right-edge');
  const x = capture.width - 1;
  let touched = 0; let first = -1;
  for (let y = 0; y < capture.height; y++) {
    const o = (y * capture.width + x) * 4;
    if (channelDelta(capture.data, sceneOnly.data, o) > minDelta) { touched++; if (first < 0) first = y; }
  }
  return { gate: 'right-edge', status: touched ? 'fail' : 'pass', value: touched, limit: 0,
    detail: touched ? `${touched} subject pixel(s) on the right edge column (first at device y=${first})` : 'no subject pixel on the right edge' };
}

// ---- REQ-QUAL-18 targets ---------------------------------------------------------------------------------------------
export interface Target { desc: string; box: Rect; sm: boolean }

/** In-page: interactive hit boxes of the subject with their declared size (`data-ag-size="sm"` on it or an ancestor). */
export function collectTargets(rootSelector: string): Target[] {
  const roots = [document.querySelector(rootSelector), ...document.querySelectorAll('[data-ag-portal-root], [data-ag-layer-root]')].filter((r): r is Element => !!r);
  const out: Target[] = [];
  const sel = 'button, a[href], input:not([type=hidden]), select, textarea, [role="button"], [role="checkbox"], [role="switch"], [role="radio"], [role="tab"], [role="menuitem"], [role="option"], [role="slider"], [tabindex]:not([tabindex="-1"])';
  const seen = new Set<Element>();
  for (const root of roots) {
    for (const el of root.querySelectorAll(sel)) {
      if (seen.has(el)) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.pointerEvents === 'none') continue;
      if (el.matches(':disabled') || el.getAttribute('aria-disabled') === 'true') continue;
      // a native control visually replaced by a styled sibling/label is measured through its label
      const r = (el instanceof HTMLInputElement && (el.labels?.length ?? 0) > 0 && el.getBoundingClientRect().width <= 1)
        ? el.labels![0]!.getBoundingClientRect() : el.getBoundingClientRect();
      if (r.width <= 1 && r.height <= 1) continue; // visually hidden
      const part = el.getAttribute('data-ag-part');
      out.push({ desc: `${el.tagName.toLowerCase()}${part ? `[data-ag-part="${part}"]` : ''}${el.getAttribute('aria-label') ? `[aria-label="${el.getAttribute('aria-label')!.slice(0, 24)}"]` : ''}`,
        box: { x: r.left, y: r.top, w: r.width, h: r.height }, sm: el.closest('[data-ag-size]')?.getAttribute('data-ag-size') === 'sm' });
    }
  }
  return out;
}

/** ≥ targetMin × targetMin CSS px; `sm` controls ≥ targetMinSm square and WCAG 2.5.8 spacing: a targetSpacingSm-diameter
    circle centred on the target intersects no other target box and no other sm target's circle. */
export function targetSizes(targets: readonly Target[], t: { targetMin: number; targetMinSm: number; targetSpacingSm: number }): GateResult {
  if (!targets.length) return { gate: 'target-size', status: 'not-applicable', detail: 'no interactive targets' };
  const centre = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
  const circleHitsBox = (c: { x: number; y: number }, rad: number, b: Rect): boolean => {
    const dx = Math.max(b.x - c.x, 0, c.x - (b.x + b.w)); const dy = Math.max(b.y - c.y, 0, c.y - (b.y + b.h));
    return dx * dx + dy * dy < rad * rad;
  };
  const bad: string[] = [];
  const pairs = new Set<string>();
  targets.forEach((tg, i) => {
    const min = Math.min(tg.box.w, tg.box.h);
    if (!tg.sm) {
      if (tg.box.w < t.targetMin || tg.box.h < t.targetMin) bad.push(`${tg.desc} ${f1(tg.box.w)}×${f1(tg.box.h)} < ${t.targetMin}×${t.targetMin}`);
      return;
    }
    if (min < t.targetMinSm) { bad.push(`${tg.desc} (sm) ${f1(tg.box.w)}×${f1(tg.box.h)} < ${t.targetMinSm}×${t.targetMinSm}`); return; }
    const c = centre(tg.box); const rad = t.targetSpacingSm / 2;
    targets.forEach((o, j) => {
      if (i === j) return;
      const inside = (a: Rect, b: Rect) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
      if (inside(tg.box, o.box) || inside(o.box, tg.box)) return; // nested parts of one control
      const oc = centre(o.box);
      const hits = circleHitsBox(c, rad, o.box) || (o.sm && Math.hypot(c.x - oc.x, c.y - oc.y) < t.targetSpacingSm);
      const key = [i, j].sort((p, q) => p - q).join('-');
      if (hits && !pairs.has(key)) { pairs.add(key); bad.push(`${tg.desc} (sm) spacing: ${t.targetSpacingSm}px circle intersects ${o.desc}`); }
    });
  });
  return { gate: 'target-size', status: bad.length ? 'fail' : 'pass', value: bad.length, limit: 0,
    detail: bad.length ? bad.slice(0, 10).join('; ') : `${targets.length} target(s) meet ${t.targetMin}×${t.targetMin} (sm: ${t.targetMinSm} + spacing)` };
}

// ---- REQ-QUAL-18 focus indicator -------------------------------------------------------------------------------------

/** Indicator = pixels within `region` (device px) that change by > minDelta between unfocused and focused captures;
    adjacent = pixels within `ringPx` of the indicator that are not indicator pixels (in the focused capture).
    Median indicator colour vs median adjacent colour must be ≥ minContrast (WCAG 2.4.11 / 1.4.11). */
export function focusIndicator(focused: Rgba, unfocused: Rgba, region: Rect, t: { focusMinContrast: number }, opts: { minDelta?: number; ringPx?: number } = {}): GateResult & { indicatorPx: number } {
  assertSameSize(focused, unfocused, 'focus-indicator');
  const minDelta = opts.minDelta ?? 10; const ring = opts.ringPx ?? 2;
  const x0 = Math.max(0, Math.floor(region.x)); const y0 = Math.max(0, Math.floor(region.y));
  const x1 = Math.min(focused.width, Math.ceil(region.x + region.w)); const y1 = Math.min(focused.height, Math.ceil(region.y + region.h));
  const W = x1 - x0; const H = y1 - y0;
  if (W <= 0 || H <= 0) return { gate: 'focus-indicator', status: 'fail', detail: 'focus region lies outside the capture', indicatorPx: 0 };
  const mask = new Uint8Array(W * H);
  const ind: Rgb[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const o = ((y0 + y) * focused.width + (x0 + x)) * 4;
    if (channelDelta(focused.data, unfocused.data, o) > minDelta) { mask[y * W + x] = 1; ind.push([focused.data[o]!, focused.data[o + 1]!, focused.data[o + 2]!]); }
  }
  if (!ind.length) return { gate: 'focus-indicator', status: 'fail', value: 0, limit: t.focusMinContrast, detail: 'focus-invisible: focusing changes no pixel', indicatorPx: 0 };
  const adj: Rgb[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (mask[y * W + x]) continue;
    let near = false;
    for (let dy = -ring; dy <= ring && !near; dy++) for (let dx = -ring; dx <= ring && !near; dx++) {
      const yy = y + dy; const xx = x + dx;
      if (yy >= 0 && yy < H && xx >= 0 && xx < W && mask[yy * W + xx]) near = true;
    }
    if (near) { const o = ((y0 + y) * focused.width + (x0 + x)) * 4; adj.push([focused.data[o]!, focused.data[o + 1]!, focused.data[o + 2]!]); }
  }
  if (!adj.length) return { gate: 'focus-indicator', status: 'fail', detail: 'indicator fills the whole focus region; no adjacent pixels to compare', indicatorPx: ind.length };
  const ic = medianRgb(ind); const ac = medianRgb(adj);
  const ratio = contrastRatio(ic, ac);
  return { gate: 'focus-indicator', status: ratio >= t.focusMinContrast ? 'pass' : 'fail', value: ratio, limit: t.focusMinContrast, indicatorPx: ind.length,
    detail: `indicator rgb(${ic.map(Math.round).join(',')}) vs adjacent rgb(${ac.map(Math.round).join(',')}) = ${ratio.toFixed(2)}:1 (≥${t.focusMinContrast}:1 required, ${ind.length} indicator px)` };
}
