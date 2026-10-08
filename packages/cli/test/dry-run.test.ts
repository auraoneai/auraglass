/** PLAT-304: --dry-run prints diffs and writes nothing; exit 1 on todos unless --allow-todo. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMigration } from '../src/migrate/4to5/index.js';
import { migrateCommand } from '../src/commands/migrate.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agdry-'));
describe('dry-run', () => {
  it('writes nothing and reports diffs', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'a.tsx'), `import { GlassButton } from 'aura-glass';\nexport const x = <GlassButton/>;\n`);
    const r = await runMigration({ cwd: dir, dryRun: true });
    expect(fs.readFileSync(path.join(dir, 'a.tsx'), 'utf8')).toContain('GlassButton');
    expect(r.diffs.get('a.tsx')).toContain('-import { GlassButton }');
    expect(r.diffs.get('a.tsx')).toContain('+import { Button }');
  });
  it('byte-stable second run (idempotent)', async () => {
    const dir = tmp();
    const f = path.join(dir, 'a.tsx');
    fs.writeFileSync(f, `import { GlassButton } from 'aura-glass';\nexport const x = <GlassButton/>;\n`);
    fs.writeFileSync(path.join(dir, '.git'), 'x'); // not a real repo -> allow-no-git
    const code = await migrateCommand(['4to5'], { cwd: dir, allowNoGit: true, silent: true });
    expect(code).toBe(0);
    const once = fs.readFileSync(f, 'utf8');
    const again = await runMigration({ cwd: dir });
    expect(again.report.files.length).toBe(0);
    expect(fs.readFileSync(f, 'utf8')).toBe(once);
  });
});
