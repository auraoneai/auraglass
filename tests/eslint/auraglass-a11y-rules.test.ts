/* MAT-257/258/259/261: ESLint RuleTester suites for the three a11y rules
   (auraglass/no-runtime-contrast, no-document-escape, no-outline-none-focus).
   >=3 valid and >=3 invalid cases each; invalid filenames exercise the
   src/theme, src/a11y and src/material error scopes plus the exemptions. */
import { describe } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { createRequire } from 'node:module';

// jsdom's jsdom/env lacks structuredClone (ESLint 9 config normalization uses it).
(globalThis as { structuredClone?: <T>(v: T) => T }).structuredClone ??=
  (<T>(v: T): T => JSON.parse(JSON.stringify(v)) as T);

const require = createRequire(import.meta.url);
const rule = (name: string) =>
  require(`../../lint/rules/mat/${name}.cjs`) as { meta: object; create: object };

const tester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

describe('auraglass/no-runtime-contrast', () => {
  tester.run('no-runtime-contrast', rule('no-runtime-contrast') as never, {
      valid: [
        { code: 'const c = wcagContrast(a, b);', filename: 'src/theme/x.ts' },
        { code: 'const c = getComputedStyle(el).color;', filename: 'src/theme/x.ts' },
        { code: 'ctx.getImageData(0, 0, 1, 1);', filename: 'src/backdrops/sampler.ts' }, // PRD-13 exemption
        { code: 'new ResizeObserver(() => { foo(); });', filename: 'src/a11y/x.ts' },
      ],
      invalid: [
        {
          code: 'const r = contrastRatio(getComputedStyle(el).color, bg);',
          filename: 'src/theme/x.ts',
          errors: [{ messageId: 'computedStyle' }],
        },
        {
          code: 'const r = wcagContrast(getComputedStyle(el).getPropertyValue("background"), fg);',
          filename: 'src/a11y/x.ts',
          errors: [{ messageId: 'computedStyle' }],
        },
        {
          code: 'const px = ctx.getImageData(0, 0, 10, 10);',
          filename: 'src/material/x.ts',
          errors: [{ messageId: 'imageData' }],
        },
        {
          code: 'new MutationObserver(() => { recalc(wcagContrast(a, b)); });',
          filename: 'src/theme/x.ts',
          errors: [{ messageId: 'observer' }],
        },
        {
          code: 'new ResizeObserver(() => { badge(contrastRatio(a, b)); });',
          filename: 'src/a11y/x.ts',
          errors: [{ messageId: 'observer' }],
        },
      ],
    });
});

describe('auraglass/no-document-escape', () => {
  tester.run('no-document-escape', rule('no-document-escape') as never, {
      valid: [
        { code: "document.addEventListener('keydown', (e) => close());", filename: 'src/theme/x.ts' },
        { code: "document.addEventListener('keydown', (e) => { if (e.key === 'Escape') x(); });", filename: 'src/theme/layers/LayerStack.ts' }, // S-25 exemption
        { code: "el.addEventListener('keydown', (e) => { if (e.key === 'Escape') x(); });", filename: 'src/material/x.ts' },
        { code: "document.addEventListener('click', (e) => y());", filename: 'src/theme/x.ts' },
      ],
      invalid: [
        {
          code: "document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });",
          filename: 'src/theme/x.ts',
          errors: [{ messageId: 'escape' }],
        },
        {
          code: "window.addEventListener('keyup', (e) => { if (e.key === 'Esc') close(); });",
          filename: 'src/a11y/x.ts',
          errors: [{ messageId: 'escape' }],
        },
        {
          code: "document.addEventListener('keydown', function h(e) { if (e.keyCode === 27) close(); });",
          filename: 'src/material/x.ts',
          errors: [{ messageId: 'escape' }],
        },
      ],
    });
});

describe('auraglass/no-outline-none-focus', () => {
  tester.run('no-outline-none-focus', rule('no-outline-none-focus') as never, {
      valid: [
        { code: "const c = 'outline-none';", filename: 'src/theme/x.ts' },
        { code: "const c = cn('focus:ring-2', 'px-4');", filename: 'src/theme/x.tsx' },
        { code: 'const c = `focus:outline-2`;', filename: 'src/a11y/x.ts' },
        { code: "const c = 'outline-style: none';", filename: 'src/material/x.ts' },
      ],
      invalid: [
        {
          code: "const c = 'focus:outline-none';",
          filename: 'src/theme/x.tsx',
          errors: [{ messageId: 'outlineNone' }],
        },
        {
          code: "const c = cn('a', 'focus-visible:outline-none');",
          filename: 'src/a11y/x.tsx',
          errors: [{ messageId: 'outlineNone' }],
        },
        {
          code: 'const c = `focus:outline-none`;',
          filename: 'src/material/x.tsx',
          errors: [{ messageId: 'outlineNone' }],
        },
        {
          code: "const c = clsx('p-2 focus:outline-none');",
          filename: 'src/theme/x.tsx',
          errors: [{ messageId: 'outlineNone' }],
        },
      ],
    });
});
