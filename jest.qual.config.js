/* QUAL (REQ-QUAL-01/-60). Jest config for the private @auraglass/qa package. The root jest.config.js
   ignores <rootDir>/packages/, so packages/qa/test/** runs only here:
     node node_modules/jest/bin/jest.js -c jest.qual.config.js
   (no --experimental-vm-modules: babel turns the graph, incl. ESM-only pixelmatch, into CJS).
   Node environment: these are tooling tests (TypeScript compiler API, git, pixel buffers), no DOM. */
export default {
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/packages/qa'],
  testMatch: ['<rootDir>/packages/qa/test/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/packages/qa/test/fixtures/'],
  transform: { '^.+\\.(t|j|mj)sx?$': ['<rootDir>/tests/helpers/babel-jest-import-meta.cjs', {}] },
  // pixelmatch 8 is ESM-only; let babel convert it like the rest of the graph.
  transformIgnorePatterns: ['/node_modules/(?!(pixelmatch)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'cjs', 'json'],
  testTimeout: 120_000,
};
