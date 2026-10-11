/* Types for scripts/docs/gen-rsc-guide.mjs (PLAT-380). */
export declare const RECORD_PATH: string;
export declare const MANIFEST_PATH: string;
export declare const RSC_GUIDE_PATH: string;
export interface ServerSafeRecord {
  version: number;
  safeModules: string[];
  meta: Array<{ name: string; rsc?: 'server' | 'client' | 'mixed' }>;
  entries: Array<{ subpath: string; safe: boolean; reason?: string }>;
}
export interface ExportsManifest { entries: Array<{ subpath: string; source: string }> }
export declare function manifestJsSubpaths(manifest: ExportsManifest): string[];
export declare function verifyRecord(record: ServerSafeRecord, manifest: ExportsManifest): string[];
export declare function entryRows(record: ServerSafeRecord, manifest: ExportsManifest): Array<{ subpath: string; specifier: string; safe: boolean; reason: string }>;
export declare function componentRows(record: ServerSafeRecord): Array<{ name: string; rsc: string | null }>;
export declare function renderRscGuide(recordText: string, manifest: ExportsManifest): string;
export declare function main(): number;
