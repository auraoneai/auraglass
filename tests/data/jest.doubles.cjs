// tests/data/jest.doubles.cjs — W2 doubles preset (SURF-141/143). The
// aura-glass root specifier maps onto the shared CMP flat doubles; the W2
// entry points map onto the real sources so real assertions run.
const rootModule = require('../../jest.config.js');
const base = rootModule.default ?? rootModule;

module.exports = {
  ...base,
  rootDir: '../..',
  displayName: 'data-doubles',
  testMatch: [...(base.testMatch ?? []), '**/tests/data/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^aura-glass/data$': '<rootDir>/src/data/index.ts',
    '^aura-glass/date$': '<rootDir>/src/date/index.ts',
    '^aura-glass/charts$': '<rootDir>/src/charts/index.ts',
    '^aura-glass/app-shell$': '<rootDir>/src/app-shell/index.ts',
    '^aura-glass$': '<rootDir>/tests/capability/doubles/aura-glass.tsx',
  },
};
