/** PLAT-343: bounded perf spec — a 200-file synthetic project migrates < 120s. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMigration } from '../src/migrate/4to5/index.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agperf-'));

describe('perf', () => {
  it('200 files migrate within budget', async () => {
    for (let i = 0; i < 200; i += 1) {
      const body = [0, 1, 2].map((k) => `export const x${i}_${k} = <GlassButton variant="primary"><GlassCard/></GlassButton>;`).join('\n');
      fs.writeFileSync(path.join(dir, `f${i}.tsx`), `import { GlassButton, GlassCard } from 'aura-glass';\n${body}\n`);
    }
    fs.writeFileSync(path.join(dir, 'package.json'), '{"dependencies":{"aura-glass":"4.9.0"}}');
    const t0 = Date.now();
    const r = await runMigration({ cwd: dir });
    const ms = Date.now() - t0;
    expect(r.report.summary.filesChanged).toBe(201);
    expect(ms).toBeLessThan(120000);
    console.log(`perf: 200 files in ${ms}ms`);
  }, 150000);
});
