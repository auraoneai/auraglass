/* REQ-CMP-49: Slider track/thumb size grid + transient-thumb rules. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { CONTROL_FAMILIES } from './families';
import { join } from 'node:path';
import cmpCss from '../../fragments/css/cmp';
import surfCss from '../../fragments/css/surf';
import { checkLayerFile } from '../contract/_checks';

const CSS_ROWS = [...cmpCss, ...surfCss];

const CSS = readFileSync(join(process.cwd(), 'src/components/slider/Slider.css'), 'utf8');

describe('slider css grid (REQ-CMP-49)', () => {
  it('track block-size sm/md/lg = 4/6/8px', () => {
    /* sm = --ag-space-1 (4px) */
    expect(CSS).toMatch(/data-ag-size='sm'\][^\n]*\[data-ag-part='track'\][^}]*block-size:\s*var\(--ag-space-1\)/);
    /* md (+ unset default) = 6px via calc(space-1 * 1.5) */
    expect(CSS).toMatch(/data-ag-size='md'\][^\n]*\[data-ag-part='track'\][^}]*block-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*1\.5\)/);
    /* lg = --ag-space-2 (8px) */
    expect(CSS).toMatch(/data-ag-size='lg'\][^\n]*\[data-ag-part='track'\][^}]*block-size:\s*var\(--ag-space-2\)/);
  });

  it('thumb sm/md/lg = 16/20/24px', () => {
    expect(CSS).toMatch(/data-ag-size='sm'\][^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-4\)/);
    /* md + :not([data-ag-size]) default = --ag-space-5 (20px) */
    expect(CSS).toMatch(/data-ag-size='md'\][^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-5\)/);
    expect(CSS).toMatch(/:not\(\[data-ag-size\]\)[^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-5\)/);
    expect(CSS).toMatch(/data-ag-size='lg'\][^\n]*\[data-ag-part='thumb'\][^}]*inline-size:\s*var\(--ag-space-6\)/);
  });

  it('thumb carries no scale/transform — BU drag owns transform only inline', () => {
    const thumbBlock = CSS.split("[data-ag-part='thumb'] {")[1]?.split('}')[0] ?? '';
    expect(thumbBlock).not.toMatch(/\bscale\b/);
    expect(thumbBlock).not.toMatch(/transform:/);
    /* transition must not target transform */
    expect(thumbBlock).not.toMatch(/transition:[^;]*transform/);
  });

  it('[data-dragging] raises --ag-specular (valid custom property)', () => {
    const drag = CSS.match(/\.ag-slider\[data-dragging\][^{]*\{[^}]*\}/s)?.[0] ?? '';
    expect(drag).toContain('--ag-specular: 1');
  });

  it('track paints the content-sunken material fill (REQ-CMP-49)', () => {
    const track = CSS.match(/\.ag-slider \[data-ag-part='track'\] \{[^}]*\}/)?.[0] ?? '';
    expect(track).toMatch(/background:[^;]*var\(--ag-surface-fill\)/);
  });

  it('thumb is opaque at rest; glass fill only under [data-dragging] (REQ-CMP-49)', () => {
    const rest = CSS.split(".ag-slider [data-ag-part='thumb'] {")[1]?.split('}')[0] ?? '';
    expect(rest).toMatch(/background:\s*var\(--ag-color-canvas\)/);
    const noComments = CSS.replace(/\/\*[\s\S]*?\*\//g, '');
    /* every rule that addresses the glass (allow-nested) thumb or paints the
       translucent surface fill on the thumb is scoped to [data-dragging] */
    const rules = noComments.match(/[^{}]+\{[^{}]*\}/g) ?? [];
    const glassRules = rules.filter((r) => /thumb/.test(r.split('{')[0]!) && /--ag-surface-fill/.test(r.split('{')[1]!));
    expect(glassRules.length).toBeGreaterThan(0);
    for (const r of glassRules) {
      for (const sel of r.split('{')[0]!.split(',')) expect(sel).toMatch(/\[data-dragging\][^,]*\[data-ag-allow-nested\]/);
    }
    /* no selector addresses the glass thumb outside a drag */
    const nestedSelectors = rules.flatMap((r) => r.split('{')[0]!.split(',')).filter((sel) => /allow-nested/.test(sel));
    expect(nestedSelectors.length).toBeGreaterThan(0);
    for (const sel of nestedSelectors) expect(sel).toContain('[data-dragging]');
  });
});

