/** PLAT-345 + REQ-PLAT-92: large-tree perf — engine over a generated 1000-file
 * tree stays under the lane budget (reported, not blocking). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMigration } from '../../packages/cli/src/migrate/4to5/index.js';

describe('codemod perf', () => {
  it('1000-file tree migrates in bounded time', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agperf-'));
    for (let i = 0; i < 1000; i++) {
      fs.writeFileSync(
        path.join(dir, `f${i}.tsx`),
        `import { GlassButton } from 'aura-glass';\nexport const x${i} = <GlassButton variant="primary" />;\n`,
      );
    }
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { 'aura-glass': '4.9.0' } }));
    const t0 = Date.now();
    const r = await runMigration({ cwd: dir, dryRun: true });
    const ms = Date.now() - t0;
    expect(r.report.summary.filesChanged).toBeGreaterThan(0);
    expect(ms).toBeLessThan(120_000);
    fs.rmSync(dir, { recursive: true, force: true });
  }, 130_000);
});
