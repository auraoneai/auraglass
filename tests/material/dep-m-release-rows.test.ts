/**
 * @jest-environment node
 *
 * REQ-FIN-57 / REQ-MAT-67 agent prep: the 4.2.0 / 4.3.0 DEP-M release-notes
 * lists are generated from fragments/deprecations/mat.ts by
 * scripts/mat/dep-m-release-rows.mjs and must stay in sync with it.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/mat/dep-m-release-rows.mjs');

const run = (args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8' });

const row = (id: string, since: string, extra: Record<string, unknown> = {}) => ({
  id,
  kind: 'export',
  status: 'planned',
  entry: '.',
  symbol: `Sym${id.slice(-2)}`,
  since,
  removeIn: '5.0.0',
  replacement: 'Surface',
  codemod: 'canonical-names',
  automation: 'full',
  breaking: 'B5',
  message: 'm',
  doc: `#${id.toLowerCase()}`,
  ...extra,
});

function fixture(rows: unknown[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'dep-m-rows-'));
  mkdirSync(join(dir, 'fragments/deprecations'), { recursive: true });
  writeFileSync(
    join(dir, 'fragments/deprecations/mat.ts'),
    `export default ${JSON.stringify(rows, null, 2)};\n`,
  );
  return dir;
}

describe('dep-m-release-rows', () => {
  const dirs: string[] = [];
  afterAll(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));

  it('committed ci/mat/release-notes lists match fragments/deprecations/mat.ts', () => {
    const res = run(['--check']);
    expect(res.stderr).toBe('');
    expect(res.status).toBe(0);
  });

  it('committed lists cover every DEP-M row of the fragment exactly once', () => {
    const res = run(['--json']);
    expect(res.status).toBe(0);
    const data = JSON.parse(res.stdout);
    const listed = ['4.2.0', '4.3.0'].flatMap((v) =>
      readFileSync(join(ROOT, `ci/mat/release-notes/dep-m-${v}.md`), 'utf8')
        .split('\n')
        .filter((l) => l.startsWith('| DEP-M'))
        .map((l) => l.split('|')[1].trim()),
    );
    expect(new Set(listed).size).toBe(listed.length);
    expect(listed.length + data.other.length).toBe(data.total);
  });

  it('groups by since, sorts by id, escapes pipes and reports other versions', () => {
    const dir = fixture([
      row('DEP-M0902', '4.2.0'),
      row('DEP-M0901', '4.2.0', { replacement: 'a|b', codemod: null, automation: 'manual' }),
      row('DEP-M0903', '4.3.0', { kind: 'css-var', symbol: '--glass-x', compat: 'aura-glass/compat' }),
      row('DEP-M0904', '4.4.0'),
      { ...row('DEP-P0001', '4.2.0') },
    ]);
    dirs.push(dir);
    const res = run(['--root', dir]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('1 DEP-M row(s) outside 4.2.0/4.3.0: DEP-M0904@4.4.0');

    const md42 = readFileSync(join(dir, 'ci/mat/release-notes/dep-m-4.2.0.md'), 'utf8');
    const ids42 = md42.split('\n').filter((l) => l.startsWith('| DEP-')).map((l) => l.split('|')[1].trim());
    expect(ids42).toEqual(['DEP-M0901', 'DEP-M0902']);
    expect(md42).toContain('- Rows: 2');
    expect(md42).toContain('- By automation: full 1, manual 1');
    expect(md42).toContain('| DEP-M0901 | `.` | `Sym01` |');
    expect(md42).toContain('| a\\|b | — | manual |');

    const md43 = readFileSync(join(dir, 'ci/mat/release-notes/dep-m-4.3.0.md'), 'utf8');
    expect(md43).toContain('## css-var (1)');
    expect(md43).toContain('| DEP-M0903 | `.` | `--glass-x` | Surface | `canonical-names` | full | B5 | `aura-glass/compat` |');

    expect(run(['--root', dir, '--check']).status).toBe(0);
  });

  it('--check fails once the fragment changes without regeneration', () => {
    const dir = fixture([row('DEP-M0901', '4.2.0')]);
    dirs.push(dir);
    expect(run(['--root', dir]).status).toBe(0);
    writeFileSync(
      join(dir, 'fragments/deprecations/mat.ts'),
      `export default ${JSON.stringify([row('DEP-M0901', '4.2.0'), row('DEP-M0902', '4.2.0')])};\n`,
    );
    const res = run(['--root', dir, '--check']);
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('ci/mat/release-notes/dep-m-4.2.0.md is stale');
  });

  it('rejects duplicate DEP-M ids and writes nothing', () => {
    const dir = fixture([row('DEP-M0901', '4.2.0'), row('DEP-M0901', '4.3.0')]);
    dirs.push(dir);
    const res = run(['--root', dir]);
    expect(res.status).toBe(1);
    expect(res.stderr).toContain('duplicate ids DEP-M0901');
    expect(existsSync(join(dir, 'ci/mat/release-notes'))).toBe(false);
  });
});
