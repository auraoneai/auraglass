/* auraglass/motion-no-ungated-loop (MAT-230 REQ-MOT-66, JS half): an infinite
   animation is legal only when gated by usePreference('allowContinuous'). The
   CSS half (infinite iteration without [data-ag-continuous="on"]) is in
   verify-motion-css.mjs. */
'use strict';
const { keyName } = require('./_helpers.cjs');

const LOOP_KEYS = new Set(['repeat', 'iterations', 'iterationCount', 'animationIterationCount']);
const GATE = /usePreference\(\s*['"]allowContinuous['"]\s*\)/;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Infinite loops require the allowContinuous gate.' },
    schema: [],
    messages: {
      ungated: "Infinite animation is not gated by usePreference('allowContinuous') (REQ-MOT-66): every loop resolves off unless the user opted in and motion is 'full'.",
    },
  },
  create(context) {
    const gated = GATE.test(context.sourceCode.getText());
    if (gated) return {};
    const isInf = (v) =>
      (v?.type === 'Literal' && (v.value === Infinity || String(v.value) === 'Infinity'))
      || (v?.type === 'UnaryExpression' && v.operator === '+' && v.argument?.name === 'Infinity')
      || (v?.type === 'Identifier' && v.name === 'Infinity');
    return {
      Property: (n) => {
        if (LOOP_KEYS.has(keyName(n) ?? '') && isInf(n.value)) {
          context.report({ node: n, messageId: 'ungated' });
        }
      },
      JSXAttribute: (n) => {
        if (!LOOP_KEYS.has(n.name.name)) return;
        const e = n.value?.type === 'JSXExpressionContainer' ? n.value.expression : null;
        if (e && isInf(e)) context.report({ node: n, messageId: 'ungated' });
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
