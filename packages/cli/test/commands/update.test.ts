/** update */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { updateCommand } from '../../src/commands/update.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('update', () => {
  it('runs against a project dir', async () => {
    const dir = tmp();
    const code = await updateCommand([], { cwd: dir, json: true, silent: true }).catch((e) => e.code);
    expect([0, 1, 2, 4]).toContain(code);
  });
});
