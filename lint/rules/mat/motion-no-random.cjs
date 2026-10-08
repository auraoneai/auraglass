/* auraglass/motion-no-random (MAT-231 REQ-MOT-35 enforcement): randomness may
   never reach a motion channel. Errors when Math.random() (directly or via a
   same-scope binding) lands in JSX style/animate/initial/transition/variants,
   in delay/duration/x/y/scale/rotate/opacity/translate object keys, or in
   el.animate( keyframes / style.setProperty( args. ID-only uses are allowed;
   labs excluded. PKG's no-random-in-render covers render-time Math.random()
   elsewhere — not duplicated here. */
'use strict';
const { norm, keyName, isTestFile } = require('./_helpers.cjs');

const MOTION_ATTRS = new Set(['style', 'animate', 'initial', 'transition', 'variants']);
const MOTION_KEYS = new Set(['delay', 'duration', 'x', 'y', 'scale', 'rotate', 'opacity', 'translate']);
const LABS = /labs?\/|__labs__|sandbox/;
const isRandomCall = (n) =>
  n?.type === 'CallExpression' && n.callee?.type === 'MemberExpression'
  && n.callee.object?.name === 'Math' && n.callee.property?.name === 'random';

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Math.random() must not reach motion channels.' },
    schema: [],
    messages: {
      random: 'Math.random() reaches a motion channel (REQ-MOT-35): motion must be deterministic — drive it from tokens or props.',
    },
  },
  create(context) {
    if (LABS.test(norm(context.filename)) || isTestFile(context.filename)) return {};
    const src = context.sourceCode;
    // same-scope bindings: const r = Math.random() / = f(Math.random())
    const randomIdents = new Set();
    const mark = (n) => {
      if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier'
        && n.init && src.getText(n.init).includes('Math.random')) {
        randomIdents.add(n.id.name);
      }
    };
    const reaches = (node) => {
      const text = src.getText(node);
      if (text.includes('Math.random')) return true;
      for (const id of randomIdents) {
        if (new RegExp(`\\b${id}\\b`).test(text)) return true;
      }
      return false;
    };
    return {
      VariableDeclarator: mark,
      JSXAttribute: (n) => {
        if (!MOTION_ATTRS.has(n.name.name)) return;
        const v = n.value?.type === 'JSXExpressionContainer' ? n.value.expression : null;
        if (!v) return;
        if (v.type === 'ObjectExpression') {
          // motion-keyed props are reported by the Property visitor — report only
          // the remaining props here so each violation fires once
          for (const p of v.properties) {
            if (p.type === 'Property' && !MOTION_KEYS.has(keyName(p) ?? '') && reaches(p.value)) {
              context.report({ node: p, messageId: 'random' });
            }
          }
          return;
        }
        if (reaches(v)) context.report({ node: n, messageId: 'random' });
      },
      Property: (n) => {
        if (MOTION_KEYS.has(keyName(n) ?? '') && reaches(n.value)) context.report({ node: n, messageId: 'random' });
      },
      CallExpression: (n) => {
        const callee = n.callee;
        const name = callee?.type === 'MemberExpression' ? callee.property?.name : callee?.name;
        if ((name === 'animate' || name === 'setProperty') && reaches(n)) {
          context.report({ node: n, messageId: 'random' });
        }
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
