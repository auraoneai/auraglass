import type { RowResult, ManifestResult } from './laneRunner';
export function l7RowResult(input: { report: unknown; status: number | null; evidenceDir: string; scope: string; branch: string | null; root: string }, deps?: unknown): Promise<RowResult & { l7?: { changed: string[]; noBaseline: string[]; missingL14?: string[]; l14Problems?: string[] } }>;
export function writeVisualClass(input: { root: string; evidenceDir: string; scope: string; sha: string }, deps?: unknown): Promise<ManifestResult & { file?: string }>;
export function blockingExit(results: Array<{ state: string; [key: string]: unknown }>): number;
