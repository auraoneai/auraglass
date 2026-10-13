// tests/media/jest.doubles.cjs — W4 doubles preset (SURF-515, contract §4.10).
// CMP_MODULES used by ./media that are still mapped onto doubles: collapsible
// (tests/contract-doubles/cmp). Slider, Toolbar, Menu and Dialog mappings were
// deleted (contract §5.2 row SURF / §6.3) once those CMP components shipped
// for real and their conformance tests passed: MediaControls relies on their
// real roving focus, material attributes and Menu parts (REQ-SURF-135/138),
// and ImageViewer.Popup relies on the real Dialog's provider-overlay portal
// and LayerStack inert handling (REQ-SURF-142), which no double composes. Run:
//   npx jest -c tests/media/jest.doubles.cjs
const rootModule = require('../../jest.config.js');
const root = rootModule.default ?? rootModule;

const cmp = (name) => `<rootDir>/tests/contract-doubles/cmp/${name}.tsx`;

module.exports = {
  ...root,
  rootDir: '../..',
  displayName: 'media-doubles',
  moduleNameMapper: {
    ...root.moduleNameMapper,
    // CMP seams at every depth src/media imports them
    '^\\.\\./\\.\\./\\.\\./components/collapsible$': cmp('collapsible'),
    '^\\.\\./\\.\\./components/collapsible$': cmp('collapsible'),
    '^\\.\\./components/collapsible$': cmp('collapsible'),
    // published specifiers onto real sources
    '^aura-glass/media$': '<rootDir>/src/media/index.ts',
    '^aura-glass/backdrops$': '<rootDir>/src/backdrops/index.ts',
    '^aura-glass$': '<rootDir>/tests/capability/doubles/aura-glass.tsx',
  },
  testMatch: [
    '<rootDir>/tests/media/**/*.test.{ts,tsx}',
    '<rootDir>/tests/backdrops/**/*.test.{ts,tsx}',
    '<rootDir>/src/media/**/*.test.{ts,tsx}',
    '<rootDir>/src/backdrops/**/*.test.{ts,tsx}',
    '<rootDir>/tests/capability/registry/media-*.test.{ts,tsx}',
    '<rootDir>/registry/{items,blocks}/media-*/**/*.test.{ts,tsx}',
    '<rootDir>/registry/items/backdrop-*/**/*.test.{ts,tsx}',
  ],
};
