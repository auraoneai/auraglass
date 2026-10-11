/* auraglass/motion-no-empty-animate (MAT-228/186 REQ-MOT-64, severity: error):
   4.x rule ported unchanged semantics — an empty animate target renders an
   instant opacity-0 element, and initial={{opacity:0}} paired with a
   conditional animate silently drops the entrance. Cases:
     1. animate={{}} / animate={{} as any} — no target keys.
     2. initial={{opacity:0}} (or initial="hidden") + animate is a conditional
        expression (ternary or && guard) — the 4.2 MAT-186 case. */
'use strict';
const { keyName } = require('./_helpers.cjs');

const isEmptyObject = (expr) => {
  if (!expr) return false;
  const e = expr.type === 'TSAsExpression' ? expr.expression : expr;
  return e.type === 'ObjectExpression' && e.properties.length === 0;
};
const isZeroOpacityLiteral = (expr) => {
  if (!expr) return false;
  const e = expr.type === 'TSAsExpression' ? expr.expression : expr;
  if (e.type !== 'ObjectExpression') return false;
  return e.properties.some((p) => {
    const val = p.type === 'Property' ? p.value : null;
    return keyName(p) === 'opacity' && val?.type === 'Literal' && Number(val.value) === 0;
  });
};
const isConditional = (expr) => {
  if (!expr) return false;
  const e = expr.type === 'TSAsExpression' ? expr.expression : expr;
  return e.type === 'ConditionalExpression'
    || (e.type === 'LogicalExpression' && (e.operator === '&&' || e.operator === '??'));
};

const jsxExpr = (attr) =>
  attr?.value?.type === 'JSXExpressionContainer' ? attr.value.expression : null;
const attrOf = (openingEl, name) =>
  openingEl?.attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === name) ?? null;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'No empty animate targets or faded-in initial with conditional animate.' },
    schema: [],
    messages: {
      emptyAnimate: 'animate={{}} has no target keys (REQ-MOT-64): an empty animate renders instantly — remove the prop or give it a contract target.',
      fadedConditional: 'initial={{opacity:0}} with a conditional animate can leave the element invisible (REQ-MOT-64): make the animate unconditional or drive opacity from a motion scalar.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement: (el) => {
        const animate = attrOf(el, 'animate');
        const init = attrOf(el, 'initial');
        if (animate && isEmptyObject(jsxExpr(animate))) {
          context.report({ node: animate, messageId: 'emptyAnimate' });
        }
        const initExpr = jsxExpr(init);
        if (init && (isZeroOpacityLiteral(initExpr) || init.value?.type === 'Literal' && init.value.value === 'hidden')) {
          const animExpr = jsxExpr(animate);
          if (animExpr && isConditional(animExpr)) {
            context.report({ node: animate, messageId: 'fadedConditional' });
          }
        }
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
