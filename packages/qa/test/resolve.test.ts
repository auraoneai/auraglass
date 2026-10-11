/* REQ-QUAL-01 One subject resolver — packages/qa/test/resolve.test.ts.
   Throwing fixtures: unresolved subject, ambiguous subject, manifest id not in index.json, index.json
   story (kind-tagged) not in the manifest, malformed parameters.ag, malformed SubjectIndex; plus the
   expiring-baseline semantics and the write-cert-manifest CLI end to end. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import type { SubjectIndex } from '../../../src/contracts/testing.ts';
import { buildCertManifest, CertManifestError } from '../src/resolve/certManifest.ts';
import { readMetaSource } from '../src/resolve/componentMetas.ts';
import { readCsfParameters, storyAg } from '../src/resolve/csf.ts';
import {
  filterSubjects, loadSubjectUniverse, parseShowcases, parseSubjectIndex, resolveSubject, resolveSubjectName,
  verifyManifestAgainstIndex, type StorybookIndex, type SubjectUniverse,
} from '../src/resolve/resolveSubject.ts';

const REPO = resolve(__dirname, '../../..');

const meta = (name: string, owner: string, tier = 'T1', entry = '.') => `import { defineMeta } from '../foundation';
export default defineMeta({ name: '${name}', owner: '${owner}', entry: '${entry}', tier: '${tier}', rsc: 'client',
  parts: ['root'], states: [], variants: {}, migration: [] });
`;

const universe: SubjectUniverse = {
  metas: new Map([
    ['Button', [{ name: 'Button', owner: 'CMP', entry: '.', tier: 'T1', file: 'src/button/Button.meta.ts' }]],
    ['Surface', [{ name: 'Surface', owner: 'MAT', entry: './material', tier: 'T0', file: 'src/material/Surface.meta.ts' }]],
    ['Chip', [
      { name: 'Chip', owner: 'CMP', entry: './data', tier: 'T2', file: 'src/components/chip/Chip.meta.ts' },
      { name: 'Chip', owner: 'SURF', entry: './data', tier: 'T2', file: 'src/data/chip/Chip.meta.ts' },
    ]],
  ]),
  showcases: new Set(['music-player']),
};

function sbIndex(entries: Array<{ id: string; importPath: string; exportName: string; tags?: string[] }>): StorybookIndex {
  return { v: 5, entries: Object.fromEntries(entries.map((e) => [e.id, { ...e, title: e.id.split('--')[0]!, name: e.exportName, type: 'story' as const, tags: e.tags ?? [] }])) };
}

const SOURCES: Record<string, string> = {
  './src/button/Button.stories.tsx': `import { Button } from './Button';
const meta = { title: 'Components/Button', component: Button,
  parameters: { layout: 'centered', ag: { subject: 'Button', kind: 'component' } } } satisfies Record<string, unknown>;
export default meta;
export const Playground = { args: {} };
export const Matrix = { parameters: { ag: { kind: 'matrix' } } };
`,
  './src/material/Lab.stories.tsx': `export default { title: 'Material/Lab', parameters: { ag: { subject: 'Surface', kind: 'lab' } } };
export const Lab = {};
`,
  './showcase/music-player/MusicPlayer.stories.tsx': `export default { title: 'Showcases/Music', parameters: { ag: { subject: 'music-player', kind: 'showcase' } } };
export const Full = {};
`,
  './src/misc/Plain.stories.tsx': `export default { title: 'Misc/Plain' };
export const Basic = {};
`,
  './src/misc/Unknown.stories.tsx': `export default { title: 'Misc/Unknown', parameters: { ag: { subject: 'GlassButton', kind: 'component' } } };
export const Basic = {};
`,
  './src/misc/Leaf.stories.tsx': `export default { title: 'Components/Button', parameters: { ag: { subject: 'button', kind: 'component' } } };
export const Basic = {};
`,
  './src/chip/Chip.stories.tsx': `export default { title: 'Data/Chip', parameters: { ag: { subject: 'Chip', kind: 'component' } } };
export const Basic = {};
`,
  './src/misc/BadKind.stories.tsx': `export default { title: 'Misc/BadKind', parameters: { ag: { subject: 'Button', kind: 'gallery' } } };
export const Basic = {};
`,
  './src/misc/Dynamic.stories.tsx': `import { shared } from './shared';
export default { title: 'Misc/Dynamic', parameters: { ...shared } };
export const Basic = {};
`,
};
const read = (p: string) => {
  const s = SOURCES[p];
  if (s === undefined) throw new Error(`fixture ${p} missing`);
  return s;
};

const GOOD = sbIndex([
  { id: 'components-button--playground', importPath: './src/button/Button.stories.tsx', exportName: 'Playground', tags: ['flagship'] },
  { id: 'components-button--matrix', importPath: './src/button/Button.stories.tsx', exportName: 'Matrix' },
  { id: 'material-lab--lab', importPath: './src/material/Lab.stories.tsx', exportName: 'Lab', tags: ['lab'] },
  { id: 'showcases-music--full', importPath: './showcase/music-player/MusicPlayer.stories.tsx', exportName: 'Full', tags: ['showcase'] },
  { id: 'misc-plain--basic', importPath: './src/misc/Plain.stories.tsx', exportName: 'Basic' },
]);

describe('resolveSubjectName — explicit subjects only', () => {
  it('resolves a ComponentMeta name and a showcase id', () => {
    expect(resolveSubjectName('Button', universe)).toMatchObject({ kind: 'component', owner: 'CMP' });
    expect(resolveSubjectName('music-player', universe)).toEqual({ subject: 'music-player', kind: 'showcase', owner: 'QUAL' });
  });
  it('throws unresolved-subject for an unknown subject (no 4.x name mapping)', () => {
    expect(() => resolveSubjectName('GlassButton', universe)).toThrow(/^unresolved-subject: 'GlassButton'/);
  });
  it('throws unresolved-subject for a case/title-leaf variant — there is no fuzzy matching', () => {
    expect(() => resolveSubjectName('button', universe)).toThrow(/^unresolved-subject/);
    expect(() => resolveSubjectName('Components/Button', universe)).toThrow(/^unresolved-subject/);
  });
  it('throws ambiguous-subject when two metas declare the same name', () => {
    expect(() => resolveSubjectName('Chip', universe)).toThrow(/^ambiguous-subject: 'Chip' is declared 2 times: src\/components\/chip\/Chip\.meta\.ts \(CMP\), src\/data\/chip\/Chip\.meta\.ts \(SURF\)/);
  });
});

describe('buildCertManifest', () => {
  it('writes one row per annotated story with owner from the resolved subject', () => {
    const { index, unannotated } = buildCertManifest(GOOD, universe, read);
    expect(index.version).toBe(1);
    expect(index.stories).toEqual([
      { id: 'components-button--matrix', subject: 'Button', kind: 'matrix', tags: [], owner: 'CMP' },
      { id: 'components-button--playground', subject: 'Button', kind: 'component', tags: ['flagship'], owner: 'CMP' },
      { id: 'material-lab--lab', subject: 'Surface', kind: 'lab', tags: ['lab'], owner: 'MAT' },
      { id: 'showcases-music--full', subject: 'music-player', kind: 'showcase', tags: ['showcase'], owner: 'QUAL' },
    ]);
    expect(unannotated).toEqual(['misc-plain--basic']);
  });

  it('throws on a story whose subject resolves to nothing', () => {
    const idx = sbIndex([{ id: 'misc-unknown--basic', importPath: './src/misc/Unknown.stories.tsx', exportName: 'Basic' }]);
    expect(() => buildCertManifest(idx, universe, read)).toThrow(CertManifestError);
    expect(() => buildCertManifest(idx, universe, read)).toThrow(/misc-unknown--basic .*unresolved-subject: 'GlassButton'/);
  });

  it('throws on a title-leaf style subject instead of guessing', () => {
    const idx = sbIndex([{ id: 'components-button--basic', importPath: './src/misc/Leaf.stories.tsx', exportName: 'Basic' }]);
    expect(() => buildCertManifest(idx, universe, read)).toThrow(/unresolved-subject: 'button'/);
  });

  it('throws on an ambiguous subject', () => {
    const idx = sbIndex([{ id: 'data-chip--basic', importPath: './src/chip/Chip.stories.tsx', exportName: 'Basic' }]);
    expect(() => buildCertManifest(idx, universe, read)).toThrow(/ambiguous-subject: 'Chip'/);
  });

  it('throws on an invalid kind and on parameters that cannot be read statically', () => {
    expect(() => buildCertManifest(sbIndex([{ id: 'misc-badkind--basic', importPath: './src/misc/BadKind.stories.tsx', exportName: 'Basic' }]), universe, read))
      .toThrow(/invalid-ag: parameters\.ag\.kind 'gallery'/);
    expect(() => buildCertManifest(sbIndex([{ id: 'misc-dynamic--basic', importPath: './src/misc/Dynamic.stories.tsx', exportName: 'Basic' }]), universe, read))
      .toThrow(/non-static-expression: src\/misc\/Dynamic\.stories\.tsx:2/);
  });

  it('throws index-not-in-manifest when a lab/scene/showcase-tagged index story has no manifest row', () => {
    const idx = sbIndex([{ id: 'misc-plain--basic', importPath: './src/misc/Plain.stories.tsx', exportName: 'Basic', tags: ['scene'] }]);
    expect(() => buildCertManifest(idx, universe, read)).toThrow(/index-not-in-manifest: 1 index\.json stor\(ies\) absent from the manifest: misc-plain--basic \(tag scene\)/);
  });

  it('matches story exports by Storybook id when index.json has no exportName', () => {
    const idx: StorybookIndex = { v: 5, entries: { 'components-button--playground': { id: 'components-button--playground', title: 'Components/Button',
      name: 'Playground', importPath: './src/button/Button.stories.tsx', type: 'story', tags: [] } } };
    expect(buildCertManifest(idx, universe, read).index.stories.map((s) => s.id)).toEqual(['components-button--playground']);
  });
});

describe('verifyManifestAgainstIndex — both directions for lab/scene/showcase/matrix', () => {
  const manifest = (stories: SubjectIndex['stories']): SubjectIndex => ({ version: 1, stories });

  it('throws manifest-not-in-index for a manifest id missing from index.json', () => {
    const m = manifest([{ id: 'material-lab--ghost', subject: 'Surface', kind: 'lab', tags: ['lab'], owner: 'MAT' }]);
    expect(() => verifyManifestAgainstIndex(m, GOOD)).toThrow(/^manifest-not-in-index: 1 manifest stor\(ies\) absent from index\.json: material-lab--ghost \(lab\)/);
  });

  it('throws index-not-in-manifest for the reverse, including a kind mismatch', () => {
    const m = manifest([{ id: 'material-lab--lab', subject: 'Surface', kind: 'component', tags: ['lab'], owner: 'MAT' },
      { id: 'showcases-music--full', subject: 'music-player', kind: 'showcase', tags: ['showcase'], owner: 'QUAL' }]);
    expect(() => verifyManifestAgainstIndex(m, GOOD)).toThrow(/^index-not-in-manifest: .*material-lab--lab \(tag lab, manifest kind component\)/);
  });

  it('accepts the manifest it built', () => {
    expect(() => verifyManifestAgainstIndex(buildCertManifest(GOOD, universe, read).index, GOOD)).not.toThrow();
  });
});

describe('resolveSubject / filterSubjects / parseSubjectIndex', () => {
  const index = buildCertManifest(GOOD, universe, read).index;
  it('maps a subject to its story ids and throws when it has none', () => {
    expect(resolveSubject(index, 'Button')).toEqual(['components-button--matrix', 'components-button--playground']);
    expect(resolveSubject(index, 'Button', { kind: 'matrix' })).toEqual(['components-button--matrix']);
    expect(() => resolveSubject(index, 'Dialog')).toThrow(/^unresolved-subject: subject 'Dialog' has no story/);
    expect(() => resolveSubject(index, 'Surface', { kind: 'matrix' })).toThrow(/^unresolved-subject/);
  });
  it('filters by tags, kind and owner like ListSubjects', () => {
    expect(filterSubjects(index, { tags: ['flagship'] }).map((s) => s.id)).toEqual(['components-button--playground']);
    expect(filterSubjects(index, { owner: 'QUAL' }).map((s) => s.subject)).toEqual(['music-player']);
    expect(filterSubjects(index, { kind: 'lab', owner: 'CMP' })).toEqual([]);
  });
  it('rejects malformed SubjectIndex documents', () => {
    expect(() => parseSubjectIndex({ version: 2, stories: [] })).toThrow(/^missing-subject-index: .*version must be 1/);
    expect(() => parseSubjectIndex({ version: 1, stories: [{ id: 'a', subject: 'B', kind: 'component', tags: [], owner: 'NOBODY' }] }))
      .toThrow(/malformed story row/);
    expect(parseSubjectIndex(index)).toBe(index);
  });
  it('rejects a malformed showcases registry', () => {
    expect(() => parseShowcases('{"music-player":{}}')).toThrow(/^invalid-showcases/);
    expect(() => parseShowcases('[{"id":"a"},{"id":"a"}]')).toThrow(/repeats a showcase id/);
    expect([...parseShowcases('[{"id":"a","tier":"S1"}]')]).toEqual(['a']);
    expect([...parseShowcases('{"version":1,"showcases":[{"id":"a"},{"id":"b"}]}')]).toEqual(['a', 'b']);
    expect(() => parseShowcases('{"version":1,"showcases":{"a":{}}}')).toThrow(/^invalid-showcases/);
  });
});

describe('expiring baseline (PRD-F §4.3 rule 3)', () => {
  const idx = sbIndex([
    { id: 'misc-unknown--basic', importPath: './src/misc/Unknown.stories.tsx', exportName: 'Basic', tags: ['lab'] },
    { id: 'components-button--playground', importPath: './src/button/Button.stories.tsx', exportName: 'Playground' },
  ]);
  const row = { file: 'src/misc/Unknown.stories.tsx', owner: 'CMP', reqFin: 'REQ-FIN-70', expires: 'RC-1', code: 'unresolved-subject', subject: 'GlassButton' };

  it('a baselined offender is left out of the manifest and exempt from the cross-check', () => {
    const r = buildCertManifest(idx, universe, read, { baseline: [row], scope: 'pr' });
    expect(r.index.stories.map((s) => s.id)).toEqual(['components-button--playground']);
    expect(r.baselined.map((p) => p.storyId)).toEqual(['misc-unknown--basic']);
  });
  it('fails on a stale row, a malformed row, and every row at RC-1 (release scope)', () => {
    const stale = { ...row, file: 'src/misc/Gone.stories.tsx' };
    expect(() => buildCertManifest(idx, universe, read, { baseline: [row, stale], scope: 'pr' })).toThrow(/stale baseline row .*Gone\.stories\.tsx/);
    expect(() => buildCertManifest(idx, universe, read, { baseline: [{ ...row, expires: '2099-01-01' }], scope: 'pr' })).toThrow(/malformed baseline row/);
    expect(() => buildCertManifest(idx, universe, read, { baseline: [row], scope: 'release' })).toThrow(/baseline row expired at RC-1/);
  });
});

describe('CSF and meta static readers', () => {
  it('merges meta-level and story-level parameters.ag like Storybook', () => {
    const csf = readCsfParameters('a.stories.tsx', read('./src/button/Button.stories.tsx'));
    expect(storyAg(csf, 'Matrix')).toEqual({ subject: 'Button', kind: 'matrix' });
    expect(() => storyAg(csf, 'Nope')).toThrow(/^unknown-story-export/);
  });
  it('reads Story.parameters assignments and same-file consts', () => {
    const csf = readCsfParameters('b.stories.tsx', `const ag = { subject: 'Button', kind: 'component' } as const;
export default { parameters: { ag } };
export const A = () => null;
A.parameters = { ag: { kind: 'matrix' } };`);
    expect(storyAg(csf, 'A')).toEqual({ subject: 'Button', kind: 'matrix' });
  });
  it('reads defineMeta, typed and satisfies metas; rejects a non-literal name', () => {
    expect(readMetaSource('x.meta.ts', meta('Button', 'CMP')).map((m) => m.name)).toEqual(['Button']);
    expect(readMetaSource('y.meta.ts', `import type { ComponentMeta } from 'c';
export const M: ComponentMeta = { name: 'Panel', owner: 'MAT', entry: './theme', tier: 'T2', rsc: 'client', parts: [], states: [], variants: {}, migration: [] };`)
      .map((m) => [m.name, m.owner])).toEqual([['Panel', 'MAT']]);
    expect(() => readMetaSource('z.meta.ts', `const n = make(); export default defineMeta({ name: n, owner: 'CMP', entry: '.', tier: 'T0' });`))
      .toThrow(/non-static-expression/);
  });
});

describe('repository universe and the write-cert-manifest CLI', () => {
  it('loads every ComponentMeta in this repository without a parse error', () => {
    const u = loadSubjectUniverse(REPO);
    expect(u.metas.size).toBeGreaterThan(0);
    for (const [name, recs] of u.metas) for (const r of recs) expect(r.name).toBe(name);
  });

  it('exits 1 with the problem on stderr, exits 0 and writes cert-manifest.json when clean', () => {
    const root = mkdtempSync(join(tmpdir(), 'qa-resolve-'));
    try {
      const put = (p: string, s: string) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), s); };
      put('src/button/Button.meta.ts', meta('Button', 'CMP'));
      put('src/material/Surface.meta.ts', meta('Surface', 'MAT', 'T0', './material'));
      put('showcase/showcases.json', '[{"id":"music-player"}]');
      put('contracts/ownership.json', '{"rows":[]}');
      put('baseline.json', '[]');
      for (const [p, s] of Object.entries(SOURCES)) put(p.slice(2), s);
      const cli = (index: StorybookIndex) => {
        put('storybook-static/index.json', JSON.stringify(index));
        return spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings',
          join(REPO, 'scripts/storybook/write-cert-manifest.mjs'), '--root', root, '--baseline', join(root, 'baseline.json')],
        { encoding: 'utf8', env: { ...process.env, AG_SCOPE: 'pr' } });
      };
      const bad = cli({ v: 5, entries: { ...GOOD.entries, ...sbIndex([{ id: 'misc-unknown--basic', importPath: './src/misc/Unknown.stories.tsx', exportName: 'Basic' }]).entries } });
      expect(bad.status).toBe(1);
      expect(bad.stderr).toMatch(/unresolved-subject: 'GlassButton'/);

      const ok = cli(GOOD);
      expect(ok.stderr).toBe('');
      expect(ok.status).toBe(0);
      const written = JSON.parse(readFileSync(join(root, 'storybook-static/cert-manifest.json'), 'utf8')) as SubjectIndex;
      const crossChecked = written.stories.filter((s) => ['lab', 'scene', 'showcase', 'matrix'].includes(s.kind)).map((s) => s.id).sort();
      expect(crossChecked).toEqual(['components-button--matrix', 'material-lab--lab', 'showcases-music--full']);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
