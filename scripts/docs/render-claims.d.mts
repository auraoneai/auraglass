/* Types for render-claims.mjs. */
import type { Claim, Claims } from './claims.js';
export const REGION_RE: RegExp;
export function formatClaim(claim: Claim | null | undefined): string;
export function loadClaims(root?: string): Claims;
export function render(text: string, claims: Claims): string;
export function renderFile(path: string, claims: Claims): number;
export function main(argv?: string[], root?: string): 0 | 1;
