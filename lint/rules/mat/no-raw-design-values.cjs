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

const agConfig = [
  {
    files: ['src/**/*.{ts,tsx,js,jsx,mts,cts}'],
    ignores: [
      'src/tokens/generated/**',
      'src/material/css/generated/**',
      'src/motion/tokens.generated.ts',
      '**/sys.palette.*',
    ],
    severity: 'error',
  },
];

module.exports = { meta, create, agConfig };
