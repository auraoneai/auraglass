/* Types for scripts/qual/lib/cold-import.cjs (REQ-QUAL-47). QUAL-owned. */
export interface PageCache { method: 'drop_caches' | 'none'; ok: boolean; reason?: string }
export interface EntryResult { samples: number[]; median?: number | null; p90?: number | null; error?: string; pageCache?: PageCache }
export interface ColdImportFailure { kind: string; node?: string; entry?: string; detail?: string }
export interface ColdImportReport {
  runnerTags: string[]; runs?: number; nodes?: Array<{ bin: string; version: string }>;
  results?: Record<string, Record<string, EntryResult>>; [k: string]: unknown;
}
export const ROOT: string;
export const NODE_COLD_IMPORT_MS: number;
export const THRESHOLDS: Record<string, { medianMs: number; p90Ms?: number }>;
export const RUNS: number;
export const REQUIRED_NODE_LINES: Array<{ id: string; test: (v: string) => boolean }>;
export function median(xs: number[]): number | null;
export function percentile(xs: number[], p: number): number | null;
export function parseRunnerTags(raw: string | undefined | null): string[];
export function jsEntries(pkgJson: { exports?: Record<string, unknown> }): string[];
export function specifierOf(name: string, sub: string): string;
export function dropPageCache(): PageCache;
export function importOnce(nodeBin: string, cwd: string, specifier: string): { ms?: number; error?: string };
export function measureEntry(nodeBin: string, cwd: string, specifier: string, opts?: { runs?: number; dropCache?: () => PageCache }): EntryResult & { pageCache: PageCache };
export function nodeVersion(bin: string): string;
export function evaluate(report: ColdImportReport): ColdImportFailure[];
export function findTarball(env?: Record<string, string | undefined>): string | null;
export function setupScratch(tarball: string, opts?: { npm?: string }): { dir: string; pkgJson: { name: string; exports?: Record<string, unknown> }; peers: string[] };
export function sha256(file: string): string;
