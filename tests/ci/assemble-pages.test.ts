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

describe('REQ-FIN-26 pages details', () => {
  it('every placeholder <title> carries pending', () => {
    run(); // nothing built → all placeholders
    expect(readFileSync('public/index.html', 'utf8')).toMatch(/<title>[^<]*pending/i);
    expect(readFileSync('public/storybook/index.html', 'utf8')).toMatch(/<title>[^<]*pending/i);
  });
  it('lab redirect is relative and points at ?path=/story/lab-', () => {
    run();
    const lab = readFileSync('public/lab/index.html', 'utf8');
    expect(lab).toContain('url=../storybook/?path=/story/lab-');
    expect(lab).not.toContain('url=/storybook');
  });
  it('registry source apps/docs/public/r wins and lands in public/r', () => {
    mkdirSync('apps/docs/public/r/button', { recursive: true });
    writeFileSync('apps/docs/public/r/button/index.json', '{}');
    run();
    expect(existsSync('public/r/button/index.json')).toBe(true);
  });
  it('copies apps/docs/public/_redirects; writes v4 placeholder otherwise', () => {
    mkdirSync('apps/docs/public', { recursive: true });
    writeFileSync('apps/docs/public/_redirects', '/custom 301\n');
    run();
    expect(readFileSync('public/_redirects', 'utf8')).toBe('/custom 301\n');
  });
  it('placeholder _redirects sends /v4/* to the release/4.x Pages URL', () => {
    run();
    const r = readFileSync('public/_redirects', 'utf8');
    expect(r).toMatch(/^\/v4\/\* .*gitlab\.io.*:splat 301/m);
  });
});
