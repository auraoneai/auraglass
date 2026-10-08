/** add.eject */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from '../../src/cli/args.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('add --eject', () => {
  it('eject flag parses', () => {
    expect(parseArgs(['add', 'x', '--eject']).flags.eject).toBe(true);
  });
});
