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
  // finding even when it only reads vars.
  { category: 'blur', re: /\b(?:-webkit-)?backdrop-filter\s*:[^;}]+|\b(?:webkit)?backdropFilter\s*:\s*['"][^'"]+['"]/g },
  // radius: border-radius/borderRadius with a px literal
  { category: 'radius', re: new RegExp(String.raw`\bborder-radius\s*:[^;}]*${NUM}px|\bborderRadius\s*:\s*['"]?[^,'"}]*${NUM}px`, 'g') },
  // shadow: literal box-shadow/boxShadow value (not var()/none/inherit)
  { category: 'shadow', re: /\bbox-shadow\s*:[^;}]+|\bboxShadow\s*:\s*['"][^'"]+['"]/g, test: (m) => /\d\s*(?:px|em|rem)/.test(m[0]) && !/^\s*box-shadow\s*:\s*(?:none|inherit)/.test(m[0]) },
  // duration: ms/s inside transition*/animation* contexts
  { category: 'duration', re: new RegExp(String.raw`\b(?:transition|transition-[a-z]+|animation|animation-[a-z]+)\s*:[^;}]*\b${NUM}m?s\b`, 'g'), test: (m) => new RegExp(String.raw`${NUM}m?s`).test(m[0]) && !/\d+(?:\.\d+)?\s*(?:px|rem|em|%)/.test(m[0].replace(/\d+(?:\.\d+)?m?s/g, '')) },
  // duration: numeric motion keys (MAT-089)
  { category: 'duration', re: new RegExp(String.raw`\b(?:duration|delay|stiffness|damping|mass|bounce|visualDuration)\s*:\s*${NUM}\b`, 'g') },
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

const normPath = (file) => file.replace(/\\/g, '/').replace(/^.*?(?=(?:tokens|src|tests|fragments|lint|dist|scripts)\/)/, '');

function isExempt(file) {
  const p = normPath(file);
  return EXEMPT_RES.some((re) => re.test(p));
}

/** Lines allowed to carry literals: `// @ag-literal-allowed: color-math` (src/theme/color.ts only, MAT-056). */
const lineIsAllowed = (file, line) =>
  normPath(file) === 'src/theme/color.ts' && line.includes('// @ag-literal-allowed: color-math');

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
 * Tailwind class matchers are skipped for files under src/motion/** (MAT-089).
 */
function scanText(text, file = '') {
  const inMotion = /(^|\/)src\/motion\//.test(normPath(file));
  const src = stripComments(text, file);
  const rawLines = text.split('\n');   // allowance markers live in comments — check the original
  const lines = src.split('\n');
  const lineOffsets = [];
  let off = 0;
  for (const l of lines) { lineOffsets.push(off); off += l.length + 1; }
  const lineOf = (idx) => lineOffsets.findIndex((o, i) => idx < (lineOffsets[i + 1] ?? Infinity)) ;
  const hits = [];
  for (const rule of RULES) {
    if (rule.tailwind && inMotion) continue;
    for (const m of src.matchAll(rule.re)) {
      if (rule.test && !rule.test(m)) continue;
      const line = lineOf(m.index);
      if (lineIsAllowed(file, rawLines[line] ?? '')) continue;
      hits.push({ category: rule.category, literal: m[0].trim().slice(0, 80), index: m.index, line: line + 1 });
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}

/**
 * Scan one CSS declaration (stylelint / postcss path). prop+value level:
 * radius/shadow/duration checks need the property name.
 */
function scanDecl(prop, value, file = '') {
  const inMotion = /(^|\/)src\/motion\//.test(normPath(file));
  const hits = [];
  const push = (category, literal) => hits.push({ category, literal });
  const text = `${prop}: ${value}`;
  for (const rule of RULES) {
    if (rule.tailwind && inMotion) continue;
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

module.exports = { CATEGORIES, EXEMPT_GLOBS, isExempt, scanText, scanDecl, countByCategory };