/* REQ-CMP-52: checkbox/radio indicator size grid 14/16/20. */
describe('checkbox indicator grid (REQ-CMP-52)', () => {
  const CB = readFileSync(join(process.cwd(), 'src/components/checkbox/Checkbox.css'), 'utf8');
  it('sm box = 14px via calc(space-1 * 3.5)', () => {
    expect(CB).toMatch(/data-ag-size='sm'\][^\n]*\[data-ag-part='indicator'\][^}]*inline-size:\s*calc\(var\(--ag-space-1\)\s*\*\s*3\.5\)/);
  });
  it('md = 16px (space-4), lg = 20px (space-5)', () => {
    expect(CB).toMatch(/data-ag-size='md'\][^\n]*\[data-ag-part='indicator'\][^}]*inline-size:\s*var\(--ag-space-4\)/);
    expect(CB).toMatch(/data-ag-size='lg'\][^\n]*\[data-ag-part='indicator'\][^}]*inline-size:\s*var\(--ag-space-5\)/);
  });
});

/* REQ-CMP-54: checked = opaque accent fill + contrast-color() icon inside
   @supports, with the --ag-color-on-accent fallback outside it; the unchecked
   edge is the border-token rim (see the REQ text for why not --ag-surface-rim). */
describe('checkbox/radio box fill + icon colour (REQ-CMP-54)', () => {
  const CB = readFileSync(join(process.cwd(), 'src/components/checkbox/Checkbox.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const CHECKED = /\.ag-checkbox\[data-checked\] \[data-ag-part='indicator'\],\s*\.ag-checkbox\[data-indeterminate\] \[data-ag-part='indicator'\],\s*\.ag-radio-group \[data-checked\] \[data-ag-part='indicator'\]\s*\{([^}]*)\}/g;
  const supportsAt = CB.indexOf('@supports (color: contrast-color(red))');
  const blocks = [...CB.matchAll(CHECKED)].map((m) => ({ at: m.index!, body: m[1]! }));

  it('fallback rule (outside @supports): accent fill, --ag-color-on-accent icon', () => {
    const fallback = blocks.filter((b) => b.at < supportsAt);
    expect(fallback).toHaveLength(1);
    expect(fallback[0]!.body).toMatch(/background:\s*var\(--ag-color-accent\);/);
    expect(fallback[0]!.body).toMatch(/color:\s*var\(--_ag-on-accent, var\(--ag-color-on-accent\)\);/);
  });

  it('@supports (color: contrast-color(red)) sets color: contrast-color(var(--ag-color-accent))', () => {
    expect(supportsAt).toBeGreaterThan(-1);
    const inside = blocks.filter((b) => b.at > supportsAt);
    expect(inside).toHaveLength(1);
    // the rule really sits inside the @supports block
    const supportsBody = CB.slice(supportsAt, CB.indexOf('}\n  }', supportsAt) + 1);
    expect(supportsBody).toContain(inside[0]!.body);
    expect(inside[0]!.body.trim()).toBe('color: contrast-color(var(--ag-color-accent));');
  });

  it('unchecked box: content-sunken fill and a border-token rim scaled from --ag-focus-width', () => {
    const base = CB.match(/\.ag-checkbox \[data-ag-part='indicator'\],\s*\.ag-radio-group \[data-ag-part='indicator'\]\s*\{([^}]*)\}/)![1]!;
    expect(base).toMatch(/background:\s*color-mix\(in oklab, var\(--ag-color-canvas\), var\(--ag-color-on-surface\) var\(--_ag-content-sunken-alpha, 4%\)\);/);
    expect(base).toMatch(/box-shadow:\s*inset 0 0 0 calc\(var\(--ag-focus-width\) \* 0\.75\) var\(--ag-color-border\);/);
    expect(base).not.toMatch(/backdrop-filter/);
  });
});

/* REQ-CMP-61 (TextField chrome grid) is covered by
   tests/controls/text-field-chrome.test.tsx: it resolves the shell's padding
   and height through the MAT comp tokens instead of matching source text. */

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

const COMP_ROOT = join(__dirname, '..', '..', 'src', 'components');
const LITERAL_RE = /#[0-9a-fA-F]{3,8}\b|(?<!-)\brgba?\(|(?<!-)\bhsla?\(/;

describe('controls css gate', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: css contract', (_name, { family }) => {
    const dir = join(COMP_ROOT, family);
    if (!existsSync(dir)) return; // shared css lives in a sibling (checkbox.css covers radio)
    const cssFiles = readdirSync(dir).filter((f) => f.endsWith('.css'));
    for (const file of cssFiles) {
      const src = readFileSync(join(dir, file), 'utf8');
      const path = `src/components/${family}/${file}`;
      const rows = CSS_ROWS.filter((row) => row.file === path);
      expect(rows).toHaveLength(1);
      const expectedLayer = file.endsWith('.a11y.css') ? 'ag.a11y' : 'ag.components';
      expect(rows[0]!.layer).toBe(expectedLayer);
      expect(checkLayerFile(path, src, expectedLayer)).toEqual([]);
      const noComments = src.replace(/\/\*[\s\S]*?\*\//g, '');
      if (LITERAL_RE.test(noComments)) throw new Error(`${file}: raw color literal`);
      if (/transition:\s*all/.test(noComments)) throw new Error(`${file}: transition: all`);
      if (/:root\b/.test(noComments)) throw new Error(`${file}: :root selector`);
      if (/backdrop-filter/.test(noComments)) throw new Error(`${file}: backdrop-filter (REQ-CMP-54)`);
    }
  });
});

