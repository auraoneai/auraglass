/** REQ-PLAT-61 — JSON parity test for `doctor --v5`: the --json payload the
 * command prints must equal the objects produced by checks.ts + v5.ts. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { doctorCommand } from '../../src/commands/doctor.js';
import { runChecks } from '../../src/doctor/checks.js';
import { runV5 } from '../../src/doctor/v5.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-parity-'));

function captureStdout(fn: () => Promise<unknown> | unknown): string {
  const orig = process.stdout.write;
  let buf = '';
  (process.stdout as any).write = (s: string) => { buf += s; return true; };
  try {
    return Promise.resolve(fn()).then(() => buf) as unknown as string;
  } finally {
    // restored by caller via then
    void orig;
  }
}

describe('doctor --v5 JSON parity', () => {
  it('--json output equals runChecks + runV5 composition', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '^19.0.0', 'aura-glass': '^5.0.0' } }));
    fs.writeFileSync(path.join(dir, 'a.tsx'), "import { GlassButton } from 'aura-glass';\nconst x=<GlassButton/>;\n");

    const orig = process.stdout.write;
    let buf = '';
    (process.stdout as any).write = (s: string) => { buf += s; return true; };
    try {
      await doctorCommand([], { v5: true, json: true, cwd: dir, silent: true } as any);
    } finally {
      process.stdout.write = orig;
    }
    const payload = JSON.parse(buf.trim());
    const expectedChecks = runChecks(dir);
    const expected = runV5(dir);

    expect(payload.version).toBe(1);
    expect(payload.checks).toEqual(expectedChecks);
    expect(payload.findings).toEqual(expected.findings);
    expect(payload.byCodemod).toEqual(expected.byCodemod);
  });

  it('--v5 JSON includes the checks.ts environment rows', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '^19.0.0', 'aura-glass': '^5.0.0' } }));
    const orig = process.stdout.write;
    let buf = '';
    (process.stdout as any).write = (s: string) => { buf += s; return true; };
    try {
      await doctorCommand([], { v5: true, json: true, cwd: dir, silent: true } as any);
    } finally {
      process.stdout.write = orig;
    }
    const payload = JSON.parse(buf.trim());
    expect(payload.checks.find((c: any) => c.id === 'node-version')).toBeDefined();
    expect(payload.checks.find((c: any) => c.id === 'react-version')).toBeDefined();
  });
});
