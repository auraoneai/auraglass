/* REQ-QUAL-68 Exemptions (QUAL). A subject may skip one mechanical gate only through
   certification/exemptions.json: { subject, gate, cells, rationale, approvedBy, expires } with
   `expires` at most 180 days ahead. OCR contrast (REQ-QUAL-13) and console (REQ-QUAL-17) can never be
   exempted. An expired exemption fails (it is not silently ignored). */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const EXEMPTIONS_FILE = 'certification/exemptions.json';
export const MAX_EXEMPTION_DAYS = 180;
/** Gates that can never be exempted, by gate id and by REQ id. */
export const NON_EXEMPTABLE: Readonly<Record<string, string>> = {
  'ocr-contrast': 'REQ-QUAL-13', 'REQ-QUAL-13': 'REQ-QUAL-13',
  console: 'REQ-QUAL-17', 'REQ-QUAL-17': 'REQ-QUAL-17',
};

export interface Exemption {
  subject: string;
  gate: string;
  /** Cell ids (or `*` for every cell of the subject) the gate is skipped on. */
  cells: string[];
  rationale: string;
  approvedBy: string;
  /** ISO date (YYYY-MM-DD) or date-time. */
  expires: string;
}

export interface ExemptionProblem { index: number; subject: string | null; gate: string | null; code: 'malformed' | 'non-exemptable' | 'expired' | 'too-long' | 'duplicate'; message: string }

const DAY_MS = 24 * 60 * 60 * 1000;
const STRING_FIELDS = ['subject', 'gate', 'rationale', 'approvedBy', 'expires'] as const;

function parseDate(s: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/.test(s)) return null;
  const t = Date.parse(s.length === 10 ? `${s}T23:59:59.999Z` : s);
  return Number.isNaN(t) ? null : t;
}

/** Every problem in the exemptions list; an empty array means the file is valid at `now`. */
export function validateExemptions(raw: unknown, now: Date = new Date()): ExemptionProblem[] {
  if (!Array.isArray(raw)) return [{ index: -1, subject: null, gate: null, code: 'malformed', message: `${EXEMPTIONS_FILE} must be a JSON array` }];
  const problems: ExemptionProblem[] = [];
  const seen = new Set<string>();
  raw.forEach((e, index) => {
    const o = (e && typeof e === 'object' ? e : {}) as Record<string, unknown>;
    const subject = typeof o.subject === 'string' ? o.subject : null;
    const gate = typeof o.gate === 'string' ? o.gate : null;
    const push = (code: ExemptionProblem['code'], message: string) => problems.push({ index, subject, gate, code, message: `exemption[${index}] ${subject ?? '?'}/${gate ?? '?'}: ${message}` });
    const missing = STRING_FIELDS.filter((k) => typeof o[k] !== 'string' || !(o[k] as string).trim());
    if (missing.length) push('malformed', `missing or empty ${missing.join(', ')}`);
    if (!Array.isArray(o.cells) || o.cells.length === 0 || !o.cells.every((c) => typeof c === 'string' && c)) push('malformed', 'cells must be a non-empty array of cell ids');
    const extra = Object.keys(o).filter((k) => ![...STRING_FIELDS, 'cells'].includes(k));
    if (extra.length) push('malformed', `unknown field(s) ${extra.join(', ')}`);
    if (gate && NON_EXEMPTABLE[gate]) push('non-exemptable', `${NON_EXEMPTABLE[gate]} (${gate}) can never be exempted`);
    if (typeof o.expires === 'string' && o.expires) {
      const t = parseDate(o.expires);
      if (t === null) push('malformed', `expires '${o.expires}' is not an ISO date`);
      else if (t < now.getTime()) push('expired', `expired on ${o.expires}`);
      else if (t - now.getTime() > MAX_EXEMPTION_DAYS * DAY_MS) push('too-long', `expires ${o.expires} is more than ${MAX_EXEMPTION_DAYS} days ahead`);
    }
    if (subject && gate) {
      const key = `${subject}\0${gate}`;
      if (seen.has(key)) push('duplicate', 'duplicate subject/gate pair (one exemption per subject and gate)');
      seen.add(key);
    }
  });
  return problems;
}

export function readExemptions(root: string): unknown {
  return JSON.parse(readFileSync(join(root, EXEMPTIONS_FILE), 'utf8')) as unknown;
}

/** True when a valid, unexpired exemption covers (subject, gate, cell). Throws on an invalid list, so a gate
    consulting an invalid file fails closed instead of honouring a bad entry. */
export function isExempt(raw: unknown, subject: string, gate: string, cell: string, now: Date = new Date()): boolean {
  const problems = validateExemptions(raw, now);
  if (problems.length) throw new Error(`invalid ${EXEMPTIONS_FILE}:\n${problems.map((p) => p.message).join('\n')}`);
  if (NON_EXEMPTABLE[gate]) return false;
  return (raw as Exemption[]).some((e) => e.subject === subject && e.gate === gate && (e.cells.includes('*') || e.cells.includes(cell)));
}
