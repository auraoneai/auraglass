/**
 * @jest-environment node
 */
/* REQ-QUAL-49 (REQ-FIN-106, FIN-450): the storySort Storybook actually reads. Storybook extracts
   `parameters.options.storySort` statically from preview.tsx (csf-tools getStorySortParameter); this test uses the
   same extractor. Its skeleton deep-equals the REQ array; each Flagships group's children follow ComponentMeta.flagship. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getStorySortParameter } from 'storybook/internal/csf-tools';
import { STORY_SORT_ORDER, FLAGSHIP_GROUPS, computeStorySort, storySortSkeleton } from '../../scripts/storybook/lint-titles.mjs';
import { ROOT, loadMetas, flagshipOrder, staticIndex } from '../../scripts/storybook/lib/story-static.mjs';
import { LAB_FILE, compare, labViolations, loadBaseline as loadLabBaseline } from '../../scripts/storybook/verify-material-lab.mjs';

const REQ_QUAL_49 = ['Start Here', 'Material Lab', 'Scenes', 'Showcases', 'Flagships',
  ['Controls', 'Overlays', 'App Shell', 'Data', 'AI', 'Media'], 'Core', 'Foundations', 'Migration'];
const previewSource = readFileSync(join(ROOT, '.storybook', 'preview.tsx'), 'utf8');
const sort = getStorySortParameter(previewSource);

describe('storySort (REQ-QUAL-49)', () => {
  it('is an inline object Storybook can read statically', () => {
    expect(sort).toEqual({ order: expect.any(Array) });
  });

  it('skeleton deep-equals the REQ-QUAL-49 array', () => {
    expect(STORY_SORT_ORDER).toEqual(REQ_QUAL_49);
    expect(storySortSkeleton(sort.order)).toEqual(REQ_QUAL_49);
  });

  it('orders every Flagships group by ComponentMeta.flagship', () => {
    const expected = flagshipOrder(loadMetas(ROOT)).map((m) => m.name);
    const groups = sort.order[5];
    expect(groups.filter((x) => !Array.isArray(x))).toEqual(FLAGSHIP_GROUPS);
    for (let i = 0; i < groups.length; i += 2) expect(groups[i + 1]).toEqual(expected);
    expect(sort.order).toEqual(computeStorySort(loadMetas(ROOT)));
  });

  it('the generated order follows flagship numbers, not names', () => {
    const order = computeStorySort([{ name: 'Zeta', flagship: 1 }, { name: 'Alpha', flagship: 2 }, { name: 'Core', flagship: undefined }]);
    expect(order[5][1]).toEqual(['Zeta', 'Alpha']);
  });
});

describe('story index computed from source', () => {
  const { entries } = staticIndex(ROOT);
  it('has unique Storybook ids', () => {
    const dup = entries.map((e) => e.id).filter((id, i, a) => a.indexOf(id) !== i);
    expect(dup).toEqual([]);
  });
  it('every entry carries an owner from contracts/ownership.json', () => {
    expect(entries.filter((e) => !e.owner)).toEqual([]);
  });
});

/* REQ-QUAL-53 (REQ-FIN-106, FIN-451): the Material Lab is exactly twelve `lab` stories, in the required order, all from
   .storybook/lab/MaterialLab.stories.tsx, with parameters.ag { subject: 'lab:<id>', kind: 'lab' }. Ids use Storybook's
   own toId/storyNameFromExport (story-static.mjs), so they are the ids of the built storybook-static/index.json. */
const LAB_ORDER = ['Overview', 'Regular', 'Clear', 'Identity', 'Content Raised', 'Content Sunken', 'Tiers',
  'Nesting & Groups', 'Shape & Concentricity', 'Scroll Edge', 'Preferences', 'Motion'];
const LAB_IDS = ['overview', 'regular', 'clear', 'identity', 'content-raised', 'content-sunken', 'tiers',
  'nesting-and-groups', 'shape-and-concentricity', 'scroll-edge', 'preferences', 'motion'].map((s) => `material-lab--${s}`);

