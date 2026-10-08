/** add */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { addCommand } from '../../src/commands/add.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('add', () => {
  it('fails 4/1 on missing registry item', async () => {
    const dir = tmp();
    const code = await addCommand(['no-such-item'], { cwd: dir, json: true, silent: true, yes: true }).catch((e) => e.code);
    expect([1, 4]).toContain(code);
  });
});
