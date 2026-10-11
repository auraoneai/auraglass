/** packages/cli lint — forbids hard-coded 4.x literals in transforms/**. */
import tsParser from '@typescript-eslint/parser';

/* REQ-PLAT-90: Glass* names are banned inside template-literal chunks in every
   transform (core and area); names come from compiled mappings (m.names). */
const TEMPLATE_GLASS = {
  selector: "TemplateElement[value.raw=/Glass[A-Z][A-Za-z]+/]",
  message: 'No Glass* names in template literals in transforms/** — use compiled mappings (m.names).',
};
const LITERAL_GLASS_TOKEN = {
  selector: "Literal[value=/^--glass-[a-z]/]",
  message: 'No hard-coded --glass-* token literals in transforms/** — use compiled mappings.',
};

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: 2022, sourceType: 'module' } },
  },
  {
    files: ['src/migrate/4to5/transforms/**/*.ts'],
    rules: { 'no-restricted-syntax': ['error', TEMPLATE_GLASS, LITERAL_GLASS_TOKEN] },
  },
  /* Core transforms additionally ban plain Glass* string literals (flat config:
     this later block replaces the rule options for these files, so it repeats all). */
  {
    files: ['src/migrate/4to5/transforms/{imports-subpaths,providers,canonical-names,prop-grammar,dead-optical-props,css-vars,deps,removed}.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/^Glass[A-Z]/]",
          message: 'No hard-coded Glass* literals in transforms/** — use compiled mappings.',
        },
        TEMPLATE_GLASS,
        LITERAL_GLASS_TOKEN,
      ],
    },
  },
];
