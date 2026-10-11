/** doctor.shadcn */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runChecks } from '../../src/doctor/checks.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('doctor (clean project)', () => {
  it('empty package.json does not crash', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), '{}');
    expect(Array.isArray(runChecks(dir))).toBe(true);
  });
});
