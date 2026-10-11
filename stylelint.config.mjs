// MAT-058 / REQ-MAT-18 (D.2-04): auraglass/no-raw-design-values over src CSS —
// 'warning' everywhere, 'error' on the MAT-owned globs. Mirrors the ESLint
// agConfig in lint/rules/mat/no-raw-design-values.cjs (same MAT_GLOBS); the
// per-stream literal ratchet (scripts/tokens/gates/literals.mjs) keeps the
// warned globs from growing.
import { createRequire } from 'node:module';
import noRawDesignValues from './stylelint-plugin-auraglass/index.js';

const require = createRequire(import.meta.url);
const { MAT_GLOBS } = require('./lint/rules/mat/no-raw-design-values.cjs');

export default {
  plugins: [noRawDesignValues],
  rules: {
    'auraglass/no-raw-design-values': [true, { severity: 'warning' }],
  },
  overrides: [
    {
      files: MAT_GLOBS.map((g) => `${g}/*.css`),
      rules: {
        'auraglass/no-raw-design-values': [true, { severity: 'error' }],
      },
    },
  ],
};
