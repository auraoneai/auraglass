// MAT-058 / REQ-MAT-18 / REQ-FIN-53: auraglass/no-raw-design-values over all
// src CSS with no directory exclusions. Severity is `error` on MAT globs and
// `warn` on other streams' globs until each stream opts in via
// lint/rules/<stream>/_strict.cjs (mirrors the ESLint half). Every per-file
// increase anywhere still fails the L1 literal ratchet
// (scripts/tokens/gates/literals.mjs vs fragments/literals-baseline/*.json).
import noRawDesignValues from './stylelint-plugin-auraglass/index.js';

const MAT_GLOBS = [
  'src/material/**/*.css',
  'src/motion/**/*.css',
  'src/theme/**/*.css',
  'src/a11y/**/*.css',
  'src/tokens/**/*.css',
];

export default {
  plugins: [noRawDesignValues],
  rules: {
    'auraglass/no-raw-design-values': [true, { severity: 'warning' }],
  },
  overrides: [
    {
      files: MAT_GLOBS,
      rules: {
        'auraglass/no-raw-design-values': [true, { severity: 'error' }],
      },
    },
  ],
};
