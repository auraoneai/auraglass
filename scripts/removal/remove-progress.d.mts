import type { DispositionRow } from './consumer-grep.mjs';

export interface RemovalRecord { family: string; sha?: string | null; names?: string[] }
export interface FamilyProgress {
  family: string; sha: string; deleted: string[]; listed: string[]; unlisted: string[]; notDeleted: string[];
}
export const RECORDS: string;
export function ensureFullHistory(root?: string): void;
export function loadRecords(root?: string): RemovalRecord[];
export function familyProgress(root: string, rows: DispositionRow[], record: RemovalRecord & { sha: string }): FamilyProgress;
export function removeProgress(root?: string, opts?: { family?: string }): FamilyProgress[];
