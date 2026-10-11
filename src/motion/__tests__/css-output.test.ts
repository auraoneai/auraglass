/* @jest-environment node */
/* MAT-201 REQ-MOT-T03: PostCSS parse of the motion CSS that ships inside
   dist/styles.css. The remote build concatenates the fragments/css/mat.ts files
   verbatim, so assertions run over the same bytes: each source file plus a
   virtual concat that models the bundle. Also covers MAT-192/193/194/195/196
   parse-level assertions (allow-list, no-geometry, selector presence). */
import { describe, expect, it } from '@jest/globals';
import postcss from 'postcss';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ANIMATABLE, MOTION_CSS_VARS } from '../../contracts/motion';
import { LAYER_ORDER_STATEMENT } from '../../contracts/tokens';

const dir = join(__dirname, '..', 'css');
const FILES = {
  motion: join(dir, 'motion.css'),
  modes: join(dir, 'motion-modes.css'),
  loading: join(dir, 'loading.css'),
  vt: join(dir, 'view-transition.css'),
} as const;

const read = (p: string) => readFileSync(p, 'utf8');
const parse = (p: string) => postcss.parse(read(p), { from: p });
const concat = postcss.parse(Object.values(FILES).map(read).join('\n'), { from: 'dist/styles.css' });

const rules = (root: postcss.Root): postcss.Rule[] => {
  const out: postcss.Rule[] = [];
  root.walkRules((r) => { out.push(r); });
  return out;
};
const decls = (node: postcss.Container): postcss.Declaration[] => {
  const out: postcss.Declaration[] = [];
  node.walkDecls((d) => { out.push(d); });
  return out;
};
/** split a shorthand on top-level commas only (commas inside var()/calc() don't split) */
const legs = (value: string): string[] => {
  const out: string[] = [];
  let depth = 0, cur = '';
  for (const ch of value) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
};
/** first tokens of each leg of every transition / transition-property decl */
const transitionProps = (node: postcss.Container): string[] => {
  const props: string[] = [];
  node.walkDecls(/^transition(-property)?$/, (d) => {
    for (const leg of legs(d.value)) {
      const first = leg.trim().split(/\s+/)[0];
      if (first && first !== 'all' && first !== 'none') props.push(first);
    }
  });
  return props;
};
/* REQ-MAT-42: every transition list in the MAT-owned motion files
   (motion.css, view-transition.css) is a subset of ANIMATABLE (S-12) — no
   --_ag-hover, display/overlay, rotate or paint colours. motion-modes.css's
   calm paint-property list (color/background-color/border-color/outline-color)
   is REQ-FIN-12's file (FIN-A) and is checked against this wider set until
   that change lands. */
const MAT_TRANSITION_FILES = ['motion', 'vt'] as const;
const FOREIGN_MODES_ALLOWED = new Set([
  ...ANIMATABLE, 'color', 'background-color', 'border-color', 'outline-color',
]);

describe('REQ-MOT-10: @property registrations', () => {
  const atProps = () => {
    const out: postcss.AtRule[] = [];
    parse(FILES.motion).walkAtRules('property', (r) => { out.push(r); });
    return out;
  };
  it('registers exactly the four motion scalars, all unlayered, inherits:false', () => {
    const regs = atProps().map((r) => r.params.trim());
    expect(regs).toEqual(['--_ag-hover', '--_ag-press', '--_ag-optics', '--_ag-pointer']);
    for (const r of atProps()) {
      expect(r.parent?.type).toBe('root'); // unlayered
      const get = (n: string) => decls(r).find((d) => d.prop === n)?.value;
      expect(get('inherits')).toBe('false');
    }
  });
  it('syntax + initial values per contract', () => {
    const map = new Map(atProps().map((r) => [r.params.trim(), r]));
    const check = (name: string, syntax: string, initial: string) => {
      const r = map.get(name);
      expect(r).toBeTruthy();
      const get = (n: string) => decls(r!).find((d) => d.prop === n)?.value;
      expect(get('syntax')).toBe(syntax);
      expect(get('initial-value')).toBe(initial);
    };
    check('--_ag-hover', "'<number>'", '0');
    check('--_ag-press', "'<number>'", '0');
    check('--_ag-optics', "'<number>'", '1');
    check('--_ag-pointer', "'<percentage>+'", '50% 30%');
  });
  it('no runtime registration anywhere in motion css', () => {
    const src = Object.values(FILES).map(read).join('\n');
    expect(src).not.toMatch(/registerProperty/);
  });
});

