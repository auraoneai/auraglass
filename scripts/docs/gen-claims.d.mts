/* Types for gen-claims.mjs. */
import type { Claim, Claims } from './claims.js';
export type ClaimId =
  | 'flagship-count' | 'component-count' | 'root-value-exports' | 'button-gzip-kb'
  | 'styles-css-gzip-kb' | 'tarball-mb' | 'contrast-min-regular' | 'contrast-min-large'
  | 'glass-recipes' | 'quickstart-seconds-next' | 'quickstart-seconds-vite'
  | 'registry-block-count' | 'codemod-transform-count' | 'pixel-gates-passed';
export const CLAIM_SOURCES: Record<ClaimId, { artifact: string; path: string; unit?: string }>;
/** generate() writes one record per CLAIM_SOURCES id (pending when its artifact is absent). */
export function generate(options?: { root?: string; sha?: string; isTag?: boolean }): { claims: Record<ClaimId, Claim> & Claims; errors: string[] };
export function main(): void;
