// tests/capability/purity-gate.test.ts — AC-SURF-03 (REQ-SURF-05).
// Every fixture under tests/capability/fixtures/purity/<area>/ demonstrates
// one banned pattern; the gate must exit 1 and report `path:line` for each.
// The clean-tree case runs the gate over every SURF source root that exists.

import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCRIPT = 'scripts/surf/verify-surf-purity.mjs';
const FIXTURES = 'tests/capability/fixtures/purity';

function* fixtureFiles(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* fixtureFiles(p);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(name)) yield p;
  }
}

function runGate(...paths: string[]) {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...paths], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out };
  } catch (err: any) {
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

const fixtures = [...fixtureFiles(join(ROOT, FIXTURES))].map((p) => relative(ROOT, p));

describe('SURF purity gate (verify-surf-purity.mjs)', () => {
  it('finds at least one banned-pattern fixture', () => {
    expect(fixtures.length).toBeGreaterThan(0);
  });

  it.each(fixtures.map((f) => [f, f] as const))(
    'flags %s with exit 1 and file:line output',
    (_label: string, file: string) => {
      const res = runGate(file);
      expect(res.code).toBe(1);
      // findings are reported as <path>:<line>:
      expect(res.out).toMatch(new RegExp(`${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\d+:`));
    },
  );

  it('passes over every existing SURF source root', () => {
    const res = runGate();
    expect(res.code).toBe(0);
  });

  // REQ-SURF-05 (1): a no-args run must actually scan — and a banned file
  // planted into a real scanned root must exit 1 (the old double-join bug
  // scanned 0 files and printed 'clean').
  it('no-args run scans files and fails on a planted fixture', () => {
    const probe = join(ROOT, 'src', 'ai', '__purity_probe__.ts');
    try {
      writeFileSync(probe, "export const leak = () => fetch('/api');\n");
      const res = runGate();
      expect({ code: res.code, out: res.out }).toEqual(
        expect.objectContaining({ code: 1, out: expect.stringContaining('__purity_probe__') }) as never,
      );
    } finally {
      rmSync(probe, { force: true });
    }
  });

  it('no-args run reports a nonzero scanned-file count', () => {
    const res = runGate();
    expect(res.code).toBe(0);
    const m = res.out.match(/(\d+) file\(s\) scanned/);
    expect(Number(m?.[1] ?? 0)).toBeGreaterThan(0);
  });
});

// --- lane W1 begin ---

// --- lane W1 end ---

// --- lane W2 begin ---

// --- lane W2 end ---

// --- lane W3 begin ---

// --- lane W3 end ---

// --- lane W4 begin ---

// --- lane W4 end ---

// --- lane W5 begin ---

// --- lane W5 end ---
