/* Types for scripts/release/export-snapshot.mjs (REQ-PLAT-23). */
export interface SnapshotModuleRow {
  kind: 'module';
  runtime: string[];
  require: string[];
  types: string[];
  typeValues: string[];
  typesRuntimeMismatch: boolean;
  mismatch: string[];
  error?: string;
}
export interface SnapshotAssetRow { kind: 'asset'; file: string | null }
export type SnapshotRow = SnapshotModuleRow | SnapshotAssetRow;
export interface SnapshotResult { json: string; entries: Record<string, SnapshotRow> }

export const MIN_NODE: [number, number];
export function nodeSupported(version?: string): boolean;
export function stableSnapshot(entries: Record<string, Partial<SnapshotModuleRow> | SnapshotAssetRow>, meta?: Record<string, unknown>): string;
export function dtsExportNames(text: string): string[];
export function dtsExports(dtsPath: string, opts?: { root?: string }): { names: string[]; values: string[]; compiler: boolean };
export function extractTarball(tgz: string, tmp: string, opts?: { cwd?: string }): { dir: string; pkg: Record<string, unknown> };
export function installTarball(tgz: string, tmp: string): { dir: string; pkg: Record<string, unknown> };
export function runtimeNames(spec: string, pkgDir: string, opts?: { cwd?: string; withRequire?: boolean }):
  { names: string[]; error: string | null; require: string[] | null; requireError: string | null };
export function snapshotPackageDir(pkgDir: string, pkg: Record<string, unknown>, opts?: { cwd?: string }): Record<string, SnapshotRow>;
export function snapshotTarball(tgz: string, opts?: { cwd?: string; keep?: boolean; tmpBase?: string | null; install?: boolean }): SnapshotResult;
export function snapshotPublished(version: string, opts?: { name?: string; cwd?: string; install?: boolean; exec?: unknown }): SnapshotResult;
export function main(argv?: string[], opts?: { cwd?: string }): number;
