export interface DispositionRow {
  i: number; name: string; file: string; disp: string; pub: boolean; dest: string; target: string;
  owner: string; codemod: string; prd: string; note: string;
}
export interface ConsumerHit { path: string; count: number }
export interface Acknowledgement { path: string; via: 'codemod' | '4.x-lts'; note?: string }
export const DEFAULT_ROOTS: string[];
export const EXCLUDED: string[];
export const SOURCE_EXT: Set<string>;
export const SPECIFIER_RE: RegExp;
export const ACK_VIA: Array<Acknowledgement['via']>;
export const FAMILY_PATHS: Record<string, string[]>;
export function dispositionsRows(text: string): DispositionRow[];
export function familyNames(family: string, rows: DispositionRow[]): DispositionRow[] | null;
export function countNameHits(text: string, names: string[]): number;
export function expandRoots(roots: string[]): string[];
export function scanRoot(root: string, names: string[]): { files: number; hits: ConsumerHit[] };
export function ghSearch(names: string[], opts?: { timeoutMs?: number; gh?: (args: string[]) => string }): { status: string; files?: number; reason?: string; hits: ConsumerHit[] };
export function verifyRecord(family: string, record: unknown, currentNames: string[], opts?: { base?: string | null; isAncestor?: (a: string, b: string) => boolean }): string[];
export function familiesInDiff(nameStatus: string): Set<string>;
export function reshapeRecord(prev: Record<string, unknown>): Record<string, unknown>;
export function main(argv?: string[]): number;
