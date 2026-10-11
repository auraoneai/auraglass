/* Types for scripts/docs/agent-data.mjs (REQ-PLAT-106). */
export interface MetaLike {
  name: string; entry: string; owner?: string; tier?: string; flagship?: number; rsc?: string;
  parts: readonly string[]; states?: readonly string[]; variants?: Record<string, readonly string[]>;
  material?: unknown; apg?: string;
  migration?: ReadonlyArray<{ from: string; automation: string; compat: boolean; props?: Record<string, unknown>; selectors?: Record<string, string> }>;
}
export interface MetaRecord { meta: MetaLike; file: string }
export interface MigrationEntry { transform: string; [key: string]: unknown }
export const ROOT: string;
export function slugOf(name: string): string;
export function importPath(entry: string): string;
export function readJson(root: string, rel: string): any;
export function packageVersion(root?: string): string;
export function sourceSha(root?: string): string;
export function loadSubpaths(root?: string): Array<{ subpath: string; css: boolean; source: string | null }>;
export function loadMetas(root?: string): Promise<MetaRecord[]>;
export function loadProps(root?: string): Promise<(name: string) => Array<{ name: string; type: string; required: boolean; description?: string }>>;
export function loadRegistry(root?: string, sha?: string): Promise<Array<{ item: any; row: any }>>;
export function loadMigrations(root?: string, metas?: MetaRecord[]): Promise<Record<string, MigrationEntry[]>>;
