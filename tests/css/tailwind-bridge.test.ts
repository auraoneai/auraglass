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
import { ROOT, ensureBuilt } from '../build/helpers';

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

  /* the contract double only carries --ag-color-canvas; the namespace, utility
     and compile assertions run against the real dist/tailwind.css. */
  const distBridge = () => {
    ensureBuilt();
    return readFileSync(join(ROOT, 'dist/tailwind.css'), 'utf8');
  };

  it('token categories land in the color/radius/shadow namespaces', () => {
    const css = distBridge();
    expect(css).toContain('--color-canvas: var(--ag-color-canvas);');
    expect(css).toContain('--color-on-surface: var(--ag-on-surface);');
    expect(css).toContain('--radius-md: var(--ag-radius-md);');
    expect(css).toContain('--shadow-glass: var(--ag-surface-shadow);');
  });

  it('glass utilities declare real properties, never self-@apply', () => {
    const css = distBridge();
    for (const u of ['glass-regular', 'glass-clear', 'glass-thin', 'glass-thick', 'content-raised']) {
      const block = css.match(new RegExp(`@utility ${u} \\{([^}]*)\\}`));
      expect(block).toBeTruthy();
      expect(block![1]).not.toContain('@apply');
      expect(block![1]).toMatch(/background|border|box-shadow/);
    }
    for (const u of ['glass-regular', 'glass-thin', 'glass-thick', 'glass-clear']) {
      const block = css.match(new RegExp(`@utility ${u} \\{([^}]*)\\}`))!;
      expect(block[1]).toContain('backdrop-filter');
      expect(block[1]).toContain('-webkit-backdrop-filter');
    }
  });

  it('compiles under real Tailwind 4 and emits the REQ-PLAT-77 rules', () => {
    /* @tailwindcss/node uses module hooks jest cannot provide — compile in a
       child node process and read the emitted css. */
    const script = `
      import { compile } from '@tailwindcss/node';
      const c = await compile("@import 'tailwindcss'; @import './tailwind.css';", {
        base: process.argv[1], shouldRewriteUrls: false, onDependency: () => {},
      });
      process.stdout.write(c.build(['bg-canvas','text-on-surface','rounded-md','shadow-glass','glass-regular','ag-dark:bg-canvas','bg-red-500']));
    `;
    const cssOut = execFileSync(process.execPath, ['--input-type=module', '-e', script, join(ROOT, 'dist')], { encoding: 'utf8' });
    for (const needle of [
      '.bg-canvas', 'var(--ag-color-canvas)',
      '.text-on-surface', 'var(--ag-on-surface)',
      '.rounded-md', 'var(--ag-radius-md)',
      '.shadow-glass', 'var(--ag-surface-shadow)',
      '.glass-regular', 'backdrop-filter',
      'data-ag-scheme=dark', '.bg-red-500',
    ]) expect(cssOut).toContain(needle);
  }, 60_000);
});
