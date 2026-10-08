/* PLAT-293: Jest 29 CJS consumer — the artifact is pure ESM so a CJS test
   environment must handle it via transformIgnorePatterns (D-03 evidence:
   reports-only from beta; the leg documents consumer-facing behaviour). */
module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!aura-glass/)'],
  transform: {},
  testMatch: ['**/*.test.js'],
};
