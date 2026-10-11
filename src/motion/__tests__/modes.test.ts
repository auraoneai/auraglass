/* @jest-environment node */
/* MAT-202 REQ-MOT-T04: modes css — calm strips transforms/infinite animation but
   keeps opacity cross-fades at token durations; none is scoped to
   [data-ag-part]/[data-ag-surface] with no '*'; forced-colors and
   data-ag-highlights blocks present. Selectors stay ≤ (0,2,0) (REQ-MAT-19). */
import { describe, expect, it } from '@jest/globals';
import postcss from 'postcss';
import parser from 'postcss-selector-parser';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FILE = join(__dirname, '..', 'css', 'motion-modes.css');
const root = postcss.parse(readFileSync(FILE, 'utf8'), { from: FILE });
const text = () => readFileSync(FILE, 'utf8');

/** (a,b,c) specificity honoring :where()=0 and :not()/:is()/etc = arg max. */
const specificity = (selector: string): [number, number, number] => {
  let a = 0, b = 0, c = 0;
  const count = (node: parser.Node): void => {
    if (node.type === 'id') a += 1;
    else if (node.type === 'class' || node.type === 'attribute') b += 1;
    else if (node.type === 'tag') c += 1;
    else if (node.type === 'pseudo') {
      const name = node.value;
      if (name === ':where') return; // contributes nothing
      if ([':not', ':is', ':has', ':matches'].includes(name ?? '')) {
        // pseudo itself counts as its most specific argument
        let best: [number, number, number] = [0, 0, 0];
        node.each((sub) => {
          if (sub.type === 'selector') {
            const s = specificity(sub.toString());
            if (s[0] > best[0] || (s[0] === best[0] && (s[1] > best[1] || (s[1] === best[1] && s[2] > best[2])))) best = s;
          }
        });
        a += best[0]; b += best[1]; c += best[2];
      } else if (name?.startsWith('::') || [':before', ':after', ':first-line', ':first-letter'].includes(name ?? '')) {
        c += 1;
      } else {
        b += 1; // functional-free pseudo-class
      }
    }
    if ('each' in node && typeof (node as parser.Container).each === 'function' && node.type !== 'pseudo') {
      (node as parser.Container).each(count);
    }
  };
  parser((sel) => sel.each(count)).processSync(selector);
  return [a, b, c];
};

const allSelectors = (): string[] => {
  const out: string[] = [];
  root.walkRules((r) => { out.push(...(r.selectors ?? [r.selector])); });
  return out;
};

describe('calm mode', () => {
  const calmRules: postcss.Rule[] = [];
  root.walkRules((r) => { if (r.selector.includes('data-ag-motion=calm')) calmRules.push(r); });

  it('calm maps every spring token to --ag-ease-standard', () => {
    const joined = calmRules.map((r) => r.toString()).join('\n');
    for (const s of ['snappy', 'smooth', 'fluid']) {
      expect(joined).toContain(`--ag-spring-${s}: var(--ag-ease-standard)`);
    }
  });
  it('calm strips scale/translate/rotate on starting/ending styles but keeps opacity', () => {
    const se = calmRules.filter((r) => /starting-style|ending-style/.test(r.selector));
    expect(se.length).toBeGreaterThanOrEqual(1);
    const joined = se.map((r) => r.toString()).join('\n');
    expect(joined).toContain('scale: none');
    expect(joined).toContain('translate: none');
    expect(joined).toContain('rotate: none');
    expect(joined).not.toMatch(/opacity:\s*1/); // starting opacity stays 0 so the cross-fade survives
  });
  it('calm stops infinite animation and freezes pointer light', () => {
    const joined = calmRules.map((r) => r.toString()).join('\n');
    expect(joined).toContain('animation: none');
    expect(joined).toContain('--_ag-pointer: 50% 50%');
  });
  it('calm makes hover/press light response instant (durations kept elsewhere)', () => {
    const interactive = calmRules.filter((r) => r.selector.includes('data-ag-interactive'));
    expect(interactive.length).toBeGreaterThanOrEqual(1);
    expect(interactive.map((r) => r.toString()).join('\n')).toContain('transition-duration: 0s');
  });
});

describe('prefers-reduced-motion media mirror', () => {
  it('mirrors calm under :root:not([data-ag-motion])', () => {
    let mirror: postcss.AtRule | undefined;
    root.walkAtRules('media', (r) => { if (r.params.includes('prefers-reduced-motion')) mirror = r; });
    expect(mirror).toBeTruthy();
    const src = mirror!.toString();
    expect(src).toContain(':root:not([data-ag-motion])');
    expect(src).toContain('--ag-spring-snappy: var(--ag-ease-standard)');
    expect(src).toContain('animation: none');
    expect(src).toContain('scale: none');
    expect(src).toContain('translate: none');
  });
});

describe('none mode', () => {
  const noneRules: postcss.Rule[] = [];
  root.walkRules((r) => { if (r.selector.includes('data-ag-motion=none')) noneRules.push(r); });
  it('zeroes transitions and animation on parts/surfaces only', () => {
    expect(noneRules.length).toBeGreaterThanOrEqual(1);
    const joined = noneRules.map((r) => r.toString()).join('\n');
    expect(joined).toContain('transition-duration: 0s');
    expect(joined).toContain('animation: none');
    const joinedSel = noneRules.map((r) => r.selector).join(',');
    expect(joinedSel).toContain('data-ag-part');
    expect(joinedSel).toContain('data-ag-surface');
  });
  it('never uses a bare * selector', () => {
    for (const s of allSelectors()) {
      expect(s.replace(/\s/g, '')).not.toMatch(/(^|[\s>+~*,])\*($|[\s>+~*,]|:)/);
    }
  });
});

describe('forced-colors and reduced highlights (REQ-MOT-113/-117)', () => {
  it('forced-colors block disables pointer light, sweeps and optics fades', () => {
    let fc: postcss.AtRule | undefined;
    root.walkAtRules('media', (r) => { if (r.params.includes('forced-colors')) fc = r; });
    expect(fc).toBeTruthy();
    const src = fc!.toString();
    expect(src).toContain('--_ag-pointer');
    expect(src).toContain('--_ag-optics');
    expect(src).toContain('animation: none');
    // focus ring never transitions: the allow-list keeps paint properties only
    expect(src).toContain('transition-property: color, background-color, border-color, outline-color');
    expect(src).not.toContain('--_ag-focus');
  });
  it('[data-ag-highlights] disables pointer light, press glow and sweeps', () => {
    const rules: postcss.Rule[] = [];
    root.walkRules((r) => { if (r.selector.includes('data-ag-highlights')) rules.push(r); });
    expect(rules.length).toBeGreaterThanOrEqual(1);
    const joined = rules.map((r) => r.toString()).join('\n');
    expect(joined).toContain('--_ag-pointer');
    expect(joined).toContain('--_ag-press: 0');
    expect(joined).toContain('animation: none');
  });
});

describe('ag.a11y specificity cap (REQ-MAT-19)', () => {
  it('no selector exceeds (0,2,0); 0 !important', () => {
    const over: string[] = [];
    for (const s of allSelectors()) {
      const [a, b] = specificity(s);
      // forced-colors pseudo-element selectors may sit at (0,1,1); we ship none
      if (a > 0 || b > 2) over.push(`${s} -> ${a},${b}`);
    }
    expect(over).toEqual([]);
    expect(text()).not.toMatch(/!important/);
  });
});
