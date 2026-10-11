export interface DispositionRow {
  i: number; name: string; file: string; disp: string; pub: boolean; dest: string; target: string;
  owner: string; codemod: string; prd: string; note: string;
}
export const DEFAULT_ROOTS: string[];
export const FAMILY_PATHS: Record<string, string[]>;
export function dispositionsRows(text: string): DispositionRow[];
export function familyNames(family: string, rows: DispositionRow[]): DispositionRow[] | null;
export function ghSearch(names: string[], opts?: { timeoutMs?: number }): { status: string; hits?: unknown[]; reason?: string };
export function verifyRecord(family: string, record: unknown, currentNames: string[]): string[];
export function main(argv?: string[]): void;
