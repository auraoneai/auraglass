/* @jest-environment node */
/* CMP-019: RuleTester for auraglass/require-data-ag-part. Fixture files give the
   rule a sibling *.meta.ts (the gate), via temp files written under
   tests/lint/cmp/fixtures/. */
import { describe, it, beforeAll, afterAll } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
import rule from '../../../lint/rules/cmp/require-data-ag-part.cjs';

const FIX = join(__dirname, 'fixtures', 'require-data-ag-part');
const FILE = (n) => join(FIX, n);

beforeAll(() => {
  mkdirSync(FIX, { recursive: true });
  // sibling meta: gates the rule for WithMeta.tsx / MissingPart.tsx / BaseUi.tsx
  writeFileSync(FILE('WithMeta.meta.ts'), 'export {};');
  writeFileSync(FILE('WithMeta.tsx'), '');
  writeFileSync(FILE('MissingPart.meta.ts'), 'export {};');
  writeFileSync(FILE('MissingPart.tsx'), '');
  writeFileSync(FILE('BaseUi.meta.ts'), 'export {};');
  writeFileSync(FILE('BaseUi.tsx'), '');
});
afterAll(() => rmSync(FIX, { recursive: true, force: true }));

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe('auraglass/require-data-ag-part', () => {
  tester.run('require-data-ag-part', rule, {
      valid: [
        {
          code: `export const WithMeta = () => <div data-ag-part="root">x</div>;`,
          filename: FILE('WithMeta.tsx'),
        },
        {
          code: `import { Accordion } from '@base-ui/react/accordion';
                 export const BaseUi = () => <Accordion.Root data-ag-part="root" />;`,
          filename: FILE('BaseUi.tsx'),
        },
        {
          // no sibling meta → rule does not apply
          code: `export const Anything = () => <div />;`,
          filename: FILE('Anything.tsx'),
        },
        {
          code: `export function WithMeta() { return <button data-ag-part="root" />; }`,
          filename: FILE('WithMeta.tsx'),
        },
      ],
      invalid: [
        {
          code: `export const MissingPart = () => <div />;`,
          filename: FILE('MissingPart.tsx'),
          errors: [{ messageId: 'missing' }],
        },
        {
          code: `export const MissingPart = () => <div data-ag-part={x} />;`,
          filename: FILE('MissingPart.tsx'),
          errors: [{ messageId: 'missing' }],
        },
        {
          code: `import { Accordion } from '@base-ui/react/accordion';
                 export const BaseUi = () => <div data-ag-part="root"><Accordion.Root /></div>;`,
          filename: FILE('BaseUi.tsx'),
          errors: [{ messageId: 'missing' }],
        },
        {
          code: `export default function MissingPart() { return <section />; }`,
          filename: FILE('MissingPart.tsx'),
          errors: [{ messageId: 'missing' }],
        },
      ],
    });
});
