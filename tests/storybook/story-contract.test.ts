/**
 * @jest-environment node
 */
/* REQ-QUAL-50 (S-41; REQ-FIN-106, FIN-450): the story-contract validator. Reads every story file in the
   .storybook/main.ts globs and checks parameters.ag, tags, the flagship Playground/States/Keyboard exports, the APG
   reference of each Keyboard story, .storybook/** imports, `any`, and the rendered copy. Every failure names the
   owner of the offending path; pre-existing offenders are in the expiring baseline, anything new fails. */
import { describe, expect, it } from '@jest/globals';
import { STORY_TAGS as CONTRACT_TAGS, REQUIRED_FLAGSHIP_STORIES as CONTRACT_REQUIRED } from '../../src/contracts/testing';
import {
  validateStoryContract, validateRepository, docsPageViolations, STORY_TAGS, STORY_KINDS, REQUIRED_FLAGSHIP_STORIES, AG_KEYS,
} from '../../scripts/storybook/lib/story-contract.mjs';
import { parseStoryFile, ROOT } from '../../scripts/storybook/lib/story-static.mjs';
import { compare, loadBaseline, packageVersion, baselineExpired, CHECKS } from '../../scripts/storybook/lib/baseline.mjs';
import { allStoryViolations } from '../../scripts/storybook/story-contract.mjs';

type V = { check: string; rule: string; key: string; owner: string; file?: string; message: string };
const metas = [
  { name: 'Button', owner: 'CMP', flagship: 1, parts: ['root'], migration: [], file: 'src/components/button/Button.meta.ts' },
  { name: 'Badge', owner: 'CMP', parts: ['root'], migration: [], file: 'src/components/badge/Badge.meta.ts' },
];
const FLAGSHIP_OK = `
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src/components/button';
const meta = { title: 'Flagships/Controls/Button', component: Button, tags: ['flagship'],
  parameters: { ag: { subject: 'Button', kind: 'component' } } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { args: { children: 'Save changes' } };
export const States: Story = { args: { children: 'Archive' } };
export const Keyboard: Story = { tags: ['apg'], args: { children: 'Send invoice' } };
`;
const apg = { references: [{ storyId: 'flagships-controls-button--keyboard', owner: 'CMP', spec: 'tests/a11y/apg/cmp/button.apg.spec.ts' }] };
const run = (sources: Record<string, string>, refs = apg): V[] => validateStoryContract(
  Object.entries(sources).map(([file, src]) => parseStoryFile(file, src, { directory: 'src' })), metas, refs,
  (f: string) => (f.startsWith('src/') ? 'CMP' : f.startsWith('stories/surf') ? 'SURF' : 'PLAT'),
) as V[];
const rules = (v: V[]) => [...new Set(v.map((x) => x.rule))].sort();
const F = 'src/components/button/Button.stories.tsx';

describe('contract constants', () => {
  it('mirror src/contracts/testing.ts (S-41)', () => {
    expect(STORY_TAGS).toEqual([...CONTRACT_TAGS]);
    expect(REQUIRED_FLAGSHIP_STORIES).toEqual([...CONTRACT_REQUIRED]);
    expect(STORY_KINDS.sort()).toEqual(['component', 'lab', 'matrix', 'scene', 'showcase']);
    expect(AG_KEYS).toEqual(['subject', 'kind', 'states', 'refraction', 'scenes', 'tier', 'axes']);
  });
});

