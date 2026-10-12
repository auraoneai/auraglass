/* tests/dx/lib/layout-assert.ts — REQ-PLAT-97. Pure helpers for the registry
   render gate (tests/dx/registry-render.spec.ts): the layout.assert.json
   schema, the required landmark set per item kind, the primary-mobile-control
   selector and a small, safe evaluator for geometric predicates such as
   `sidebar.x + sidebar.width <= main.x` or `abs(sidebar.y - main.y) <= 1`.
   No eval/Function: the expression is tokenised and parsed here. */

export interface Box { x: number; y: number; width: number; height: number }

export interface LayoutPredicate {
  /** Expression over named boxes, e.g. `sidebar.x + sidebar.width <= main.x`. */
  assert: string;
  /** Only evaluated when the viewport width is within [minWidth, maxWidth]. */
  minWidth?: number;
  maxWidth?: number;
}

export interface LayoutAssert {
  subject?: string;
  overflow?: { horizontal?: boolean };
  touchTargets?: { default?: number; mobilePrimary?: number };
  landmarks?: string[];
  /** name -> CSS selector; the first visible match is measured. */
  boxes?: Record<string, string>;
  predicates?: LayoutPredicate[];
  [k: string]: unknown;
}

/** Landmark set a block must expose when its layout.assert.json names none (PRD REQ-PLAT-97). */
export const BLOCK_LANDMARKS = ['banner', 'navigation', 'main'] as const;

/** Implicit-role selectors for each landmark name (explicit role always counts). */
export const LANDMARK_SELECTORS: Record<string, string> = {
  banner: 'header:not(main header, article header, aside header, nav header, section header), [role="banner"]',
  navigation: 'nav, [role="navigation"]',
  main: 'main, [role="main"]',
  complementary: 'aside, [role="complementary"]',
  contentinfo: 'footer:not(main footer, article footer, aside footer, nav footer, section footer), [role="contentinfo"]',
  form: 'form, [role="form"]',
  region: 'section[aria-label], section[aria-labelledby], [role="region"]',
  search: 'search, [role="search"]',
};

export const landmarkSelector = (name: string): string => LANDMARK_SELECTORS[name] ?? `[role="${name}"], ${name}`;

/** Controls that must be ≥44×44 CSS px at a mobile viewport ("primary mobile controls");
    every other control must be ≥24×24. */
export const PRIMARY_MOBILE_CONTROLS = [
  '[data-ag-prominent]', '[data-ag-intent="primary"]', 'button[type="submit"]', 'input[type="submit"]',
  'header button', '[role="banner"] button', 'nav a[href]', 'nav button', '[role="navigation"] a[href]',
  '[role="navigation"] button', '[role="tablist"] [role="tab"]',
].join(', ');

export const CONTROL_SELECTOR = 'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"], [role="menuitem"], [role="option"]';

/** Tab stops: natively focusable or tabindex>=0, not disabled, not roving (tabindex=-1). */
export const TAB_STOP_SELECTOR = [
  'a[href]', 'button', 'input:not([type="hidden"])', 'select', 'textarea', 'summary', '[tabindex]', '[contenteditable="true"]',
].map((s) => `${s}:not([disabled]):not([tabindex^="-"])`).join(', ');

export function requiredLandmarks(kind: 'block' | 'item', la: LayoutAssert | null): { landmarks: string[]; oneH1: boolean } {
  if (la?.landmarks && la.landmarks.length) return { landmarks: [...la.landmarks], oneH1: kind === 'block' };
  return { landmarks: kind === 'block' ? [...BLOCK_LANDMARKS] : [], oneH1: kind === 'block' };
}

export function predicatesFor(la: LayoutAssert | null, viewportWidth: number): LayoutPredicate[] {
  return (la?.predicates ?? []).filter((p) => (p.minWidth === undefined || viewportWidth >= p.minWidth) && (p.maxWidth === undefined || viewportWidth <= p.maxWidth));
}

/** Names a predicate expression references (`<name>.<prop>`). */
export function referencedBoxes(expr: string): string[] {
  return [...new Set([...expr.matchAll(/\b([a-zA-Z_][\w-]*)\.(x|y|width|height|right|bottom)\b/g)].map((m) => m[1]!))];
}

export function validateLayoutAssert(la: LayoutAssert): string[] {
  const errs: string[] = [];
  for (const [i, p] of (la.predicates ?? []).entries()) {
    if (typeof p.assert !== 'string' || !p.assert.trim()) { errs.push(`predicates[${i}]: assert must be a non-empty string`); continue; }
    try { parse(p.assert); } catch (e) { errs.push(`predicates[${i}]: ${(e as Error).message}`); }
    for (const n of referencedBoxes(p.assert)) if (!la.boxes?.[n]) errs.push(`predicates[${i}]: box '${n}' has no selector in boxes`);
  }
  return errs;
}

