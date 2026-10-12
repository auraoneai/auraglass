/* REQ-PLAT-32: release-notes.mjs — fixed heading order, numbers traced to
   artifacts, commit subjects + changesets + change-class inputs. */
import { describe, expect, it } from '@jest/globals';
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
    expect(idx.every((v, i) => v >= 0 && (i === 0 || v > (idx[i - 1] ?? -1)))).toBe(true);
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

/* REQ-PLAT-32 / REQ-SURF-182: every 5x section has a content source — the
   deprecation fragments, SURF's new-capability.md, visual-fix records and the
   security claims file / exception:'security' fragments — and no placeholder
   literal is emitted. */
describe('release notes 5x sources (REQ-PLAT-32, REQ-SURF-182)', () => {
  const PLACEHOLDERS = ['_Populated by the fix ledger at RC._', '_Entries come from',
    '_Sourced from the security claims file', 'aura-glass/migrate'];
  const section = (out: string, h: string) => {
    const i = out.indexOf(`## ${h}\n`);
    const j = out.indexOf('\n## ', i + 3);
    return out.slice(i, j < 0 ? undefined : j);
  };
  const DEPS = [
    { id: 'DEP-P0101', kind: 'export', entry: '.', symbol: 'oldThing', since: '5.0.0', removeIn: '6.0.0', message: 'use newThing' },
    { id: 'DEP-P0102', kind: 'export', entry: '.', symbol: 'olderThing', since: '4.1.1', removeIn: '5.0.0', message: 'gone' },
    { id: 'DEP-P0103', kind: 'export', entry: '.', symbol: 'leakyAuth', since: '5.0.0', removeIn: '6.0.0',
      exception: 'security', message: 'leaked a token' },
  ];
  const CAP = '## New capability (5.0.0)\n\n- **Kbd** (X-06, CMP): `Kbd` — [CI artifacts](https://gitlab.com/g/p/-/jobs/1/artifacts/browse)\n';

  it('empty inputs: no placeholder literal, every heading states its empty source', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '5.0.0' }))`);
    for (const p of PLACEHOLDERS) expect(out).not.toContain(p);
    expect(section(out, 'Fixed')).toContain('No fix commit in the range.');
    expect(section(out, 'Visual bug fixes')).toContain('No visual-fix record');
    expect(section(out, 'Security')).toContain('No security advisory and no security-exception deprecation');
    expect(section(out, 'Added')).toContain('`@auraglass/cli` with `migrate 4to5`');
  });
  it('Deprecated lists exactly the fragment entries whose since is the version', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '5.0.0', deprecations: ${JSON.stringify(DEPS)} }))`);
    const dep = section(out, 'Deprecated');
    expect(dep).toContain('- `DEP-P0101` (export . oldThing, removed in 6.0.0): use newThing');
    expect(dep).toContain('`DEP-P0103`');
    expect(dep).not.toContain('DEP-P0102');
  });
  it('Security comes from exception:security fragments and the claims Advisories bullets', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '5.0.0', deprecations: ${JSON.stringify(DEPS)},
      claims: { security: '# Security\\n\\n## Advisories\\n\\n- GHSA-xxxx: hosted runtime JWT default\\n\\n## Other\\n- not this\\n' } }))`);
    const sec = section(out, 'Security');
    expect(sec).toContain('- GHSA-xxxx: hosted runtime JWT default');
    expect(sec).toContain('- `DEP-P0103` (export . leakyAuth, security exception): leaked a token');
    expect(sec).not.toContain('DEP-P0101');
    expect(sec).not.toContain('not this');
    expect(sec).not.toContain('No security advisory');
  });
  it('Visual bug fixes come from docs/release/visual-fixes/*.json with the composite link', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vf-'));
    writeFileSync(join(dir, 'dark-text.json'), JSON.stringify({ id: 'D-28-dark-text',
      cells: ['chromium/dark/1440', 'chromium/dark/390'], compositeArtifact: 'https://gitlab.com/g/p/-/jobs/2/artifacts/file/c.png' }));
    const out = EVAL(`console.log(m.renderNotes({ version: '5.0.0', visualFixes: m.loadVisualFixes('${dir}') }))`);
    expect(section(out, 'Visual bug fixes')).toContain(
      '- `D-28-dark-text` (`docs/release/visual-fixes/dark-text.json`, 2 cells) — [composite](https://gitlab.com/g/p/-/jobs/2/artifacts/file/c.png)');
  });
  it('a malformed visual-fix record fails closed', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vf-'));
    writeFileSync(join(dir, 'bad.json'), '{');
    expect(() => EVAL(`m.loadVisualFixes('${dir}')`)).toThrow(/visual-fixes\/bad\.json is not JSON/);
  });
  it('the SURF New capability file renders under Added; the ledger rows are never read', () => {
    const out = EVAL(`console.log(m.renderNotes({ version: '5.0.0', newCapability: ${JSON.stringify(CAP)},
      capabilityLedger: { capabilities: [{ id: 'NOPE', summary: 'from the ledger' }] } }))`);
    const added = section(out, 'Added');
    expect(added).toContain('### New capability (5.0.0)');
    expect(added).toContain('- **Kbd** (X-06, CMP)');
    expect(out).not.toContain('from the ledger');
    const empty = EVAL(`console.log(m.renderNotes({ version: '5.0.0', newCapability: '## New capability (5.0.0)\\n' }))`);
    expect(section(empty, 'Added')).toContain('No capability-ledger row is delivered in this release.');
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
  it('CLI --line 5x reads .artifacts/surf/ledger/new-capability.md and requires it in the tag pipeline', () => {
    const dir = fixtureRepo();
    const outFile = join(dir, 'notes.md');
    // Tag pipeline of this tag without SURF's file: exit 1.
    expect(EVAL(`const code = await m.main(${JSON.stringify(['--tag', 'v5.0.0-beta.1', '--line', '5x', '--out', outFile])},
      { root: ${JSON.stringify(dir)}, env: { CI_COMMIT_TAG: 'v5.0.0-beta.1' } }); console.log('EXIT=' + code)`)).toContain('EXIT=1');
    mkdirSync(join(dir, '.artifacts/surf/ledger'), { recursive: true });
    writeFileSync(join(dir, '.artifacts/surf/ledger/new-capability.md'),
      '## New capability (5.0.0-beta.1)\n\n- **Kbd** (X-06, CMP): `Kbd` — [CI artifacts](https://gitlab.com/g/p/-/jobs/1/artifacts/browse)\n');
    expect(EVAL(`const code = await m.main(${JSON.stringify(['--tag', 'v5.0.0-beta.1', '--line', '5x', '--out', outFile])},
      { root: ${JSON.stringify(dir)}, env: { CI_COMMIT_TAG: 'v5.0.0-beta.1' } }); console.log('EXIT=' + code)`)).toContain('EXIT=0');
    const notes = readFileSync(outFile, 'utf8');
    expect(notes).toContain('### New capability (5.0.0-beta.1)');
    expect(notes.indexOf('### New capability')).toBeGreaterThan(notes.indexOf('## Added'));
    expect(notes.indexOf('### New capability')).toBeLessThan(notes.indexOf('## Fixed'));
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

/* REQ-PLAT-32 / REQ-PLAT-52 (4x): the 4.x notes carry a Security and privacy
   section sourced from exception-carrying deprecation entries of the version
   and the advisories patched in it. */
describe('release notes 4x security section (REQ-PLAT-32)', () => {
  const CL = '# Changelog\n\n## [4.1.1] - Unreleased\n\n- trust patch.\n';
  const DEPS = [
    { id: 'DEP-P0012', kind: 'export', entry: '.', symbol: 'adaptiveAI', since: '4.1.1', removeIn: '5.0.0', exception: 'privacy', message: 'opt-in now' },
    { id: 'DEP-P0015', kind: 'css-global', entry: '.', symbol: '--aura-font-sans (Aeonik)', since: '4.1.1', removeIn: '5.0.0', exception: 'legal', message: 'system stack' },
    { id: 'DEP-P0099', kind: 'export', entry: '.', symbol: 'plain', since: '4.1.1', removeIn: '5.0.0', message: 'no exception' },
    { id: 'DEP-P0100', kind: 'export', entry: '.', symbol: 'later', since: '4.2.0', removeIn: '5.0.0', exception: 'security', message: 'other version' },
  ];
  it('lists the advisory patched in the version and every exception entry of the version', () => {
    const dir = mkdtempSync(join(tmpdir(), 'adv-'));
    writeFileSync(join(dir, '2026-10-hosted-runtime.md'),
      '# GHSA draft\n\n**Title:** Hosted example runtime: default JWT secret\n\n**Package:** `aura-glass` (npm). **Patched in:** 4.1.1. **Proposed severity:** High.\n');
    writeFileSync(join(dir, 'other.md'), '# Other\n\n**Patched in:** 4.2.0\n');
    const out = EVAL(`console.log(m.renderNotes4x({ version: '4.1.1', changelog: ${JSON.stringify(CL)},
      deprecations: ${JSON.stringify(DEPS)}, advisories: m.loadAdvisories('${dir}') }))`);
    const sec = out.slice(out.indexOf('## Security and privacy'), out.indexOf('## Commits'));
    expect(sec).toContain('- Advisory: Hosted example runtime: default JWT secret (`docs/security/advisories/2026-10-hosted-runtime.md`)');
    expect(sec).toContain('- `DEP-P0012` (privacy; export . adaptiveAI): opt-in now');
    expect(sec).toContain('- `DEP-P0015` (legal; css-global . --aura-font-sans (Aeonik)): system stack');
    expect(sec).not.toContain('DEP-P0099');
    expect(sec).not.toContain('DEP-P0100');
    expect(sec).not.toContain('Other');
    expect(out.indexOf('## Security and privacy')).toBeGreaterThan(out.indexOf('## Deprecations added'));
  });
  it('states an empty section instead of omitting it', () => {
    const out = EVAL(`console.log(m.renderNotes4x({ version: '4.1.1', changelog: ${JSON.stringify(CL)} }))`);
    expect(out).toContain('No advisory is patched in 4.1.1 and no deprecation entry of 4.1.1 carries an exception.');
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
      .toThrow(/moved dependencies without a kind:'dependency' DEP entry with since in \(4\.1\.1, 4\.2\.0\]: date-fns/);
  });
  /* C.3-15c: a 4.3.0 render while v4.2.0 is not tagged yet diffs against
     v4.1.0, so the 4.2.0 dependency entries announce the moves; an entry from
     before the range or after the version never does. */
  it('accepts a DEP entry from an untagged minor inside the range and shows its since', () => {
    const CL = '# Changelog\n\n## [4.3.0] - Unreleased\n\n- bridge.\n';
    const out = EVAL(`console.log(m.renderNotes4x({ version: '4.3.0', previous: 'v4.1.0',
      changelog: ${JSON.stringify(CL)}, deprecations: ${JSON.stringify(DEPS)},
      moved: m.movedDependencies(${JSON.stringify(PREV)}, ${JSON.stringify(CUR)}) }))`);
    expect(out).toContain('| `date-fns` | `^4.1.0` | `^4.1.0` | yes | `DEP-P0039` (since 4.2.0, removed in 5.0.0) |');
  });
  it('depWindow is (previous, version] on semver bases and == version otherwise', () => {
    const r = JSON.parse(EVAL(`const w = m.depWindow('v4.1.0', '4.3.0'); const x = m.depWindow('abc123', '4.3.0');
      console.log(JSON.stringify([['4.1.0', '4.1.1', '4.2.0', '4.3.0', '4.4.0', 'x', undefined].map(w), w.label,
        ['4.2.0', '4.3.0'].map(x), x.label]))`));
    expect(r).toEqual([[false, true, true, true, false, false, false], 'in (4.1.0, 4.3.0]', [false, true], '== 4.3.0']);
  });
  it('still fails closed when the only DEP entry predates the range', () => {
    const OLD = DEPS.map((d) => (d.symbol === 'date-fns' ? { ...d, since: '4.1.0' } : d));
    const CL = '# Changelog\n\n## [4.3.0] - Unreleased\n\n- bridge.\n';
    expect(() => EVAL(`m.renderNotes4x({ version: '4.3.0', previous: 'v4.1.0',
      changelog: ${JSON.stringify(CL)}, deprecations: ${JSON.stringify(OLD)},
      moved: m.movedDependencies(${JSON.stringify(PREV)}, ${JSON.stringify(CUR)}) })`))
      .toThrow(/DEP entry with since in \(4\.1\.0, 4\.3\.0\]: date-fns/);
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

/* REQ-PLAT-35 / REQ-FIN-113: a 4.x minor's notes carry the operator's
   downstream-grep record; the tag pipeline of that tag refuses to render
   without it. */
describe('release notes downstream-grep record (REQ-PLAT-35)', () => {
  const git = (cwd: string, ...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid',
        GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' } });
  const CHANGELOG = '# Changelog\n\n## [4.2.0] - Unreleased\n\n- diet.\n\n## [4.1.1] - Unreleased\n\n- patch.\n\n## [4.1.0] - 2026-09-05\n\n- old\n';
  const RECORD = JSON.stringify({ tool: 'downstream-grep', roots: [
    { root: '/src/app-a', status: 'ok', pins: ['package.json:3:"aura-glass": "3.1.1"'], imports: ['a.ts:1', 'b.ts:2'], removedSymbolHits: [] },
    { root: '/src/app-b', status: 'missing', pins: [], imports: [], removedSymbolHits: [] },
  ] }, null, 2);
  function repo({ record }: { record: boolean }) {
    const dir = mkdtempSync(join(tmpdir(), 'rnd-'));
    mkdirSync(join(dir, 'fragments/deprecations'), { recursive: true });
    mkdirSync(join(dir, 'src/contracts'), { recursive: true });
    mkdirSync(join(dir, 'docs/release/decisions'), { recursive: true });
    copyFileSync(join(ROOT, 'src/contracts/load-fragments.mjs'), join(dir, 'src/contracts/load-fragments.mjs'));
    symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'));
    writeFileSync(join(dir, '.gitignore'), 'node_modules\n');
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '4.2.0' }));
    writeFileSync(join(dir, 'CHANGELOG.md'), CHANGELOG);
    writeFileSync(join(dir, 'fragments/deprecations/plat.json'), '[]');
    if (record) writeFileSync(join(dir, 'docs/release/decisions/downstream-4.2.0.json'), RECORD);
    git(dir, 'init', '-q', '-b', 'main');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'feat: base');
    git(dir, 'tag', 'v4.1.0');
    git(dir, 'commit', '-q', '--allow-empty', '-m', 'feat: next');
    return dir;
  }
  const RUN = (root: string, argv: string[], env: Record<string, string>) => EVAL(
    `const code = await m.main(${JSON.stringify(argv)}, { root: ${JSON.stringify(root)}, env: ${JSON.stringify(env)} }); console.log('EXIT=' + code)`);

  it('summarises each root of the committed record with its sha256', () => {
    const dir = repo({ record: true });
    const outFile = join(dir, 'notes.md');
    expect(RUN(dir, ['--tag', 'v4.2.0', '--line', '4x', '--out', outFile], { CI_COMMIT_TAG: 'v4.2.0' })).toContain('EXIT=0');
    const notes = readFileSync(outFile, 'utf8');
    const sha = require('node:crypto').createHash('sha256').update(RECORD).digest('hex');
    expect(notes).toContain(`Attached record: \`docs/release/decisions/downstream-4.2.0.json\` (sha256 \`${sha}\`).`);
    expect(notes).toContain('| `/src/app-a` | ok | 1 | 2 | 0 |');
    expect(notes).toContain('| `/src/app-b` | missing | 0 | 0 | 0 |');
    expect(notes.indexOf('## Downstream grep record')).toBeGreaterThan(notes.indexOf('## Changelog'));
  });
  it('the v4.2.0 tag pipeline exits 1 without the record', () => {
    const dir = repo({ record: false });
    const outFile = join(dir, 'notes.md');
    expect(RUN(dir, ['--tag', 'v4.2.0', '--line', '4x', '--out', outFile], { CI_COMMIT_TAG: 'v4.2.0' })).toContain('EXIT=1');
  });
  it('outside the tag pipeline a missing record is stated, not hidden', () => {
    const dir = repo({ record: false });
    const outFile = join(dir, 'notes.md');
    expect(RUN(dir, ['--tag', 'v4.2.0', '--line', '4x', '--out', outFile], {})).toContain('EXIT=0');
    expect(readFileSync(outFile, 'utf8')).toContain('_Not committed yet: `docs/release/decisions/downstream-4.2.0.json`');
  });
  it('a patch release has no downstream section and needs no record', () => {
    const dir = repo({ record: false });
    const outFile = join(dir, 'notes.md');
    expect(RUN(dir, ['--tag', 'v4.1.1', '--line', '4x', '--out', outFile], { CI_COMMIT_TAG: 'v4.1.1' })).toContain('EXIT=0');
    expect(readFileSync(outFile, 'utf8')).not.toContain('## Downstream grep record');
  });
  it('a record without roots fails closed', () => {
    expect(() => EVAL(`m.downstreamSection({ version: '4.2.0', record: { text: '{"roots":[]}' } })`))
      .toThrow(/has no roots/);
  });
});

