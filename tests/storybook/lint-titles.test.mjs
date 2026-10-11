/**
 * @jest-environment node
 */
/* REQ-QUAL-49 (REQ-FIN-106, FIN-450): title lint — one failing fixture per rule, a passing fixture, and the real
   story set (computed from source) green against the expiring baseline with violations listed per owner. */
import { describe, expect, it } from '@jest/globals';
import { lintTitles, RULES, MAX_COMPONENT_STORIES } from '../../scripts/storybook/lint-titles.mjs';
import { staticIndex, loadMetas, ROOT } from '../../scripts/storybook/lib/story-static.mjs';
import { compare, loadBaseline, packageVersion, formatByOwner } from '../../scripts/storybook/lib/baseline.mjs';

const metas = [
  { name: 'Button', owner: 'CMP', flagship: 1 },
  { name: 'Badge', owner: 'CMP' },
  { name: 'Table', owner: 'SURF', flagship: 32 },
];
let n = 0;
const story = (title, name, extra = {}) => ({
  type: 'story', id: `fx-${(n += 1)}`, title, name, importPath: './src/fixture.stories.tsx', owner: 'CMP', ...extra,
});
const flagshipTitle = (count = 3) => ['Playground', 'States', 'Keyboard', 'Loading', 'Disabled'].slice(0, count)
  .map((s) => story('Flagships/Controls/Button', s, { subject: 'Button', kind: 'component' }));
const rulesOf = (entries) => [...new Set(lintTitles(entries, metas).map((v) => v.rule))].sort();

describe('lint-titles rules (one failing fixture each)', () => {
  it('passes a clean story set', () => {
    const entries = [...flagshipTitle(3), story('Core/Badge', 'Neutral', { subject: 'Badge', kind: 'component' }),
      story('Core/Badge', 'Danger', { subject: 'Badge', kind: 'component' })];
    expect(lintTitles(entries, metas)).toEqual([]);
  });

  it('version-segment: a title segment like 5.0', () => {
    expect(rulesOf([...flagshipTitle(), story('Core/5.0/Badge', 'Neutral', { subject: 'Badge' })])).toContain('version-segment');
  });

  it('lowercase-leaf', () => {
    expect(rulesOf([...flagshipTitle(), story('Core/badge', 'Neutral')])).toContain('lowercase-leaf');
  });

  it('glass-prefix (D-14)', () => {
    expect(rulesOf([...flagshipTitle(), story('Core/GlassBadge', 'Neutral')])).toContain('glass-prefix');
  });

  it('multi-group: one component titled in two groups', () => {
    const v = lintTitles([...flagshipTitle(), story('Core/Button', 'Neutral', { subject: 'Button' })], metas);
    expect(v.filter((x) => x.rule === 'multi-group').map((x) => x.key).sort()).toEqual(['Core/Button', 'Flagships/Controls/Button']);
  });

  it('leaf-not-meta-name: leaf differs from the subject ComponentMeta.name', () => {
    expect(rulesOf([...flagshipTitle(), story('Core/Pill', 'Neutral', { subject: 'Badge' })])).toContain('leaf-not-meta-name');
  });

  it('too-many-stories: >12 non-matrix stories (matrix stories do not count)', () => {
    const many = Array.from({ length: MAX_COMPONENT_STORIES + 1 }, (_, i) => story('Flagships/Data/Table', `S${i}`, { subject: 'Table', kind: 'component' }));
    expect(rulesOf([...flagshipTitle(), ...many])).toContain('too-many-stories');
    const withMatrix = [...many.slice(0, MAX_COMPONENT_STORIES), story('Flagships/Data/Table', 'Matrix', { subject: 'Table', kind: 'matrix' })];
    expect(rulesOf([...flagshipTitle(), ...withMatrix])).not.toContain('too-many-stories');
  });

  it('oversize-title: a non-flagship title larger than the smallest flagship title', () => {
    const big = ['A', 'B', 'C', 'D'].map((s) => story('Core/Badge', s, { subject: 'Badge' }));
    expect(rulesOf([...flagshipTitle(3), ...big])).toContain('oversize-title');
    expect(rulesOf([...flagshipTitle(5), ...big])).not.toContain('oversize-title');
    const lab = ['A', 'B', 'C', 'D'].map((s) => story('Material Lab/Clear', s));
    expect(rulesOf([...flagshipTitle(3), ...lab])).not.toContain('oversize-title');
  });

  it('default-variants-only: story set exactly {Default, Variants}', () => {
    expect(rulesOf([...flagshipTitle(), story('Core/Badge', 'Default'), story('Core/Badge', 'Variants')])).toContain('default-variants-only');
  });

  it('covers all eight REQ-QUAL-49 rules', () => {
    expect(RULES).toHaveLength(8);
  });

  it('attributes each violation to the owner of the story file', () => {
    const v = lintTitles([...flagshipTitle(), story('Core/badge', 'Neutral', { owner: 'SURF' })], metas);
    expect(v.find((x) => x.rule === 'lowercase-leaf')).toMatchObject({ owner: 'SURF', check: 'story-titles', file: 'src/fixture.stories.tsx' });
  });
});

describe('lint-titles on the repository story set', () => {
  const { entries } = staticIndex(ROOT);
  const violations = lintTitles(entries, loadMetas(ROOT));
  const r = compare(violations, loadBaseline(ROOT), { checks: ['story-titles'], version: packageVersion(ROOT) });

  it('indexes the story files matched by .storybook/main.ts', () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length);
  });

  it('introduces no violation outside the expiring baseline', () => {
    expect(r.introduced.map((v) => `${v.owner}: ${v.message}`)).toEqual([]);
  });

  it('lists the pre-existing violations per owner', () => {
    const owners = new Set(r.baselined.map((v) => v.owner));
    for (const o of owners) expect(['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL', 'NONE']).toContain(o);
    expect(formatByOwner(r.baselined)).toEqual(expect.any(String));
  });
});
