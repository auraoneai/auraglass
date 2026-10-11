/* auraglass/no-raw-design-values — the program's only raw-value rule (MAT-056/089).
   Flags literal design values (hex/rgb/oklch colors, blur px, border-radius px,
   box-shadow, ms/s in motion contexts, motion numeric keys, Tailwind duration/ease
   classes, cubic-bezier, linear() curves) so code must go through tokens. */
'use strict';

const { scanText, isExempt } = require('./_literals.cjs');

const meta = {
  type: 'problem',
  docs: { description: 'Disallow raw design values; use token vars and utilities.' },
  schema: [],
  messages: {
    raw: "Raw {{category}} value '{{literal}}' — use the token (var(--ag-*)) or generated output instead.",
  },
};

function create(context) {
  const filename = context.filename ?? context.getFilename?.() ?? '';
  return {
    Program(node) {
      if (isExempt(filename)) return;
      const text = context.sourceCode?.getText?.() ?? context.getSourceCode().getText();
      for (const hit of scanText(text, filename)) {
        const loc = context.sourceCode?.getLocFromIndex
          ? context.sourceCode.getLocFromIndex(hit.index)
          : context.getSourceCode().getLocFromIndex(hit.index);
        context.report({ node, loc: { start: loc, end: loc }, messageId: 'raw', data: { category: hit.category, literal: hit.literal } });
      }
    },
  };
}

/* REQ-MAT-18 (D.2-04): 'error' on the MAT-owned globs, 'warn' everywhere else
   in src/. Other streams escalate their own globs to 'error' by listing
   'no-raw-design-values' in lint/rules/<stream>/_strict.cjs. The literal
   ratchet (scripts/tokens/gates/literals.mjs, per-stream fragments) is what
   keeps the warned globs from growing. stylelint.config.mjs mirrors this split. */
const GENERATED = [
  'src/tokens/generated/**',
  'src/material/css/generated/**',
  'src/motion/tokens.generated.ts',
  '**/sys.palette.*',
];
const MAT_GLOBS = [
  'src/material/**',
  'src/motion/**',
  'src/theme/**',
  'src/a11y/**',
  'src/tokens/**',
  'src/styles/**',
  'src/hooks/**',
  'src/compat/mat/**',
];
const JS = '*.{ts,tsx,js,jsx,mts,cts}';

const agConfig = [
  { files: [`src/**/${JS}`], ignores: GENERATED, severity: 'warn' },
  { files: MAT_GLOBS.map((g) => `${g}/${JS}`), ignores: GENERATED, severity: 'error' },
];

module.exports = { meta, create, agConfig, MAT_GLOBS, GENERATED };
