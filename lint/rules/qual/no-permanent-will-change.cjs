/* auraglass/no-permanent-will-change — `will-change` may only appear behind a
   transient animation flag (inline style computed from state). A bare
   `will-change:` declaration in CSS text or a static style object keeps the
   compositor layer alive forever. */
'use strict';

const RE = /\bwill-change\s*:/g;
const KEY_RE = /^willChange$/;

function checkText(context, node, value) {
  if (typeof value !== 'string') return;
  if (RE.test(value)) {
    context.report({ node, messageId: 'wc', data: {} });
  }
  RE.lastIndex = 0;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban permanent will-change declarations' },
    messages: { wc: '`will-change` in static CSS/styles is banned — apply it transiently from animation state only' },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        checkText(context, node, node.value);
      },
      TemplateLiteral(node) {
        for (const q of node.quasis) checkText(context, q, q.value.cooked ?? q.value.raw);
      },
      Property(node) {
        const key = node.key;
        const name = key && !node.computed ? (key.type === 'Identifier' ? key.name : key.value) : undefined;
        if (name === 'willChange') {
          const v = node.value;
          // allow conditional/animated sources — only literals are permanent
          if (v && v.type === 'Literal') {
            context.report({ node: v, messageId: 'wc', data: {} });
          }
        }
      },
    };
  },
  agConfig: [
    { files: ['src/**/*.{ts,tsx,js,jsx}', 'src/**/*.css'], ignores: ['dist/**'], severity: 'error' },
  ],
};
