/** PLAT-304/PLAT-85: --dry-run prints unified diffs and writes nothing; exit 1 on todos unless --allow-todo. */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMigration } from '../src/migrate/4to5/index.js';
import { migrateCommand } from '../src/commands/migrate.js';
import { addCommand } from '../src/commands/add.js';
import { initCommand } from '../src/commands/init.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agdry-'));
const treeHash = (dir: string): string[] => {
  const out: string[] = [];
  const walk = (d: string): void => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else out.push(`${path.relative(dir, p)}:${fs.readFileSync(p, 'utf8')}`);
    }
  };
  walk(dir);
  return out;
};
const capture = () => {
  const buf: string[] = [];
  const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
  return { buf, stop: () => spy.mockRestore() };
};

describe('dry-run', () => {
  it('migrate 4to5 writes nothing and reports diffs', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'a.tsx'), `import { Nav } from 'aura-glass/navigation';\nexport const x = <Nav/>;\n`);
    const r = await runMigration({ cwd: dir, dryRun: true });
    expect(fs.readFileSync(path.join(dir, 'a.tsx'), 'utf8')).toContain('aura-glass/navigation');
    expect(r.diffs.get('a.tsx')).toContain(`-import { Nav } from 'aura-glass/navigation'`);
    expect(r.diffs.get('a.tsx')).toContain(`+import { Nav } from 'aura-glass'`);
  });

  it('migrate 4to5 dry-run leaves a byte-identical tree', async () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'sub'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'a.tsx'), `import { Nav } from 'aura-glass/navigation';\n`);
    fs.writeFileSync(path.join(dir, 'sub', 'b.tsx'), `import { Dialog } from 'aura-glass/overlay';\n`);
    const before = treeHash(dir);
    await runMigration({ cwd: dir, dryRun: true });
    expect(treeHash(dir)).toEqual(before);
  });

  it('byte-stable second run (idempotent)', async () => {
    const dir = tmp();
    const f = path.join(dir, 'a.tsx');
    fs.writeFileSync(f, `import { Nav } from 'aura-glass/navigation';\nexport const x = <Nav/>;\n`);
    /* no .git — isGitRepo false -> --allow-no-git opts out */
    const code = await migrateCommand(['4to5'], { cwd: dir, 'allow-no-git': true, silent: true });
    expect(code).toBe(0);
    const once = fs.readFileSync(f, 'utf8');
    const again = await runMigration({ cwd: dir });
    expect(again.report.files.length).toBe(0);
    expect(fs.readFileSync(f, 'utf8')).toBe(once);
  });

  it('add --dry-run prints a unified diff and writes nothing', async () => {
    const dir = tmp();
    const reg = fs.mkdtempSync(path.join(os.tmpdir(), 'agreg-'));
    fs.writeFileSync(path.join(reg, 'button.json'), JSON.stringify({
      name: 'button', type: 'registry:component',
      files: [{ path: 'components/button.tsx', content: "export const B=1;\n" }],
    }));
    const cap = capture();
    try {
      await addCommand(['button'], { cwd: dir, registry: reg, 'dry-run': true, 'allow-no-git': true, json: true, silent: true });
    } finally { cap.stop(); }
    const payload = JSON.parse(cap.buf.join(''));
    expect(payload.dryRun).toBe(true);
    expect(payload.diffs[0].path).toMatch(/button\.tsx$/);
    expect(payload.diffs[0].diff).toContain('+export const B=1;');
    /* nothing written */
    expect(fs.existsSync(path.join(dir, 'components'))).toBe(false);
  });

  it('init --dry-run prints a diff for auraglass.json and writes nothing', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { 'next': '15.0.0' } }));
    const cap = capture();
    try {
      await initCommand([], { cwd: dir, 'dry-run': true, json: true, silent: true });
    } finally { cap.stop(); }
    const payload = JSON.parse(cap.buf.join(''));
    expect(payload.diffs.length).toBeGreaterThan(0);
    expect(payload.diffs.some((d: { path: string }) => d.path === 'auraglass.json')).toBe(true);
    expect(fs.existsSync(path.join(dir, 'auraglass.json'))).toBe(false);
  });
});
