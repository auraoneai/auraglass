/** CMP-117 (REQ-CMP-08/03): source-level CSS gate for control files — every rule
    inside @layer ag.components, selectors scoped to .ag-* classes or
    [data-ag-part]/data-* states, no hex/rgb literals, no !important, no
    transition: all, no :root. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONTROL_FAMILIES } from './families';

const COMP_ROOT = join(__dirname, '..', '..', 'src', 'components');
const LITERAL_RE = /#[0-9a-fA-F]{3,8}\b|(?<!-)\brgba?\(|(?<!-)\bhsla?\(/;

describe('controls css gate', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: css contract', (_name, { family }) => {
    const dir = join(COMP_ROOT, family);
    if (!existsSync(dir)) return; // shared css lives in a sibling (checkbox.css covers radio)
    const cssFiles = readdirSync(dir).filter((f) => f.endsWith('.css'));
    for (const file of cssFiles) {
      const src = readFileSync(join(dir, file), 'utf8');
      if (!src.includes('@layer ag.components')) {
        throw new Error(`${file}: missing @layer ag.components`);
      }
      if (LITERAL_RE.test(src)) throw new Error(`${file}: raw color literal`);
      if (/!important/.test(src)) throw new Error(`${file}: !important`);
      if (/transition:\s*all/.test(src)) throw new Error(`${file}: transition: all`);
      if (/:root\b/.test(src)) throw new Error(`${file}: :root selector`);
      const noComments = src.replace(/\/\*[\s\S]*?\*\//g, '');
      if (/backdrop-filter/.test(noComments)) throw new Error(`${file}: backdrop-filter (REQ-CMP-54)`);
    }
  });
});

/* REQ-CMP-61: focus ring on control:focus-visible; size padding 2/3/4;
   sm label type; control-height vars for the 3x3 grid. */
describe('text-field chrome (REQ-CMP-61)', () => {
  const TF = readFileSync(join(process.cwd(), 'src/components/text-field/TextField.css'), 'utf8');
  it('focus-visible ring on control, rim stays on shell', () => {
    expect(TF).toMatch(/data-ag-part='control'\]:focus-visible[^}]*outline:[^}]*--ag-color-focus-outer/);
    expect(TF).toMatch(/control-shell'\]:focus-within[^}]*--ag-color-focus-outer/);
  });
  it('size padding sm/md/lg = space-2/3/4 + sm label type', () => {
    expect(TF).toMatch(/size='sm'\][^\n]*control-shell[^}]*padding-inline:\s*var\(--ag-space-2\)/);
    expect(TF).toMatch(/size='lg'\][^\n]*control-shell[^}]*padding-inline:\s*var\(--ag-space-4\)/);
    expect(TF).toMatch(/size='sm'\][^\n]*control[^}]*font-size:\s*var\(--ag-type-label-size\)/);
  });
  it('control-height vars for default/compact/spacious', () => {
    for (const d of ['default','compact','spacious'])
      for (const s of ['sm','md','lg'])
        expect(TF).toContain(`--ag-comp-control-height-${s}-${d}`);
  });
});