/* ---- parsed-CSS helpers for the REQ-CMP-42/53/62/67 rules below ---- */
const postcss = require('postcss') as typeof import('postcss');
type PRule = import('postcss').Rule;
type PAtRule = import('postcss').AtRule;
const parseCss = (rel: string) => {
  const paired = rel.replace(/\.css$/, '.a11y.css');
  const files = [rel];
  if (existsSync(join(process.cwd(), paired))) {
    const rows = CSS_ROWS.filter((row) => row.file === paired);
    if (rows.length !== 1 || rows[0]!.layer !== 'ag.a11y') {
      throw new Error(`${paired}: accessibility sheet must be registered in ag.a11y`);
    }
    files.push(paired);
  }
  return postcss.parse(files.map((file) => readFileSync(join(process.cwd(), file), 'utf8')).join('\n'));
};
const atOf = (r: PRule): PAtRule | undefined => {
  const p = r.parent as PAtRule | undefined;
  return p?.type === 'atrule' && p.name !== 'layer' ? p : undefined;
};
/** rules whose selector list contains `sel`, optionally only under a matching at-rule */
function rulesWith(root: import('postcss').Root, sel: string, at?: (a: PAtRule) => boolean): PRule[] {
  const out: PRule[] = [];
  root.walkRules((r) => {
    if (!r.selectors.map((s) => s.replace(/\s+/g, ' ').trim()).includes(sel)) return;
    const a = atOf(r);
    if (at ? a && at(a) : !a) out.push(r);
  });
  return out;
}
const declOf = (rules: PRule[], prop: string): string | undefined => {
  let v: string | undefined;
  for (const r of rules) r.walkDecls(prop, (d) => { v = d.value; });
  return v;
};
const reducedMotion = (a: PAtRule) => a.name === 'media' && a.params.includes('prefers-reduced-motion: reduce');
const coarsePointer = (a: PAtRule) => a.name === 'media' && a.params.includes('pointer: coarse');

/* REQ-CMP-53: the check path draws with stroke-dashoffset 1 -> 0 over
   --ag-duration-micro on [data-checked]; instant under reduced motion and
   under calm/none. */
describe('checkbox check draw (REQ-CMP-53)', () => {
  const cb = parseCss('src/components/checkbox/Checkbox.css');
  const PATH = ".ag-checkbox [data-ag-part='icon'] path";
  const CHECKED = ".ag-checkbox[data-checked] [data-ag-part='icon'] path";
  it('pathLength=1 dash: offset 1 at rest, 0 when checked', () => {
    expect(declOf(rulesWith(cb, PATH), 'stroke-dasharray')).toBe('1');
    expect(declOf(rulesWith(cb, PATH), 'stroke-dashoffset')).toBe('1');
    expect(declOf(rulesWith(cb, CHECKED), 'stroke-dashoffset')).toBe('0');
  });
  it('transitions stroke-dashoffset only, over --ag-duration-micro', () => {
    expect(declOf(rulesWith(cb, CHECKED), 'transition')).toMatch(/^stroke-dashoffset var\(--ag-duration-micro\) /);
  });
  it('instant under prefers-reduced-motion and under calm/none', () => {
    expect(declOf(rulesWith(cb, CHECKED, reducedMotion), 'transition')).toBe('none');
    expect(declOf(rulesWith(cb, `[data-ag-motion='calm'] ${CHECKED}`), 'transition')).toBe('none');
    expect(declOf(rulesWith(cb, `[data-ag-motion='none'] ${CHECKED}`), 'transition')).toBe('none');
  });
});

/* REQ-CMP-62: autofill keeps the shell fill (inset shadow of --_ag-fill) and
   the on-surface ink; under (pointer: coarse) every control size is >= 16px. */
