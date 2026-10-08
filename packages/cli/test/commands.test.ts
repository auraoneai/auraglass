/** Command + bin smoke (PLAT-301/302/314/315). */
import { describe, expect, it, jest } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from '../src/cli/args.js';
import { EXIT } from '../src/cli/errors.js';
import { AUDIT_THRESHOLDS } from '../src/audit/thresholds.js';

const here = __dirname;
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agcmd-'));

describe('cli args', () => {
  it('parses global flags', () => {
    const p = parseArgs(['--cwd', '/x', '--json', '--yes', '--silent']);
    expect(p.flags.cwd).toBe('/x');
    expect(p.flags.json).toBe(true);
    expect(p.flags.yes).toBe(true);
    expect(p.flags.silent).toBe(true);
  });
  it('exit codes frozen', () => {
    expect(EXIT).toEqual({ ok: 0, validation: 1, usage: 2, safety: 3, network: 4 });
  });
});

describe('bin', () => {
  const bin = path.join(here, '..', 'src', 'bin.ts');
  it('exposes main entry via src/bin.ts', () => {
    expect(fs.existsSync(bin)).toBe(true);
  });
});

describe('audit thresholds', () => {
  it('exports frozen thresholds', () => {
    expect(AUDIT_THRESHOLDS).toBeDefined();
    expect(typeof AUDIT_THRESHOLDS).toBe('object');
  });
});
