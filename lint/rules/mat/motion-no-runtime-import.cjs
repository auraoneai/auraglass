/* auraglass/motion-no-runtime-import (MAT-225 REQ-MOT-60): the optional motion
   runtime may only be imported inside src/motion/adapter. Errors on
   import/export-from/require()/import() of framer-motion, motion, motion/*,
   popmotion, react-spring, @react-spring/*, gsap elsewhere. */
'use strict';
const { norm } = require('./_helpers.cjs');

const BANNED = /^(motion|motion\/|framer-motion|popmotion|react-spring|@react-spring\/|gsap)/;
const ALLOW = /src\/motion\/adapter\.tsx$|src\/motion\/adapter\//;

const check = (context, node, value) => {
  if (typeof value === 'string' && BANNED.test(value) && !ALLOW.test(norm(context.filename))) {
    context.report({ node, messageId: 'runtimeImport' });
  }
};

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Motion runtime imports are confined to src/motion/adapter.' },
    schema: [],
    messages: {
      runtimeImport: "Import of a motion runtime outside src/motion/adapter is forbidden (REQ-MOT-60): only the './motion' adapter may import motion/framer-motion/popmotion/react-spring/gsap.",
    },
  },
  create(context) {
    return {
      ImportDeclaration: (n) => check(context, n.source, n.source.value),
      ExportNamedDeclaration: (n) => { if (n.source) check(context, n.source, n.source.value); },
      ExportAllDeclaration: (n) => check(context, n.source, n.source.value),
      ImportExpression: (n) => { if (n.source?.type === 'Literal') check(context, n.source, n.source.value); },
      CallExpression: (n) => {
        if (n.callee?.type === 'Identifier' && n.callee.name === 'require' && n.arguments[0]?.type === 'Literal') {
          check(context, n.arguments[0], n.arguments[0].value);
        }
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx,mjs,cjs}'], severity: 'warn' }],
};
