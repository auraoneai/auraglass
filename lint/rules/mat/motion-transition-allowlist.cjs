/* auraglass/motion-transition-allowlist (REQ-MOT-12 + T03, JS half): style/
   transition objects may animate only contract-animatable props. The CSS half
   is verified by scripts/ci/verify-motion-css.mjs (MAT-232). */
'use strict';
const { keyName } = require('./_helpers.cjs');

const ALLOW = new Set([
  'transform', 'opacity', 'translate', 'scale', 'rotate',
  '--ag-specular', '--_ag-optics', '--_ag-press', '--_ag-refraction-scale', '--_ag-hover',
  'color', 'background-color', 'backgroundColor', 'border-color', 'borderColor',
  'outline-color', 'outlineColor', 'display', 'overlay',
]);
const CSSIFY = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const legs = (s) => s.split(/,(?![^(]*\))/).map((l) => l.trim()).filter(Boolean);
const propOf = (leg) => (leg.trim().split(/\s+/)[0] ?? '').toLowerCase();

const checkValue = (context, node, raw) => {
  for (const leg of legs(raw)) {
    const p = CSSIFY(propOf(leg));
    if (p === 'all') { context.report({ node, messageId: 'transitionAll' }); continue; }
    if (p && !ALLOW.has(p) && !ALLOW.has(propOf(leg))) {
      context.report({ node, messageId: 'notAllowed', data: { prop: propOf(leg) } });
    }
  }
};

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Transitions animate only REQ-MOT-12 allow-listed properties.' },
    schema: [],
    messages: {
      transitionAll: "'transition: all' is banned (REQ-MOT-12): enumerate allow-listed properties.",
      notAllowed: "'{{prop}}' is not on the motion transition allow-list (REQ-MOT-12).",
    },
  },
  create(context) {
    const fromProp = (prop) => {
      const k = keyName(prop);
      if (k !== 'transition' && k !== 'transitionProperty' && k !== 'transition-property') return;
      const v = prop.value;
      if (v?.type === 'Literal' && typeof v.value === 'string') checkValue(context, prop, v.value);
      if (v?.type === 'TemplateLiteral' && v.expressions.length === 0) checkValue(context, prop, v.quasis[0]?.value.cooked ?? '');
    };
    return {
      Property: fromProp,
      JSXAttribute: (n) => {
        if (n.name.name !== 'transition' && n.name.name !== 'transitionProperty') return;
        const expr = n.value?.type === 'JSXExpressionContainer' ? n.value.expression : n.value;
        if (expr?.type === 'Literal' && typeof expr.value === 'string') checkValue(context, n, expr.value);
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
