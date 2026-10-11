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
