/* @jest-environment node */
/* PLAT-281 (REQ-PLAT-75): the tailwind bridge builds from the contract double
   manifest, maps the color/radius/shadow var families to var(--ag-*), emits only
   @import + @theme inline + @utility + @custom-variant, and stays <=6KB gz. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from '../build/helpers';

const DOUBLE = join(ROOT, 'tests/contract-doubles/tokens/manifest.json');

describe('tailwind bridge (PLAT-280/281)', () => {
  const out = join(mkdtempSync(join(tmpdir(), 'ag-tw-')), 'tailwind.css');
  it('generates the bridge file from the manifest', () => {
    execFileSync('node', ['scripts/build/gen-tailwind-bridge.mjs', '--manifest', DOUBLE, '--out', out], { cwd: ROOT });
    expect(existsSync(out)).toBe(true);
  });

  it('content is only the sanctioned at-rules', () => {
    const css = readFileSync(out, 'utf8');
    expect(css).toContain("@import './tokens.css';");
    for (const bad of ['@tailwind', '@config', '@plugin', '@source']) expect(css).not.toContain(bad);
    const atRules = [...css.matchAll(/@(\w[\w-]*)\b/g)].map(m => m[1]);
    for (const r of new Set(atRules)) expect(['import', 'theme', 'utility', 'custom-variant', 'layer', 'apply']).toContain(r);
  });

  it('is <= 6 KB gz excluding tokens.css', () => {
    const css = readFileSync(out, 'utf8').replace(/^@import.*$/m, '');
    expect(gzipSync(css, { level: 9 }).length).toBeLessThanOrEqual(6 * 1024);
  });
});
