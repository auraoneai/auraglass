/* REQ-PLAT-33: docs/release-rollback-deprecation.md covers the three dist-tag lines with the
   eight scenarios, each carrying its executable commands; unpublish is never a rollback step;
   the S1-S3 table stays; no CJS / self-hosted runtime scope lines. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';

const runbook = readFileSync('docs/release-rollback-deprecation.md', 'utf8');

const SCENARIOS = [
  '1. Bad 4.x release before 5.0 GA',
  '2. Bad LTS patch (`v4-lts`)',
  '3. Bad pre-release (`next`)',
  '4. Bad 5.0 GA (`latest` back to `v4-lts`)',
  '5. Tier regression',
  '6. Unreadable material',
  '7. Codemod damage',
  '8. Removed item needed',
] as const;

/** Body of `### <heading>` up to the next `##`/`###` heading. */
function section(heading: string): string {
  const start = runbook.indexOf(`\n### ${heading}\n`);
  if (start < 0) throw new Error(`missing scenario heading: ### ${heading}`);
  const body = runbook.slice(start + heading.length + 6);
  const end = body.search(/\n##{1,2} /);
  return end < 0 ? body : body.slice(0, end);
}

describe('rollback runbook (REQ-PLAT-33)', () => {
  it('has exactly the eight scenarios, in order', () => {
    const headings = [...runbook.matchAll(/^### (.+)$/gm)].map((m) => m[1]);
    expect(headings).toEqual([...SCENARIOS]);
  });

  it('names the three dist-tag lines', () => {
    for (const tag of ['`latest`', '`next`', '`v4-lts`']) expect(runbook).toContain(`| ${tag} |`);
  });

  it.each([
    [SCENARIOS[0], ['npm dist-tag add aura-glass@<prev> latest', 'npm deprecate aura-glass@<bad> "<msg>"']],
    [SCENARIOS[1], ['npm dist-tag add aura-glass@<prev-4.x> v4-lts', 'npm deprecate aura-glass@<bad-4.x>']],
    [SCENARIOS[2], ['npm dist-tag add aura-glass@<prev-prerelease> next', 'npm deprecate aura-glass@<bad-prerelease>']],
    [SCENARIOS[3], ['npm view aura-glass dist-tags.v4-lts', 'npm dist-tag add aura-glass@<current-v4-lts> latest',
      'AG_ROLLBACK_LATEST_TO_4X=true']],
    [SCENARIOS[4], ['tier="standard"']],
    [SCENARIOS[5], ['transparency="tinted"', 'data-ag-transparency="tinted"', 'data-ag-transparency="solid"']],
    [SCENARIOS[6], ['--allow-dirty', 'git checkout .', 'migrate 4to5 --dry-run']],
    [SCENARIOS[7], ['npm install aura-glass@v4-lts', 'npx @auraglass/cli add <item>']],
  ])('%s carries its commands', (heading, literals) => {
    const body = section(heading);
    for (const l of literals) expect(body).toContain(l);
  });

  it('commands sit in fenced blocks, not prose only', () => {
    for (const h of [SCENARIOS[0], SCENARIOS[1], SCENARIOS[2], SCENARIOS[3], SCENARIOS[6], SCENARIOS[7]])
      expect(section(h)).toMatch(/```bash\n[\s\S]*?npm |```bash\n[\s\S]*?git |```bash\n[\s\S]*?npx /);
  });

  it('a bad GA keeps 5.0 installable (no unpublish in any scenario)', () => {
    expect(section(SCENARIOS[3])).toMatch(/5\.0 stays installable/);
    for (const h of SCENARIOS) expect(section(h)).not.toMatch(/npm unpublish/);
  });

  it('states that npm unpublish is never a rollback step, with the owner-only emergency exception', () => {
    expect(runbook).toMatch(/\*\*`npm unpublish` is never a rollback step\.\*\*/);
    expect(runbook).toMatch(/exposed secret or a legal\s+emergency/);
    expect(runbook).toMatch(/owner action with a decision record/);
  });

  it('keeps the S1-S3 severity table', () => {
    expect(runbook).toContain('## Severity Levels');
    for (const s of ['| S1 |', '| S2 |', '| S3 |']) expect(runbook).toContain(s);
  });

  it('drops the CJS and self-hosted runtime scope lines', () => {
    expect(runbook).not.toMatch(/self-hosted runtime|CJS/);
  });

  it('points the AC-PLAT-19 drill at its decision record', () => {
    expect(runbook).toContain('## Drill (AC-PLAT-19)');
    expect(runbook).toContain('docs/release/decisions/rollback-drill.md');
  });
});
