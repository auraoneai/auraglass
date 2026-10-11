/* Type declarations for scripts/qual/perf/lib.mjs (QUAL perf tools, G-21). */
export const ROOT: string;
export function loadQa(name: string, root?: string): Promise<Record<string, any>>;
export function rel(root: string, abs: string): string;
export interface MetaIdentity { name: string; tier: 'T0' | 'T1' | 'T2' | 'preview'; owner: string; flagship?: number; file: string; dir: string }
export function readMetas(root?: string): Promise<MetaIdentity[]>;
export function importGraph(root?: string): { edges: Map<string, string[]> };
export function git(args: string[], root?: string): string;
export function isAncestor(a: string, b: string, root?: string): boolean;
export function fetchRefArtifact(o: { ref: string; job: string; path: string }): Promise<{ ok: boolean; status: number; body: string | null; reason: string | null }>;
export function readJson(file: string): any;
export function seedMarkersAt(sha: string, dirs: string[], root?: string): string[];
export function expandInputs(list: string, cwd?: string): Promise<string[]>;
