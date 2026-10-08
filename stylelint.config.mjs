// MAT-058: auraglass/no-raw-design-values at error over all src CSS.
import noRawDesignValues from './stylelint-plugin-auraglass/index.js';

export default {
  plugins: [noRawDesignValues],
  rules: {
    'auraglass/no-raw-design-values': [true, { severity: 'error' }],
  },
};
