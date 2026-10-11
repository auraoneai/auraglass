// tests/capability/diff-gate.test.ts — REQ-SURF-183.
// `--diff <base>` derives the before/after value-export snapshots itself from
// the entry barrels named in src/contracts/entries.ts at <base> and HEAD (no
// --exports flag), so CI never prints 'exports diff not evaluated'. A temp git
// repo commits an `export const GhostExport` to an entry barrel without a
// ledger row: the gate exits 1 naming it and writes its evidence.
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-diff-'));
  const git = (...a: string[]) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' }).trim();
  git('init', '-q');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'user.name', 'fixture');
  git('config', 'commit.gpgsign', 'false');
  for (const p of ['scripts/surf', 'docs/auraglass-5', 'src/contracts', 'src/ai/thread']) mkdirSync(join(dir, p), { recursive: true });
  copyFileSync(join(ROOT, 'scripts/surf/verify-capability-ledger.mjs'), join(dir, 'scripts/surf/verify-capability-ledger.mjs'));
  copyFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), join(dir, 'docs/auraglass-5/capability-ledger.json'));
  copyFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.schema.json'), join(dir, 'docs/auraglass-5/capability-ledger.schema.json'));
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '5.0.0' }));
  // The ledger's stories[] ids are re-checked against CSF files in the repo.
  for (const f of ['src/data/table/Table.stories.tsx', 'src/media/MediaScrubber.stories.tsx', 'src/media/ImageViewer.stories.tsx']) {
    mkdirSync(join(dir, f, '..'), { recursive: true });
    copyFileSync(join(ROOT, f), join(dir, f));
  }
  writeFileSync(join(dir, 'src/contracts/entries.ts'), [
    "export const ENTRIES = [",
    "  { subpath: '.', source: 'src/index.ts', owner: 'PLAT', ga: '5.0', exports: [] },",
    "  { subpath: './ai', source: 'src/ai/index.ts', owner: 'SURF', ga: '5.0', exports: ['Thread'] },",
    "];",
  ].join('\n'));
  writeFileSync(join(dir, 'src/index.ts'), "export const Command = 1;\nexport type Ignored = string;\n");
  writeFileSync(join(dir, 'src/ai/thread/Thread.tsx'), 'export function Thread() { return null; }\n');
  writeFileSync(join(dir, 'src/ai/index.ts'), "export * from './thread/Thread';\nexport { Message } from './message';\n");
  git('add', '-A');
  git('commit', '-q', '-m', 'base');
  return { dir, git, base: git('rev-parse', 'HEAD') };
}

const run = (dir: string, base: string) =>
  spawnSync(process.execPath, [join(dir, 'scripts/surf/verify-capability-ledger.mjs'), '--diff', base, '--prd-dir', join(ROOT, 'docs/auraglass-5/prd')],
    { encoding: 'utf8', cwd: dir });

describe('--diff derives export snapshots from the entry barrels', () => {
  it('an export added to an entry barrel without a ledger row exits 1 naming it', () => {
    const { dir, git, base } = repo();
    writeFileSync(join(dir, 'src/ai/index.ts'), "export * from './thread/Thread';\nexport { Message } from './message';\nexport const GhostExport = 1;\n");
    git('commit', '-q', '-am', 'add GhostExport');
    const r = run(dir, base);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('export GhostExport (./ai) added without a ledger row');
    expect(`${r.stdout}${r.stderr}`).not.toContain('exports diff not evaluated');
    const ev = JSON.parse(readFileSync(join(dir, '.artifacts/surf/ledger/diff.json'), 'utf8'));
    expect(ev.exportsAdded).toEqual([{ subpath: './ai', name: 'GhostExport', row: false }]);
    const head = JSON.parse(readFileSync(join(dir, '.artifacts/surf/ledger/exports-head.json'), 'utf8'));
    expect(head['./ai']).toEqual(['GhostExport', 'Message', 'Thread']);
    expect(head['.']).toEqual(['Command']);
  });
  it('an export through a nested `export *` is enumerated too', () => {
    const { dir, git, base } = repo();
    writeFileSync(join(dir, 'src/ai/thread/Thread.tsx'), 'export function Thread() { return null; }\nexport class GhostPanel {}\n');
    git('commit', '-q', '-am', 'add GhostPanel');
    const r = run(dir, base);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('export GhostPanel (./ai) added without a ledger row');
  });
  it('an added export that is a ledger name passes', () => {
    const { dir, git, base } = repo();
    writeFileSync(join(dir, 'src/ai/index.ts'), "export * from './thread/Thread';\nexport { Message } from './message';\nexport { Composer } from './composer';\n");
    git('commit', '-q', '-am', 'add Composer');
    const r = run(dir, base);
    expect(`${r.stdout}${r.stderr}`).toContain('capability-ledger: ok');
    expect(r.status).toBe(0);
  });
});
