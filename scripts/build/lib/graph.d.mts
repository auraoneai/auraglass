/* Types for graph.mjs (consumed by the TS build/rsc/side-effects gates). */
export interface ManifestEntry {
  subpath: string;
  source: string;
  types?: string;
  default: string;
  css?: string;
  [key: string]: unknown;
}
export const ROOT: string;
export const SRC: string;
export const DIST: string;
export function resolveSpecifier(spec: string, fromFile: string): string | null;
export function specifiersOf(file: string): string[];
export function importClosure(entryFile: string, options?: { within?: string }): Set<string>;
export function closureHasSeed(entryFile: string): boolean;
export function walk(dir: string, filter?: (path: string) => boolean): string[];
export function rel(file: string): string;
export function loadJson(path: string): unknown;
export function manifestEntries(root?: string): { entries: ManifestEntry[]; js: ManifestEntry[]; asset: ManifestEntry[] };
export function buildableEntries(root?: string): { keep: ManifestEntry[]; pending: (ManifestEntry & { reason: string })[] };
