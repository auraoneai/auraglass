/**
 * REQ-PLAT-47 unit-react19 leg: the full repo jest suite (`jest --ci`) on
 * React 19 with the element-ref spy appended to the repo's own
 * setupFilesAfterEnv. (A bare `--setupFilesAfterEnv` CLI flag replaces the
 * configured list, which would drop jest-dom and src/utils/testSetup.ts.)
 */
const path = require('path');
const base = require('../../jest.config.js');

module.exports = {
  ...base,
  rootDir: path.join(__dirname, '..', '..'),
  setupFilesAfterEnv: [...(base.setupFilesAfterEnv || []), '<rootDir>/tests/react19/element-ref-spy.ts'],
};
