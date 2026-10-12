/** aura-glass-cli jest config — root config ignores <rootDir>/packages/**. */
export default {
  displayName: 'cli',
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.{ts,tsx,mjs}', '<rootDir>/src/migrate/4to5/__tests__/**/*.test.{ts,tsx,mjs}'],
  transform: {
    // The lint contract imports the package's ESM eslint.config.js too.
    '^.+\\.(ts|tsx|mts|js)$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'] },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(jscodeshift|@babel)/)'],
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  globalSetup: '<rootDir>/test/helpers/gen-mappings.cjs',
  testTimeout: 120000,
  maxWorkers: 2,
};
