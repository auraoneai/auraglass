// tests/app-shell/jest.doubles.cjs — W1 doubles preset (SURF-117, contract §4.10).
// Extends the root jest.config.js — the root config is never edited — and
// maps the CMP modules W1 composes onto the contract doubles so the shell's
// behavior tests run against the frozen seam instead of CMP internals.
// Run: npx jest -c tests/app-shell/jest.doubles.cjs
// Each mapping is deleted in the PR after that CMP component's conformance
// test passes on next. Menu and Sheet have landed (real composites:
// Menu.Content = Portal>Positioner>Popup, Sheet side/detents/layer), so their
// mappings are retired and the shell tests run against the real components.
const rootModule = require('../../jest.config.js');
const root = rootModule.default ?? rootModule;

module.exports = {
  ...root,
  rootDir: '../..',
  moduleNameMapper: {
    ...root.moduleNameMapper,
    '^\\.\\./components/dialog$': '<rootDir>/tests/app-shell/doubles/dialog.tsx',
    '^\\.\\./dialog$': '<rootDir>/tests/app-shell/doubles/dialog.tsx',
    '^\\.\\./components/collapsible$': '<rootDir>/tests/contract-doubles/cmp/collapsible.tsx',
    '^\\.\\./collapsible$': '<rootDir>/tests/contract-doubles/cmp/collapsible.tsx',
    '^\\.\\./components/tooltip$': '<rootDir>/tests/contract-doubles/cmp/tooltip.tsx',
    '^\\.\\./components/combobox$': '<rootDir>/tests/contract-doubles/cmp/combobox.tsx',
    '^\\.\\./components/popover$': '<rootDir>/tests/contract-doubles/cmp/popover.tsx',
    '^\\.\\./components/scroll-area$': '<rootDir>/tests/contract-doubles/cmp/scroll-area.tsx',
  },
  testMatch: ['<rootDir>/tests/app-shell/**/*.test.{ts,tsx}', '<rootDir>/src/app-shell/**/*.test.{ts,tsx}'],
};
