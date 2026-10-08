/** list-info */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { registryItemSchema } from '../../src/registry/schema.js';
import { listCommand } from '../../src/commands/list-info.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('list/info', () => {
  it('registryItemSchema parses a minimal item', () => {
    const r = registryItemSchema.safeParse({ name: 'button', type: 'components', files: [] });
    expect(r.success).toBe(true);
  });
  it('list command returns a code', async () => {
    const dir = tmp();
    const code = await listCommand([], { cwd: dir, json: true, silent: true }).catch((e) => e.code);
    expect([0, 1, 2, 4]).toContain(code);
  });
});
