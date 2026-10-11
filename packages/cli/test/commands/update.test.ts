/** update — applies upstream to clean states, refuses locally-modified
 *  (exit 1), --force writes <file>.auraglass-upstream. */
import { describe, expect, it, jest } from '@jest/globals';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { updateCommand } from '../../src/commands/update.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agupd-'));
const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const stamp = (name: string, version: string, h: string) => `// @auraglass/registry ${name}@${version} sha256:${h}\n`;
const capture = () => {
  const buf: string[] = [];
  const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
  return { buf, stop: () => spy.mockRestore() };
};

const OLD = 'export const item = 1;\n';
const NEW = 'export const item = 2;\n';

function fixture(): { dir: string; reg: string } {
  const dir = tmp();
  const reg = fs.mkdtempSync(path.join(os.tmpdir(), 'agreg-'));
  fs.writeFileSync(path.join(reg, 'w.json'), JSON.stringify({
    name: 'w', type: 'registry:component', version: '1.1.0',
    files: [
      { path: 'unchanged.tsx', content: OLD },
      { path: 'upchanged.tsx', content: NEW },
      { path: 'modified.tsx', content: OLD },
    ],
  }));
  const compDir = path.join(dir, 'components', 'aura', 'w');
  fs.mkdirSync(compDir, { recursive: true });
  fs.writeFileSync(path.join(compDir, 'unchanged.tsx'), stamp('w', '1.0.0', sha(OLD)) + OLD);
  fs.writeFileSync(path.join(compDir, 'upchanged.tsx'), stamp('w', '1.0.0', sha(OLD)) + OLD);
  fs.writeFileSync(path.join(compDir, 'modified.tsx'), stamp('w', '1.0.0', sha(OLD)) + '/* local */\n' + OLD);
  return { dir, reg };
}

describe('update', () => {
  it('updates upstream-changed files; refuses locally-modified (exit 1)', async () => {
    const { dir, reg } = fixture();
    const cap = capture();
    let code: number | undefined;
    try {
      code = await updateCommand(['w'], { cwd: dir, registry: reg, 'allow-no-git': true, json: true, silent: true });
    } finally { cap.stop(); }
    expect(code).toBe(1);
    const payload = JSON.parse(cap.buf.join(''));
    const by = (n: string) => payload.files.find((f: { file: string }) => f.file.includes(n)).action;
    expect(by('unchanged.tsx')).toBe('unchanged');
    expect(by('upchanged.tsx')).toBe('updated');
    expect(by('modified.tsx')).toBe('refused-locally-modified');
    /* the upstream-changed file got the new content + new stamp */
    const body = fs.readFileSync(path.join(dir, 'components/aura/w/upchanged.tsx'), 'utf8');
    expect(body).toContain('item = 2');
    expect(body).toContain(`sha256:${sha(NEW)}`);
    /* locally-modified untouched */
    expect(fs.readFileSync(path.join(dir, 'components/aura/w/modified.tsx'), 'utf8')).toContain('/* local */');
  });

  it('--force writes .auraglass-upstream instead of overwriting', async () => {
    const { dir, reg } = fixture();
    const code = await updateCommand(['w'], { cwd: dir, registry: reg, 'allow-no-git': true, force: true, json: true, silent: true });
    expect(code).toBe(0);
    const upstream = path.join(dir, 'components/aura/w/modified.tsx.auraglass-upstream');
    expect(fs.existsSync(upstream)).toBe(true);
    expect(fs.readFileSync(path.join(dir, 'components/aura/w/modified.tsx'), 'utf8')).toContain('/* local */');
  });

  it('runs against an empty project dir', async () => {
    const dir = tmp();
    const code = await updateCommand([], { cwd: dir, json: true, silent: true }).catch((e) => e.code);
    expect([0, 1, 2, 4]).toContain(code);
  });
});
