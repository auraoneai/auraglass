/* Types for certification.mjs (REQ-PLAT-97). */
export interface CertRecord { item: string; project: string; sha: string | null; status: string }
export interface CertItem { pass: boolean; projects: Record<string, string>; reasons?: string[] }
export interface Certification { version: 1; sha: string; projects: string[]; items: Record<string, CertItem>; malformed?: string[] }
export const DEFAULT_PROJECTS: string[];
export function recordFile(dir: string, item: string, project: string): string;
export function readRecords(dir: string | null | undefined): Array<CertRecord | { file: string; malformed: true }>;
export function aggregate(input: { items: string[]; records: Array<Partial<CertRecord> & Record<string, unknown>>; sha: string | null; projects?: string[] }): Certification;
export function certifiedNames(cert: unknown, sha: string): Set<string>;
export function main(argv?: string[], env?: Record<string, string | undefined>): number;