describe('layering (REQ-MAT-19)', () => {
  const LAYERS: Record<keyof typeof FILES, string> = {
    motion: 'ag.material', loading: 'ag.material', vt: 'ag.material', modes: 'ag.a11y',
  };
  for (const [name, file] of Object.entries(FILES) as Array<[keyof typeof FILES, string]>) {
    it(`${name} starts with the layer order statement and 0 !important`, () => {
      const text = read(file);
      expect(text).toContain(LAYER_ORDER_STATEMENT);
      expect(text).not.toMatch(/!important/);
    });
    it(`${name} keeps every rule inside its ${LAYERS[name]} block`, () => {
      const root = parse(file);
      const stray: string[] = [];
      root.each((node) => {
        if (node.type === 'atrule' && node.name === 'property') return;
        if (node.type === 'atrule' && node.name === 'layer') return;
        if (node.type === 'comment') return;
        stray.push(`${node.type}:${node.toString().slice(0, 60)}`);
      });
      expect(stray).toEqual([]);
      const contentLayers: postcss.AtRule[] = [];
      root.walkAtRules('layer', (r) => { if (r.nodes?.length) contentLayers.push(r); });
      expect(contentLayers).toHaveLength(1);
      expect(contentLayers[0]!.params).toBe(LAYERS[name]);
      root.walkAtRules('keyframes', (r) => {
        expect(r.parent?.type).toBe('atrule');
        expect((r.parent as postcss.AtRule).name).toBe('layer');
      });
    });
  }
});

describe('REQ-MOT-13: banned properties never transition or animate', () => {
  const BANNED = /\b(backdrop-filter|-webkit-backdrop-filter|filter|box-shadow|width|height|top|left|inset|border-radius|clip-path)\b/;
  it('no banned property in any transition or keyframes', () => {
    const bad: string[] = [];
    concat.walkDecls(/^transition(-property)?$/, (d) => {
      if (BANNED.test(d.value)) bad.push(`${d.prop}: ${d.value} @ ${d.source?.start?.line}`);
    });
    concat.walkAtRules('keyframes', (k) => {
      k.walkDecls((d) => { if (BANNED.test(d.prop)) bad.push(`keyframe ${d.prop} @ ${k.params}`); });
    });
    expect(bad).toEqual([]);
  });
  it('no transition: all', () => {
    const bad: string[] = [];
    concat.walkDecls(/^transition(-property)?$/, (d) => {
      if (/(^|,)\s*all\b/.test(d.value)) bad.push(d.value);
    });
    expect(bad).toEqual([]);
  });
  it('no backdrop-filter anywhere in motion css', () => {
    for (const f of Object.values(FILES)) expect(read(f)).not.toMatch(/backdrop-filter/);
  });
});

describe('REQ-MOT-11/-100: hover/press are light-only', () => {
  const hoverPress = rules(parse(FILES.motion)).filter((r) =>
    /:hover|:active|\[data-pressed\]/.test(r.selector));
  it('hover/press rules exist and set only the scalars', () => {
    expect(hoverPress.length).toBeGreaterThanOrEqual(2);
    const texts = hoverPress.map((r) => r.toString()).join('\n');
    expect(texts).not.toContain('--_ag-hover');
    expect(texts).toContain('--_ag-press: 1');
    expect(texts).toContain('--ag-state-hover-specular');
  });
  it('no transform-family property in any hover/press rule (SC-38)', () => {
    const bad: string[] = [];
    for (const r of hoverPress) {
      decls(r).forEach((d) => {
        if (/^(transform|translate|scale|rotate)$/.test(d.prop)) bad.push(`${r.selector} -> ${d.prop}`);
      });
      r.walkDecls(/^transition/, (d) => {
        if (/\b(transform|translate|scale|rotate)\b/.test(d.value)) bad.push(`${r.selector} -> ${d.prop}:${d.value}`);
      });
    }
    expect(bad).toEqual([]);
  });
});

