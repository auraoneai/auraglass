/** PLAT-319 + REQ-PLAT-91: audit backdrop is remote-only via AURAGLASS_AUDIT_ENDPOINT;
 * without the endpoint it refuses with exit 4 (no silent local scoring). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditCommand } from '../../packages/cli/src/commands/audit.js';
import { AUDIT_THRESHOLDS } from '../../packages/cli/src/audit/thresholds.js';

describe('audit backdrop (remote-only)', () => {
  it('exits 4 without AURAGLASS_AUDIT_ENDPOINT', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agaud-'));
    const code = await auditCommand(['backdrop'], { cwd: dir, json: true, silent: true }).catch((e) => (e as { code?: number }).code);
    expect(code).toBe(4);
  });
  it('thresholds live in src/audit/thresholds.ts', () => {
    expect(AUDIT_THRESHOLDS.minTextContrast).toBeGreaterThan(0);
  });
});
