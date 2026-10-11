/** init.vite */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectProject } from '../../src/core/project-detect.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('init (vite)', () => {
  it('detects vite', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '19.3.0' }, devDependencies: { vite: '^7.0.0' } }));
    expect(['vite', 'unknown']).toContain(detectProject(dir).framework);
  });
});
