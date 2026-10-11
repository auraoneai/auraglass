export interface BaselineRow { file: string; owner: string; reqFin: string; expires: string }
export const BASELINE_DIR: string;
export function expired(row: BaselineRow, version: string): boolean;
export function loadBaseline(root: string, gate: string): { path: string; rows: BaselineRow[]; present: boolean };
export function applyBaseline<T extends { file: string }>(findings: T[], rows: unknown[], version: string): { excused: T[]; blocking: T[]; errors: string[] };
export function packageVersion(root: string): string;
