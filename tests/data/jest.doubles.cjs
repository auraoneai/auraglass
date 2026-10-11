// tests/data/jest.doubles.cjs — W2 doubles preset (SURF-141/143). The
// aura-glass root specifier maps onto the shared CMP flat doubles; the W2
// entry points map onto the real sources so real assertions run.
const rootModule = require('../../jest.config.js');
const base = rootModule.default ?? rootModule;

module.exports = {
  ...base,
  rootDir: '../..',
  displayName: 'data-doubles',
  // Scoped to the W2 surface only: inheriting the root testMatch ran the
  // whole repo suite under the doubles mapping (unrelated suites fail there).
  testMatch: [
    '<rootDir>/tests/data/**/*.test.{ts,tsx}',
    '<rootDir>/src/{data,date,charts}/**/*.test.{ts,tsx}',
  ],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^aura-glass/data$': '<rootDir>/src/data/index.ts',
    '^aura-glass/date$': '<rootDir>/src/date/index.ts',
    '^aura-glass/charts$': '<rootDir>/src/charts/index.ts',
    '^aura-glass/app-shell$': '<rootDir>/src/app-shell/index.ts',
    '^aura-glass$': '<rootDir>/tests/capability/doubles/aura-glass.tsx',
  },
};
