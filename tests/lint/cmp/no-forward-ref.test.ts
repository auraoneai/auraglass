/* @jest-environment node */
/* CMP-023: RuleTester for auraglass/no-forward-ref — named, namespace, aliased,
   member-call and compat-valid cases. */
import { describe, it } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import rule from '../../../lint/rules/cmp/no-forward-ref.cjs';

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe('auraglass/no-forward-ref', () => {
  tester.run('no-forward-ref', rule, {
      valid: [
        // no forwardRef at all
        `import { useRef } from 'react';
         export const A = (p) => <div ref={p.ref} />;`,
        // ref as normal prop (React 19 pattern)
        `import * as React from 'react';
         export const B = ({ ref }) => <div ref={ref} />;`,
        // a local function coincidentally named differently
        `const useForwardRef = () => null; useForwardRef();`,
      ],
      invalid: [
        {
          code: `import { forwardRef } from 'react';
                 const A = forwardRef((p, r) => <div ref={r} />);`,
          errors: [{ messageId: 'banned' }, { messageId: 'banned' }],
        },
        {
          code: `import { forwardRef as fr } from 'react';
                 const A = fr((p, r) => <div ref={r} />);`,
          errors: [{ messageId: 'banned' }],
        },
        {
          code: `import * as React from 'react';
                 const A = React.forwardRef((p, r) => <div ref={r} />);`,
          errors: [{ messageId: 'banned' }],
        },
      ],
    });
});
