/** jest globalSetup: compile mappings before any transform test runs. */
const { execFileSync } = require('node:child_process');
const path = require('node:path');

module.exports = async function genMappings() {
  const pkg = path.resolve(__dirname, '..', '..');
  execFileSync('node', [path.join(pkg, 'scripts', 'gen-mappings.mjs')], { stdio: 'inherit' });
};
