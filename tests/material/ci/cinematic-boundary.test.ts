/* @jest-environment node */
/* REQ-MAT-37 / REQ-FIN-56 (D.3-20): the cinematic boundary. The runtime gate is
   registered as an L1 lane row (pr + main), passes on the real src/material tree,
   and the labs admission contract documents the seven rules. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import lanes from '../../../fragments/lanes/mat';

const ROOT = join(__dirname, '../../..');
const SCRIPT = 'scripts/mat/verify-material-runtime.mjs';
const DOC = join(ROOT, 'apps/docs/content/mat/cinematic-contract.md');

describe('cinematic boundary (REQ-MAT-37)', () => {
  it('registers verify-material-runtime as a fail-closed local L1 row on pr and main', () => {
    const rows = lanes.filter((r) => r.path === SCRIPT);
    expect(rows.map((r) => r.scope).sort()).toEqual(['main', 'pr']);
    for (const r of rows) {
      expect(r).toMatchObject({ lane: 'L1', kind: 'node-script', remote: false, failClosed: true });
    }
    expect(existsSync(join(ROOT, SCRIPT))).toBe(true);
  });

  it('passes on the repository src/material tree with the OK log line', () => {
    const out = execFileSync(process.execPath, [join(ROOT, SCRIPT), '--root', ROOT], { encoding: 'utf8' });
    expect(out.trim().split('\n').pop()).toBe('[verify-material-runtime] OK');
  });

  it('documents exactly the seven admission rules', () => {
    const doc = readFileSync(DOC, 'utf8');
    const section = doc.split('## Admission rules for a cinematic resident')[1]?.split('\n## ')[0] ?? '';
    const titles = [...section.matchAll(/^(\d+)\. \*\*(.+?)\*\*/gm)].map((m) => `${m[1]} ${m[2]}`);
    expect(titles).toEqual([
      '1 Library-owned pixels only.',
      '2 At most one WebGL context per page.',
      '3 Pause offscreen.',
      '4 Pause when the document is hidden.',
      '5 Standard `Surface` fallback.',
      '6 No import side effects.',
      '7 Public entries only.',
    ]);
    for (const condition of ['`calm`', '`none`', '`glass`', 'forced colours', 'context is lost']) {
      expect(section).toContain(condition);
    }
  });
});
