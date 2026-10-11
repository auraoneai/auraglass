/* Types for lint-claims.mjs. */
export interface ClaimTextViolation {
  line: number; text: string;
  kind: 'unknown-claim' | 'unpaired-claim-marker' | 'unsourced-number';
}
export interface ClaimViolation extends ClaimTextViolation { file: string }
export interface ClaimAllowance { text: string; reason: string; file?: string }
export const NUMBER_RE: RegExp;
export const SCAN: string[];
export function loadAllow(root?: string): ClaimAllowance[];
export function lintText(text: string, options?: { file?: string; allow?: ClaimAllowance[] }): ClaimTextViolation[];
export function lint(root?: string, options?: { extra?: string[] }): ClaimViolation[];
export function main(argv?: string[], root?: string): 0 | 1;
