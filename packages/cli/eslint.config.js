/** packages/cli lint — forbids hard-coded 4.x literals in transforms/**. */
import tsParser from '@typescript-eslint/parser';

/* REQ-PLAT-90: every transform (core and area) takes 4.x names and tokens from
   compiled mappings (m.names / m.tokens), never from literals: no Glass* string
   literal, no Glass* inside a template-literal chunk, and no --glass-* token in a
   string literal or a template-literal chunk. */
const LITERAL_GLASS = {
  selector: "Literal[value=/^Glass[A-Z]/]",
  message: 'No hard-coded Glass* literals in transforms/** — use compiled mappings.',
};
const TEMPLATE_GLASS = {
  selector: "TemplateElement[value.raw=/Glass[A-Z][A-Za-z]+/]",
  message: 'No Glass* names in template literals in transforms/** — use compiled mappings (m.names).',
};
const LITERAL_GLASS_TOKEN = {
  selector: "Literal[value=/^--glass-[a-z]/]",
  message: 'No hard-coded --glass-* token literals in transforms/** — use compiled mappings.',
};
const TEMPLATE_GLASS_TOKEN = {
  selector: "TemplateElement[value.raw=/--glass-[a-z]/]",
  message: 'No --glass-* tokens in template literals in transforms/** — use compiled mappings.',
};

export const TRANSFORM_RESTRICTIONS = [LITERAL_GLASS, TEMPLATE_GLASS, LITERAL_GLASS_TOKEN, TEMPLATE_GLASS_TOKEN];

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: 2022, sourceType: 'module' } },
  },
  {
    files: ['src/migrate/4to5/transforms/**/*.ts'],
    rules: { 'no-restricted-syntax': ['error', ...TRANSFORM_RESTRICTIONS] },
  },
];
