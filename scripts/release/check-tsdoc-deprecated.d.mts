/** Input fields consumed by the declaration-level deprecation gate. */
export interface TsdocEntry {
  id: string;
  kind: string;
  status: string;
  symbol: string;
  since: string;
  removeIn: string;
  replacement: string | null;
}
export interface Declaration {
  kind: 'export' | 'prop';
  name: string;
  owner: string | null;
  line: number;
  tag: string | null;
}
export interface EntryCheckOptions {
  missingIsError?: boolean;
  stats?: { covered: number; absent: number } | null;
}
export const COVERED_KINDS: Set<string>;
export function findDeclFiles(symbol: string, roots: readonly string[], options?: { cwd?: string }): string[];
export function declarations(text: string, fileName?: string): Declaration[];
export function parseTag(tag: string | null | undefined): { since: string; removeIn: string; link: string | null } | null;
export function checkEntry(options: EntryCheckOptions & {
  entry: TsdocEntry;
  readFile: (path: string) => string;
  findFiles: (symbol: string) => readonly string[];
}): string[];
export function checkReverse(files: readonly string[], entries: readonly TsdocEntry[], options: { readFile: (path: string) => string }): string[];
export function main(argv?: string[], options?: { root?: string }): Promise<number>;
