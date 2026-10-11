#!/usr/bin/env node
/* scripts/qual/remote/preflight.mjs — REQ-QUAL-67 egress-CA preflight for `.ag-aws-remote` jobs (QUAL, FIN-425; OD-5).

   The gated AWS runner VPC has no direct egress; jobs that need the network go through the runner's TLS-intercepting
   egress proxy, whose CA expired on 2026-09-27 (runtime-remote evidence E17). Rotating that CA is an operator action
   (OD-5), never done by CI. This preflight runs first in such jobs:

     node scripts/qual/remote/preflight.mjs [--egress] [--ca <pem>] [--now <iso>]

   - Without --egress (and without AG_REQUIRES_EGRESS=1) the job uses the offline bundle: exit 0, nothing checked.
   - With egress requested it reads the proxy CA (--ca, else AG_EGRESS_CA_FILE) and exits 78 with exactly
       runner egress CA expired: notAfter=<date>; offline bundle required
     when the CA is expired or expires within 7 days (<date> = the certificate's notAfter, ISO 8601 UTC). A missing or
     unreadable CA also exits 78 (`runner egress CA unavailable: <why>; offline bundle required`). Otherwise exit 0.
   Exit 64 on usage errors. `--now` exists for tests (fixed clock). */
import { X509Certificate } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const EXIT_CA = 78;
export const CA_MIN_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export const expiredMessage = (notAfter) => `runner egress CA expired: notAfter=${notAfter}; offline bundle required`;
export const unavailableMessage = (why) => `runner egress CA unavailable: ${why}; offline bundle required`;

/** Pure decision: ok, or the exact refusal for a CA whose notAfter is past or within CA_MIN_DAYS of `now`. */
export function checkCa(notAfter, now) {
  const at = notAfter instanceof Date ? notAfter : new Date(notAfter);
  if (Number.isNaN(at.getTime())) return { ok: false, code: EXIT_CA, message: unavailableMessage(`unparseable notAfter ${String(notAfter)}`) };
  const iso = at.toISOString();
  if (at.getTime() - now.getTime() <= CA_MIN_DAYS * DAY_MS) return { ok: false, code: EXIT_CA, message: expiredMessage(iso), notAfter: iso };
  return { ok: true, code: 0, notAfter: iso, daysLeft: Math.floor((at.getTime() - now.getTime()) / DAY_MS) };
}

/** notAfter of the first certificate in a PEM file. */
export function readNotAfter(file) {
  const pem = readFileSync(file, 'utf8');
  const first = pem.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/);
  if (!first) throw new Error(`${file} contains no PEM certificate`);
  return new Date(new X509Certificate(first[0]).validTo);
}

export function parseArgs(argv) {
  const o = { egress: false, ca: null, now: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--egress') o.egress = true;
    else if (a === '--ca' || a === '--now') {
      const v = argv[++i];
      if (!v || v.startsWith('--')) throw new Error(`${a} needs a value`);
      o[a.slice(2)] = v;
    } else throw new Error(`unknown argument ${a}`);
  }
  return o;
}

export function preflight(argv, env = process.env) {
  let o;
  try { o = parseArgs(argv); } catch (e) { return { code: 64, message: `preflight: ${e.message}` }; }
  const now = o.now ? new Date(o.now) : new Date();
  if (Number.isNaN(now.getTime())) return { code: 64, message: `preflight: --now ${o.now} is not a date` };
  if (!(o.egress || env.AG_REQUIRES_EGRESS === '1')) return { code: 0, message: 'preflight: no egress requested; offline bundle mode' };
  const file = o.ca ?? env.AG_EGRESS_CA_FILE;
  if (!file) return { code: EXIT_CA, message: unavailableMessage('no CA file (--ca or AG_EGRESS_CA_FILE)') };
  if (!existsSync(resolve(file))) return { code: EXIT_CA, message: unavailableMessage(`${file} not found`) };
  let notAfter;
  try { notAfter = readNotAfter(resolve(file)); } catch (e) { return { code: EXIT_CA, message: unavailableMessage(e.message) }; }
  const r = checkCa(notAfter, now);
  return r.ok ? { code: 0, message: `preflight: egress CA valid until ${r.notAfter} (${r.daysLeft} days)` } : { code: r.code, message: r.message };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const r = preflight(process.argv.slice(2));
  (r.code === 0 ? process.stdout : process.stderr).write(`${r.message}\n`);
  process.exit(r.code);
}