describe('REQ-MOT-12/-18, REQ-MAT-42: transition allow-list', () => {
  const offenders = (root: postcss.Root, allowed: ReadonlySet<string>): string[] => {
    const bad: string[] = [];
    root.walk((node) => {
      if (node.type === 'rule' || (node.type === 'atrule' && node.name === 'starting-style')) {
        for (const p of transitionProps(node as postcss.Container)) {
          if (!allowed.has(p)) bad.push(`${node.type === 'rule' ? (node as postcss.Rule).selector : '@' + (node as postcss.AtRule).name} -> ${p}`);
        }
      }
    });
    return bad;
  };
  const animatable: ReadonlySet<string> = new Set(ANIMATABLE);
  for (const name of MAT_TRANSITION_FILES) {
    it(`${name}: every transitioned property is in ANIMATABLE`, () => {
      expect(offenders(parse(FILES[name]), animatable)).toEqual([]);
    });
    it(`${name}: no discrete display/overlay transitions or transition-behavior`, () => {
      const bad: string[] = [];
      parse(FILES[name]).walkDecls(/^transition(-behavior)?$/, (d) => {
        if (d.prop === 'transition-behavior' || /allow-discrete/.test(d.value)) bad.push(`${d.prop}: ${d.value}`);
      });
      expect(bad).toEqual([]);
    });
  }
  it('loading.css transitions only ANIMATABLE properties', () => {
    expect(offenders(parse(FILES.loading), animatable)).toEqual([]);
  });
  it('motion-modes.css stays within ANIMATABLE plus its calm paint list (REQ-FIN-12 file)', () => {
    expect(offenders(parse(FILES.modes), FOREIGN_MODES_ALLOWED)).toEqual([]);
  });
});

describe('REQ-MOT-14/-16/-17: popup materialize', () => {
  const motionRules = rules(parse(FILES.motion));
  const sel = (re: RegExp) => motionRules.filter((r) => re.test(r.selector));
  it('starting/ending style rules exist across the overlay families', () => {
    expect(sel(/\[data-starting-style\]/).length).toBeGreaterThanOrEqual(1);
    expect(sel(/\[data-ending-style\]/).length).toBeGreaterThanOrEqual(1);
    const text = motionRules.map((r) => r.selector).join(',');
    for (const f of ['dialog', 'alert-dialog', 'sheet', 'toast', 'popover', 'menu', 'select', 'combobox', 'tooltip', 'preview-card']) {
      expect(text).toContain(`data-ag-overlay=${f}`);
    }
  });
  it('starting/ending styles set --_ag-optics:0 and carry will-change', () => {
    const start = motionRules.find((r) => r.selector === '[data-starting-style]');
    const end = motionRules.find((r) => r.selector === '[data-ending-style]');
    expect(start).toBeTruthy();
    expect(end).toBeTruthy();
    expect(start!.toString()).toContain('--_ag-optics: 0');
    expect(start!.toString()).toContain('will-change: transform, opacity');
    expect(start!.toString()).toContain('transform-origin: var(--transform-origin)');
    expect(end!.toString()).toContain('--_ag-optics: 0');
    expect(end!.toString()).toContain('will-change: transform, opacity');
  });
  it('will-change appears only under starting/ending/animating selectors', () => {
    const offenders: string[] = [];
    parse(FILES.motion).walkDecls('will-change', (d) => {
      const rule = d.parent as postcss.Rule;
      for (const s of rule.selectors ?? [rule.selector]) {
        if (!/\[(data-starting-style|data-ending-style|data-ag-animating)\]/.test(s)) offenders.push(s);
      }
    });
    expect(offenders).toEqual([]);
  });
  it('menu family translates from the anchor side; sheet along its edge', () => {
    const src = read(FILES.motion);
    expect(src).toContain('var(--_ag-side-sign, 0) * 4px');
    expect(src).toContain('var(--_ag-edge-x) * 100%');
    expect(src).toContain('var(--_ag-edge-y) * 100%');
  });
  it('exit transitions run on exit durations + accelerate ease', () => {
    const joined = sel(/\[data-ending-style\]/).map((r) => r.toString()).join('\n');
    expect(joined).toContain('var(--ag-duration-small-exit)');
    expect(joined).toContain('var(--ag-ease-accelerate)');
  });
});