/* ------------------------------------------------------------ evaluator */
type Tok = { t: 'num'; v: number } | { t: 'ref'; box: string; prop: string } | { t: 'fn'; v: 'abs' | 'min' | 'max' } | { t: 'op'; v: string };
type Node =
  | { k: 'num'; v: number }
  | { k: 'ref'; box: string; prop: string }
  | { k: 'call'; fn: 'abs' | 'min' | 'max'; args: Node[] }
  | { k: 'neg'; a: Node }
  | { k: 'bin'; op: string; a: Node; b: Node };

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  const re = /\s*(?:(\d+(?:\.\d+)?)|(abs|min|max)(?=\s*\()|([a-zA-Z_][\w-]*)\.(x|y|width|height|right|bottom)\b|(<=|>=|==|<|>|[-+*/(),]))/y;
  let i = 0;
  while (i < src.length) {
    if (/^\s*$/.test(src.slice(i))) break;
    re.lastIndex = i;
    const m = re.exec(src);
    if (!m) throw new Error(`unexpected input at ${i}: '${src.slice(i, i + 12)}'`);
    if (m[1] !== undefined) out.push({ t: 'num', v: Number(m[1]) });
    else if (m[2] !== undefined) out.push({ t: 'fn', v: m[2] as 'abs' | 'min' | 'max' });
    else if (m[3] !== undefined) out.push({ t: 'ref', box: m[3], prop: m[4]! });
    else out.push({ t: 'op', v: m[5]! });
    i = re.lastIndex;
  }
  return out;
}

function parse(src: string): Node {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => { const t = peek(); return t?.t === 'op' && t.v === v; };
  const expect = (v: string) => { if (!isOp(v)) throw new Error(`expected '${v}' in '${src}'`); p++; };
  const primary = (): Node => {
    const t = toks[p++];
    if (!t) throw new Error(`unexpected end of '${src}'`);
    if (t.t === 'num') return { k: 'num', v: t.v };
    if (t.t === 'ref') return { k: 'ref', box: t.box, prop: t.prop };
    if (t.t === 'fn') {
      expect('(');
      const args = [additive()];
      while (isOp(',')) { p++; args.push(additive()); }
      expect(')');
      if (t.v === 'abs' && args.length !== 1) throw new Error('abs() takes one argument');
      return { k: 'call', fn: t.v, args };
    }
    if (t.v === '(') { const e = additive(); expect(')'); return e; }
    if (t.v === '-') return { k: 'neg', a: primary() };
    throw new Error(`unexpected '${t.v}' in '${src}'`);
  };
  const multiplicative = (): Node => {
    let a = primary();
    while (isOp('*') || isOp('/')) { const op = (toks[p++] as { v: string }).v; a = { k: 'bin', op, a, b: primary() }; }
    return a;
  };
  function additive(): Node {
    let a = multiplicative();
    while (isOp('+') || isOp('-')) { const op = (toks[p++] as { v: string }).v; a = { k: 'bin', op, a, b: multiplicative() }; }
    return a;
  }
  const left = additive();
  const cmp = peek();
  if (!cmp || cmp.t !== 'op' || !['<=', '>=', '==', '<', '>'].includes(cmp.v)) throw new Error(`'${src}' must be a comparison (<=, >=, ==, <, >)`);
  p++;
  const right = additive();
  if (p !== toks.length) throw new Error(`trailing input in '${src}'`);
  return { k: 'bin', op: cmp.v, a: left, b: right };
}

function value(n: Node, boxes: Record<string, Box | null>): number {
  switch (n.k) {
    case 'num': return n.v;
    case 'neg': return -value(n.a, boxes);
    case 'ref': {
      const b = boxes[n.box];
      if (!b) throw new Error(`box '${n.box}' not found`);
      if (n.prop === 'right') return b.x + b.width;
      if (n.prop === 'bottom') return b.y + b.height;
      return b[n.prop as keyof Box];
    }
    case 'call': {
      const vs = n.args.map((a) => value(a, boxes));
      return n.fn === 'abs' ? Math.abs(vs[0]!) : n.fn === 'min' ? Math.min(...vs) : Math.max(...vs);
    }
    case 'bin': {
      const a = value(n.a, boxes), b = value(n.b, boxes);
      if (n.op === '+') return a + b;
      if (n.op === '-') return a - b;
      if (n.op === '*') return a * b;
      if (n.op === '/') return a / b;
      throw new Error(`comparison '${n.op}' used as a value`);
    }
  }
}

/** Evaluates one predicate; a missing box or malformed expression is a failure, never a pass. */
export function evalPredicate(expr: string, boxes: Record<string, Box | null>): { pass: boolean; detail: string } {
  let root: Node;
  try { root = parse(expr); } catch (e) { return { pass: false, detail: `invalid predicate: ${(e as Error).message}` }; }
  if (root.k !== 'bin') return { pass: false, detail: `invalid predicate '${expr}'` };
  try {
    const a = value(root.a, boxes), b = value(root.b, boxes);
    const pass = root.op === '<=' ? a <= b : root.op === '>=' ? a >= b : root.op === '<' ? a < b : root.op === '>' ? a > b : Math.abs(a - b) < 1e-9;
    return { pass, detail: `${expr}: ${round(a)} ${root.op} ${round(b)}` };
  } catch (e) {
    return { pass: false, detail: `${expr}: ${(e as Error).message}` };
  }
}

const round = (v: number) => Math.round(v * 100) / 100;
