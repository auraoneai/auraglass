/* auraglass/motion-no-hover-transform (MAT-226 REQ-MOT-62, JS half): whileHover/
   whileTap motion props are banned in src/** — hover/press state lives in the
   material layer's CSS scalars, never in per-component transforms. The CSS half
   (:hover transform rules) is enforced by scripts/ci/verify-motion-css.mjs. */
'use strict';
const { keyName } = require('./_helpers.cjs');

const BANNED = new Set(['whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView']);

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'No whileHover/whileTap transform props — state styling is CSS-owned.' },
    schema: [],
    messages: {
      hoverTransform: "'{{name}}' props are banned (REQ-MOT-62): hover/press feedback comes from --_ag-hover/--_ag-press scalars in src/motion/css, not per-component transforms.",
    },
  },
  create(context) {
    const report = (node, name) => context.report({ node, messageId: 'hoverTransform', data: { name } });
    return {
      JSXAttribute: (n) => { if (BANNED.has(n.name.name)) report(n, n.name.name); },
      Property: (n) => { const k = keyName(n); if (k && BANNED.has(k)) report(n, k); },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
