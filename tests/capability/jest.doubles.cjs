// tests/capability/jest.doubles.cjs — W5 doubles preset (contract §4.10).
// Extends the root jest.config.js — the root config is never edited — and
// maps CMP module specifiers the capability blocks compose onto doubles:
// tests/contract-doubles/cmp/*.tsx where a contract double exists,
// tests/capability/doubles/* for the flat primitives (Button/Card/Badge/
// Separator/TextField/Avatar) the contract does not double.
// Run: npx jest -c tests/capability/jest.doubles.cjs   (job surf:test:doubles)
// Each mapping is deleted in the PR after that CMP component's conformance
// test passes on next.
const rootModule = require('../../jest.config.js');
const root = rootModule.default ?? rootModule;

module.exports = {
  ...root,
  rootDir: '../..',
  moduleNameMapper: {
    ...root.moduleNameMapper,
    '^aura-glass$': '<rootDir>/tests/capability/doubles/aura-glass.tsx',
  },
  testMatch: ['<rootDir>/tests/capability/**/*.test.{ts,tsx}'],
};
