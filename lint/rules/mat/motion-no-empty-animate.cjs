/* auraglass/motion-no-empty-animate (MAT-228/186 REQ-MOT-64, severity: error):
   4.x rule ported unchanged semantics — an empty animate target renders an
   instant opacity-0 element, and initial={{opacity:0}} paired with a
   conditional animate silently drops the entrance. Cases:
     1. animate={{}} / animate={{} as any} — no target keys.
     2. initial={{opacity:0}} (or initial="hidden") + animate is a conditional
        expression (ternary or && guard) — the 4.2 MAT-186 case.
     3. Conditional empty motion targets or an undefined animate branch
        paired with a non-settled initial state (REQ-PLAT-48). */
'use strict';
const MOTION_PROPS = ['animate', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'exit', 'transition', 'variants'];
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
      undefinedConditional: 'animate has an `undefined` branch while initial={{initial}} is not the settled state, so reduced-motion users are left at initial: give the branch the FINAL state (animate={r ? FINAL : X}) or skip the entrance (initial={r ? false : I}).',
      emptyConditional: '{{prop}} uses an empty-object conditional branch — reduced motion must render the settled state: initial={r ? false : I}, animate={r ? FINAL : X}, transition={r ? { duration: 0 } : T}.',
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
        // REQ-PLAT-48: `animate={r ? undefined : X}` (either branch) with an
        // initial that is not the settled state leaves the element at
        // initial under reduced motion. Settled = initial absent, `false`,
        // a conditional with a `false` branch, or an object literal whose
        // every key is already at identity (opacity/scale 1, x/y/rotate 0).
        const IDENTITY = { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, x: 0, y: 0, rotate: 0 };
        const strip = (e) => (e && e.type === 'TSAsExpression' ? e.expression : e);
        const isUndef = (e) => {
          const x = strip(e);
          return !!x && ((x.type === 'Identifier' && x.name === 'undefined')
            || (x.type === 'UnaryExpression' && x.operator === 'void'));
        };
        const isFalse = (e) => { const x = strip(e); return !!x && x.type === 'Literal' && x.value === false; };
        const settledInitial = (e) => {
          const x = strip(e);
          if (!x) return true;
          if (isFalse(x)) return true;
          if (x.type === 'ConditionalExpression') return isFalse(x.consequent) || isFalse(x.alternate);
          if (x.type === 'ObjectExpression') {
            return x.properties.every((p) => {
              if (p.type !== 'Property') return false;
              const k = p.key.type === 'Identifier' ? p.key.name : String(p.key.value);
              const v = strip(p.value);
              const num = v && v.type === 'Literal' ? Number(v.value)
                : v && v.type === 'UnaryExpression' && v.operator === '-' && v.argument.type === 'Literal' ? -Number(v.argument.value)
                : NaN;
              return k in IDENTITY && num === IDENTITY[k];
            });
          }
          return false;
        };
        if (animate && init) {
          const a = strip(jsxExpr(animate));
          const initValue = init.value && init.value.type === 'JSXExpressionContainer' ? init.value.expression
            : init.value; // string variant literal: never settled
          if (a && a.type === 'ConditionalExpression' && (isUndef(a.consequent) || isUndef(a.alternate))
            && !settledInitial(initValue)) {
            const src = context.getSourceCode ? context.getSourceCode().getText(initValue) : 'I';
            context.report({ node: animate, messageId: 'undefinedConditional', data: { initial: src.length > 40 ? `${src.slice(0, 37)}...` : src } });
          }
        }
        // REQ-PLAT-48: empty-object conditional branches on motion props
        // (`cond ? {} : target` / `cond ? target : {}`) — reduced-motion
        // must render the stable state, not an instantly-empty animate.
        // Exception: cookie-consent keeps motion gated via its explicit
        // disableAnimation prop (documented exception).
        const file = (context.getFilename && context.getFilename()) || '';
        if (!/cookie-consent/.test(file)) {
          for (const name of MOTION_PROPS) {
            const attr = attrOf(el, name);
            const expr = jsxExpr(attr);
            // Walk the conditional tree: an empty-object branch nested in
            // a ternary/logical chain counts too.
            const hasEmptyBranch = (e, depth) => {
              if (!e || depth > 6) return false;
              const x = e.type === 'TSAsExpression' ? e.expression : e;
              if (x.type === 'ConditionalExpression') {
                return isEmptyObject(x.consequent) || isEmptyObject(x.alternate)
                  || hasEmptyBranch(x.consequent, depth + 1) || hasEmptyBranch(x.alternate, depth + 1);
              }
              if (x.type === 'LogicalExpression' && (x.operator === '&&' || x.operator === '??')) {
                return isEmptyObject(x.left) || isEmptyObject(x.right)
                  || hasEmptyBranch(x.left, depth + 1) || hasEmptyBranch(x.right, depth + 1);
              }
              return false;
            };
            if (expr && isConditional(expr) && hasEmptyBranch(expr, 0)) {
              context.report({ node: attr, messageId: 'emptyConditional', data: { prop: name } });
            }
          }
        }
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
