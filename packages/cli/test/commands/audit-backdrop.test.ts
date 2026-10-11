/**
 * REQ-PLAT-89 `audit backdrop` (mocked HTTP). The endpoint is replaced by a
 * fetch spy so these run anywhere; the no-mock pass/fail proof is
 * tests/dx/audit-backdrop.remote.spec.ts against packages/cli/audit/reference-server.mjs.
 */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditCommand } from '../../src/commands/audit.js';
import { CliError, EXIT } from '../../src/cli/errors.js';
import {
  AUDIT_THRESHOLDS,
  LUM_VARIANCE_MIN_LEVELS,
  OCR_CONTRAST,
  TRANSPARENCY_RUNGS,
} from '../../src/audit/thresholds.js';
import { evaluateSurface, validateRequest, validateResponse } from '../../src/audit/backdrop.js';

const PKG = path.resolve(__dirname, '..', '..');
const ROOT = path.resolve(PKG, '..', '..');
const ENDPOINT = 'http://audit.example.test:4791/';
const PAGE = 'http://app.example.test/settings';

type FetchArgs = [string, RequestInit];
type PackJson = { files: Array<{ path: string }> };
let fetchSpy: jest.SpiedFunction<typeof fetch>;
let stdout: string[];
let savedEndpoint: string | undefined;

const surface = (over: Record<string, unknown> = {}) => ({
  selector: '[data-ag-surface]:nth-of-type(1)',
  lumVariance: 31.2,
  ocrContrast: 7.4,
  textSize: 'body',
  rung: 'glass',
  verdict: 'pass',
  ...over,
});
const reply = (body: unknown, status = 200) =>
  new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
const respondWith = (body: unknown, status = 200) => fetchSpy.mockResolvedValue(reply(body, status));
const run = (flags: Record<string, string | boolean> = {}) =>
  auditCommand(['backdrop'], { url: PAGE, ...flags });
const sentBody = () => JSON.parse(String((fetchSpy.mock.calls[0] as unknown as FetchArgs)[1].body)) as Record<string, unknown>;

beforeEach(() => {
  savedEndpoint = process.env.AURAGLASS_AUDIT_ENDPOINT;
  process.env.AURAGLASS_AUDIT_ENDPOINT = ENDPOINT;
  fetchSpy = jest.spyOn(globalThis, 'fetch');
  stdout = [];
  jest.spyOn(process.stdout, 'write').mockImplementation((chunk: string | Uint8Array) => {
    stdout.push(String(chunk));
    return true;
  });
});
afterEach(() => {
  jest.restoreAllMocks();
  if (savedEndpoint === undefined) delete process.env.AURAGLASS_AUDIT_ENDPOINT;
  else process.env.AURAGLASS_AUDIT_ENDPOINT = savedEndpoint;
});

describe('thresholds (architecture §15.2)', () => {
  it('exports lumVariance / OCR contrast / rung constants', () => {
    expect(LUM_VARIANCE_MIN_LEVELS).toBe(4);
    expect(OCR_CONTRAST).toEqual({ body: 4.5, large: 3.0 });
    expect([...TRANSPARENCY_RUNGS]).toEqual(['glass', 'tinted', 'solid']);
    expect(AUDIT_THRESHOLDS.translucentRungs).toEqual(['glass', 'tinted']);
  });
  it('fails glass over nothing, low text contrast, and exempts solid from the backdrop floor', () => {
    expect(evaluateSurface({ lumVariance: 1.2, ocrContrast: 9, textSize: 'body', rung: 'glass' })[0]).toMatch(/^glass-over-nothing/);
    expect(evaluateSurface({ lumVariance: 1.2, ocrContrast: 9, textSize: 'body', rung: 'tinted' })).toHaveLength(1);
    expect(evaluateSurface({ lumVariance: 0, ocrContrast: 9, textSize: 'body', rung: 'solid' })).toEqual([]);
    expect(evaluateSurface({ lumVariance: 20, ocrContrast: 4.4, textSize: 'body', rung: 'glass' })[0]).toMatch(/^ocr-contrast/);
    expect(evaluateSurface({ lumVariance: 20, ocrContrast: 3.1, textSize: 'large', rung: 'glass' })).toEqual([]);
    expect(evaluateSurface({ lumVariance: 20, ocrContrast: null, textSize: null, rung: 'glass' })).toEqual([]);
  });
});