describe('Material Lab (REQ-QUAL-53)', () => {
  const { entries } = staticIndex(ROOT);
  const lab = entries.filter((e) => e.importPath === LAB_FILE);

  it('has exactly the twelve Lab stories, in order', () => {
    expect(lab.map((e) => e.name)).toEqual(LAB_ORDER);
    expect(lab.map((e) => e.id)).toEqual(LAB_IDS);
  });

  it('every Lab story is kind lab, tagged lab, QUAL-owned and served from .storybook/lab', () => {
    for (const e of lab) {
      expect({ id: e.id, title: e.title, kind: e.kind, lab: e.tags.includes('lab'), owner: e.owner })
        .toEqual({ id: e.id, title: 'Material Lab', kind: 'lab', lab: true, owner: 'QUAL' });
      expect(e.subject).toMatch(/^lab:[a-z-]+$/);
    }
    expect(new Set(lab.map((e) => e.subject)).size).toBe(12);
  });

  it('no story outside .storybook/lab/** claims the Material Lab (expiring baseline for pre-existing MAT stories)', () => {
    const version = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
    const r = compare(labViolations(entries), loadLabBaseline(ROOT), version);
    expect(r.introduced.map((v) => v.message)).toEqual([]);
    expect(r.stale.map((s) => `${s.rule} ${s.key}`)).toEqual([]);
  });

  it('the Material Lab check fails on a planted lab story outside the harness and on a colliding id', () => {
    const planted = [...entries,
      { id: 'material-lab-planted--x', title: 'Material Lab/Planted', kind: 'component', importPath: './stories/cmp/Planted.stories.tsx', owner: 'CMP' },
      { id: 'material-lab--tiers', title: 'Material Lab', kind: 'lab', importPath: './src/app-shell/Planted.stories.tsx', owner: 'SURF' },
      { id: 'core-x--y', title: 'Core/X', kind: 'lab', importPath: './stories/qual/Planted.stories.tsx', owner: 'QUAL' }];
    const r = compare(labViolations(planted), loadLabBaseline(ROOT), '5.0.0-alpha.0');
    expect(r.introduced.map((v) => `${v.rule} ${v.key} ${v.owner}`).sort()).toEqual([
      'lab-id-collision material-lab--tiers SURF', 'lab-outside-harness core-x--y QUAL', 'lab-outside-harness material-lab-planted--x CMP']);
    // From RC-1 the baseline no longer excuses anything.
    expect(compare(labViolations(entries), loadLabBaseline(ROOT), '5.0.0-rc.1').baselined).toEqual([]);
  });

  it('composes only S-05/S-06 material exports and S-21/S-22 theme exports from the library', () => {
    const src = readFileSync(join(ROOT, '.storybook', 'lab', 'MaterialLab.stories.tsx'), 'utf8');
    const libImports = [...src.matchAll(/^import\s+(type\s+)?\{([^}]*)\}\s+from\s+'(\.\.\/\.\.\/src\/[^']+)';$/gm)]
      .filter((m) => !m[1]).map((m) => ({ from: m[3], names: m[2].split(',').map((n) => n.trim().split(/\s+as\s+/)[0]).filter(Boolean) }));
    const ALLOWED = {
      '../../src/material': ['Surface', 'SurfaceGroup', 'Environment', 'ScrollEdge', 'ConcentricFrame', 'useMaterialTier', 'materialProps'],
      '../../src/theme': ['AuraGlassProvider', 'usePreference', 'useResolvedPreferences', 'usePreferenceActions'],
    };
    expect(libImports.map((i) => i.from).sort()).toEqual(Object.keys(ALLOWED).sort());
    for (const i of libImports) expect(i.names.filter((n) => !ALLOWED[i.from].includes(n))).toEqual([]);
  });
});
