/* auraglass/no-transition-all — `transition: all`/`transition-property: all`
   smuggles animatables past the motion seam. Transitions must name the exact
   ANIMATABLE property list (motion-transition-allowlist covers membership;
   this rule bans the `all` wildcard itself), in CSS text and inline styles. */
'use strict';

const RE = /\btransition(?:-[a-z]+)?\s*:\s*[^;}"']*\ball\b/gi;
const KEY_RE = /^transition(?:Property)?$/;

function checkText(context, node, value) {
  if (typeof value !== 'string') return;
  for (const m of value.matchAll(RE)) {
    context.report({
      node,
      messageId: 'all',
      data: { found: m[0].trim() },
    });
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban `transition: all` — transitions must name animatable properties' },
    messages: { all: "`transition: all` is banned — name the exact properties (found '{{found}}')" },
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
        if (name === 'transition' || name === 'transitionProperty') {
          const v = node.value;
          if (v && v.type === 'Literal' && typeof v.value === 'string' && /\ball\b/.test(v.value)) {
            context.report({ node: v, messageId: 'all', data: { found: v.value } });
          }
        }
      },
    };
  },
  agConfig: [
    { files: ['src/**/*.{ts,tsx,js,jsx}', 'src/**/*.css'], ignores: ['dist/**', 'tokens/**'], severity: 'error' },
  ],
};
