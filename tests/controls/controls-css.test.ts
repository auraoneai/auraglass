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

/* REQ-CMP-53: check-path dash animation <= duration-micro, 0s under calm/reduced. */
describe('checkbox check-path draw (REQ-CMP-53)', () => {
  const CB = readFileSync(join(process.cwd(), 'src/components/checkbox/Checkbox.css'), 'utf8');
  it('pathLength=1 dash draw on [data-checked] over duration-micro', () => {
    expect(CB).toMatch(/stroke-dasharray:\s*1/);
    expect(CB).toMatch(/data-checked\][^\n]*\[data-ag-part='icon'\]\s*path[^}]*stroke-dashoffset:\s*0/);
    expect(CB).toMatch(/transition:\s*stroke-dashoffset\s+var\(--ag-duration-micro\)/);
  });
  it('instant under reduced-motion and calm/none', () => {
    expect(CB).toMatch(/prefers-reduced-motion:\s*reduce[^}]*transition:\s*none/s);
    expect(CB).toMatch(/data-ag-motion='calm'\][^}]*transition:\s*none/);
    expect(CB).toMatch(/data-ag-motion='none'\][^}]*transition:\s*none/);
  });
});
