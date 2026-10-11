/** init.shadcn */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readConfig, writeConfig } from '../../src/core/config.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('init config', () => {
  it('writes auraglass.json', () => {
    const dir = tmp();
    writeConfig(dir, { style: 'glass' });
    const c = readConfig(dir);
    expect(c?.style).toBe('glass');
  });
});
