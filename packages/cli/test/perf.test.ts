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
      const body = [0, 1, 2].map((k) => `export const x${i}_${k} = <GlassProvider><Nav/></GlassProvider>;`).join('\n');
      fs.writeFileSync(path.join(dir, `f${i}.tsx`), `import { GlassProvider } from 'aura-glass';\nimport { Nav } from 'aura-glass/navigation';\n${body}\n`);
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

describe('cold start (REQ-PLAT-84)', () => {
  const bin = path.join(__dirname, '..', 'dist', 'bin.js');
  (fs.existsSync(bin) ? it : it.skip)('node dist/bin.js --version p95 <= 300ms over 20 runs', async () => {
    const { execFileSync } = await import('node:child_process');
    const times: number[] = [];
    for (let i = 0; i < 20; i += 1) {
      const t0 = performance.now();
      execFileSync('node', [bin, '--version'], { encoding: 'utf8' });
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    const p95 = times[Math.ceil(times.length * 0.95) - 1];
    console.log(`cold --version p95 ${p95.toFixed(1)}ms (min ${times[0].toFixed(1)})`);
    expect(p95).toBeLessThanOrEqual(300);
  }, 120000);
});
