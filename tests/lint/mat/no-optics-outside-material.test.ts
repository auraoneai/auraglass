/* @jest-environment node */
/* MAT-098: RuleTester coverage for auraglass/no-optics-outside-material — one invalid
   fixture per REQ-MAT-39 pattern (7+), incl. template literal, style={{}} object and a
   component story; valid fixtures under src/material/** and generated paths. */
import { describe, it } from '@jest/globals';
import { RuleTester } from 'eslint';

const rule = require('../../../lint/rules/mat/no-optics-outside-material.cjs');
const parser = require('@typescript-eslint/parser');

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const inSrc = 'src/components/Card/Card.tsx';
const inStory = 'src/components/Card/Card.stories.tsx';

// RuleTester.run registers its own describe/it blocks. Every REQ-MAT-39
// pattern gets one invalid fixture outside src/material/**; valid fixtures sit
// under src/material/**, tokens/** and generated paths.
describe('auraglass/no-optics-outside-material', () => {
  tester.run('no-optics-outside-material', rule, {
      valid: [
        // the material engine owns optics
        { filename: 'src/material/css/helpers.ts', code: "const f = 'backdrop-filter: blur(20px) saturate(1.6)';" },
        { filename: 'src/material/Surface.tsx', code: 'const p = { backdropFilter: "blur(20px)" };' },
        // token sources may name optics values
        { filename: 'tokens/sys/values.ts', code: 'const t = "blur(12px)";' },
        // generated outputs (token CSS, tailwind bridge)
        { filename: 'src/material/css/generated/ladders.ts', code: "const g = 'backdrop-filter: blur(12px)';" },
        { filename: 'build/tailwind-bridge.mjs', code: "const u = 'linear-gradient(rgba(255,255,255,0.4), transparent)';" },
        // this rule's own test/fixture dir
        { filename: 'tests/lint/mat/fixture.ts', code: "const s = 'backdrop-filter: blur(9px)';" },
        // ordinary code with no optics
        { filename: inSrc, code: 'const x = { padding: 8 };' },
        { filename: inSrc, code: 'const label = `blur the lines`;' }, // no call syntax
      ],
      invalid: [
        // 1. style object key: backdropFilter
        {
          filename: inSrc,
          code: 'const el = <div style={{ backdropFilter: "blur(20px)" }} />;',
          errors: [{ messageId: 'key' }, { messageId: 'pattern' }],
        },
        // 2. style object key: WebkitBackdropFilter
        {
          filename: inSrc,
          code: 'const s = { WebkitBackdropFilter: "blur(8px)" };',
          errors: [{ messageId: 'key' }, { messageId: 'pattern' }],
        },
        // 3. string literal: backdrop-filter
        {
          filename: inSrc,
          code: 'const css = "backdrop-filter: blur(20px)";',
          errors: [{ messageId: 'pattern' }],
        },
        // 4. template literal: -webkit-backdrop-filter
        {
          filename: inSrc,
          code: 'const css = `-webkit-backdrop-filter: blur(${n}px)`;',
          errors: [{ messageId: 'pattern' }],
        },
        // 5. white glass rgba() tint
        {
          filename: inSrc,
          code: 'const fill = "rgba(255, 255, 255, 0.4)";',
          errors: [{ messageId: 'pattern' }],
        },
        // 6. blur() literal in a template
        {
          filename: inSrc,
          code: 'const f = `filter: blur(4px)`;',
          errors: [{ messageId: 'pattern' }],
        },
        // 7. saturate() literal
        {
          filename: inSrc,
          code: 'const s = "saturate(1.6)";',
          errors: [{ messageId: 'pattern' }],
        },
        // 8. white specular gradient
        {
          filename: inSrc,
          code: 'const g = "linear-gradient(300deg, rgba(255,255,255,0.35), transparent)";',
          errors: [{ messageId: 'pattern' }],
        },
        // 9. stories are NOT exempt
        {
          filename: inStory,
          code: 'export const S = { args: { style: { backdropFilter: "blur(2px)" } } };',
          errors: [{ messageId: 'key' }, { messageId: 'pattern' }],
        },
      ],
  });
});
