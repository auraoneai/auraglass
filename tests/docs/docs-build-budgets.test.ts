/**
 * @jest-environment node
 */
/* tests/docs/docs-build-budgets.test.ts — REQ-PLAT-102. Static docs build
   budgets (build <= 10 min, apps/docs/out <= 150 MB) measured by
   scripts/docs/check-docs-budgets.mjs, and the basePath-aware static server
   the remote docs-a11y / docs-lighthouse specs use. */
import { describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BUILD_BUDGET_MS, OUT_BUDGET_BYTES, dirSize, evaluate, main } from '../../scripts/docs/check-docs-budgets.mjs';
import { docsBasePath, fileFor } from '../../scripts/docs/serve-out.mjs';

function site() {
  const root = mkdtempSync(join(tmpdir(), 'ag-budgets-'));
  mkdirSync(join(root, 'apps/docs/out/guides/vite'), { recursive: true });
  writeFileSync(join(root, 'apps/docs/out/index.html'), 'x'.repeat(1000));
  writeFileSync(join(root, 'apps/docs/out/guides/vite/index.html'), 'y'.repeat(500));
  return root;
}

describe('budgets', () => {
  it('are the PRD numbers', () => {
    expect(BUILD_BUDGET_MS).toBe(600_000);
    expect(OUT_BUDGET_BYTES).toBe(150_000_000);
  });
  it('fail above either budget and pass at it', () => {
    expect(evaluate({ buildMs: 600_000, outBytes: 150_000_000 })).toEqual([]);
    expect(evaluate({ buildMs: 600_001, outBytes: 1 })).toEqual(['docs build took 600.0 s > 600 s']);
    expect(evaluate({ buildMs: null, outBytes: 150_000_001 })).toEqual(['apps/docs/out is 150.0 MB > 150 MB']);
  });
  it('measures out/ bytes and files', () => {
    expect(dirSize(join(site(), 'apps/docs/out'))).toEqual({ bytes: 1500, files: 2 });
  });
  it('times a build command and writes the report; a failing command exits 1; missing out/ exits 1', () => {
    const root = site();
    expect(main(['--time', '--', process.execPath, '-e', 'setTimeout(() => {}, 50)'], root)).toBe(0);
    const report = JSON.parse(readFileSync(join(root, '.artifacts/plat/docs-build.json'), 'utf8'));
    expect(report.outBytes).toBe(1500);
    expect(report.buildMs).toBeGreaterThanOrEqual(50);
    expect(main(['--time', '--', process.execPath, '-e', 'process.exit(3)'], root)).toBe(1);
    expect(main(['--out', 'nope'], root)).toBe(1);
  });
});

describe('serve-out', () => {
  it('maps basePath + trailing-slash routes to out files and never escapes out/', () => {
    const out = join(site(), 'apps/docs/out');
    expect(fileFor(out, '/b', '/b/')).toBe(join(out, 'index.html'));
    expect(fileFor(out, '/b', '/b/guides/vite/')).toBe(join(out, 'guides/vite/index.html'));
    expect(fileFor(out, '/b', '/b/guides/vite')).toBe(join(out, 'guides/vite/index.html'));
    expect(fileFor(out, '/b', '/guides/vite/')).toBeNull();
    expect(fileFor(out, '/b', '/b/../../etc/passwd')).toBeNull();
    expect(fileFor(out, '', '/guides/vite/')).toBe(join(out, 'guides/vite/index.html'));
  });
  it('derives the basePath like apps/docs/next.config.ts', () => {
    expect(docsBasePath({ NEXT_BASE_PATH: '/x/' })).toBe('/x');
    expect(docsBasePath({ NEXT_BASE_PATH: '' })).toBe('');
  });
});
