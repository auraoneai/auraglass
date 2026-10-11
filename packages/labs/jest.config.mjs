/** @auraglass/labs jest config — REQ-FIN-09 / REQ-FIN-87: `npm test -w packages/labs` runs the
 *  labs suites. The root config ignores <rootDir>/packages/**; the REQ-SURF-166..169 suites live in
 *  the repo-level tests/labs/** (package shape, admission gate, promotion), so this config targets
 *  them plus any package-local src/test suites. Node env, babel TS transform (same shape as cli). */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(pkgDir, '..', '..');

export default {
  displayName: 'labs',
  rootDir: repoRoot,
  roots: ['<rootDir>/tests/labs', '<rootDir>/packages/labs'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/labs/**/*.test.{ts,tsx,mts,mjs,js}',
    '<rootDir>/packages/labs/{src,test}/**/*.test.{ts,tsx,mts,mjs,js}',
  ],
  // Negative admission fixtures are inputs to scripts/surf/verify-labs-admission.mjs, not suites.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/labs/fixtures/'],
  transform: {
    '^.+\\.(ts|tsx|mts)$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'] },
    ],
  },
};
