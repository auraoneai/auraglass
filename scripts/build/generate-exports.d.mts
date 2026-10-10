/* Type declarations for generate-exports.mjs (REQ-FIN-06), so TS tests can import it. */
export type ExportCondition = { types: string; default: string; css?: string };
export interface SeedFileRow { file: string; owner: string; removingReqFin: string }
export interface ExclusionRow { subpath: string; reason: string; stale: boolean; gaDropped?: boolean; seedFiles?: SeedFileRow[] }
export function exclusionReport(root?: string): ExclusionRow[];
export function desiredExports(root?: string): Record<string, ExportCondition | string>;
export function desiredTopLevel(root?: string): { main: string | undefined; types: string | undefined };
export function desiredTypes(root?: string): string | undefined;
export function desiredMain(root?: string): string | undefined;
export function packageDrift(root?: string): string[];
export interface ManifestRow { subpath: string; source: string; types?: string; default?: string; css?: string }
export function listEntriesJson(root?: string): { version: number; entries: ManifestRow[]; excluded: ExclusionRow[]; exports: Record<string, ExportCondition | string> };
