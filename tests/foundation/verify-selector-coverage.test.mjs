/* CMP-056: selector-coverage script fixtures — matched, orphan, pseudo-stripped.
   (Relocated from tests/ci/, which is PLAT-owned per ownership.json.) */
/**
 * @jest-environment node
 */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const SCRIPT = join(ROOT, 'scripts/cmp/verify-selector-coverage.mjs');
const FIX = join(HERE, 'fixtures/selector-coverage');

function run(...args) {
  const r = spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8' });
  return { status: r.status, out: r.stdout + r.stderr };
}

describe('verify-selector-coverage', () => {
  it('matched fixture: pseudos stripped and at-rules ignored, exits 0', () => {
    const r = run('--css', join(FIX, 'matched.css'), '--dom', join(FIX, 'matched.dom.html'));
    expect(r.status).toBe(0);
    expect(r.out).not.toContain('ag-chip');
  });
  it('orphan fixture: fails with file:line selector and orphan class', () => {
    const r = run('--css', join(FIX, 'orphan.css'), '--dom', join(FIX, 'orphan.dom.html'));
    expect(r.status).toBe(1);
    expect(r.out).toContain('orphan.css:1 .ag-ghost');
    expect(r.out).toContain('class .ag-ghost never rendered');
  });
});
