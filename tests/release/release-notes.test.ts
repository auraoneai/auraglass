/* @jest-environment node */
/* REQ-PLAT-32: release-notes.mjs — fixed heading order, numbers traced to
   artifacts, commit subjects + changesets + change-class inputs. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
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
    expect(idx.every((v, i) => v >= 0 && (i === 0 || v > (idx[i - 1] ?? Infinity)))).toBe(true);
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

describe('release notes --tag --line (REQ-PLAT-16)', () => {
  const GIT_ENV = {
    ...process.env,
    GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid',
    GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid',
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
  };
  const tempRepo = () => {
    const dir = mkdtempSync(join(tmpdir(), 'rn-'));
    const git = (...a: string[]) => execFileSync('git', a, { cwd: dir, env: GIT_ENV, encoding: 'utf8' });
    git('init', '-q', '-b', 'next');
    return { dir, git };
  };
  const cli = (dir: string, args: string[]) => {
    const out = join(dir, 'notes.md');
    execFileSync('node', [`${ROOT}/scripts/release/release-notes.mjs`, ...args, '--out', out,
      '--claims-dir', join(dir, 'none'), '--capability-ledger', join(dir, 'none.json'),
      '--change-class', join(dir, 'none.json')], { cwd: dir, env: GIT_ENV, encoding: 'utf8' });
    return readFileSync(out, 'utf8');
  };

  it('v5.0.0-beta.1 on 5x: header from the tag, subjects since the previous v5 tag only', () => {
    const { dir, git } = tempRepo();
    git('commit', '-q', '--allow-empty', '-m', 'feat: before the 4.x tag');
    git('tag', 'v4.9.0');
    git('commit', '-q', '--allow-empty', '-m', 'feat: shipped in alpha');
    git('tag', 'v5.0.0-alpha.3');
    git('commit', '-q', '--allow-empty', '-m', 'feat(cmp): new in beta');
    git('commit', '-q', '--allow-empty', '-m', 'fix(tokens): beta fix');
    git('tag', 'v5.0.0-beta.1');
    const text = cli(dir, ['--tag', 'v5.0.0-beta.1', '--line', '5x']);
    expect(text.split('\n')[0]).toBe('# aura-glass 5.0.0-beta.1 release notes');
    expect(text).toContain('- new in beta');
    expect(text).toContain('- beta fix');
    expect(text).not.toContain('shipped in alpha');
    expect(text).not.toContain('before the 4.x tag');
  });

  it('v4.2.0 on 4x: header, the CHANGELOG section of the tag, deprecations added in 4.2.0', () => {
    const { dir } = tempRepo();
    writeFileSync(join(dir, 'CHANGELOG.md'),
      '# Changelog\n\n## [4.2.0] - 2026-11-01\n\n### Changed\n\n- moved peers first\n\n## [4.1.1] - 2026-10-20\n\n- older entry\n');
    writeFileSync(join(dir, 'deprecations.json'), JSON.stringify({ version: 1, entries: [
      { id: 'DEP-P0020', kind: 'export', entry: '.', symbol: 'GlassModal', since: '4.2.0', removeIn: '5.0.0', replacement: 'Dialog' },
      { id: 'DEP-P0012', kind: 'export', entry: '.', symbol: 'enableAdaptiveAI', since: '4.1.1', removeIn: '5.0.0', replacement: null },
    ] }));
    const text = cli(dir, ['--tag', 'v4.2.0', '--line', '4x']);
    expect(text.split('\n')[0]).toBe('# aura-glass 4.2.0 release notes');
    expect(text).toContain('- moved peers first');
    expect(text).not.toContain('older entry');
    expect(text).toContain('## Deprecations added in 4.2.0');
    expect(text).toContain('**DEP-P0020** (export, removed in 5.0.0): . `GlassModal` → Dialog');
    expect(text).not.toContain('DEP-P0012');
    expect(text).not.toContain('Dependency floors');
  });

  it('4x without a CHANGELOG section for the tag fails', () => {
    const { dir } = tempRepo();
    writeFileSync(join(dir, 'CHANGELOG.md'), '# Changelog\n\n## [4.1.1] - 2026-10-20\n');
    writeFileSync(join(dir, 'deprecations.json'), JSON.stringify({ version: 1, entries: [] }));
    expect(() => cli(dir, ['--tag', 'v4.2.0', '--line', '4x'])).toThrow(/no ## \[4\.2\.0\] section/);
  });

  it('previousTag stays on the same major and below the tag', () => {
    const out = EVAL(`console.log(JSON.stringify([
      m.previousTag(['v4.9.0', 'v5.0.0-alpha.3', 'v5.0.0-beta.2', 'v5.0.0-alpha.10'], 'v5.0.0-beta.1'),
      m.previousTag(['v4.1.0', 'v4.2.0', 'v5.0.0-alpha.0'], 'v4.1.1'),
      m.previousTag(['v4.1.0'], 'v5.0.0-alpha.0')]))`);
    expect(JSON.parse(out)).toEqual(['v5.0.0-alpha.10', 'v4.1.0', null]);
  });

  it('the runbook carries the operator gh release step', () => {
    const doc = readFileSync(join(ROOT, 'docs/release-rollback-deprecation.md'), 'utf8');
    expect(doc).toContain('gh release create <tag> --notes-file release-notes.md dist-maps.tgz');
  });
});
