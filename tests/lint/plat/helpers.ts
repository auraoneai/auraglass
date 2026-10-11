/* @jest-environment node */
import { RuleTester } from 'eslint';

const parser = require('@typescript-eslint/parser');

export const tester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module', ecmaVersion: 2022 } },
});

export const F = 'src/material/Button.tsx';