/* release/4.x only: the real tree renders v4.1.1 notes with sourced
   Deprecated, Fixed and Security sections (REQ-PLAT-32 4x port). */
describe('release notes on this tree: --tag v4.1.1 --line 4x', () => {
  it('renders the CHANGELOG section, the 4.1.1 deprecations, the hosted-runtime advisory and the exception entries', () => {
    const outFile = join(mkdtempSync(join(tmpdir(), 'rn411-')), 'notes.md');
    const r = EVAL(`const code = await m.main(${JSON.stringify(['--tag', 'v4.1.1', '--line', '4x', '--since', 'HEAD~1', '--out', outFile])},
      { root: ${JSON.stringify(ROOT)}, env: {} }); console.log('EXIT=' + code)`);
    expect(r).toContain('EXIT=0');
    const notes = readFileSync(outFile, 'utf8');
    expect(notes.split('\n')[0]).toBe('# aura-glass 4.1.1 release notes');
    expect(notes).toContain('### Security and privacy');
    const at = (h: string) => notes.indexOf(`\n## ${h}`);
    const dep = notes.slice(at('Deprecations added'), at('Security and privacy'));
    expect(dep).toMatch(/- `DEP-P\d{4}`/);
    const sec = notes.slice(at('Security and privacy'), at('Commits'));
    expect(sec).toContain('(`docs/security/advisories/2026-10-hosted-runtime.md`)');
    expect(sec).toMatch(/- `DEP-P\d{4}` \((privacy|honesty|legal|security|crash);/);
    expect(notes).not.toContain('_Populated by');
  });
});
