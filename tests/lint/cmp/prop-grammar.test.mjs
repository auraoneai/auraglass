/* @jest-environment node */
/* REQ-CMP-05: RuleTester for auraglass/prop-grammar — banned material prop names
   on exported *Props under components/primitives/icons; warn-scope on SURF. */
import { describe, it } from '@jest/globals';
import { RuleTester } from 'eslint';
import * as tsParser from '@typescript-eslint/parser';
import rule from '../../../lint/rules/cmp/prop-grammar.cjs';

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe('auraglass/prop-grammar', () => {
  tester.run('prop-grammar', rule, {
      valid: [
        // ordinary public props
        `export interface ButtonProps { variant?: 'regular'|'prominent'; size?: 'sm'|'md'|'lg'; }`,
        // non-exported Props (internal) — not in scope
        `interface InternalProps { material?: string; }`,
        // exported but not *Props
        `export interface CardModel { material?: string; }`,
        // props named like banned stems but legal
        `export interface DepthListProps { depthLabel?: string; tintLabel?: string; }`,
      ],
      invalid: [
        {
          code: `export interface CardProps { material?: 'liquid'|'glass'; }`,
          errors: [{ messageId: 'banned' }],
        },
        {
          code: `export type PanelProps = { tier?: number; blur?: number; glowLevel?: number };`,
          errors: [{ messageId: 'banned' }, { messageId: 'banned' }, { messageId: 'banned' }],
        },
        {
          code: `export interface FieldProps { onChange?: (v: string) => void; asChild?: boolean; respectMotionPreference?: boolean }`,
          errors: [{ messageId: 'banned' }, { messageId: 'banned' }, { messageId: 'banned' }],
        },
      ],
    });
});
