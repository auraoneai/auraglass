/* Shared REQ-MAT-39 optics patterns for the CSS scanner and recipe counter.
   Keep in sync with lint/rules/mat/no-optics-outside-material.cjs. */

export const OPTICS_PATTERNS = [
  { id: 'backdrop-filter', re: /backdrop-filter|-webkit-backdrop-filter/i, label: 'backdrop-filter declaration' },
  { id: 'backdrop-key', re: /\b(?:backdropFilter|WebkitBackdropFilter)\s*:/, label: 'backdropFilter style key' },
  { id: 'white-rgba', re: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/, label: 'white glass rgba() tint' },
  { id: 'blur-literal', re: /\bblur\(\s*\d/, label: 'blur() literal' },
  { id: 'saturate-literal', re: /\bsaturate\(\s*\d/, label: 'saturate() literal' },
  { id: 'specular-gradient', re: /linear-gradient\([^)]*rgba\(255,\s*255,\s*255/, label: 'white specular gradient' },
];

/** Emits a real backdrop filter: declaration in CSS or style key in JS/TS. */
export const EMITTER_PATTERNS = [
  /backdrop-filter\s*:/i,
  /-webkit-backdrop-filter\s*:/i,
  /\b(?:backdropFilter|WebkitBackdropFilter)\s*:/,
];

export const matchPatterns = (text) =>
  OPTICS_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.id);

export const emitsBackdropFilter = (text) =>
  EMITTER_PATTERNS.some((re) => re.test(text));
