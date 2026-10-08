/* auraglass/motion-single-preference-source (MAT-227 REQ-MOT-63): exactly one
   preference source — src/theme/preferences (2d-P) — plus the contracted
   compat and the motion lane's own OS floor (src/motion/ticker.ts:resolvedMotion
   reads the media query only when no data-ag-motion attribute is set). */
'use strict';
const { norm, isTestFile } = require('./_helpers.cjs');

const ALLOWED_FILES = /src\/theme\/preferences\/|src\/compat\/|src\/motion\/ticker\.ts$|src\/motion\/__tests__\//;
const BANNED_IMPORTS = new Set([
  'useReducedMotion', 'useEnhancedReducedMotion', 'useMotionPreference',
  'useMotionPreferenceContext', 'MotionPreferenceContext',
  'prefersReducedMotion', 'ReducedMotionProvider',
]);

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Single preference source for reduced motion.' },
    schema: [],
    messages: {
      mediaQuery: "Direct matchMedia('prefers-reduced-motion') is forbidden outside the single preference source (REQ-MOT-63): resolve via usePreference('motion') / resolvedMotion.",
      bannedImport: "'{{name}}' bypasses the single preference source (REQ-MOT-63): preferences live in src/theme/preferences only.",
    },
  },
  create(context) {
    if (ALLOWED_FILES.test(norm(context.filename)) || isTestFile(context.filename)) return {};
    return {
      CallExpression: (n) => {
        if (n.callee?.type === 'Identifier' && n.callee.name === 'matchMedia'
          && n.arguments[0]?.type === 'Literal' && /prefers-reduced-motion/.test(String(n.arguments[0].value))) {
          context.report({ node: n, messageId: 'mediaQuery' });
        }
      },
      ImportDeclaration: (n) => {
        for (const s of n.specifiers) {
          const name = s.type === 'ImportSpecifier' ? (s.imported.name ?? s.imported.value) : s.local.name;
          if (BANNED_IMPORTS.has(name)) context.report({ node: s, messageId: 'bannedImport', data: { name } });
        }
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx,js,jsx}'], severity: 'warn' }],
};
