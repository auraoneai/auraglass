/* @jest-environment node */
// tests/capability/fragments-surf.test.ts — REQ-SURF-194 / REQ-FIN-90 (AC-FIN-90).
// 1. scripts/surf/verify-playwright-fragment.mjs rejects each defect class on
//    fixture roots (keyed object, duplicate names across streams, missing or
//    file testDir, SURF testMatch with no hit) and accepts a clean root.
// 2. The SURF review fragment defines >=1 L14 item for `blocks/<id>--default`
//    of each of the six product-surface blocks.
// 3. fragments/literals-baseline/surf.json equals the tool measurement.
// The repo-wide playwright check runs as the L1 node-script lane row
// (fragments/lanes/surf.ts W5), not here.

import { afterEach, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import type { ReviewItem } from '../../src/contracts/fragments';

const ROOT = process.cwd();
const VERIFY = join(ROOT, 'scripts/surf/verify-playwright-fragment.mjs');
const BLOCKS = ['app-frame', 'data-workspace', 'analytics-dashboard', 'media-viewer', 'ai-workspace', 'support-inbox'];

const roots: string[] = [];
afterEach(() => { for (const r of roots.splice(0)) rmSync(r, { recursive: true, force: true }); });

function fixture(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'ag-pw-frag-'));
  roots.push(root);
  for (const [p, body] of Object.entries(files)) {
    mkdirSync(dirname(join(root, p)), { recursive: true });
    writeFileSync(join(root, p), body);
  }
  return root;
}

function verify(root: string): { status: number; out: string } {
  try {
    const out = execFileSync(process.execPath, [VERIFY, '--root', root], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0, out };
  } catch (e) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { status: err.status, out: `${err.stdout}${err.stderr}` };
  }
}

const SPEC = 'export {};\n';

describe('verify-playwright-fragment', () => {
  it('accepts unique names, directory testDirs and matching testMatch', () => {
    const root = fixture({
      'tests/e2e/surf/rtl.spec.ts': SPEC,
      'tests/perf/browser/surf/ai-streaming.spec.ts': SPEC,
      'tests/motion/a.spec.ts': SPEC,
      'fragments/playwright/surf.json': JSON.stringify([
        { name: 'surf:cert-rtl', testDir: 'tests/e2e/surf', testMatch: 'rtl.spec.ts' },
        { name: 'surf:ai-perf', testDir: 'tests/perf/browser/surf', testMatch: 'ai-streaming.spec.ts' },
      ]),
      'fragments/playwright/mat.json': JSON.stringify([{ name: 'mat:motion', testDir: './tests/motion', testMatch: '**/*.spec.ts' }]),
    });
    const r = verify(root);
    expect(r.status).toBe(0);
    expect(r.out).toContain('3 projects, 0 errors');
  });

  it('rejects a lane-keyed object instead of PlaywrightProjectFragment[]', () => {
    const root = fixture({
      'tests/e2e/surf/app-shell/x.spec.ts': SPEC,
      'fragments/playwright/surf.json': JSON.stringify({ W1: [{ name: 'surf:app-shell', testDir: 'tests/e2e/surf/app-shell' }] }),
    });
    const r = verify(root);
    expect(r.status).toBe(1);
    expect(r.out).toContain('must be a PlaywrightProjectFragment[]');
  });

  it('rejects a project name duplicated across or within streams', () => {
    const root = fixture({
      'tests/e2e/surf/media/x.spec.ts': SPEC,
      'fragments/playwright/surf.json': JSON.stringify([
        { name: 'surf:cert-media-sampling', testDir: 'tests/e2e/surf/media' },
        { name: 'surf:cert-media-sampling', testDir: 'tests/e2e/surf/media' },
      ]),
      'fragments/playwright/qual.json': JSON.stringify([{ name: 'surf:cert-media-sampling', testDir: 'tests/e2e/surf/media' }]),
    });
    const r = verify(root);
    expect(r.status).toBe(1);
    expect(r.out.match(/duplicate project name surf:cert-media-sampling/g)).toHaveLength(2);
  });

  it('rejects a missing testDir, a file testDir and a SURF project without testDir', () => {
    const root = fixture({
      'tests/perf/browser/surf/ai-streaming.spec.ts': SPEC,
      'fragments/playwright/surf.json': JSON.stringify([
        { name: 'surf:gone', testDir: 'tests/a11y/clear-over-media' },
        { name: 'surf:ai-perf', testDir: 'tests/perf/browser/surf/ai-streaming.spec.ts' },
        { name: 'surf:nodir' },
      ]),
    });
    const r = verify(root);
    expect(r.status).toBe(1);
    expect(r.out).toContain('surf:gone testDir tests/a11y/clear-over-media does not exist');
    expect(r.out).toContain('surf:ai-perf testDir tests/perf/browser/surf/ai-streaming.spec.ts is not a directory');
    expect(r.out).toContain('surf:nodir has no testDir');
  });

  it('rejects a SURF testMatch that matches no file under its testDir', () => {
    const root = fixture({
      'tests/a11y/apg/surf/rtl.spec.ts': SPEC,
      'fragments/playwright/surf.json': JSON.stringify([{ name: 'surf:cert-rtl', testDir: 'tests/a11y/apg/surf', testMatch: 'rtl-missing.spec.ts' }]),
    });
    const r = verify(root);
    expect(r.status).toBe(1);
    expect(r.out).toContain('surf:cert-rtl testMatch rtl-missing.spec.ts matches no file');
  });
});

describe('SURF review fragment (L14 definitions)', () => {
  it('has >=1 item per product-surface block subject blocks/<id>--default', async () => {
    const all = await loadFragments('review');
    const surf = all.find((f) => f.stream === 'surf');
    expect(surf).toBeDefined();
    const items = surf!.value as readonly ReviewItem[];
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of BLOCKS) {
      expect(items.filter((i) => i.subject === `blocks/${id}--default`).length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('SURF literals-baseline fragment', () => {
  it('equals the tool measurement (scripts/surf/literals-baseline.mjs check mode)', () => {
    const out = execFileSync(process.execPath, [join(ROOT, 'scripts/surf/literals-baseline.mjs')], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toMatch(/0 increases, 0 stale/);
  });
});
