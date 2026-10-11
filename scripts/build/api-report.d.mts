/* Type declarations for api-report.mjs (PLAT-22), so TS tests can import it. */
export const EXTRACTOR_VERSION: string;
export function slugify(key: string): string;
export function extractorAvailable(root?: string): boolean;
export function extractNames(sourcePath: string, opts?: { root?: string }): Promise<string[]>;
export function extractCssApi(sourcePath: string): unknown;
export function apiExtractorReport(opts: { dtsPath: string; reportPath: string; configDir: string; root?: string }): unknown;
export function reportFiles(entry: string, names: string[], opts?: { unanalysable?: string[] }): { exportsJson: string; apiMd: string };
export function entrySource(entry: string, opts?: { root?: string }): { source?: string; subpath?: string; css?: string } | null;
export function run5x(
  entry: string,
  opts?: { root?: string; check?: boolean; failOnUnanalysable?: boolean | null },
): Promise<{ files: Record<string, string>; unanalysable: string[]; check: boolean; failOnUnanalysable: boolean | null }>;
export function exportsKeysWithTypes(pkg: unknown): string[];
export function run4x(opts?: { root?: string }): unknown;
export function extractDtsNames(text: string, dir?: string): string[];
export function allEntries(root?: string): string[];
export function main(argv?: string[], opts?: { root?: string }): Promise<unknown>;
