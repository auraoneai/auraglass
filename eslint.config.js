/* contract-v1.0 verbatim (ESM). Rules are discovered from lint/rules/<stream>/*.cjs by eslint-plugin-auraglass.js. */
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import auraglass from './eslint-plugin-auraglass.js';
export default [
  { ignores: ['legacy/**', 'dist/**', 'storybook-static/**', 'reports/**', '.artifacts/**', '**/node_modules/**', 'packages/*/dist/**', 'apps/docs/.next/**', 'apps/docs/public/r/**'] },
  { files: ['**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'],
    languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { auraglass, 'react-hooks': reactHooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'warn' } },
  ...auraglass.configs.discovered,
];
