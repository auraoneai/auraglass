/* contract-v1.0 verbatim (ESM). Rules are discovered from lint/rules/<stream>/*.cjs by eslint-plugin-auraglass.js. */
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import auraglass from './eslint-plugin-auraglass.js';
export default [
  { ignores: ['legacy/**', 'dist/**', 'storybook-static/**', 'reports/**', '.artifacts/**', '**/node_modules/**', 'packages/*/dist/**', 'apps/docs/.next/**', 'apps/docs/public/r/**'] },
  { files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { auraglass, 'react-hooks': reactHooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'warn' } },
  // REQ-SURF-08: no toLocale* in SURF source — locale formatting is
  // hydration-unstable across server/client timezones (contract §4.11; the
  // builtin rule can't live in lint/rules/surf/_strict.cjs).
  { files: [
      'src/{app-shell,data,date,ai,media,backdrops,charts}/**/*.{ts,tsx,js,jsx}',
      'src/components/{timeline,breadcrumbs,command-palette,pagination,source-transition,tab-bar,tabs}/**/*.{ts,tsx,js,jsx}',
    ],
    rules: {
      'no-restricted-properties': ['error', {
        object: 'Intl',
        message: 'locale formatting is hydration-unstable — pass locale as a prop or use the explicit Intl constructor with a pinned locale',
      }, {
        property: 'toLocaleString',
        message: 'toLocaleString varies with client TZ/locale — use formatMediaTime/Intl with a pinned locale',
      }, {
        property: 'toLocaleDateString',
        message: 'toLocaleDateString varies with client TZ/locale — pin the locale explicitly',
      }, {
        property: 'toLocaleTimeString',
        message: 'toLocaleTimeString varies with client TZ/locale — pin the locale explicitly',
      }],
    } },
  ...auraglass.configs.discovered,
];
