// tests/data/jest.doubles.cjs — W2 doubles preset (SURF-141/143). The
// aura-glass root specifier maps onto the shared CMP flat doubles; the W2
// entry points map onto the real sources so real assertions run.
const rootModule = require('../../jest.config.js');
const base = rootModule.default ?? rootModule;

module.exports = {
  ...base,
  rootDir: '../..',
  displayName: 'data-doubles',
  // Scope to the W2 area only (matching the ai/app-shell presets); spreading
  // base.testMatch ran the entire repo suite under the doubles mappings.
  // The packed-entry suites assert the built tarball only and fail closed
  // without AURAGLASS_TARBALL; they run in surf:package:packed-entries, never
  // against sources/doubles. The other tests/data/exports suites are
  // sources-only and stay in this cell.
  testPathIgnorePatterns: [
    ...(base.testPathIgnorePatterns ?? []),
    '<rootDir>/tests/data/exports/surf-entries\\.test\\.ts$',
    '<rootDir>/tests/data/exports/data-date-entries\\.test\\.ts$',
    '<rootDir>/tests/data/exports/surf-statics\\.test\\.ts$',
  ],
  testMatch: [
    '<rootDir>/tests/data/**/*.test.{ts,tsx}',
    '<rootDir>/src/data/**/*.test.{ts,tsx}',
    '<rootDir>/src/date/**/*.test.{ts,tsx}',
    '<rootDir>/src/charts/**/*.test.{ts,tsx}',
    '<rootDir>/tests/capability/registry/data-*.test.{ts,tsx}',
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
