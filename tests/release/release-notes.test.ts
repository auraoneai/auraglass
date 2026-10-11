/* REQ-PLAT-32: release-notes.mjs — fixed heading order, numbers traced to
   artifacts, commit subjects + changesets + change-class inputs. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
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
