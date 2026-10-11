/** init.next */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectProject } from '../../src/core/project-detect.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('init (next)', () => {
  it('detects a Next project', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { next: '16.4.0', react: '19.3.0' } }));
    fs.writeFileSync(path.join(dir, 'next.config.mjs'), 'export default {}');
    expect(detectProject(dir).framework).toBe('next-app');
  });
});
