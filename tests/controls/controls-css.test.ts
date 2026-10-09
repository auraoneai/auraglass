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

/* REQ-CMP-55: ring always mounted (unchecked renders the indicator part);
   dot sizes 6/8/10px per size. */
describe('radio ring + dot grid (REQ-CMP-55)', () => {
  const RG = readFileSync(join(process.cwd(), 'src/components/radio-group/RadioGroup.css'), 'utf8');
  it('dot sizes are px-based per size, not 40%', () => {
    expect(RG).not.toMatch(/::after\s*{[^}]*inline-size:\s*40%/);
    expect(RG).toMatch(/size='sm'[\s\S]*?::after\s*{[^}]*inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*1\.5\)/);
    expect(RG).toMatch(/size='lg'[\s\S]*?::after\s*{[^}]*inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*2\.5\)/);
    expect(RG).toMatch(/inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*2\)/); /* md/base */
  });
  it('indicator part present on unchecked render', () => {
    expect(RG).toMatch(/data-ag-part='indicator'/);
  });
});
