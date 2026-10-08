/** init.install */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectPackageManager, installCommand } from '../../src/core/package-manager.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('init install', () => {
  it('detects pnpm by lockfile', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'pnpm-lock.yaml'), '');
    const pm = detectPackageManager(dir);
    expect(pm).toBe('pnpm');
    expect(installCommand(pm, ['aura-glass'])).toContain('pnpm');
  });
});
