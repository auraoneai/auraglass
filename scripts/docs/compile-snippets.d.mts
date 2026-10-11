export interface Snippet { source: string; line: number; lang: 'ts' | 'tsx' | 'jsx'; fragment: boolean; code: string; example?: boolean }
export interface Fence { line: number; lang: string; meta: string; code: string }
export interface SnippetFailure { source: string; line: number; lang: string; fragment: boolean; errors: Array<{ line: number; code: number; message: string }> }
export interface SnippetReport {
  total: number; sources: number; types: { mode: 'packed' | 'source'; tarball: string | null };
  compilerOptions: { strict: boolean; jsx: string; moduleResolution: string };
  durationMs: number; budgetMs: number; globalErrors: string[]; failures: SnippetFailure[];
}
export const BUDGET_MS: number;
export const FENCE_ROOTS: string[];
export const FENCE_FILES: string[];
export const EXAMPLE_ROOT: string;
export const REPORT_PATH: string;
export const COMPILER_OPTIONS: Record<string, unknown>;
export function parseFences(src: string): Fence[];
export function collectSnippets(root?: string): Snippet[];
export function wrapSnippet(s: Snippet): { text: string; offset: number; hoisted: number };
export function packPath(root?: string): string;
export function extractTarball(tarball: string, work: string): string;
export function sourcePaths(root: string): Record<string, string[]>;
export function compile(opts?: { root?: string; tarball?: string | null; requirePacked?: boolean; snippets?: Snippet[] }): SnippetReport;
export function main(argv?: string[], root?: string): number;
