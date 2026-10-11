// tests/capability/diff-gate-existing.test.ts — REQ-SURF-183 diff gate.
// Only registry/labs entries that did not exist at <base> are "added";
// editing a file of an existing entry (REQ-SURF-188 added parameters.ag to 15
// registry stories) must not demand a ledger row change. A temp git repo
// carries a copy of the script so ROOT resolves to the fixture.
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = join(__dirname, '../..');
let repo = '';
let base = '';

const git = (...args: string[]) =>
  execFileSync('git', ['-c', 'user.name=fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false', ...args],
    { cwd: repo, encoding: 'utf8' }).trim();
const put = (rel: string, body: string) => {
  mkdirSync(dirname(join(repo, rel)), { recursive: true });
  writeFileSync(join(repo, rel), body);
};
const copy = (rel: string) => {
  mkdirSync(dirname(join(repo, rel)), { recursive: true });
  copyFileSync(join(ROOT, rel), join(repo, rel));
};

beforeAll(() => {
  repo = mkdtempSync(join(tmpdir(), 'ag-ledger-diff-'));
  git('init', '-q');
  copy('scripts/surf/verify-capability-ledger.mjs');
  copy('docs/auraglass-5/capability-ledger.json');
  copy('docs/auraglass-5/capability-ledger.schema.json');
  put('registry/items/existing-item/Existing.stories.tsx', 'export default { title: "registry/existing-item" };\n');
  put('registry/blocks/existing-block/Block.stories.tsx', 'export default { title: "registry/existing-block" };\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'base');
  base = git('rev-parse', 'HEAD');
  put('registry/items/existing-item/Existing.stories.tsx',
    'export default { title: "registry/existing-item", parameters: { ag: { subject: "existing-item", kind: "showcase", scenes: "all" } } };\n');
  put('registry/blocks/existing-block/Block.stories.tsx', 'export default { title: "registry/existing-block", parameters: {} };\n');
  put('registry/items/ghost-item/index.tsx', 'export const Ghost = () => null;\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'head');
});

afterAll(() => {
  if (repo) rmSync(repo, { recursive: true, force: true });
});

describe('capability-ledger --diff: added vs edited registry entries', () => {
  it('flags only the entry that did not exist at base', () => {
    const r = spawnSync(process.execPath, [join(repo, 'scripts/surf/verify-capability-ledger.mjs'), '--diff', base],
      { cwd: repo, encoding: 'utf8' });
    const out = `${r.stdout}${r.stderr}`;
    expect(out).toContain('diff: registry/labs entry ghost-item added without a matching ledger row change');
    expect(out).not.toContain('entry existing-item added');
    expect(out).not.toContain('entry existing-block added');
    expect(r.status).toBe(1);
  });
});
