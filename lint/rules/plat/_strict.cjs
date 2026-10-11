/* PLAT-259: strict-severity lanes for PLAT-owned globs. Base agConfig keeps
   the rules repo-wide (warn-by-default once streams opt in per G-05); inside
   PLAT-owned paths they are errors today. All rules escalate to error at RC-1. */
const PLAT_GLOBS = [
  'src/internal/**/*.{ts,tsx}',
  'src/compat/**/*.{ts,tsx}',
  'src/contracts/**/*.{ts,tsx}',
  'scripts/build/**/*.{ts,mts,cts}',
  'scripts/ci/**/*.{ts,mts,cts}',
  'build/**/*.{ts,mts,cts}',
];
module.exports = {
  strict: {
    'use-client-required': PLAT_GLOBS,
    'use-client-needless': PLAT_GLOBS,
    'no-random-in-render': PLAT_GLOBS,
    'no-dom-lazy-init': PLAT_GLOBS,
    'contract-boundary': PLAT_GLOBS,
    'no-legacy-import': PLAT_GLOBS,
  },
};
