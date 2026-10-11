/** @auraglass/mcp jest config — REQ-FIN-09: every workspace package is runnable
 *  via npm test -w packages/mcp. Node env; matches any *.test.* under the package. */
export default {
  displayName: 'mcp',
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/{src,test,tests}/**/*.test.{ts,tsx,mts,mjs,js}'],
  transform: {
    '^.+\\.(ts|tsx|mts)$': [
      'babel-jest',
      { presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'] },
    ],
  },
};
