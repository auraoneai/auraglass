/** REQ-PLAT-61 — `add` prints a deprecated item's replacement exactly once. */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { addCommand } from '../../src/commands/add.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-add-'));

jest.mock('../../src/registry/client.js', () => ({
  fetchItem: async (name: string) => ({
    name,
    type: 'registry:ui',
    version: '1.0.0',
    files: [
      { path: 'a.tsx', content: 'export const A=1;', type: 'file' },
      { path: 'b.tsx', content: 'export const B=1;', type: 'file' },
    ],
  }),
}));

describe('add — replacement notice', () => {
  it('prints the replacement exactly once for a deprecated item', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'deprecations.json'), JSON.stringify({ version: 1, entries: [
      { id: 'DEP-X', kind: 'cli', symbol: 'legacy-widget', since: '4.2.0', replacement: 'new-widget', message: 'renamed' },
      { id: 'DEP-Y', kind: 'cli', symbol: 'legacy-widget', since: '4.2.0', replacement: 'new-widget', message: 'dup row' },
    ] }));
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'x', version: '0.0.0' }));

    const orig = process.stdout.write;
    let buf = '';
    (process.stdout as any).write = (s: string) => { buf += s; return true; };
    try {
      await addCommand(['legacy-widget'], {
        cwd: dir,
        'dry-run': true,
        'allow-dirty': true,
        'allow-no-git': true,
      } as any);
    } finally {
      process.stdout.write = orig;
    }
    const hits = buf.match(/replacement: new-widget/g) ?? [];
    expect(hits.length).toBe(1);
  });
});
