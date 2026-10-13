// SURF-149/253 — REQ-SURF-03 (REQ-FIN-80): every SURF css file under every
// SURF css root is declared in fragments/css/surf.ts, starts with
// LAYER_ORDER_STATEMENT, keeps all of its rules inside exactly one
// registered layer block (ag.components or ag.a11y), and has no !important / hex / physical
// properties (logical-properties rule) / raw duration or rem literals outside
// var() fallbacks.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { LAYER_ORDER_STATEMENT } from '../../../src/contracts/tokens';
import surfCss from '../../../fragments/css/surf';

const ROOT = process.cwd();
const PHYSICAL = /(?<![a-z-])(?:left|right|top|bottom|margin-left|margin-right|margin-top|margin-bottom|padding-left|padding-right|padding-top|padding-bottom|border-left|border-right|border-top|border-bottom|inset-left|inset-right)\s*:/;

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules') continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p;
  }
}

/* Every SURF-owned css root (PRD-F §6 FIN-F row) — W1 (app-shell + the 6
   flagship component sheets), W2 (data/date/charts/timeline), W3 (ai), W4
   (media + backdrops incl. presets). */
const SURF_CSS_ROOTS = [
  'src/app-shell', 'src/data', 'src/date', 'src/charts',
  'src/components/timeline', 'src/components/tabs', 'src/components/tab-bar',
  'src/components/breadcrumbs', 'src/components/pagination',
  'src/components/command-palette', 'src/components/source-transition',
  'src/ai', 'src/media', 'src/backdrops',
];
/* SURF roots that ship no css today; scanned so a css file added there is
   gated the moment it lands. */
const SURF_OTHER_ROOTS = ['src/three', 'src/compat/surf', 'packages/labs'];

const rel = (f: string) => relative(ROOT, f).replace(/\\/g, '/');
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '');
/* Remove var(...) spans, innermost first, so nested fallbacks
   (var(--a, var(--b, 1rem))) are stripped completely. */
const stripVars = (s: string) => {
  let prev: string;
  do { prev = s; s = s.replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ''); } while (s !== prev);
  return s;
};

const registered = new Map(surfCss.map((row) => [row.file as string, row]));

