/* Shared raw-design-value matchers for auraglass/no-raw-design-values
   (ESLint + stylelint) and the literals ratchet (MAT-056/058/059/089).
   Categories (SC-17): color | blur | radius | shadow | duration | easing | spring. */
'use strict';

const CATEGORIES = ['color', 'blur', 'radius', 'shadow', 'duration', 'easing', 'spring'];

const NUM = String.raw`\d+(?:\.\d+)?`;

/** [category, regex, context-filter] — scanned over source text / decl values. */
const RULES = [
  // color: hex literals, rgb(a)/hsl(a) with literal components, oklch() without `from`
  { category: 'color', re: /#[0-9a-fA-F]{3,8}\b/g },
  { category: 'color', re: new RegExp(String.raw`\b(?:rgb|rgba|hsl|hsla)\(\s*${NUM}`, 'g') },
  { category: 'color', re: /\boklch\((?!\s*from\s*var\()/g }, // oklch(from var(...)) is the allowed form
  // blur: blur(<n>px)
  { category: 'blur', re: new RegExp(String.raw`\bblur\(\s*${NUM}px`, 'g') },
  // MAT-062: the legacy gates flag every backdrop-filter declaration regardless
  // of value — a backdrop-filter (or its -webkit- form) counts as a blur-class
  // finding even when it only reads vars. Exception (`opticsOwner`): inside the
  // MAT optics owner (OPTICS_OWNER_GLOBS — the single sanctioned glass recipe of
  // REQ-MAT-39 and its a11y rungs) a declaration whose value carries no literal
  // (`none`, or only fallback-free var() / url(#id) references) is the recipe
  // itself, not a raw design value; a literal there still counts here and
  // through the blur(<n>px) matcher above.
  { category: 'blur', re: /\b(?:-webkit-)?backdrop-filter\s*:[^;}]+|\b(?:webkit)?backdropFilter\s*:\s*['"][^'"]+['"]/g, opticsOwner: true },
  // radius: border-radius/borderRadius with a px literal
  { category: 'radius', re: new RegExp(String.raw`\bborder-radius\s*:[^;}]*${NUM}px|\bborderRadius\s*:\s*['"]?[^,'"}]*${NUM}px`, 'g') },
  // shadow: literal box-shadow/boxShadow value (not var()/none/inherit)
  { category: 'shadow', re: /\bbox-shadow\s*:[^;}]+|\bboxShadow\s*:\s*['"][^'"]+['"]/g, test: (m) => /\d\s*(?:px|em|rem)/.test(m[0]) && !/^\s*box-shadow\s*:\s*(?:none|inherit)/.test(m[0]) },
  // duration: ms/s inside transition*/animation* contexts
  // A value whose every time is zero (`0s`, `0ms`: the calm/none/reduced-motion
  // resets) is not a design value — no duration token can own "no time".
  { category: 'duration', re: new RegExp(String.raw`\b(?:transition|transition-[a-z]+|animation|animation-[a-z]+)\s*:[^;}]*\b${NUM}m?s\b`, 'g'), test: (m) => new RegExp(String.raw`${NUM}m?s`).test(m[0]) && !/\d+(?:\.\d+)?\s*(?:px|rem|em|%)/.test(m[0].replace(/\d+(?:\.\d+)?m?s/g, '')) && !(m[0].match(new RegExp(String.raw`\b${NUM}m?s\b`, 'g')) ?? []).every((t) => parseFloat(t) === 0) },
  // duration: numeric motion keys (MAT-089) — outside src/motion/** only: the
  // motion adapter is where token-derived spring/tween objects are assembled.
  { category: 'duration', re: new RegExp(String.raw`\b(?:duration|delay|stiffness|damping|mass|bounce|visualDuration)\s*:\s*${NUM}\b`, 'g'), motionOnly: true },
  // duration: Tailwind duration-/delay- classes (outside src/motion/** only)
  { category: 'duration', re: /\b(?:duration|delay)-\d+\b/g, tailwind: true },
  // easing: cubic-bezier( + Tailwind ease- classes
  { category: 'easing', re: /\bcubic-bezier\(/g },
  { category: 'easing', re: /\bease-(?:linear|in|out|in-out|initial)\b/g, tailwind: true },
  // spring: literal linear() curves
  { category: 'spring', re: /\blinear\(\s*\d/g },
];

/** Files the raw-value rule never applies to (MAT-056/058). */
const EXEMPT_GLOBS = [
  'tokens/**',
  'src/tokens/generated/**',
  'src/material/css/generated/**',
  'src/motion/tokens.generated.ts',
  'dist/**',
  '**/sys.palette.*',
];

const globToRe = (glob) =>
  new RegExp(
    '^' +
      glob
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '[^/]*')
        .replace(//g, '.*') +
      '$',
  );

const EXEMPT_RES = EXEMPT_GLOBS.map(globToRe);

/** MAT optics owner (REQ-MAT-39: the material engine is the one glass recipe;
    src/a11y/css holds the rungs that switch it off). */
const OPTICS_OWNER_GLOBS = ['src/material/**', 'src/a11y/css/**'];
const OPTICS_OWNER_RES = OPTICS_OWNER_GLOBS.map(globToRe);

const normPath = (file) => file.replace(/\\/g, '/').replace(/^.*?(?=(?:tokens|src|tests|fragments|lint|dist|scripts)\/)/, '');

function isExempt(file) {
  const p = normPath(file);
  return EXEMPT_RES.some((re) => re.test(p));
}

const isOpticsOwner = (file) => OPTICS_OWNER_RES.some((re) => re.test(normPath(file)));

/** A backdrop-filter match whose value carries no literal: `none`, or only
    fallback-free var() / url(#id) references (the same test scanDecl applies). */
const literalFreeFilter = (match) => {
  const value = match.replace(/^[^:]*:\s*/, '').replace(/^['"]|['"]$/g, '').trim();
  return /^none$/i.test(value) || !/\d/.test(stripVarRefsText(value));
};
function stripVarRefsText(value) {
  let out = value;
  for (let prev = ''; prev !== out;) {
    prev = out;
    out = out.replace(/var\(\s*--[a-zA-Z0-9_-]+\s*\)/g, 'V');
  }
  return out.replace(/url\(\s*['"]?#[^)'"]*['"]?\s*\)/g, 'U');
}

/* Feature probes are capability tests, not design values: a CSS `@supports`
   prelude and the argument list of a `CSS.supports(…)` call (the PRD §4.5
   capFloor probe `(backdrop-filter: blur(1px))`) are blanked before matching,
   like comments. The rules of the block an @supports guards are still scanned. */
const PROBE_RE = /@supports\b[^{;]*|\bCSS\.supports\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)|\bcss\.supports\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)/g;
const blankProbes = (text) => text.replace(PROBE_RE, (m) => m.replace(/[^\n]/g, ' '));

/* Per-line allowance markers `// @ag-literal-allowed: <reason>` (MAT-056; the
   named-reason form is the clause FIN-E #308 / REQ-CMP-139 requested). Only the
   reasons below exist and each one is valid only inside its own path scope; an
   unknown reason or a marker outside its scope allows nothing.
     color-math  — src/theme/color.ts colour-space conversion constants (MAT-056)
     test-vector — literal input/expected data inside test files (e.g. hex parse
                   vectors); never production source. */
const ALLOWANCES = {
  'color-math': ['src/theme/color.ts'],
  'test-vector': ['**/*.test.{ts,tsx,js,jsx,mjs,cjs}', '**/__tests__/**', 'tests/**'],
};
const ALLOWANCE_RES = Object.fromEntries(
  Object.entries(ALLOWANCES).map(([reason, globs]) => [reason, globs.flatMap(expandBraces).map(globToRe)]),
);
function expandBraces(glob) {
  const m = glob.match(/\{([^}]+)\}/);
  return m ? m[1].split(',').flatMap((alt) => expandBraces(glob.replace(m[0], alt))) : [glob];
}
const MARKER_RE = /\/\/ @ag-literal-allowed: ([a-z-]+)(?![a-z-])/;

const lineIsAllowed = (file, line) => {
  const m = line.match(MARKER_RE);
  if (!m || !ALLOWANCE_RES[m[1]]) return false;
  const p = normPath(file);
  return ALLOWANCE_RES[m[1]].some((re) => re.test(p));
};

// Blank out comments in place (positions + newlines preserved) so literals
// inside comments never match. JS-ish files drop // and block comments; css drops block comments only.
function stripComments(text, file = '') {
  const css = /\.css$/i.test(normPath(file));
  return text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (m) => {
    if (css && m.startsWith('//')) return m; // `//` is not a comment in CSS
    return m.replace(/[^\n]/g, ' ');
  });
}

/**
 * Scan source text. Returns [{category, literal, index, line}].
 * Tailwind class and numeric motion-key matchers are skipped for files under
 * src/motion/** (MAT-089).
 */
function scanText(text, file = '') {
  const inMotion = /(^|\/)src\/motion\//.test(normPath(file));
  const owner = isOpticsOwner(file);
  const src = blankProbes(stripComments(text, file));
  const rawLines = text.split('\n');   // allowance markers live in comments — check the original
  const lines = src.split('\n');
  const lineOffsets = [];
  let off = 0;
  for (const l of lines) { lineOffsets.push(off); off += l.length + 1; }
  const lineOf = (idx) => lineOffsets.findIndex((o, i) => idx < (lineOffsets[i + 1] ?? Infinity)) ;
  const hits = [];
  for (const rule of RULES) {
    if ((rule.tailwind || rule.motionOnly) && inMotion) continue;
    for (const m of src.matchAll(rule.re)) {
      if (rule.test && !rule.test(m)) continue;
      if (rule.opticsOwner && owner && literalFreeFilter(m[0])) continue;
      const line = lineOf(m.index);
      if (lineIsAllowed(file, rawLines[line] ?? '')) continue;
      hits.push({ category: rule.category, literal: m[0].trim().slice(0, 80), index: m.index, line: line + 1 });
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}

/* Semantic non-design values (stylelint path only — scanDecl). These are not
   design decisions a token could own, so the stylelint rule accepts them; the
   literal ratchet (scripts/tokens/gates/literals.mjs, which scans through
   scanText) keeps counting every one of them, so tolerated literals stay
   gated by the ratchet, never silently by the lint rule:
     - a whole value of `none` (backdrop-filter / box-shadow / … fallbacks),
       `0` / `0s` / `0ms` (reduced-motion and motion=none resets),
       `transparent` or `currentColor` (also as comma lists of these);
     - a backdrop-filter list whose every argument is a fallback-free
       var() reference (or a url(#id) filter reference): it reads tokens or
       private --_ag-* scalars and carries no literal. A var() fallback
       literal is still a literal, so `var(--x, 12px)` stays flagged;
     - mask stops `#000` / `#000000` with an explicit `0 0` position in a
       mask / mask-image list: mask stops are alpha-only and carry no colour
       (prefer the `black` keyword, which never matches). */
const SEMANTIC_WORD = /^(?:none|0|0s|0ms|transparent|currentcolor)$/i;
const isSemanticValue = (value) =>
  value.split(',').every((part) => SEMANTIC_WORD.test(part.trim()));
const stripVarRefs = (value) => {
  let out = value;
  for (let prev = ''; prev !== out;) {
    prev = out;
    out = out.replace(/var\(\s*--[a-zA-Z0-9_-]+\s*\)/g, 'V');
  }
  return out.replace(/url\(\s*['"]?#[^)'"]*['"]?\s*\)/g, 'U');
};
const isVarOnlyFilter = (prop, value) =>
  /^(?:-webkit-)?backdrop-filter$/i.test(prop) && !/\d/.test(stripVarRefs(value));
const MASK_STOP = /#0{3}(?:0{3})?(?=\s+0\s+0\b)/g;
const isMaskProp = (prop) => /^(?:-webkit-)?mask(?:-image)?$/i.test(prop);

/**
 * Scan one CSS declaration (stylelint / postcss path). prop+value level:
 * radius/shadow/duration checks need the property name. Semantic non-design
 * values (see SEMANTIC_WORD above) are accepted here and only here.
 */
function scanDecl(prop, value, file = '') {
  const inMotion = /(^|\/)src\/motion\//.test(normPath(file));
  const hits = [];
  if (isSemanticValue(value) || isVarOnlyFilter(prop, value)) return hits;
  const push = (category, literal) => hits.push({ category, literal });
  const scanned = isMaskProp(prop) ? value.replace(MASK_STOP, 'black') : value;
  const text = `${prop}: ${scanned}`;
  for (const rule of RULES) {
    if ((rule.tailwind || rule.motionOnly) && inMotion) continue;
    for (const m of text.matchAll(rule.re)) {
      if (rule.test && !rule.test(m)) continue;
      push(rule.category, m[0].trim().slice(0, 80));
    }
  }
  return hits;
}

/** per-file {category: count} map from a list of hits. */
function countByCategory(hits) {
  const out = {};
  for (const h of hits) out[h.category] = (out[h.category] ?? 0) + 1;
  return out;
}

module.exports = { CATEGORIES, EXEMPT_GLOBS, ALLOWANCES, OPTICS_OWNER_GLOBS, isExempt, isOpticsOwner, lineIsAllowed, scanText, scanDecl, countByCategory };