describe('story-contract fixtures', () => {
  it('a conforming flagship passes', () => {
    expect(run({ [F]: FLAGSHIP_OK })).toEqual([]);
  });

  it('ag-missing: a ComponentMeta subject without parameters.ag', () => {
    const src = FLAGSHIP_OK.replace("parameters: { ag: { subject: 'Button', kind: 'component' } } ", '');
    expect(rules(run({ [F]: src }))).toContain('ag-missing');
  });

  it('ag-invalid: kind outside StoryKind and keys outside StoryAgParameters', () => {
    const v = run({ [F]: FLAGSHIP_OK.replace("kind: 'component'", "kind: 'block', material: 'regular'") });
    expect(v.find((x) => x.rule === 'ag-invalid')?.message).toMatch(/kind block.*unknown key material|unknown key material.*kind block/);
  });

  it('subject-unresolved: a component subject that is no ComponentMeta', () => {
    const src = `export default { title: 'Core/Pill', parameters: { ag: { subject: 'Pill', kind: 'component' } } };
export const Neutral = { args: { children: 'Paid' } };`;
    expect(rules(run({ [F]: FLAGSHIP_OK, 'src/components/pill/Pill.stories.tsx': src }))).toEqual(['subject-unresolved']);
  });

  it('tag-not-allowed', () => {
    expect(rules(run({ [F]: FLAGSHIP_OK.replace("tags: ['flagship']", "tags: ['flagship', 'autodocs']") }))).toEqual(['tag-not-allowed']);
  });

  it('flagship-missing-story: each of Playground / States / Keyboard', () => {
    for (const name of REQUIRED_FLAGSHIP_STORIES) {
      const src = FLAGSHIP_OK.replace(new RegExp(`export const ${name}: Story = [^\\n]+\\n`), '');
      const v = run({ [F]: src }).filter((x) => x.rule === 'flagship-missing-story');
      expect(v.map((x) => x.key)).toEqual([`Button|${name}`]);
      expect(v[0]!.owner).toBe('CMP');
    }
  });

  it('flagship-no-stories: a flagship meta without a story file', () => {
    expect(run({}).map((x) => `${x.rule}|${x.key}|${x.owner}`)).toEqual(['flagship-no-stories|Button|CMP']);
  });

  it('keyboard-not-apg: the Keyboard story is not tagged apg', () => {
    expect(rules(run({ [F]: FLAGSHIP_OK.replace("{ tags: ['apg'], ", '{ ') }))).toEqual(['keyboard-not-apg']);
  });

  it("keyboard-unreferenced: no APG spec under the owner's tests/a11y/apg/<owner>/ names the Keyboard id", () => {
    expect(rules(run({ [F]: FLAGSHIP_OK }, { references: [] }))).toEqual(['keyboard-unreferenced']);
    const wrongDir = { references: [{ ...apg.references[0]!, spec: 'tests/a11y/apg/surf/button.apg.spec.ts' }] };
    expect(rules(run({ [F]: FLAGSHIP_OK }, wrongDir))).toEqual(['keyboard-unreferenced']);
  });

  it('imports-storybook: a story file importing .storybook/**', () => {
    const src = `import { StoryRoot } from '../../../.storybook/contract/StoryRoot';\n${FLAGSHIP_OK}`;
    expect(rules(run({ [F]: src }))).toEqual(['imports-storybook']);
  });

  it('any-type: `as any` and `: any`', () => {
    expect(rules(run({ [F]: `${FLAGSHIP_OK}\nexport const X: Story = { args: { onClick: ((e: any) => e) as any } };` }))).toContain('any-type');
  });

  it("attributes failures to the owner's paths", () => {
    const src = `export default { title: 'Core/Pill', tags: ['beta'] };\nexport const A = {};`;
    expect(run({ 'stories/surf/Pill.stories.tsx': src }).find((x) => x.rule === 'tag-not-allowed')?.owner).toBe('SURF');
  });
});

describe('expiring baseline', () => {
  const baseline = loadBaseline(ROOT) as { rows: V[]; expires?: string; missing?: boolean };

  it('is schema-valid and expires at RC-1', () => {
    expect(baseline.missing).toBeUndefined();
    expect(baseline.expires).toBe('RC-1');
    for (const r of baseline.rows) expect(CHECKS).toContain(r.check);
  });

  it('expires at 5.0.0-rc.1 and GA, not before', () => {
    expect(baselineExpired('5.0.0-alpha.0')).toBe(false);
    expect(baselineExpired('5.0.0-beta.3')).toBe(false);
    expect(baselineExpired('5.0.0-rc.1')).toBe(true);
    expect(baselineExpired('5.0.0')).toBe(true);
    expect(baselineExpired('4.3.0')).toBe(false);
    const v = [{ check: 'story-contract', rule: 'any-type', key: 'a', owner: 'CMP', message: 'm' }];
    expect(compare(v, { rows: v }, { checks: CHECKS, version: '5.0.0-rc.1' }).introduced).toHaveLength(1);
    expect(compare(v, { rows: v }, { checks: CHECKS, version: '5.0.0-beta.1' }).introduced).toHaveLength(0);
  });
});

describe('story contract on the repository', () => {
  const violations = allStoryViolations(ROOT) as V[];
  const r = compare(violations, loadBaseline(ROOT), { checks: CHECKS, version: packageVersion(ROOT) });

  it('introduces no violation outside the expiring baseline (per owner)', () => {
    expect(r.introduced.map((v: V) => `${v.owner}: [${v.check}/${v.rule}] ${v.message}`)).toEqual([]);
  });

  it('reports the current flagship gaps (missing Keyboard stories) against their owners', () => {
    const contract = validateRepository(ROOT) as V[];
    const missingKeyboard = contract.filter((v) => v.rule === 'flagship-missing-story' && v.key.endsWith('|Keyboard'));
    expect(missingKeyboard.length).toBeGreaterThan(0);
    for (const v of missingKeyboard) expect(['CMP', 'SURF', 'MAT']).toContain(v.owner);
  });

  it('docs-page coverage gaps are reported per owner', () => {
    for (const v of docsPageViolations([{ name: 'A', owner: 'SURF', flagship: 1, file: 'a' }]) as V[]) expect(v.owner).toBe('SURF');
  });
});
