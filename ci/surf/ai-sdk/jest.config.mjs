/* surf:test:ai-sdk harness jest config (SURF-281): the root contract config's
 * testMatch does not cover ci/, so this extends it with the harness tests. The
 * pinned SDK resolves through ci/surf/ai-sdk/node_modules (-> .artifacts/). */
import root from '../../../jest.config.js';

export default {
  ...root,
  rootDir: '../../..',
  testMatch: ['<rootDir>/ci/surf/ai-sdk/**/*.test.{ts,tsx}'],
};