describe('audit backdrop (mocked endpoint)', () => {
  it('exits 4 with setup text when AURAGLASS_AUDIT_ENDPOINT is unset, without calling fetch', async () => {
    delete process.env.AURAGLASS_AUDIT_ENDPOINT;
    expect(await run()).toBe(EXIT.network);
    expect(fetchSpy).not.toHaveBeenCalled();
    const text = stdout.join('');
    expect(text).toMatch(/AURAGLASS_AUDIT_ENDPOINT is not set/);
    expect(text).toMatch(/reference-server\.mjs/);
    expect(text).toMatch(/schema\/audit-backdrop\.json/);
  });

  it('pass: POSTs a schema-valid request to <endpoint>/audit and prints one line per surface, exit 0', async () => {
    respondWith({
      version: 1,
      url: PAGE,
      surfaces: [surface(), surface({ selector: '#toolbar', rung: 'solid', lumVariance: 0, ocrContrast: 3.2, textSize: 'large' })],
    });
    expect(await run()).toBe(EXIT.ok);
    const [target, init] = fetchSpy.mock.calls[0] as unknown as FetchArgs;
    expect(target).toBe('http://audit.example.test:4791/audit');
    expect(init.method).toBe('POST');
    const body = sentBody();
    expect(validateRequest(body)).toEqual([]);
    expect(body).toEqual({ url: PAGE, thresholds: AUDIT_THRESHOLDS });
    const lines = stdout.join('').trim().split('\n');
    expect(lines.filter((l) => l.startsWith('PASS'))).toHaveLength(2);
    expect(lines[0]).toMatch(/^PASS\s+\[data-ag-surface\]:nth-of-type\(1\)\s+lumVariance=31\.20 ocrContrast=7\.40\(body\) rung=glass$/);
    expect(lines[1]).toMatch(/#toolbar\s+lumVariance=0\.00 ocrContrast=3\.20\(large\) rung=solid$/);
  });

  it('fail: glass over nothing exits 1 and names the failing gate', async () => {
    respondWith({
      version: 1,
      url: PAGE,
      surfaces: [surface(), surface({ selector: '#over-nothing', lumVariance: 0.4, verdict: 'fail', reasons: ['flat backdrop'] })],
    });
    expect(await run()).toBe(EXIT.validation);
    const text = stdout.join('');
    expect(text).toMatch(/^FAIL\s+#over-nothing\s+lumVariance=0\.40 .*glass-over-nothing: lumVariance 0\.40 < 4$/m);
    expect(text).toMatch(/1\/2 surface\(s\) pass/);
  });

  it('forwards --selector in the request and in --json output', async () => {
    respondWith({ version: 1, url: PAGE, selector: '#sidebar', surfaces: [surface({ selector: '#sidebar > [data-ag-surface]' })] });
    expect(await run({ selector: '#sidebar', json: true })).toBe(EXIT.ok);
    expect(sentBody().selector).toBe('#sidebar');
    const printed = JSON.parse(stdout.join('')) as { selector: string; failed: number; surfaces: Array<{ verdict: string }> };
    expect(printed.selector).toBe('#sidebar');
    expect(printed.failed).toBe(0);
    expect(printed.surfaces.map((s) => s.verdict)).toEqual(['pass']);
  });

  it('invalid response (schema violation) is a remote error, exit 4', async () => {
    respondWith({ version: 1, url: PAGE, surfaces: [{ selector: '#a', lumVariance: 'high', rung: 'frosted', verdict: 'pass' }] });
    const err = await run().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(CliError);
    expect((err as CliError).code).toBe(EXIT.network);
    expect((err as CliError).message).toMatch(/violates schema\/audit-backdrop\.json/);
    expect((err as CliError).message).toMatch(/lumVariance: expected number/);
    expect((err as CliError).message).toMatch(/missing required "ocrContrast"/);
  });

  it('endpoint verdict that contradicts the §15.2 thresholds is rejected, exit 4', async () => {
    respondWith({ version: 1, url: PAGE, surfaces: [surface({ lumVariance: 0.1, verdict: 'pass' })] });
    const err = (await run().catch((e: unknown) => e)) as CliError;
    expect(err.code).toBe(EXIT.network);
    expect(err.message).toMatch(/disagrees with §15\.2 thresholds/);
  });

  it('5xx from the endpoint exits 4 with the status', async () => {
    respondWith('capture worker crashed', 503);
    const err = (await run().catch((e: unknown) => e)) as CliError;
    expect(err).toBeInstanceOf(CliError);
    expect(err.code).toBe(EXIT.network);
    expect(err.message).toMatch(/audit endpoint 503: http:\/\/audit\.example\.test:4791\/audit — capture worker crashed/);
  });

  it('unreachable endpoint exits 4; a page with no surfaces exits 1', async () => {
    fetchSpy.mockRejectedValueOnce(new TypeError('fetch failed'));
    expect(((await run().catch((e: unknown) => e)) as CliError).code).toBe(EXIT.network);
    respondWith({ version: 1, url: PAGE, surfaces: [] });
    expect(await run()).toBe(EXIT.validation);
    expect(stdout.join('')).toMatch(/no \[data-ag-surface\] found/);
  });

  it('usage errors: missing --url, empty --selector, non-http url (exit 2, no fetch)', async () => {
    for (const flags of [{ url: true }, { selector: true }, { url: 'file:///etc/passwd' }] as Array<Record<string, string | boolean>>) {
      const err = (await auditCommand(['backdrop'], { url: PAGE, ...flags }).catch((e: unknown) => e)) as CliError;
      expect(err.code).toBe(EXIT.usage);
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('schema/audit-backdrop.json', () => {
  it('rejects textSize/ocrContrast mismatches and unknown properties', () => {
    expect(validateResponse({ version: 1, url: PAGE, surfaces: [surface({ textSize: null })] })[0]).toMatch(/textSize must be null exactly/);
    expect(validateResponse({ version: 1, url: PAGE, surfaces: [], extra: 1 })[0]).toMatch(/unexpected property "extra"/);
    expect(validateRequest({ url: PAGE, thresholds: AUDIT_THRESHOLDS, selector: '' })[0]).toMatch(/shorter than 1/);
  });

  it('ships in the @auraglass/cli tarball (npm pack --dry-run)', () => {
    const out = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: PKG, encoding: 'utf8' });
    // npm 10 prints an array, npm 11 an object keyed by package name.
    const parsed = JSON.parse(out) as Array<PackJson> | Record<string, PackJson>;
    const entry = Array.isArray(parsed) ? parsed[0]! : parsed['@auraglass/cli']!;
    const files = entry.files.map((f) => f.path);
    expect(files).toContain('schema/audit-backdrop.json');
    expect(files).toContain('audit/reference-server.mjs');
    expect(files).toContain('audit/playwright.config.ts');
  });
});

describe('CLI bundle', () => {
  it('the tsdown dist bundle references no playwright or chromium module', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-cli-dist-'));
    try {
      execFileSync(process.execPath, [path.join(ROOT, 'node_modules', 'tsdown', 'dist', 'run.mjs'), '--out-dir', outDir, '--no-dts'], {
        cwd: PKG,
        stdio: 'pipe',
      });
      const js = fs.readdirSync(outDir, { recursive: true, encoding: 'utf8' }).filter((f) => /\.(m?js|cjs)$/.test(f));
      expect(js).toEqual(expect.arrayContaining(['bin.js', 'index.js']));
      for (const f of js) {
        const src = fs.readFileSync(path.join(outDir, f), 'utf8');
        expect(src).not.toMatch(/from\s*["'](?:@playwright\/test|playwright(?:-core)?|chromium[\w-]*)["']/);
        expect(src).not.toMatch(/(?:import|require)\s*\(\s*["'](?:@playwright\/test|playwright(?:-core)?|chromium[\w-]*)["']\s*\)/);
      }
      // The schema is bundled, so validation works without reading package files at runtime.
      expect(js.map((f) => fs.readFileSync(path.join(outDir, f), 'utf8')).join('\n')).toMatch(/audit-backdrop\.json|"translucentRungs"/);
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });
});
