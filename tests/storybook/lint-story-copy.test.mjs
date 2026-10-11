/**
 * @jest-environment node
 */
/* REQ-QUAL-50 (REQ-FIN-106, FIN-450): rendered-copy lint. Each banned phrase in a fixture story fails; the rendered
   text `Default` fails; a story merely exported as `Default` does not; the repository is green against the baseline. */
import { describe, expect, it } from '@jest/globals';
import { lintCopy, lintAllCopy, BANNED_COPY } from '../../scripts/storybook/lint-story-copy.mjs';
import { ROOT } from '../../scripts/storybook/lib/story-static.mjs';
import { compare, loadBaseline, packageVersion } from '../../scripts/storybook/lib/baseline.mjs';

const file = 'src/components/fixture/Fixture.stories.tsx';
const story = (body) => `import * as React from 'react';
export default { title: 'Core/Fixture', parameters: { ag: { subject: 'Fixture', kind: 'component' } } };
export const Neutral = { render: () => ${body} };`;
const words = (src) => lintCopy(file, src, 'CMP').map((v) => v.key.split('|')[1]);

describe('lint-story-copy', () => {
  it('passes product-realistic copy', () => {
    expect(lintCopy(file, story('<p>Invoice INV-2041 is overdue by 3 days</p>'), 'CMP')).toEqual([]);
  });

  it.each(BANNED_COPY)('fails on the banned phrase %j in JSX text', (w) => {
    expect(words(story(`<p>Note: ${w}${w.endsWith(' ') ? '' : ' '}rest</p>`))).toContain(w.trim().toLowerCase());
  });

  it('fails on banned copy in string attributes and args', () => {
    expect(words(story('<button aria-label="Click me">x</button>'))).toContain('click me');
    const args = `export default { title: 'Core/Fixture' };\nexport const A = { args: { children: 'Lorem ipsum dolor' } };`;
    expect(words(args)).toContain('lorem');
  });

  it('matches case-insensitively and the one-word glassmorphism', () => {
    expect(words(story('<p>QUANTUM layouts</p>'))).toContain('quantum');
    expect(words(story('<h2>Glassmorphism cards</h2>'))).toContain('glass morphism');
  });

  it('does not match inside other words ("Samples", "examples")', () => {
    expect(words(story('<p>Samples and examples</p>'))).toEqual([]);
  });

  it('fails on the rendered text Default, not on a story exported as Default', () => {
    expect(lintCopy(file, story('<button>Default</button>'), 'CMP').map((v) => v.rule)).toEqual(['rendered-default']);
    const exportOnly = `export default { title: 'Core/Fixture' };\nexport const Default = { args: { children: 'Archive' } };`;
    expect(lintCopy(file, exportOnly, 'CMP')).toEqual([]);
  });

  it('ignores parameters, titles and imports', () => {
    const src = `import x from './Lorem';\nexport default { title: 'Core/Quantum', parameters: { docs: { description: 'This is a story' } } };\nexport const A = {};`;
    expect(lintCopy(file, src, 'CMP')).toEqual([]);
  });

  it('attributes a violation to the owner of the file', () => {
    expect(lintCopy(file, story('<p>Lorem</p>'), 'SURF')[0]).toMatchObject({ owner: 'SURF', check: 'story-copy', file });
  });

  it('the repository introduces no copy violation outside the baseline', () => {
    const r = compare(lintAllCopy(ROOT), loadBaseline(ROOT), { checks: ['story-copy'], version: packageVersion(ROOT) });
    expect(r.introduced.map((v) => `${v.owner}: ${v.message}`)).toEqual([]);
  });
});
