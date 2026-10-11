/** Public API for the server-safe canary page generator. */
export interface ServerSafeMap {
  entries?: readonly { subpath: string; safe: boolean }[];
}
export const CANARIES: string[];
export function importableSubpaths(map: ServerSafeMap, exportsKeys: readonly string[]): {
  safe: string[];
  skipped: { subpath: string; reason: string }[];
};
export function renderServerPage(subpaths: readonly string[]): string;
export function main(root?: string): 0 | 2;
