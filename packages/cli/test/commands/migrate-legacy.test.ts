/** migrate-legacy */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { migrateIcons, reportOnly } from '../../src/migrate/legacy/icons.js';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));
describe('migrate icons --from lucide', () => {
  it('produces a report', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'a.tsx'), "import { X } from 'lucide-react';\n");
    const r = migrateIcons(dir, 'lucide', false);
    expect(r).toBeDefined();
  });
  it('radix/mui --write is report-only (exit 2)', () => {
    const r = reportOnly(tmp(), 'radix');
    expect(r.report['reportOnly']).toBe(true);
  });
});
