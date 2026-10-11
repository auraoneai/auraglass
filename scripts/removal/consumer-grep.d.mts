/* Type declarations for consumer-grep.mjs (RM-*), so TS tests can import it. */
export interface DispositionRow {
  i: number; name: string; file: string; disp: string; pub: boolean; dest: string;
  target: string; owner: string; codemod: string; prd: string; note: string;
}
export const DEFAULT_ROOTS: string[];
export const FAMILY_PATHS: Record<string, unknown>;
export function dispositionsRows(text: string): DispositionRow[];
export function familyNames(family: string, rows: DispositionRow[]): string[];
export function ghSearch(names: string[], opts?: { timeoutMs?: number }): unknown;
export function verifyRecord(family: string, record: unknown, currentNames: string[]): unknown;
export function main(argv?: string[]): unknown;
