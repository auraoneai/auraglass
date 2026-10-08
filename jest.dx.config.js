import base from './jest.config.js';
export default {
  ...base,
  setupFilesAfterEnv: [],
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
};
