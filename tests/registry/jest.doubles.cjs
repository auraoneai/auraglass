// tests/registry/jest.doubles.cjs — REQ-PLAT-96: registry blocks/items render
// against the S-24/S-30 contract doubles (tests/contract-doubles/*). Load
// failure is a hard failure — no warn-and-return. Run:
//   npx jest -c tests/registry/jest.doubles.cjs
const rootModule = require('../../jest.config.js');
const root = rootModule.default ?? rootModule;
const D = '<rootDir>/tests/contract-doubles/aura-glass';
module.exports = {
  ...root,
  rootDir: '../..',
  displayName: 'registry-doubles',
  moduleNameMapper: {
    ...root.moduleNameMapper,
    '^aura-glass$': `${D}/index.tsx`,
    '^aura-glass/(theme|data|ai|app-shell|backdrops|date|media)$': `${D}/$1.tsx`,
  },
  testMatch: ['<rootDir>/tests/registry/plat-blocks.test.tsx'],
};