describe('REQ-MOT-15: @starting-style scoping', () => {
  it('only toast-item and thread-message get @starting-style', () => {
    const found: string[] = [];
    parse(FILES.motion).walkAtRules('starting-style', (r) => {
      found.push((r.parent as postcss.Rule).selector.replace(/\s+/g, ' '));
    });
    expect(found).toEqual(['[data-ag-part=toast-item], [data-ag-part=thread-message]']);
  });
  it('@starting-style touches opacity + translate only', () => {
    parse(FILES.motion).walkAtRules('starting-style', (r) => {
      expect(decls(r).map((d) => d.prop).sort()).toEqual(['opacity', 'translate']);
    });
  });
  it('no starting-style rule targets layout parts at rest', () => {
    const src = read(FILES.motion);
    for (const part of ['stack', 'grid', 'container', 'separator', 'text', 'heading', 'card']) {
      expect(src).not.toContain(`data-ag-part=${part}`);
    }
  });
});

describe('REQ-MOT-30/-31/-32: loading sweep', () => {
  const root = parse(FILES.loading);
  it('ships exactly one keyframes, named ag-sweep, translate-only', () => {
    const kf: postcss.AtRule[] = [];
    root.walkAtRules('keyframes', (r) => { kf.push(r); });
    expect(kf).toHaveLength(1);
    expect(kf[0]!.params).toBe('ag-sweep');
    const props = new Set<string>();
    kf[0]!.walkDecls((d) => { props.add(d.prop); });
    expect([...props]).toEqual(['translate']);
  });
  it('ag-sweep is 1400ms / --ag-ease-standard / infinite, only under [data-ag-continuous=on]', () => {
    const uses: string[] = [];
    root.walkDecls('animation', (d) => {
      if (!d.value.includes('ag-sweep')) return;
      uses.push(d.value);
      let p = d.parent as postcss.Container | undefined;
      const chain: string[] = [];
      while (p) {
        if (p.type === 'rule') chain.push((p as postcss.Rule).selector);
        p = p.parent as postcss.Container | undefined;
      }
      expect(chain.join(' >> ')).toContain('data-ag-continuous=on');
    });
    expect(uses).toHaveLength(1);
    expect(uses[0]).toContain('1400ms');
    expect(uses[0]).toContain('var(--ag-ease-standard)');
    expect(uses[0]).toContain('infinite');
  });
  it('[data-ag-offscreen] pauses animations', () => {
    const text = read(FILES.loading);
    expect(text).toContain('[data-ag-offscreen]');
    expect(text).toContain('animation-play-state: paused');
  });
});

describe('REQ-MOT-37: view-transition optics block', () => {
  const text = read(FILES.vt);
  it('contains the §4.7 rules', () => {
    expect(text).toContain(':root:active-view-transition [data-ag-surface][data-ag-vt]');
    expect(text).toContain(':root:active-view-transition [data-ag-surface][data-ag-vt-participant]');
    expect(text).toContain('--_ag-optics: 0');
    expect(text).toContain('::view-transition-group(*.ag-morph)');
    expect(text).toContain('var(--ag-duration-medium)');
    expect(text).toContain('var(--ag-spring-fluid)');
    expect(text).toContain('[data-ag-surface][data-ag-vt-settled]');
    expect(text).toContain('var(--ag-duration-micro)');
  });
  it('has the calm fallback (ag-morph-calm) with no group animation', () => {
    expect(text).toContain('::view-transition-group(*.ag-morph-calm)');
    expect(text).toContain('::view-transition-old(*.ag-morph-calm)');
    expect(text).toContain('::view-transition-new(*.ag-morph-calm)');
  });
});

describe('global invariants', () => {
  it('every @keyframes name is ag-prefixed', () => {
    const names: string[] = [];
    concat.walkAtRules('keyframes', (r) => { names.push(r.params); });
    expect(names.length).toBeGreaterThan(0);
    for (const n of names) expect(n).toMatch(/^ag-/);
  });
  it('MOTION_CSS_VARS are referenced, never redeclared outside mode remapping', () => {
    // modes.css legitimately rebinds --ag-spring-* to --ag-ease-standard inside
    // [data-ag-motion=calm] subtrees (REQ-MAT-44); every other file only consumes.
    const src = [FILES.motion, FILES.loading, FILES.vt].map(read).join('\n');
    const bad: string[] = [];
    postcss.parse(src).walkDecls((d) => {
      if ((MOTION_CSS_VARS as readonly string[]).includes(d.prop)) bad.push(d.prop);
    });
    expect(bad).toEqual([]);
    expect(src).toContain('var(--ag-duration-');
    expect(src).toContain('var(--ag-ease-');
    expect(src).toContain('var(--ag-spring-');
  });
});