describe('text input autofill + coarse font size (REQ-CMP-62)', () => {
  const specificity = (sel: string) => {
    const s = sel.replace(/::?[a-z-]+(\([^)]*\))?/g, (m) => (m.startsWith('::') ? '' : m));
    const ids = (s.match(/#[\w-]+/g) ?? []).length;
    const cls = (s.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) ?? []).length;
    return ids * 100 + cls;
  };
  for (const [family, root] of [['text-field/TextField.css', '.ag-text-field'], ['search-field/SearchField.css', '.ag-search-field']] as const) {
    const css = parseCss(`src/components/${family}`);
    const CONTROL = `${root} [data-ag-part='control']`;
    it(`${root}: :autofill / :-webkit-autofill paint the shell fill and on-surface ink`, () => {
      for (const sel of [`${CONTROL}:autofill`, `${CONTROL}:-webkit-autofill`]) {
        const r = rulesWith(css, sel);
        expect(declOf(r, 'box-shadow')).toBe('inset 0 0 0 var(--ag-target-min) var(--_ag-fill, var(--ag-color-canvas))');
        expect(declOf(r, '-webkit-text-fill-color')).toBe('var(--ag-color-on-surface)');
      }
    });
    it(`${root}: the coarse rule sets >= 16px and out-ranks every sized text rule`, () => {
      const coarse = [...rulesWith(css, CONTROL, coarsePointer), ...rulesWith(css, `${CONTROL}[data-ag-size]`, coarsePointer)];
      expect(coarse).toHaveLength(2);
      for (const r of coarse) expect(declOf([r], 'font-size')).toBe('max(16px, 1em)');
      const sized = rulesWith(css, `${CONTROL}[data-ag-size]`, coarsePointer)[0]!;
      /* every non-coarse font-size rule on a sized control loses to the coarse one:
         lower specificity, or equal specificity earlier in the file */
      css.walkRules((r) => {
        if (atOf(r) || !r.some((n) => n.type === 'decl' && n.prop === 'font-size')) return;
        for (const sel of r.selectors) {
          if (!sel.includes("[data-ag-part='control']")) continue;
          const a = specificity(sel), b = specificity(`${CONTROL}[data-ag-size]`);
          const earlier = (r.source?.start?.offset ?? 0) < (sized.source?.start?.offset ?? 0);
          expect(a < b || (a === b && earlier)).toBe(true);
        }
      });
    });
  }
  it('the shared sm control rule ([data-size-class][data-ag-size]) is out-ranked by the coarse rule', () => {
    /* (0,2,0) shared rule vs (0,3,0) `.ag-text-field [data-ag-part='control'][data-ag-size]` */
    const shared = parseCss('src/components/control-shared/controls.css');
    expect(declOf(rulesWith(shared, "[data-size-class='control'][data-ag-size='sm']"), 'font-size')).toBe('var(--ag-type-label-size)');
    expect(specificity("[data-size-class='control'][data-ag-size='sm']")).toBeLessThan(specificity(".ag-text-field [data-ag-part='control'][data-ag-size]"));
  });
});

/* REQ-CMP-67 (Select; Combobox shares the entrance): the popup materialises
   from var(--transform-origin) with opacity + scale 0.96 -> 1 over
   --ag-duration-small (exit --ag-duration-small-exit); opacity only under calm
   and reduced motion; no transition under none; backdrop-filter never moves. */
describe('select / combobox popup motion (REQ-CMP-67)', () => {
  for (const [file, popup] of [['select/Select.css', '.ag-select-popup'], ['combobox/Combobox.css', '.ag-combobox-popup']] as const) {
    const css = parseCss(`src/components/${file}`);
    it(`${popup}: transition on the popup itself (enter + exit), opacity + scale over duration-small`, () => {
      const base = rulesWith(css, popup);
      expect(declOf(base, 'transform-origin')).toBe('var(--transform-origin)');
      expect(declOf(base, 'transition')?.replace(/\s+/g, ' ')).toBe(
        'opacity var(--ag-duration-small) var(--ag-ease-standard), scale var(--ag-duration-small) var(--ag-ease-standard)');
      for (const st of ['data-starting-style', 'data-ending-style']) {
        const r = rulesWith(css, `${popup}[${st}]`);
        expect(declOf(r, 'opacity')).toBe('0');
        expect(declOf(r, 'scale')).toBe('0.96');
        expect(declOf(r, 'transform')).toBeUndefined();
      }
      expect(declOf(rulesWith(css, `${popup}[data-ending-style]`), 'transition-duration')).toBe('var(--ag-duration-small-exit)');
    });
    it(`${popup}: calm keeps opacity only (scale 1, no transform); none has no transition`, () => {
      for (const sel of [popup, `${popup}[data-starting-style]`, `${popup}[data-ending-style]`]) {
        expect(declOf(rulesWith(css, `[data-ag-motion='calm'] ${sel}`), 'scale')).toBe('1');
      }
      expect(declOf(rulesWith(css, `[data-ag-motion='none'] ${popup}`), 'transition')).toBe('none');
      const rm = rulesWith(css, `${popup}[data-starting-style]`, reducedMotion);
      expect(declOf(rm, 'scale')).toBe('1');
      expect(declOf(rm, 'transition-property')).toBe('opacity');
    });
    it(`${popup}: no transition list names backdrop-filter or transform`, () => {
      css.walkDecls(/^transition/, (d) => {
        expect(d.value).not.toMatch(/backdrop-filter|\bfilter\b/);
        if ((d.parent as PRule).selector?.includes(popup)) expect(d.value).not.toMatch(/\btransform\b/);
      });
    });
  }
});

