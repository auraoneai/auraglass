export interface DistTagOptions {
  v4DistTag?: string;
  ga?: boolean;
  rollback?: boolean;
}
export interface ParsedSemver {
  major: number;
  minor: number;
  patch: number;
  pre: string[];
}
export function parseSemver(version: string): ParsedSemver | null;
export function distTagFor(version: string, opts?: DistTagOptions): string;
export function cmpSemver(a: string, b: string): -1 | 0 | 1;
export function monotonicViolation(
  tag: string,
  newVersion: string,
  currentVersion: string | null | undefined,
  opts?: { rollbackOk?: boolean },
): string | null;
export function isGaFromDistTags(map: Record<string, string> | null | undefined): boolean;
