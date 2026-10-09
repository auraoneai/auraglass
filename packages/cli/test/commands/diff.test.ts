/** diff — all 4 stamp states against a fixture registry + --patch. */
import { describe, expect, it, jest } from '@jest/globals';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { diffCommand } from '../../src/commands/diff.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agdiff-'));
const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const stamp = (name: string, version: string, h: string) => `// @auraglass/registry ${name}@${version} sha256:${h}\n`;
const capture = () => {
  const buf: string[] = [];
  const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
  return { buf, stop: () => spy.mockRestore() };
};

const UPSTREAM = 'export const item = 1;\n';
const UPSTREAM_NEW = 'export const item = 2;\n';

function fixture(): { dir: string; reg: string } {
  const dir = tmp();
  const reg = fs.mkdtempSync(path.join(os.tmpdir(), 'agreg-'));
  /* upstream 'w' at current content; installed stamped with the OLD sha */
  fs.writeFileSync(path.join(reg, 'w.json'), JSON.stringify({
    name: 'w', type: 'registry:component',
    files: [
      { path: 'unchanged.tsx', content: UPSTREAM },
      { path: 'modified.tsx', content: UPSTREAM },
      { path: 'upchanged.tsx', content: UPSTREAM_NEW },
      { path: 'both.tsx', content: UPSTREAM_NEW },
    ],
  }));
  const compDir = path.join(dir, 'components', 'aura', 'w');
  fs.mkdirSync(compDir, { recursive: true });
  fs.writeFileSync(path.join(compDir, 'unchanged.tsx'), stamp('w', '1.0.0', sha(UPSTREAM)) + UPSTREAM);
  fs.writeFileSync(path.join(compDir, 'modified.tsx'), stamp('w', '1.0.0', sha(UPSTREAM)) + '/* local edit */\n' + UPSTREAM);
  fs.writeFileSync(path.join(compDir, 'upchanged.tsx'), stamp('w', '1.0.0', sha(UPSTREAM)) + UPSTREAM);
  fs.writeFileSync(path.join(compDir, 'both.tsx'), stamp('w', '1.0.0', sha(UPSTREAM)) + '/* local edit */\n' + UPSTREAM);
  return { dir, reg };
}

describe('diff', () => {
  it('reports all 4 states', async () => {
    const { dir, reg } = fixture();
    const cap = capture();
    try {
      await diffCommand(['w'], { cwd: dir, registry: reg, json: true, silent: true });
    } finally { cap.stop(); }
    const files = JSON.parse(cap.buf.join('')).files as Array<{ file: string; state: string }>;
    const by = (n: string) => files.find((f) => f.file.includes(n))!.state;
    expect(by('unchanged.tsx')).toBe('unchanged');
    expect(by('modified.tsx')).toBe('locally-modified');
    expect(by('upchanged.tsx')).toBe('upstream-changed');
    expect(by('both.tsx')).toBe('both');
  });

  it('--patch prints a unified upstream diff', async () => {
    const { dir, reg } = fixture();
    const cap = capture();
    try {
      await diffCommand(['w'], { cwd: dir, registry: reg, json: true, patch: true, silent: true });
    } finally { cap.stop(); }
    const files = JSON.parse(cap.buf.join('')).files as Array<{ file: string; state: string; patch?: string }>;
    const changed = files.find((f) => f.file.includes('upchanged.tsx'))!;
    expect(changed.patch).toContain('-export const item = 1;');
    expect(changed.patch).toContain('+export const item = 2;');
    const clean = files.find((f) => f.file.includes('unchanged.tsx'))!;
    expect(clean.patch).toBeUndefined();
  });

  it('not-installed files are reported', async () => {
    const { dir, reg } = fixture();
    fs.rmSync(path.join(dir, 'components', 'aura', 'w', 'unchanged.tsx'));
    const cap = capture();
    try {
      await diffCommand(['w'], { cwd: dir, registry: reg, json: true, silent: true });
    } finally { cap.stop(); }
    const files = JSON.parse(cap.buf.join('')).files as Array<{ file: string; state: string }>;
    expect(files.some((f) => f.file.includes('unchanged.tsx') && (f.state === 'not-installed' || f.state === 'missing-local'))).toBe(true);
  });

  it('runs against an empty project dir', async () => {
    const dir = tmp();
    const code = await diffCommand([], { cwd: dir, json: true, silent: true }).catch((e) => e.code);
    expect([0, 1, 2, 4]).toContain(code);
  });
});