/* REQ-CMP-42: the indicator is the only selected cue; it moves by transform +
   inline-size with --ag-spring-snappy over --ag-duration-small only while
   [data-ag-animating] and not during a View Transition; calm/none and reduced
   motion jump. */
describe('segmented-control indicator (REQ-CMP-42)', () => {
  const css = parseCss('src/components/segmented-control/SegmentedControl.css');
  const IND = ".ag-segmented-control [data-ag-part='indicator']";
  const MOVING = `${IND}[data-ag-animating]:not([data-ag-vt])`;
  it('checked items paint no platter of their own', () => {
    for (const sel of ['.ag-segmented-item[data-checked]', ".ag-segmented-item[aria-checked='true']"]) {
      for (const r of rulesWith(css, sel)) {
        r.walkDecls((d) => { expect(['background', 'background-color', 'box-shadow']).not.toContain(d.prop); });
      }
    }
  });
  it('rest: opaque inner fill, no transition; moving: engine fill + will-change transform', () => {
    expect(declOf(rulesWith(css, IND), 'transition')).toBeUndefined();
    expect(declOf(rulesWith(css, IND), 'transform')).toBe('translate3d(var(--_ag-seg-x, 0px), var(--_ag-seg-y, 0px), 0)');
    expect(declOf(rulesWith(css, `${IND}[data-ag-animating]`), 'background')).toBe('var(--_ag-surface-fill, transparent)');
    expect(declOf(rulesWith(css, `${IND}[data-ag-animating]`), 'will-change')).toBe('transform');
  });
  it('moves by transform + inline-size with the snappy spring over duration-small', () => {
    const t = declOf(rulesWith(css, MOVING), 'transition')?.replace(/\s+/g, ' ');
    expect(t).toMatch(/^transform var\(--ag-duration-small\) var\(--ag-spring-snappy/);
    expect(t).toMatch(/inline-size var\(--ag-duration-small\) var\(--ag-spring-snappy/);
  });
  it('calm, none and reduced motion jump', () => {
    expect(declOf(rulesWith(css, `[data-ag-motion='calm'] ${MOVING}`), 'transition')).toBe('none');
    expect(declOf(rulesWith(css, `[data-ag-motion='none'] ${MOVING}`), 'transition')).toBe('none');
    expect(declOf(rulesWith(css, MOVING, reducedMotion), 'transition')).toBe('none');
  });
});

/* REQ-CMP-40: items in a capsule toolbar are concentric; no viewport query and
   no self-referencing inline-size container on the bar. */
describe('toolbar concentric items + overflow CSS (REQ-CMP-40)', () => {
  const css = parseCss('src/components/toolbar/Toolbar.css');
  it('item radius = max(0, root radius - root inset)', () => {
    expect(declOf(rulesWith(css, ".ag-toolbar[data-ag-shape='capsule']"), 'border-radius')).toBe('var(--ag-radius-full)');
    expect(declOf(rulesWith(css, '.ag-toolbar'), 'padding')).toBe('var(--ag-space-1)');
    for (const item of ['.ag-button', '.ag-toolbar-link']) {
      expect(declOf(rulesWith(css, `.ag-toolbar[data-ag-shape='capsule'] ${item}`), 'border-radius'))
        .toBe('max(var(--ag-space-0), calc(var(--ag-radius-full) - var(--ag-space-1)))');
    }
  });
  it('the bar is not a size container (its width would stop following its items) and never exceeds its parent', () => {
    expect(declOf(rulesWith(css, '.ag-toolbar'), 'container-type')).toBeUndefined();
    expect(declOf(rulesWith(css, '.ag-toolbar'), 'max-inline-size')).toBe('100%');
    css.walkAtRules('media', (a) => { expect(a.params).not.toMatch(/width/); });
  });
});
