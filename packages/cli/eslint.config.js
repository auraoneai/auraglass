/** packages/cli lint — forbids hard-coded 4.x literals in transforms/**. */
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: 2022, sourceType: 'module' } },
  },
  {
    files: ['src/migrate/4to5/transforms/{imports-subpaths,providers,canonical-names,prop-grammar,dead-optical-props,css-vars,deps,removed}.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/^Glass[A-Z]/]",
          message: 'No hard-coded Glass* literals in transforms/** — use compiled mappings.',
        },
        {
          selector: "Literal[value=/^--glass-[a-z]/]",
          message: 'No hard-coded --glass-* token literals in transforms/** — use compiled mappings.',
        },
      ],
    },
  },
];
