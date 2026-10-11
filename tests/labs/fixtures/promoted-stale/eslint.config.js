// Fixture eslint config: registers the real auraglass/no-simulation rule
// so the admission gate's check (b) runs inside this tiny package.
import noSim from '../../../../lint/rules/surf/no-simulation.cjs';
import tsParser from '@typescript-eslint/parser';

export default [{
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: { parser: tsParser },
  plugins: { auraglass: { rules: { 'no-simulation': noSim } } },
  rules: { 'auraglass/no-simulation': 'error' },
}];
