/* @jest-environment node */
// PLAT-023: assemble-pages.mjs — full inputs and pending placeholders.
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(process.cwd(), 'scripts/ci/assemble-pages.mjs');
let dir: string;
let home: string;
beforeEach(() => { home = process.cwd(); dir = mkdtempSync(join(tmpdir(), 'pages-')); process.chdir(dir); });
afterEach(() => { process.chdir(home); rmSync(dir, { recursive: true, force: true }); });

const run = () => execFileSync('node', [SCRIPT], { encoding: 'utf8' });

describe('assemble-pages', () => {
  it('copies docs, storybook and registry into public/', () => {
    mkdirSync('apps/docs/out', { recursive: true });
    writeFileSync('apps/docs/out/index.html', 'docs');
    mkdirSync('storybook-static', { recursive: true });
    writeFileSync('storybook-static/index.html', 'sb');
    mkdirSync('registry-dist/r/button', { recursive: true });
    writeFileSync('registry-dist/r/button/index.json', '{}');
    run();
    expect(readFileSync('public/index.html', 'utf8')).toBe('docs');
    expect(readFileSync('public/storybook/index.html', 'utf8')).toBe('sb');
    expect(existsSync('public/r/button/index.json')).toBe(true);
  });
  it('keeps pending placeholders when inputs are missing', () => {
    run();
    const docs = readFileSync('public/index.html', 'utf8');
    const sb = readFileSync('public/storybook/index.html', 'utf8');
    expect(docs).toContain('pending');
    expect(sb).toContain('pending');
  });
  it('always writes the lab redirect', () => {
    run();
    expect(readFileSync('public/lab/index.html', 'utf8')).toContain('refresh');
  });
});
