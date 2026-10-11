/**
 * `auraglass audit backdrop` client (REQ-PLAT-89). Remote-only: the CLI never
 * launches a browser. It POSTs a schema-valid request to
 * `<AURAGLASS_AUDIT_ENDPOINT>/audit`, validates the reply against
 * `schema/audit-backdrop.json`, and re-applies the §15.2 thresholds to every
 * reported surface so a lenient endpoint cannot turn a failing surface green.
 */

import schemaJson from '../../schema/audit-backdrop.json';
import { usageError } from '../cli/errors.js';
import { validateDef } from './json-schema.js';
import {
  AUDIT_THRESHOLDS,
  LUM_VARIANCE_MIN_LEVELS,
  OCR_CONTRAST,
  TRANSLUCENT_RUNGS,
  type TransparencyRung,
} from './thresholds.js';

const schema = schemaJson as unknown as Record<string, unknown>;

export interface BackdropRequest {
  url: string;
  selector?: string;
  thresholds: typeof AUDIT_THRESHOLDS;
}

export interface BackdropSurface {
  selector: string;
  lumVariance: number;
  ocrContrast: number | null;
  textSize: 'body' | 'large' | null;
  rung: TransparencyRung;
  verdict: 'pass' | 'fail';
  reasons?: string[];
}

export interface BackdropResponse {
  version: 1;
  url: string;
  selector?: string;
  surfaces: BackdropSurface[];
}

export type BackdropOutcome =
  | { kind: 'ok'; report: BackdropResponse; evaluated: Array<BackdropSurface & { reasons: string[] }>; failed: number }
  | { kind: 'remote-error'; message: string };

/** Apply §15.2 thresholds to one surface; returns the failure reasons (empty = pass). */
export function evaluateSurface(s: Pick<BackdropSurface, 'lumVariance' | 'ocrContrast' | 'textSize' | 'rung'>): string[] {
  const reasons: string[] = [];
  if (TRANSLUCENT_RUNGS.includes(s.rung) && s.lumVariance < LUM_VARIANCE_MIN_LEVELS) {
    reasons.push(`glass-over-nothing: lumVariance ${s.lumVariance.toFixed(2)} < ${LUM_VARIANCE_MIN_LEVELS}`);
  }
  if (s.ocrContrast !== null) {
    const min = s.textSize === 'large' ? OCR_CONTRAST.large : OCR_CONTRAST.body;
    if (s.ocrContrast < min) {
      reasons.push(`ocr-contrast: ${s.ocrContrast.toFixed(2)} < ${min} (${s.textSize ?? 'body'})`);
    }
  }
  return reasons;
}

export function buildRequest(url: string, selector: string | undefined): BackdropRequest {
  const req: BackdropRequest = { url, thresholds: AUDIT_THRESHOLDS };
  if (selector !== undefined) req.selector = selector;
  return req;
}

export function validateRequest(req: unknown): string[] {
  return validateDef(schema, 'request', req);
}

export function validateResponse(res: unknown): string[] {
  const errors = validateDef(schema, 'response', res);
  if (errors.length) return errors;
  const r = res as BackdropResponse;
  r.surfaces.forEach((s, i) => {
    if ((s.ocrContrast === null) !== (s.textSize === null)) {
      errors.push(`$.surfaces[${i}]: textSize must be null exactly when ocrContrast is null`);
    }
  });
  return errors;
}

export async function runBackdropAudit(
  endpoint: string,
  req: BackdropRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<BackdropOutcome> {
  const reqErrors = validateRequest(req);
  if (reqErrors.length) {
    // --url / --selector values that the request schema rejects are usage errors.
    throw usageError(`invalid audit request: ${reqErrors.join('; ')}`);
  }
  const target = `${endpoint.replace(/\/+$/, '')}/audit`;
  let res: Response;
  try {
    res = await fetchImpl(target, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(req),
    });
  } catch (e) {
    return { kind: 'remote-error', message: `audit endpoint unreachable: ${target} (${String(e)})` };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { kind: 'remote-error', message: `audit endpoint ${res.status}: ${target}${body ? ` — ${body.slice(0, 200)}` : ''}` };
  }
  let payload: unknown;
  try {
    payload = await res.json();
  } catch (e) {
    return { kind: 'remote-error', message: `audit endpoint returned non-JSON: ${String(e)}` };
  }
  const resErrors = validateResponse(payload);
  if (resErrors.length) {
    return { kind: 'remote-error', message: `audit endpoint response violates schema/audit-backdrop.json: ${resErrors.join('; ')}` };
  }
  const report = payload as BackdropResponse;
  const evaluated = report.surfaces.map((s) => {
    const reasons = evaluateSurface(s);
    const verdict: 'pass' | 'fail' = reasons.length ? 'fail' : 'pass';
    return { ...s, verdict, reasons: reasons.length ? reasons : (s.reasons ?? []), endpointVerdict: s.verdict };
  });
  const disagree = evaluated.filter((s) => s.verdict !== s.endpointVerdict);
  if (disagree.length) {
    return {
      kind: 'remote-error',
      message: `audit endpoint verdict disagrees with §15.2 thresholds for: ${disagree.map((s) => s.selector).join(', ')}`,
    };
  }
  const clean = evaluated.map(({ endpointVerdict: _e, ...s }) => s);
  return { kind: 'ok', report, evaluated: clean, failed: clean.filter((s) => s.verdict === 'fail').length };
}

/** One human-readable line per surface (without the status word). */
export function formatSurface(s: BackdropSurface & { reasons: string[] }): string {
  const ocr = s.ocrContrast === null ? 'n/a' : `${s.ocrContrast.toFixed(2)}(${s.textSize})`;
  const base = `${s.selector}  lumVariance=${s.lumVariance.toFixed(2)} ocrContrast=${ocr} rung=${s.rung}`;
  return s.verdict === 'fail' && s.reasons.length ? `${base}  — ${s.reasons.join('; ')}` : base;
}
