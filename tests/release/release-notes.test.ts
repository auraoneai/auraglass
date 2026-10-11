/* REQ-PLAT-32: release-notes.mjs — fixed heading order, numbers traced to
   artifacts, commit subjects + changesets + change-class inputs. */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = process.cwd();
const EVAL = (body: string) =>
  execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('${ROOT}/scripts/release/release-notes.mjs'); ${body}`],
  { cwd: ROOT, encoding: 'utf8' });

describe('release notes (REQ-PLAT-32)', () => {
  it('fixed heading order Breaking→Deprecated→Added→Fixed→Visual→Security', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '9.9.9' }))`);
    const idx = ['## Breaking', '## Deprecated', '## Added', '## Fixed', '## Visual bug fixes', '## Security']
      .map((h) => out.indexOf(h));
    expect(idx.every((v, i) => v >= 0 && (i === 0 || v > idx[i - 1]))).toBe(true);
  });
  it('change-class visual fixes land under Visual bug fixes', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '9.9.9',
      changeClass: { visualFixes: [{ title: 'GlassCard radius at 2xl', pr: 123 }] } }))`);
    expect(out).toContain('GlassCard radius at 2xl');
    expect(out.indexOf('GlassCard radius at 2xl')).toBeGreaterThan(out.indexOf('## Visual bug fixes'));
  });
  it('commit subjects map to headings by conventional type', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '9.9.9',
      commitSubjects: ['feat(cmp): add GlassTimeline', 'fix!: drop onOpen callback', 'fix(tokens): misspelled var'] }))`);
    expect(out).toContain('add GlassTimeline');
    expect(out).toContain('misspelled var');
    expect(out.indexOf('drop onOpen callback')).toBeGreaterThan(out.indexOf('## Breaking'));
    expect(out.indexOf('drop onOpen callback')).toBeLessThan(out.indexOf('## Deprecated'));
  });
  it('changesets render under Added with provenance', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cs-'));
    writeFileSync(join(dir, 'x.md'), "---\n'aura-glass': minor\n---\nAdded the thing\n");
    const out = EVAL(`console.log(m.renderNotes({ version: '9.9.9',
      changesets: m.loadChangesets('${dir}') }))`);
    expect(out).toContain('Added the thing (.changeset/x.md)');
  });
  it('claims numbers appear verbatim (traced, not re-derived)', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '9.9.9',
      claims: { deprecations: 'x\\n## Numbers\\n- deprecated_total: 245\\n' } }))`);
    expect(out).toContain('deprecated_total: 245');
  });
});

/* REQ-PLAT-16: the tag pipeline calls `release-notes.mjs --tag "$CI_COMMIT_TAG"
   --line "$AG_LINE"`; the version comes from the tag and a 4.x tag gets 4.x
   notes, never the 5.0.0 skeleton. */
describe('release notes --tag/--line (REQ-PLAT-16)', () => {
  const git = (cwd: string, ...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid',
        GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' } });
  const CHANGELOG = [
    '## [4.2.0] - 2026-11-01', '', '### Moved dependencies', '', '- date-fns moved to peer.', '',
    '## [4.1.1] - 2026-10-20', '', '### Security', '', '- assertJwtSecret fails closed.', '',
    '# Changelog', '', '## [4.1.0] - 2026-09-05', '', '- old entry', '',
  ].join('\n');
  const DEPS = [
    { id: 'DEP-P0001', kind: 'export', entry: '.', symbol: 'oldThing', since: '4.2.0',
      removeIn: '5.0.0', message: 'use newThing' },
    { id: 'DEP-P0002', kind: 'export', entry: '.', symbol: 'olderThing', since: '4.1.1',
      removeIn: '5.0.0', message: 'gone' },
  ];

  /** Real temp git repo: v4.1.0 → v5.0.0-alpha.1 (a 5.x prerelease tag in the
   *  same clone) → 4.2.0 work → HEAD. */
  function fixtureRepo() {
    const dir = mkdtempSync(join(tmpdir(), 'rn-'));
    mkdirSync(join(dir, 'fragments/deprecations'), { recursive: true });
    mkdirSync(join(dir, 'src/contracts'), { recursive: true });
    copyFileSync(join(ROOT, 'src/contracts/load-fragments.mjs'), join(dir, 'src/contracts/load-fragments.mjs'));
    symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'));
    writeFileSync(join(dir, '.gitignore'), 'node_modules\n');
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '4.2.0' }));
    writeFileSync(join(dir, 'CHANGELOG.md'), CHANGELOG);
    writeFileSync(join(dir, 'fragments/deprecations/plat.json'), JSON.stringify(DEPS));
    git(dir, 'init', '-q', '-b', 'main');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'feat: before 4.1.0');
    git(dir, 'tag', 'v4.1.0');
    git(dir, 'commit', '-q', '--allow-empty', '-m', 'feat: only-in-5x-prerelease-range');
    git(dir, 'tag', 'v5.0.0-alpha.1');
    git(dir, 'commit', '-q', '--allow-empty', '-m', 'fix(cms): GlassCanvas action guard');
    git(dir, 'commit', '-q', '--allow-empty', '-m', 'docs: not user facing');
    return dir;
  }
  const RUN = (root: string, argv: string[]) => EVAL(
    `const code = await m.main(${JSON.stringify(argv)}, { root: ${JSON.stringify(root)} }); console.log('EXIT=' + code)`);

  it('renderNotes4x heads the tag version and carries the CHANGELOG section verbatim', () => {
    const out = EVAL(`console.log(m.renderNotes4x({ version: '4.2.0',
      changelog: ${JSON.stringify(CHANGELOG)}, deprecations: ${JSON.stringify(DEPS)} }))`);
    expect(out.split('\n')[0]).toBe('# aura-glass 4.2.0 release notes');
    expect(out).toContain('- date-fns moved to peer.');
    expect(out).not.toContain('assertJwtSecret fails closed');
    // 5.0.0 skeleton content never appears in 4.x notes.
    expect(out).not.toContain('Dependency floors');
    expect(out).not.toContain('migrate 4to5');
    expect(out).not.toContain('5.0.0 release notes');
  });
  it('lists exactly the deprecations whose since is the released version', () => {
    const out = EVAL(`console.log(m.renderNotes4x({ version: '4.2.0',
      changelog: ${JSON.stringify(CHANGELOG)}, deprecations: ${JSON.stringify(DEPS)} }))`);
    const dep = out.slice(out.indexOf('## Deprecations added'), out.indexOf('## Commits'));
    expect(dep).toContain('`DEP-P0001` (export . oldThing, removed in 5.0.0): use newThing');
    expect(dep).not.toContain('DEP-P0002');
  });
  it('fails closed when CHANGELOG.md has no section for the version', () => {
    expect(() => EVAL(`m.renderNotes4x({ version: '4.3.0', changelog: ${JSON.stringify(CHANGELOG)} })`))
      .toThrow(/no non-empty '## \[4\.3\.0\]' section/);
  });
  it('rejects a 5.x version on the 4x line', () => {
    expect(() => EVAL(`m.renderNotes4x({ version: '5.0.0-beta.1', changelog: '' })`))
      .toThrow(/--line 4x needs a 4\.x version/);
  });
  it('previousTag stays on the major for 4x and orders prereleases for 5x', () => {
    const tags = ['v4.0.0', 'v4.1.0', 'v4.1.1', 'v5.0.0-alpha.1', 'v5.0.0-alpha.10', 'v5.0.0-alpha.2', 'v2.1.5'];
    const out = EVAL(`const t = ${JSON.stringify(tags)}; console.log(JSON.stringify([
      m.previousTag(t, '4.2.0', '4x'), m.previousTag(t, '4.1.1', '4x'),
      m.previousTag(t, '5.0.0-beta.1', '5x'), m.previousTag(t, '5.0.0-alpha.2', '5x'),
      m.previousTag(t, '4.0.0', '4x')]))`);
    expect(JSON.parse(out)).toEqual(['v4.1.1', 'v4.1.0', 'v5.0.0-alpha.10', 'v5.0.0-alpha.1', null]);
  });
  it('CLI --tag v4.2.0 --line 4x writes 4.x notes with commits since v4.1.0 only', () => {
    const dir = fixtureRepo();
    const outFile = join(dir, 'notes.md');
    expect(RUN(dir, ['--tag', 'v4.2.0', '--line', '4x', '--out', outFile])).toContain('EXIT=0');
    const notes = readFileSync(outFile, 'utf8');
    expect(notes.split('\n')[0]).toBe('# aura-glass 4.2.0 release notes');
    expect(notes).toContain('## Commits since v4.1.0');
    expect(notes).toContain('- GlassCanvas action guard');
    // The range starts at v4.1.0, not at the newer 5.x prerelease tag…
    expect(notes).toContain('only-in-5x-prerelease-range');
    expect(notes).not.toContain('before 4.1.0');
    expect(notes).not.toContain('not user facing');
    expect(notes).toContain('`DEP-P0001`');
  });
  it('CLI --tag v5.0.0-beta.1 --line 5x heads the prerelease version', () => {
    const dir = fixtureRepo();
    const outFile = join(dir, 'notes.md');
    expect(RUN(dir, ['--tag', 'v5.0.0-beta.1', '--line', '5x', '--out', outFile])).toContain('EXIT=0');
    const notes = readFileSync(outFile, 'utf8');
    expect(notes.split('\n')[0]).toBe('# aura-glass 5.0.0-beta.1 release notes');
    expect(notes).toContain('## Breaking');
    // Range base is v5.0.0-alpha.1, so the pre-alpha commit is out of range.
    expect(notes).toContain('GlassCanvas action guard');
    expect(notes).not.toContain('only-in-5x-prerelease-range');
  });
  it('CLI exits 1 on an unknown --line and on a 4x tag without a CHANGELOG section', () => {
    const dir = fixtureRepo();
    expect(RUN(dir, ['--tag', 'v4.2.0', '--line', '6x', '--out', join(dir, 'a.md')])).toContain('EXIT=1');
    expect(() => RUN(dir, ['--tag', 'v4.3.0', '--line', '4x', '--out', join(dir, 'b.md')]))
      .toThrow(/no non-empty '## \[4\.3\.0\]' section/);
  });
  it('a commit range that cannot be computed is stated in the notes, not silently empty', () => {
    const dir = fixtureRepo();
    git(dir, 'tag', '-d', 'v4.1.0');
    const outFile = join(dir, 'notes.md');
    expect(RUN(dir, ['--tag', 'v4.2.0', '--line', '4x', '--out', outFile])).toContain('EXIT=0');
    expect(readFileSync(outFile, 'utf8')).toContain('_Commit range unavailable: no earlier v4.* tag in the clone._');
  });
});

/* REQ-PLAT-56 / REQ-FIN-45: 4.2.0 notes open with the dependencies that moved
   to peers, computed from package.json at the previous tag vs HEAD and tied to
   their kind:'dependency' DEP entries. */
describe('release notes moved dependencies (REQ-PLAT-56)', () => {
  const git = (cwd: string, ...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid',
        GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' } });
  const CHANGELOG = '# Changelog\n\n## [4.2.0] - Unreleased\n\n### Changed\n\n- diet.\n\n## [4.1.0] - 2026-09-05\n\n- old\n';
  const PREV = { name: 'aura-glass', version: '4.1.0',
    dependencies: { clsx: '^2.1.1', 'date-fns': '^4.1.0', zod: '^3.22.0', express: '^5.2.1' },
    peerDependencies: { react: '>=18' } };
  const CUR = { name: 'aura-glass', version: '4.2.0',
    dependencies: { clsx: '^2.1.1', express: '^5.2.1' },
    peerDependencies: { react: '>=18', 'date-fns': '^4.1.0', zod: '^3.23.0' },
    peerDependenciesMeta: { 'date-fns': { optional: true } } };
  const DEPS = [
    { id: 'DEP-P0039', kind: 'dependency', entry: '.', symbol: 'date-fns', since: '4.2.0', removeIn: '5.0.0', message: 'moved' },
    { id: 'DEP-P0040', kind: 'dependency', entry: '.', symbol: 'zod', since: '4.2.0', removeIn: '5.0.0', message: 'moved' },
    { id: 'DEP-P0001', kind: 'export', entry: '.', symbol: 'oldThing', since: '4.2.0', removeIn: '5.0.0', message: 'use newThing' },
  ];

  it('movedDependencies returns exactly the deps that became peers', () => {
    const out = JSON.parse(EVAL(`console.log(JSON.stringify(m.movedDependencies(${JSON.stringify(PREV)}, ${JSON.stringify(CUR)})))`));
    expect(out).toEqual([
      { name: 'date-fns', from: '^4.1.0', to: '^4.1.0', optional: true },
      { name: 'zod', from: '^3.22.0', to: '^3.23.0', optional: false },
    ]);
  });
  it('the moved-dependency table is the first section and its DEP ids are not repeated', () => {
    const out = EVAL(`console.log(m.renderNotes4x({ version: '4.2.0', previous: 'v4.1.1',
      changelog: ${JSON.stringify(CHANGELOG)}, deprecations: ${JSON.stringify(DEPS)},
      moved: m.movedDependencies(${JSON.stringify(PREV)}, ${JSON.stringify(CUR)}) }))`);
    const headings = out.split('\n').filter((l) => l.startsWith('## '));
    expect(headings[0]).toBe('## Moved dependencies (install them yourself)');
    expect(headings[1]).toBe('## Changelog');
    expect(out).toContain('| `date-fns` | `^4.1.0` | `^4.1.0` | yes | `DEP-P0039` (removed in 5.0.0) |');
    expect(out).toContain('| `zod` | `^3.22.0` | `^3.23.0` | no | `DEP-P0040` (removed in 5.0.0) |');
    expect(out).not.toContain('`express`');
    const dep = out.slice(out.indexOf('## Deprecations added'), out.indexOf('## Commits'));
    expect(dep).toContain('`DEP-P0001`');
    expect(dep).not.toContain('- `DEP-P0039`');
    expect(dep).toContain('The 2 dependency entries are in the table above.');
  });
  it('fails closed when a moved dependency has no DEP entry for the version', () => {
    expect(() => EVAL(`m.renderNotes4x({ version: '4.2.0', previous: 'v4.1.1',
      changelog: ${JSON.stringify(CHANGELOG)}, deprecations: ${JSON.stringify(DEPS.slice(1))},
      moved: m.movedDependencies(${JSON.stringify(PREV)}, ${JSON.stringify(CUR)}) })`))
      .toThrow(/moved dependencies without a kind:'dependency' DEP entry since 4\.2\.0: date-fns/);
  });
  it('CLI diffs package.json at the previous tag against HEAD', () => {
    const dir = mkdtempSync(join(tmpdir(), 'rnm-'));
    mkdirSync(join(dir, 'fragments/deprecations'), { recursive: true });
    mkdirSync(join(dir, 'src/contracts'), { recursive: true });
    copyFileSync(join(ROOT, 'src/contracts/load-fragments.mjs'), join(dir, 'src/contracts/load-fragments.mjs'));
    symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'));
    writeFileSync(join(dir, '.gitignore'), 'node_modules\n');
    writeFileSync(join(dir, 'package.json'), JSON.stringify(PREV));
    writeFileSync(join(dir, 'CHANGELOG.md'), CHANGELOG);
    writeFileSync(join(dir, 'fragments/deprecations/plat.json'), JSON.stringify(DEPS));
    git(dir, 'init', '-q', '-b', 'main');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'feat: 4.1.0');
    git(dir, 'tag', 'v4.1.0');
    writeFileSync(join(dir, 'package.json'), JSON.stringify(CUR));
    git(dir, 'commit', '-q', '-am', 'feat(deps): move date-fns and zod to peers');
    const outFile = join(dir, 'out/notes.md');
    expect(EVAL(`const code = await m.main(${JSON.stringify(['--tag', 'v4.2.0', '--line', '4x', '--out', outFile])},
      { root: ${JSON.stringify(dir)} }); console.log('EXIT=' + code)`)).toContain('EXIT=0');
    const notes = readFileSync(outFile, 'utf8');
    expect(notes.split('\n')[2]).toBe('## Moved dependencies (install them yourself)');
    expect(notes).toContain('were `dependencies` in v4.1.0');
    expect(notes).toContain('`DEP-P0039`');
    expect(notes).toContain('`DEP-P0040`');
  });
});
