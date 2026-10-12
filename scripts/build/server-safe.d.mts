/* Type declarations for server-safe.mjs (REQ-PLAT-69), so TS tests can import it. */
export const CONDITIONS: readonly string[];
export function exportsTarget(exp: unknown, sub: string, conditions?: readonly string[]): string | null;
export function resolveBare(spec: string, from: string): { file: string } | { builtin: true } | { error: string };
export function reactServerHooks(root?: string): string[];
export function serverGraph(start: string, root?: string): { safe: boolean; reason?: string; files: Set<string> };
export interface ServerSafeModuleRow { module: string; from: 'meta' | 'foundation'; meta?: string; safe: boolean; reason?: string }
export function serverSafeModules(root?: string): { rows: Array<{ file: string | null; meta?: string; metaFile?: string; foundation?: true }>; metaEntries: Array<{ file: string; name: string; rsc?: string }> };
export function generateServerSafeExports(root?: string): {
  version: 1;
  safeModules: string[];
  meta: Array<{ name: string; rsc?: string }>;
  modules: ServerSafeModuleRow[];
  entries: Array<{ subpath: string; safe: boolean; reason?: string }>;
};
