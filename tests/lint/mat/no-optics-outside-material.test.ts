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
        // RuleTester fixtures of QUAL's backdrop-filter CSS rules
        { filename: 'tests/lint/qual/css-perf.test.ts', code: "const s = '.a { backdrop-filter: blur(20px) saturate(1.8); }';" },
        // frozen 4.x codemod recipe inputs (REQ-PLAT-92)
        { filename: 'tests/dx/fixtures/recipes-4x/saas-dashboard/input.tsx', code: 'const p = { backdropFilter: "blur(12px)" };' },
        // ordinary code with no optics
        { filename: inSrc, code: 'const x = { padding: 8 };' },
        { filename: inSrc, code: 'const label = `blur the lines`;' }, // no call syntax
        // optics-detector fixtures and the material engine's verification suites
        { filename: 'stories/qual/fixtures/perf/A11yFallback.stories.tsx', code: 'const p = { backdropFilter: "blur(12px)" };' },
        { filename: 'tests/perf/qual/invariants.mjs', code: "const props = ['backdrop-filter', '-webkit-backdrop-filter'];" },
        { filename: 'tests/material/ci/ladders-shape.test.ts', code: "const has = '-webkit-backdrop-filter' in decls;" },
        { filename: 'tests/e2e/mat/material/tiers.spec.ts', code: "const bf = read(page, '::before', 'backdrop-filter');" },
        { filename: 'tests/lint/qual/story-rules.test.ts', code: "const c = `.card { backdrop-filter: blur(12px); }`;" },
        // non-emitting contexts: test titles, expect messages, readers / feature queries
        { filename: 'tests/a/a.spec.ts', code: "test('no backdrop-filter under forced colors', () => {});" },
        { filename: 'tests/a/a.spec.ts', code: 'test.describe(`${n}: 0 backdrop-filters`, () => {});' },
        { filename: 'tests/a/a.test.ts', code: "it.each([1])('blur(2px) case %s', () => {});" },
        { filename: 'tests/a/a.spec.ts', code: "expect(f, `${p} backdrop-filter`).toBe('none');" },
        { filename: 'tests/a/a.spec.ts', code: "expect.soft(f, 'backdrop-filter').toBe('none');" },
        { filename: inSrc, code: "const v = cs.getPropertyValue('-webkit-backdrop-filter');" },
        { filename: inSrc, code: "const ok = CSS.supports('(backdrop-filter: blur(1px))');" },
        // optics resets and capability flags
        { filename: 'tests/a/a.test.ts', code: "const rules = ['backdrop-filter: none', 'filter: none'];" },
        { filename: inSrc, code: 'const cap = { backdropFilter: true, saveData: false };' },
        { filename: inSrc, code: 'const cap = { backdropFilter: rand() < 0.85 };' },
        { filename: inSrc, code: 'const cap = { WebkitBackdropFilter: !legacy };' },
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
        // the fixture exemptions are narrow: sibling dx/qual tests are still linted
        {
          filename: 'tests/dx/codemod-canary.test.ts',
          code: "const s = 'backdrop-filter: blur(9px)';",
          errors: [{ messageId: 'pattern' }],
        },
        {
          filename: 'tests/lint/qual/other.test.ts',
          code: "const s = 'backdrop-filter: blur(9px)';",
          errors: [{ messageId: 'pattern' }],
        },
        // the non-emitting contexts are narrow: other arguments and emitting values still report
        {
          filename: 'tests/a/a.spec.ts',
          code: "test('t', () => { el.style.cssText = 'backdrop-filter: blur(4px)'; });",
          errors: [{ messageId: 'pattern' }],
        },
        {
          filename: 'tests/a/a.spec.ts',
          code: "expect('backdrop-filter: blur(2px)').toBe(x);",
          errors: [{ messageId: 'pattern' }],
        },
        {
          filename: inSrc,
          code: "el.style.setProperty('-webkit-backdrop-filter', 'none');",
          errors: [{ messageId: 'pattern' }],
        },
        {
          filename: inSrc,
          code: "const css = '.a { backdrop-filter: none; } .b { backdrop-filter: blur(8px); }';",
          errors: [{ messageId: 'pattern' }],
        },
        {
          filename: inSrc,
          code: "const s = { backdropFilter: on ? 'url(#lens)' : 'none' };",
          errors: [{ messageId: 'key' }],
        },
        // a story/test fixture outside the named detector directories is still linted
        {
          filename: 'stories/qual/Other.stories.tsx',
          code: 'export const S = { args: { style: { backdropFilter: "blur(2px)" } } };',
          errors: [{ messageId: 'key' }, { messageId: 'pattern' }],
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
