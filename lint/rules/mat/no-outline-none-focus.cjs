/* auraglass/no-outline-none-focus — MAT-259. `focus:outline-none` /
   `focus-visible:outline-none` removes the visible focus indicator the a11y
   rungs guarantee (PRD §4.6). Flagged in TSX string literals and cn()/clsx()
   class arguments. */
'use strict';

const meta = {
  type: 'problem',
  docs: { description: 'Disallow focus:outline-none / focus-visible:outline-none classes.' },
  schema: [],
  messages: {
    outlineNone: "'{{klass}}' removes the visible focus indicator — the focus ring is guaranteed by a11y/css/focus.css.",
  },
};

const CLASS_RE = /(?:^|\s)(focus(?:-visible)?:outline-none)(?=\s|$)/g;

function create(context) {
  const reportString = (node, text) => {
    for (const m of text.matchAll(CLASS_RE)) {
      context.report({ node, messageId: 'outlineNone', data: { klass: m[1] } });
    }
  };
  // String literals everywhere (incl. cn()/clsx() arguments, which are literals).
  return {
    Literal(node) {
      if (typeof node.value === 'string') reportString(node, node.value);
    },
    TemplateLiteral(node) {
      for (const q of node.quasis) reportString(q, q.value.cooked ?? q.value.raw);
    },
  };
}

const agConfig = [
  {
    files: ['src/a11y/**/*.{ts,tsx}', 'src/theme/**/*.{ts,tsx}', 'src/material/**/*.{ts,tsx}'],
    severity: 'error',
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    ignores: ['**/*.test.*', '**/__tests__/**', 'tests/**'],
    severity: 'warn',
  },
];

module.exports = { meta, create, agConfig };
