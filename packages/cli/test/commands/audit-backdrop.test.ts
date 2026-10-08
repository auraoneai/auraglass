/** audit-backdrop */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditCommand } from '../../src/commands/audit.js';
import { EXIT } from '../../src/cli/errors.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('audit backdrop', () => {
  it('exits 4 without endpoint', async () => {
    const dir = tmp();
    const code = await auditCommand(['backdrop'], { cwd: dir, json: true, silent: true });
    expect(code).toBe(EXIT.network);
  });
});
