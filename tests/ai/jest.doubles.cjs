// tests/ai/jest.doubles.cjs — W3 doubles preset (SURF-388, contract §4.10).
// src/ai composes no CMP modules today — the surface is self-contained — so
// the preset maps the published `aura-glass/ai` specifier onto the real
// sources; CMP module mappings are added here in the PR where a shipped ai
// component starts composing one. Run: npx jest -c tests/ai/jest.doubles.cjs
const rootModule = require('../../jest.config.js');
const root = rootModule.default ?? rootModule;

module.exports = {
  ...root,
  rootDir: '../..',
  displayName: 'ai-doubles',
  moduleNameMapper: {
    ...root.moduleNameMapper,
    '^aura-glass/ai$': '<rootDir>/src/ai/index.ts',
    '^aura-glass$': '<rootDir>/tests/capability/doubles/aura-glass.tsx',
  },
  testMatch: [
    '<rootDir>/tests/ai/**/*.test.{ts,tsx}',
    '<rootDir>/src/ai/**/*.test.{ts,tsx}',
    '<rootDir>/tests/capability/registry/ai-*.test.{ts,tsx}',
  ],
};
