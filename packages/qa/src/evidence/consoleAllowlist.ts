/* REQ-QUAL-17 console hygiene (QUAL, FIN-430). `certification/console-allowlist.json` holds the only `console.warn`
   texts a cell may emit: `{regex, owner, expires, reason}` with `expires` ≤ 90 days ahead of the validation date and not
   yet passed. `pageerror` and `console.error` are never allowlisted. Not exemptable through exemptions.json (REQ-QUAL-68). */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const CONSOLE_ALLOWLIST_FILE = 'certification/console-allowlist.json';
export const MAX_EXPIRY_DAYS = 90;
const OWNERS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;

export interface AllowlistEntry { regex: string; owner: (typeof OWNERS)[number]; expires: string; reason: string }

const DAY = 86_400_000;

/** Validates the allowlist at `now`; returns entries with compiled patterns, throws listing every invalid entry. */
export function parseConsoleAllowlist(raw: unknown, now: Date, file = CONSOLE_ALLOWLIST_FILE): Array<AllowlistEntry & { re: RegExp }> {
  if (!Array.isArray(raw)) throw new Error(`${file}: must be a JSON array`);
  const errors: string[] = [];
  const out: Array<AllowlistEntry & { re: RegExp }> = [];
  raw.forEach((e: unknown, i) => {
    const at = `${file}[${i}]`;
    if (!e || typeof e !== 'object') { errors.push(`${at}: not an object`); return; }
    const o = e as Record<string, unknown>;
    const keys = Object.keys(o).sort().join(',');
    if (keys !== 'expires,owner,reason,regex') errors.push(`${at}: keys must be exactly {regex, owner, expires, reason} (got ${keys})`);
    let re: RegExp | null = null;
    if (typeof o.regex !== 'string' || !o.regex) errors.push(`${at}: regex must be a non-empty string`);
    else { try { re = new RegExp(o.regex); } catch (err) { errors.push(`${at}: regex does not compile (${(err as Error).message})`); } }
    if (!(OWNERS as readonly unknown[]).includes(o.owner)) errors.push(`${at}: owner must be one of ${OWNERS.join('|')}`);
    if (typeof o.reason !== 'string' || o.reason.trim().length < 10) errors.push(`${at}: reason must say why (≥10 chars)`);
    const exp = typeof o.expires === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(o.expires) ? Date.parse(`${o.expires}T23:59:59Z`) : Number.NaN;
    if (!Number.isFinite(exp)) errors.push(`${at}: expires must be YYYY-MM-DD`);
    else if (exp < now.getTime()) errors.push(`${at}: expired on ${o.expires as string}`);
    else if (exp - now.getTime() > MAX_EXPIRY_DAYS * DAY) errors.push(`${at}: expires ${o.expires as string} is more than ${MAX_EXPIRY_DAYS} days ahead`);
    if (re && !errors.some((m) => m.startsWith(at))) out.push({ ...(o as unknown as AllowlistEntry), re });
  });
  if (errors.length) throw new Error(errors.join('\n'));
  return out;
}

export function loadConsoleAllowlist(root: string, now = new Date()): Array<AllowlistEntry & { re: RegExp }> {
  return parseConsoleAllowlist(JSON.parse(readFileSync(join(root, CONSOLE_ALLOWLIST_FILE), 'utf8')), now);
}

export interface ConsoleEvent { kind: 'pageerror' | 'error' | 'warning'; text: string }

/** Every event that fails the cell: all pageerrors and console errors, and warnings no valid entry matches. */
export function consoleViolations(events: readonly ConsoleEvent[], allow: ReadonlyArray<{ re: RegExp }>): ConsoleEvent[] {
  return events.filter((e) => e.kind !== 'warning' || !allow.some((a) => a.re.test(e.text)));
}
