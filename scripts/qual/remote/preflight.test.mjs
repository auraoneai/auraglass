/**
 * @jest-environment node
 */
/* REQ-QUAL-67 (FIN-425): scripts/qual/remote/preflight.mjs — exit 78 with the exact message when a job requests egress
   and the runner's proxy CA is expired or expires within 7 days (OD-5). The fixture is a public self-signed test
   certificate (no key committed); the clock is fixed with --now relative to the fixture's own notAfter. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { X509Certificate } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CA_MIN_DAYS, EXIT_CA, checkCa, expiredMessage, preflight, readNotAfter } from './preflight.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(HERE, 'preflight.mjs');
const CA = join(HERE, '__fixtures__/egress-ca.pem');
const NOT_AFTER = new Date(new X509Certificate(readFileSync(CA, 'utf8')).validTo);
const DAY = 24 * 60 * 60 * 1000;
const at = (days) => new Date(NOT_AFTER.getTime() + days * DAY).toISOString();
const run = (args, env = {}) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', env: { PATH: process.env.PATH, ...env } });

describe('checkCa (pure decision)', () => {
  it('passes a CA with more than 7 days left', () => {
    expect(checkCa(NOT_AFTER, new Date(at(-30)))).toMatchObject({ ok: true, code: 0 });
  });
  it.each([[-400], [-3], [0], [1], [CA_MIN_DAYS]])('refuses a CA whose notAfter is %i day(s) from now (expired or ≤ 7 days)', (d) => {
    const r = checkCa(NOT_AFTER, new Date(at(-d)));
    expect(r).toEqual({ ok: false, code: EXIT_CA, message: expiredMessage(NOT_AFTER.toISOString()), notAfter: NOT_AFTER.toISOString() });
  });
  it('the 7-day boundary: 7 days + 1 minute left passes', () => {
    expect(checkCa(NOT_AFTER, new Date(NOT_AFTER.getTime() - CA_MIN_DAYS * DAY - 60_000)).ok).toBe(true);
  });
});

describe('preflight CLI', () => {
  it('reads notAfter from the PEM', () => {
    expect(readNotAfter(CA).toISOString()).toBe(NOT_AFTER.toISOString());
  });

  it('exits 78 with exactly "runner egress CA expired: notAfter=<date>; offline bundle required" for an expired CA', () => {
    const r = run(['--egress', '--ca', CA, '--now', at(1)]);
    expect(r.status).toBe(78);
    expect(r.stderr).toBe(`runner egress CA expired: notAfter=${NOT_AFTER.toISOString()}; offline bundle required\n`);
  });

  it('exits 78 when the CA expires within 7 days', () => {
    const r = run(['--egress', '--ca', CA, '--now', at(-6)]);
    expect(r.status).toBe(78);
    expect(r.stderr.trim()).toBe(expiredMessage(NOT_AFTER.toISOString()));
  });

  it('exits 0 for a valid CA, reading the CA path from AG_EGRESS_CA_FILE and the request from AG_REQUIRES_EGRESS=1', () => {
    const r = run(['--now', at(-30)], { AG_REQUIRES_EGRESS: '1', AG_EGRESS_CA_FILE: CA });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain(`egress CA valid until ${NOT_AFTER.toISOString()}`);
  });

  it('exits 0 without checking anything when no egress is requested (offline bundle)', () => {
    const r = run(['--now', at(10)], { AG_EGRESS_CA_FILE: CA });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('offline bundle mode');
  });

  it('exits 78 when egress is requested but the CA is missing or not a certificate', () => {
    expect(preflight(['--egress'], {})).toEqual({ code: 78, message: 'runner egress CA unavailable: no CA file (--ca or AG_EGRESS_CA_FILE); offline bundle required' });
    const dir = mkdtempSync(join(tmpdir(), 'ag-preflight-'));
    writeFileSync(join(dir, 'bad.pem'), 'not a certificate\n');
    const r = run(['--egress', '--ca', join(dir, 'bad.pem')]);
    expect(r.status).toBe(78);
    expect(r.stderr).toMatch(/^runner egress CA unavailable: .*contains no PEM certificate; offline bundle required\n$/);
    expect(run(['--egress', '--ca', join(dir, 'missing.pem')]).status).toBe(78);
  });

  it('exits 64 on usage errors', () => {
    expect(run(['--bogus']).status).toBe(64);
    expect(run(['--ca']).status).toBe(64);
    expect(run(['--egress', '--now', 'yesterday-ish']).status).toBe(64);
  });
});
