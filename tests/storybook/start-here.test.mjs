/**
 * @jest-environment node
 */
/* REQ-QUAL-52 (REQ-FIN-106, FIN-450): Start Here. Counts come from the index + inventory + package.json version;
   every ?path= link resolves in the index (a bogus one fails the build check); no version literal in the page. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { computeStartHere, brokenPathLinks, START_HERE_ID, VERSION_LITERAL_RE } from '../../scripts/storybook/lib/start-here.mjs';
import { verifyStartHere, START_HERE_FILES } from '../../scripts/storybook/verify-start-here.mjs';
import { ROOT } from '../../scripts/storybook/lib/story-static.mjs';

const index = {
  v: 5,
  entries: {
    [START_HERE_ID]: { type: 'docs', id: START_HERE_ID, title: 'Start Here', name: 'Docs', tags: ['unattached-mdx'] },
    'flagships-controls-button--docs': { type: 'docs', id: 'flagships-controls-button--docs', title: 'Flagships/Controls/Button', name: 'Docs', tags: ['autodocs'] },
    'flagships-controls-button--playground': { type: 'story', id: 'flagships-controls-button--playground', title: 'Flagships/Controls/Button', name: 'Playground', tags: ['flagship'] },
    'flagships-controls-button--keyboard': { type: 'story', id: 'flagships-controls-button--keyboard', title: 'Flagships/Controls/Button', name: 'Keyboard', tags: ['apg', 'play-fn'] },
    'core-badge--neutral': { type: 'story', id: 'core-badge--neutral', title: 'Core/Badge', name: 'Neutral', tags: [] },
    'material-lab--clear': { type: 'story', id: 'material-lab--clear', title: 'Material Lab', name: 'Clear', tags: ['lab', 'play-fn'] },
  },
};
const metas = [{ name: 'Button', flagship: 1 }, { name: 'IconButton', flagship: 2 }, { name: 'Badge' }, { name: 'Badge' }];

describe('computeStartHere', () => {
  const data = computeStartHere({ index, metas, version: '9.9.9-test.1' });

  it('computes flagships, core, stories and interaction flows', () => {
    expect(data.counts).toEqual({ flagships: 2, core: 1, stories: 4, flows: 2 });
    expect(data.version).toBe('9.9.9-test.1');
  });

  it('links each present group to its first entry (docs first)', () => {
    expect(data.groups.find((g) => g.name === 'Flagships')).toEqual({ name: 'Flagships', count: 2, path: '/docs/flagships-controls-button--docs' });
    expect(data.groups.find((g) => g.name === 'Material Lab')?.path).toBe('/story/material-lab--clear');
    expect(data.groups.find((g) => g.name === 'Showcases')?.path).toBeNull();
  });

  it('requires the package version', () => {
    expect(() => computeStartHere({ index, metas, version: '' })).toThrow(/version/);
  });

  it('counts follow the input (no literals): adding a story changes the count', () => {
    const more = { entries: { ...index.entries, 'core-badge--danger': { type: 'story', id: 'core-badge--danger', title: 'Core/Badge', name: 'Danger', tags: [] } } };
    expect(computeStartHere({ index: more, metas, version: '1.0.0' }).counts.stories).toBe(5);
  });
});

describe('link validation', () => {
  it('accepts links that resolve and rejects a bogus ?path=', () => {
    expect(brokenPathLinks('<a href="?path=/story/core-badge--neutral">Badge</a>', index)).toEqual([]);
    expect(brokenPathLinks('<a href="?path=/story/core-badge--nope">Badge</a>', index)).toEqual(['/story/core-badge--nope']);
    expect(brokenPathLinks('[x](?path=/docs/core-badge--neutral)', index)).toEqual(['/docs/core-badge--neutral']);
  });

  it('verifyStartHere fails on a bogus link, a version literal and a missing Start Here entry', () => {
    const ok = verifyStartHere({ index, sources: { 'a.mdx': '<StartHere />' }, metas, version: '1.0.0' });
    expect(ok.problems).toEqual([]);
    const bogus = verifyStartHere({ index, sources: { 'a.mdx': '[Go](?path=/story/missing--story)' }, metas, version: '1.0.0' });
    expect(bogus.problems).toEqual(['a.mdx: ?path=/story/missing--story is not in the index']);
    const literal = verifyStartHere({ index, sources: { 'a.mdx': 'AuraGlass 5.0.0 ships' }, metas, version: '1.0.0' });
    expect(literal.problems[0]).toMatch(/version literal "5\.0\.0"/);
    const { [START_HERE_ID]: _gone, ...rest } = index.entries;
    expect(verifyStartHere({ index: { entries: rest }, sources: {}, metas, version: '1.0.0' }).problems).toEqual([`index has no ${START_HERE_ID} entry`]);
  });
});

describe('stories/qual/StartHere', () => {
  it('exists, and carries no version literal and no ?path= literal', () => {
    for (const f of START_HERE_FILES) {
      expect(existsSync(join(ROOT, f))).toBe(true);
      const src = readFileSync(join(ROOT, f), 'utf8');
      expect(VERSION_LITERAL_RE.test(src)).toBe(false);
      expect(/5\.[0-9]\.[0-9]/.test(src)).toBe(false);
      expect(brokenPathLinks(src, index)).toEqual([]);
    }
  });

  it('the MDX is titled Start Here and renders the computed component', () => {
    const mdx = readFileSync(join(ROOT, 'stories/qual/StartHere.mdx'), 'utf8');
    expect(mdx).toMatch(/<Meta title="Start Here" \/>/);
    expect(mdx).toMatch(/<StartHere \/>/);
    const tsx = readFileSync(join(ROOT, 'stories/qual/StartHere.tsx'), 'utf8');
    expect(tsx).toMatch(/import \{ version \} from '..\/..\/package.json'/);
    expect(tsx).toMatch(/computeStartHere\(/);
  });
});
