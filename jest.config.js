/* contract-v1.1 verbatim (ESM). Node-environment tests add the docblock  @jest-environment node. */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/tests/**/*.test.{ts,tsx,mjs}', '<rootDir>/registry/**/*.test.{ts,tsx}',
    '<rootDir>/showcase/**/*.test.{ts,tsx}', '<rootDir>/fragments/**/*.test.ts', '<rootDir>/scripts/**/*.test.{ts,mjs}'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/legacy/', '<rootDir>/dist/', '<rootDir>/packages/', '<rootDir>/apps/'],
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.ts'],
  transform: { '^.+\\.(t|j|mj)sx?$': ['<rootDir>/tests/helpers/babel-jest-import-meta.cjs', {}] },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'json'],
  transformIgnorePatterns: ['/node_modules/(?!prettier)'],
  moduleNameMapper: { '\\.css$': 'identity-obj-proxy', '^prettier$': '<rootDir>/node_modules/prettier/index.mjs' },
};
