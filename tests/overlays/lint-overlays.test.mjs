/* @jest-environment node */
/* CMP-200/256 (REQ-CMP-12): RuleTester coverage for
   auraglass/no-overlay-global-listeners over the _shared/__fixtures__/lint
   fixtures, plus a source-level import gate (no Positioner/FocusTrap
   primitives imports, no framer-motion) across the lane's overlay dirs. */
import { describe, expect, it } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import rule from '../../lint/rules/cmp/no-overlay-global-listeners.cjs';

const __dirname = join(process.cwd(), 'tests', 'overlays');

const tester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

const FIX = join(__dirname, '..', '..', 'src', 'components', 'overlays', '_shared', '__fixtures__', 'lint');
const src = (n) => readFileSync(join(FIX, n), 'utf8');

describe('auraglass/no-overlay-global-listeners (CMP-197)', () => {
    tester.run('no-overlay-global-listeners', rule, {
      valid: [
        { code: src('clean.tsx') },
        { code: "const f=()=>{}; el.addEventListener('keydown', f); element.removeEventListener('scroll', f);" },
        { code: "window.addEventListener('click', ()=>{}); document.addEventListener('focusin', ()=>{});" },
      ],
      invalid: [
        { code: src('keydown-listener.tsx'), errors: [{ messageId: 'listener' }, { messageId: 'listener' }] },
        { code: src('mousedown-listener.tsx'), errors: [{ messageId: 'listener' }, { messageId: 'listener' }] },
        {
          code: src('scroll-resize-listener.tsx'),
          errors: [{ messageId: 'listener' }, { messageId: 'listener' }, { messageId: 'listener' }],
        },
        { code: src('body-style-write.tsx'), errors: [{ messageId: 'bodyStyle' }, { messageId: 'bodyStyle' }] },
      ],
    });
});

/* CMP-256/199: static lane — the lane's own overlay sources must contain zero
   global-listener/body-style patterns AND no imports of the raw BU positioning
   primitives or framer-motion (S-32 seam discipline). */
const OVERLAY_DIRS = [
  join(__dirname, '..', '..', 'src', 'components', 'dialog'),
  join(__dirname, '..', '..', 'src', 'components', 'alert-dialog'),
  join(__dirname, '..', '..', 'src', 'components', 'sheet'),
  join(__dirname, '..', '..', 'src', 'components', 'overlays', '_shared'),
];
const SOURCE_RE = /\.(ts|tsx)$/;
const SKIP = /\.(test|stories)\.|__tests__|__fixtures__/;
const files = [];
for (const dir of OVERLAY_DIRS) {
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (SOURCE_RE.test(p) && !SKIP.test(p)) files.push(p);
    }
  };
  walk(dir);
}

describe('overlay static lane (CMP-256)', () => {
  it.each(files.map((f) => [f.split('/').pop(), f]))('%s has no banned patterns', (_n, file) => {
    const text = readFileSync(file, 'utf8');
    expect(text).not.toMatch(/\b(?:document|window)\.addEventListener\(\s*['"](?:keydown|mousedown|pointerdown|scroll|resize)['"]/);
    expect(text).not.toMatch(/document\.body\.style\.\w+\s*=/);
    expect(text).not.toMatch(/from\s+['"]framer-motion['"]/);
    expect(text).not.toMatch(/from\s+['"]@base-ui\/(react\/)?(primitives|positioner|focus-trap)/);
  });
});
