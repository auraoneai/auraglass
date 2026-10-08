/** audit.compat */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditCommand } from '../../src/commands/audit.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('audit deps|imports', () => {
  it('audit deps returns a code', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { 'aura-glass': '4.9.0' } }));
    const code = await auditCommand(['deps'], { cwd: dir, json: true, silent: true });
    expect([0, 1]).toContain(code);
  });
});
