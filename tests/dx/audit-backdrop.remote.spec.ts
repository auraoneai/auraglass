/**
 * REQ-PLAT-89 remote spec (no mocks). Runs only in the manual GitLab job
 * `plat:audit:backdrop` (Playwright image):
 *
 *   npx playwright test -c packages/cli/audit/playwright.config.ts
 *
 * The config starts packages/cli/audit/reference-server.mjs (real Chromium
 * captures). This spec builds the real CLI bundle with tsdown, serves two
 * fixture pages, and runs `auraglass audit backdrop` against them:
 *   - a surface over a declared, textured backdrop → pass (exit 0)
 *   - the same glass over a flat page ("glass over nothing") → fail (exit 1)
 */
import { test, expect } from '@playwright/test';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CLI_PKG = path.join(ROOT, 'packages', 'cli');
const OUT = path.join(ROOT, '.artifacts', 'plat', 'audit-backdrop');
const CLI_DIST = path.join(OUT, 'cli-dist');
const ENDPOINT = process.env.AURAGLASS_AUDIT_ENDPOINT ?? `http://127.0.0.1:${process.env.AG_AUDIT_PORT ?? '4791'}`;

const SURFACE_CSS = `
  .panel {
    position: absolute; left: 160px; top: 140px; width: 560px; height: 260px;
    padding: 32px; box-sizing: border-box; border-radius: 24px;
    background: rgb(255 255 255 / 0.78);
    -webkit-backdrop-filter: blur(14px) saturate(1.4); backdrop-filter: blur(14px) saturate(1.4);
    color: #111; font: 400 18px/1.5 system-ui, sans-serif;
  }
  .panel h1 { margin: 0 0 12px; font-size: 28px; font-weight: 700; }`;

const page = (body: string, backdropCss: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>audit-backdrop fixture</title>
<style>html, body { margin: 0; height: 100%; } ${backdropCss} ${SURFACE_CSS}</style></head>
<body>${body}</body></html>`;

const PANEL = `<div class="panel" id="settings-panel" data-ag-surface="" data-ag-variant="regular">
  <h1>Account settings</h1><p>Manage how AuraGlass renders surfaces in this workspace.</p></div>`;

const FIXTURES: Record<string, string> = {
  // Declared media backdrop with real luminance structure under the panel.
  '/over-backdrop.html': page(
    `<main data-ag-backdrop="media" style="position:relative;height:100%">${PANEL}</main>`,
    `main { background:
        repeating-linear-gradient(45deg, #1d3b72 0 18px, #f4c95d 18px 36px, #2b8a6e 36px 54px),
        #1d3b72; }`,
  ),
  // The same glass with nothing behind it.
  '/over-nothing.html': page(`<main style="position:relative;height:100%">${PANEL}</main>`, 'main { background: #ffffff; }'),
};

let fixtureServer: http.Server;
let fixtureBase = '';

function runCli(url: string): { code: number | null; stdout: string; stderr: string; json: Record<string, unknown> } {
  const r = spawnSync(process.execPath, [path.join(CLI_DIST, 'bin.js'), 'audit', 'backdrop', '--url', url, '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, AURAGLASS_AUDIT_ENDPOINT: ENDPOINT, NO_COLOR: '1' },
    timeout: 120_000,
  });
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(r.stdout) as Record<string, unknown>;
  } catch {
    /* asserted below via code/stdout */
  }
  return { code: r.status, stdout: r.stdout, stderr: r.stderr, json };
}

test.describe('auraglass audit backdrop against the reference endpoint', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    execFileSync(process.execPath, [path.join(CLI_PKG, 'scripts', 'gen-mappings.mjs')], { cwd: CLI_PKG, stdio: 'inherit' });
    execFileSync(
      process.execPath,
      [path.join(ROOT, 'node_modules', 'tsdown', 'dist', 'run.mjs'), '--out-dir', CLI_DIST, '--no-dts'],
      { cwd: CLI_PKG, stdio: 'inherit' },
    );
    fixtureServer = http.createServer((req, res) => {
      const html = FIXTURES[req.url ?? ''];
      res.writeHead(html ? 200 : 404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(html ?? 'not found');
    });
    await new Promise<void>((resolve) => fixtureServer.listen(0, '127.0.0.1', resolve));
    fixtureBase = `http://127.0.0.1:${(fixtureServer.address() as AddressInfo).port}`;
  });

  test.afterAll(async () => {
    await new Promise<void>((resolve) => fixtureServer.close(() => resolve()));
  });

  test('surface over a declared backdrop → pass', async () => {
    const r = runCli(`${fixtureBase}/over-backdrop.html`);
    fs.writeFileSync(path.join(OUT, 'pass-case.json'), r.stdout || r.stderr);
    expect(r.code).toBe(0);
    const surfaces = r.json.surfaces as Array<Record<string, unknown>>;
    expect(surfaces).toHaveLength(1);
    const [s] = surfaces;
    expect(s!.selector).toBe('#settings-panel');
    expect(s!.rung).toBe('glass');
    expect(s!.verdict).toBe('pass');
    expect(s!.lumVariance as number).toBeGreaterThanOrEqual(4);
    expect(s!.ocrContrast as number).toBeGreaterThanOrEqual(4.5);
  });

  test('glass over nothing → fail', async () => {
    const r = runCli(`${fixtureBase}/over-nothing.html`);
    fs.writeFileSync(path.join(OUT, 'fail-case.json'), r.stdout || r.stderr);
    expect(r.code).toBe(1);
    const surfaces = r.json.surfaces as Array<Record<string, unknown>>;
    expect(surfaces).toHaveLength(1);
    const [s] = surfaces;
    expect(s!.selector).toBe('#settings-panel');
    expect(s!.rung).toBe('glass');
    expect(s!.verdict).toBe('fail');
    expect(s!.lumVariance as number).toBeLessThan(4);
    expect((s!.reasons as string[]).join(' ')).toMatch(/^glass-over-nothing/);
    expect(r.json.failed).toBe(1);
  });
});
