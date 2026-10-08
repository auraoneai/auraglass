/* auraglass/no-optics-outside-material — REQ-MAT-39 (was no-inline-glass, SC-16).
   Outside src/material/**, tokens/** and generated CSS, no code may emit backdrop
   filters, white-glass rgba() tints, blur()/saturate() literals or white specular
   gradients. Stories and tests are not exempt; the rule's own test file is. */
'use strict';

const PATTERNS = [
  { re: /backdrop-filter|-webkit-backdrop-filter/i, label: 'backdrop-filter declaration' },
  { re: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/, label: 'white glass rgba() tint' },
  { re: /\bblur\(\s*\d/, label: 'blur() literal' },
  { re: /\bsaturate\(\s*\d/, label: 'saturate() literal' },
  { re: /linear-gradient\([^)]*rgba\(255,\s*255,\s*255/, label: 'white specular gradient' },
];

const OPTICS_KEYS = new Set(['backdropFilter', 'WebkitBackdropFilter']);

/** Paths that are allowed to carry optics code (posix-style relative paths). */
const EXEMPT = [
  /(^|\/)src\/material\//,              // the material engine owns all optics
  /(^|\/)tokens\//,                     // token sources carry blur()/colour values
  /(^|\/)generated\//,                  // generated outputs (incl. token CSS, tailwind bridge)
  /(^|\/)dist\//,
  /tailwind[^/]*\.(css|ts|mjs|cjs)$/,   // the generated Tailwind bridge
  /(^|\/)tests\/lint\/mat\//,           // this rule's own RuleTester fixtures live here
  /(^|\/)legacy\//,                     // quarantined 4.x tree (PLAT-owned)
];

const norm = (f) => (typeof f === 'string' ? f.replace(/\\/g, '/') : '');
const isExempt = (filename) => {
  const f = norm(filename);
  return f === '' || f === '<input>' || EXEMPT.some((re) => re.test(f));
};

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Forbid material optics (backdrop filters, glass rgba/blur/saturate literals, specular gradients) outside src/material/**' },
    schema: [],
    messages: {
      key: "'{{name}}' is a material optic; emit it only inside src/material/** (REQ-MAT-39).",
      pattern: '{{label}} is a material optic; emit it only inside src/material/** (REQ-MAT-39).',
    },
  },
  create(context) {
    if (isExempt(context.filename ?? context.getFilename?.())) return {};
    const report = (node, label) =>
      context.report({ node, messageId: 'pattern', data: { label } });
    const checkText = (node, text) => {
      if (typeof text !== 'string') return;
      const hit = PATTERNS.find((p) => p.re.test(text));
      if (hit) report(node, hit.label);
    };
    return {
      Property(node) {
        const key = node.key;
        if (!key || node.computed) {
          return;
        }
        const name = key.type === 'Identifier' ? key.name : key.value;
        if (OPTICS_KEYS.has(name)) {
          context.report({ node: key, messageId: 'key', data: { name } });
        }
      },
      Literal(node) {
        checkText(node, node.value);
      },
      TemplateLiteral(node) {
        for (const quasi of node.quasis) checkText(quasi, quasi.value.cooked ?? quasi.value.raw);
      },
      // CSS-in-JS / tagged templates and JSON-ish string args are covered by the two
      // visitors above; template *expressions* are not scanned (they are values, not optics).
    };
  },
  agConfig: [
    {
      // Ratchet registration (§20 step 2): warn over src/** until each migrated family
      // graduates to 'error' via lint/rules/mat/_strict.cjs (MAT-180).
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      ignores: [],
      severity: 'warn',
    },
  ],
};
