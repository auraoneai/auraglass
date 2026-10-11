export interface CoverageRow { name: string; dest: string; pub: boolean; prd: string }
export interface DeprecationEntry { id: string; kind?: string; symbol?: string; replacement?: string | null; __stream?: string }
export interface CoverageResult {
  need: number;
  missing: Array<{ name: string; dest: string; owner: string }>;
  invalid: Array<{ name: string; id: string; replacement: unknown; owner: string }>;
}
export function exportSet(root?: string): Set<string>;
export function validReplacement(replacement: unknown, exports: Set<string>): boolean;
export function entryOwner(row: { prd: string }): string;
export function coverage(rows: CoverageRow[], entries: DeprecationEntry[], exports: Set<string>): CoverageResult;
export function loadEntries(root?: string): Promise<DeprecationEntry[]>;
export function run(root?: string): Promise<CoverageResult>;
