/* Type declarations for graph.mjs (REQ-FIN-06), so TS tests can import it. */
export interface ManifestEntry { subpath: string; source: string; types?: string; default?: string; css?: string; ga?: string }
export interface PendingEntry extends ManifestEntry { reason: string; gaDropped?: boolean; seedFiles?: string[] }
export const ROOT: string;
export const SRC: string;
export const DIST: string;
export const SEED_HEADER_RE: RegExp;
export function resolveSpecifier(spec: string, fromFile: string): string | null;
export function specifiersOf(file: string): string[];
export function importClosure(entryFile: string, opts?: { within?: string }): Set<string>;
export function fileIsSeed(file: string): boolean;
export function closureSeedFiles(entryFile: string, root?: string): string[];
export function closureHasSeed(entryFile: string): boolean;
export function walk(dir: string, filter?: (p: string) => boolean): string[];
export function rel(file: string): string;
export function loadJson(path: string): any;
export function manifestEntries(root?: string): { entries: ManifestEntry[]; js: ManifestEntry[]; asset: ManifestEntry[] };
export function contractGaLines(root?: string): Map<string, string>;
export function gaGate(e: { ga?: string }, version: string | undefined): string | null;
export function buildableEntries(root?: string): { keep: ManifestEntry[]; pending: PendingEntry[] };