describe('SURF css discipline (SURF-149, REQ-SURF-03)', () => {
  const byRoot = new Map<string, string[]>();
  for (const d of [...SURF_CSS_ROOTS, ...SURF_OTHER_ROOTS]) byRoot.set(d, [...walk(join(ROOT, d))].map(rel));
  const files = [...byRoot.values()].flat();

  it('scans every SURF css root (each W1–W4 root contributes files)', () => {
    const empty = SURF_CSS_ROOTS.filter((d) => byRoot.get(d)!.length === 0);
    expect(empty).toEqual([]);
  });
  it('every SURF css file is declared in the fragment (0 orphans)', () => {
    const orphans = files.filter((f) => !registered.has(f));
    expect(orphans).toEqual([]);
  });
  it('every file starts with LAYER_ORDER_STATEMENT (0 missing layer-order lines)', () => {
    const bad = files.filter((f) => !readFileSync(join(ROOT, f), 'utf8').startsWith(LAYER_ORDER_STATEMENT + '\n'));
    expect(bad).toEqual([]);
  });
  it('no @import and balanced braces (the build concatenates fragment rows)', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8')).replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
      if (/@import\b/.test(src)) bad.push(`${f}: @import`);
      let depth = 0;
      for (const c of src) {
        if (c === '{') depth++;
        else if (c === '}' && --depth < 0) break;
      }
      if (depth !== 0) bad.push(`${f}: unbalanced braces (${depth})`);
    }
    expect(bad).toEqual([]);
  });
  it('every rule sits inside exactly one block of its registered layer', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8')).slice(LAYER_ORDER_STATEMENT.length);
      const layer = registered.get(f)?.layer;
      const blocks = [...src.matchAll(/@layer\s+([\w.-]+)\s*\{/g)];
      if (blocks.length !== 1 || blocks[0]?.[1] !== layer) {
        bad.push(`${f}: expected one ${layer ?? 'registered'} block, found ${blocks.map((m) => m[1]).join(', ')}`);
        continue;
      }
      const open = blocks[0]!.index!;
      /* Nothing but whitespace before the block, and the block's closing brace
         is the last non-whitespace character of the file. */
      if (src.slice(0, open).trim() !== '') bad.push(`${f}: content before the layer block`);
      let depth = 0;
      let end = -1;
      for (let i = open; i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}' && --depth === 0) { end = i; break; }
      }
      if (end < 0 || src.slice(end + 1).trim() !== '') bad.push(`${f}: content after the layer block`);
    }
    expect(bad).toEqual([]);
  });
  it('only its registered component or accessibility layer is allowed', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8'));
      const expected = registered.get(f)?.layer;
      if (expected !== 'ag.components' && expected !== 'ag.a11y') bad.push(`${f}: invalid registered layer ${expected}`);
      /* Layer BLOCKS end with '{'; the frozen order statement ends with ';'. */
      for (const m of src.matchAll(/@layer\s+([a-zA-Z0-9_.,\s-]+?)\s*\{/g)) {
        const names = m[1]!.trim();
        if (names !== expected) bad.push(`${f}: @layer ${names} {`);
      }
      /* Any other layer statement than the frozen one is a stray layer. */
      for (const m of src.matchAll(/@layer\s+[^;{]+;/g)) {
        if (m[0] !== LAYER_ORDER_STATEMENT) bad.push(`${f}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });
  it('no !important, no hex literals, no physical properties, no raw duration/rem literals', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8'));
      if (/!important/.test(src)) bad.push(`${f}: !important`);
      if (/#[0-9a-fA-F]{3,8}\b/.test(src)) bad.push(`${f}: hex literal`);
      if (PHYSICAL.test(src)) bad.push(`${f}: physical property`);
      /* Raw duration/rem literals must ride a var(--ag-*|--_ag-*) fallback. */
      for (const m of stripVars(src).matchAll(/(?<![\w-])\d*\.?\d+(?:ms|s|rem)\b/g)) bad.push(`${f}: literal ${m[0]}`);
    }
    expect(bad).toEqual([]);
  });
  /* REQ-SURF-03: optics are MAT's — SURF css declares no backdrop-filter or
     filter at all (forced colours / reduced transparency drop the backdrop
     in material.css). */
  it('no backdrop-filter / filter declarations', () => {
    const bad: string[] = [];
    for (const f of files) {
      for (const d of declarations(stripComments(readFileSync(join(ROOT, f), 'utf8')))) {
        if (/^(?:-webkit-)?(?:backdrop-)?filter$/.test(d.prop)) bad.push(`${f}: ${d.prop}: ${d.value}`);
      }
    }
    expect(bad).toEqual([]);
  });
  it('no colour, blur or radius literals outside var() fallbacks', () => {
    const bad: string[] = [];
    for (const f of files) {
      for (const d of declarations(stripComments(readFileSync(join(ROOT, f), 'utf8')))) {
        if (d.prop.startsWith('--')) continue; // private var definitions are checked where they are read
        const v = stripVars(d.value);
        /* mask stops are alpha, not paint: `black` there is an opacity stop */
        const paints = !/^(?:-webkit-)?mask/.test(d.prop);
        if (paints && COLOUR_FN.test(v)) bad.push(`${f}: colour function in ${d.prop}: ${d.value}`);
        if (paints && NAMED_COLOUR.test(v)) bad.push(`${f}: named colour in ${d.prop}: ${d.value}`);
        if (/\bblur\(/.test(v)) bad.push(`${f}: blur() in ${d.prop}`);
        if (/radius$/.test(d.prop) && /(?<![\w-])\d*\.?[1-9]\d*(?:\.\d+)?(?:px|rem|em|%)?(?![\w-])/.test(v)) {
          bad.push(`${f}: radius literal ${d.prop}: ${d.value}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
  it('no global element selectors (every rule is anchored on an ag class or S-01 attribute)', () => {
    const bad: string[] = [];
    for (const f of files) {
      for (const sel of selectors(stripComments(readFileSync(join(ROOT, f), 'utf8')))) {
        if (GLOBAL_LEAD.test(sel)) bad.push(`${f}: ${sel}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

/* rgb()/hsl()/oklch()/… colour functions (relative `oklch(from var(--ag-…))`
   reads a token, so it is allowed). */
const COLOUR_FN = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\((?!\s*from\b)/;
const NAMED_COLOUR = /(?<![\w-])(?:white|black|red|green|blue|gray|grey|yellow|orange|purple|pink|silver|navy|teal|maroon|olive|lime|aqua|fuchsia)(?![\w-])/i;
/* A selector whose leading compound is a bare element, `*`, html/body or
   :root (not scoped under an .ag-* class or a [data-*] attribute). */
const GLOBAL_LEAD = /^(?:\*|html|body|:root|[a-z][a-z0-9]*)(?=$|[\s>+~:.[#])/i;

function declarations(src: string): { prop: string; value: string }[] {
  const out: { prop: string; value: string }[] = [];
  for (const m of src.matchAll(/(?<=[{;]\s*)(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]+)(?=[;}])/g)) {
    out.push({ prop: m[1]!.toLowerCase(), value: m[2]!.trim() });
  }
  return out;
}

/** Top-level selector list items of every style rule (keyframe stops and @-rule preludes excluded). */
function selectors(src: string): string[] {
  const out: string[] = [];
  const keyframeDepths = new Set<number>();
  let depth = 0;
  let buf = '';
  for (const ch of src) {
    if (ch === '{') {
      const header = buf.trim();
      buf = '';
      if (header.startsWith('@')) {
        if (/^@(?:-webkit-)?keyframes\b/.test(header)) keyframeDepths.add(depth + 1);
      } else if (header && !keyframeDepths.has(depth)) {
        out.push(...splitTopLevel(header));
      }
      depth++;
    } else if (ch === '}') {
      keyframeDepths.delete(depth);
      depth--;
      buf = '';
    } else if (ch === ';') {
      buf = '';
    } else {
      buf += ch;
    }
  }
  return out.map((s) => s.trim()).filter(Boolean);
}

function splitTopLevel(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of list) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur);
  return parts;
}
