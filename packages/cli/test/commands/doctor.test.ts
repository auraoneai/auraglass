/** doctor */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runChecks } from '../../src/doctor/checks.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('doctor', () => {
  it('runs checks on a 4.x project', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { 'aura-glass': '4.9.0' } }));
    expect(runChecks(dir).length).toBeGreaterThan(0);
  });
});
