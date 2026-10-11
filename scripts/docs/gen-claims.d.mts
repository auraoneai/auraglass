/* Types for gen-claims.mjs. */
import type { Claim, Claims } from './claims.js';
export type ClaimId =
  | 'flagship-count' | 'component-count' | 'root-value-exports' | 'button-gzip-kb'
  | 'styles-css-gzip-kb' | 'tarball-mb' | 'contrast-min-regular' | 'contrast-min-large'
  | 'glass-recipes' | 'quickstart-seconds-next' | 'quickstart-seconds-vite'
  | 'registry-block-count' | 'codemod-transform-count' | 'pixel-gates-passed';
import type { ARTIFACTS, TREE_SOURCES } from './paths.mjs';
export type ArtifactKey = keyof typeof ARTIFACTS;
export type TreeSourceKey = keyof typeof TREE_SOURCES;
export type ClaimSource = ({ artifact: ArtifactKey; tree?: never } | { tree: TreeSourceKey; artifact?: never }) & {
  path: string; unit: string; value: (data: unknown) => number | null;
};
export const CLAIM_SOURCES: Record<ClaimId, ClaimSource>;
export const ARTIFACT_OWNER: Record<ArtifactKey, 'PLAT' | 'QUAL' | 'MAT'>;
export const GA_TAG_RE: RegExp;
export interface GenerateOptions { root?: string; env?: NodeJS.ProcessEnv; write?: boolean }
export type SourceRead =
  | { rel: string; state: 'missing' }
  | { rel: string; state: 'unreadable'; reason: string }
  | { rel: string; state: 'foreign'; sha: string }
  | { rel: string; state: 'present'; data: unknown; sha: string | null };
export function buildSha(root?: string, env?: NodeJS.ProcessEnv): string | null;
export function readArtifact(root: string, key: ArtifactKey): SourceRead;
export function readTree(root: string, key: TreeSourceKey, sha: string | null): SourceRead;
export function generate(options?: GenerateOptions): {
  sha: string | null; tag: string | null; ga: boolean; pending: ClaimId[];
  claims: Record<ClaimId, Claim> & Claims; errors: string[];
};
export function main(options?: Pick<GenerateOptions, 'root' | 'env'>): 0 | 1;
