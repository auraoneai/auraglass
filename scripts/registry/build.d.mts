/* Types for build.mjs. Registry items are authored JSON read from disk, so
   their shape is open-ended (`any`); the build's own report rows are typed. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegistryItemJson = any;
export interface ReportRow {
  name: string;
  kind: string;
  file: string;
  owner: string | null;
  status: 'pending' | 'invalid' | 'certified' | 'omitted';
  sizeBytes?: number;
  errors?: string[];
  certified?: string;
  reason?: string;
}
export interface BuildReport {
  sha: string | null;
  version: string | null;
  ga: boolean;
  manifest: string | null;
  items: ReportRow[];
  base?: { missingCssVars: string[] };
}
export function stable<T>(value: T): T;
export const emit: (value: unknown) => string;
export function validate(schema: unknown, value: unknown, path?: string): string[];
export function readItem(dir: string, id: string, relRoot: string): { id: string; dir: string; file: string; item: RegistryItemJson; files: RegistryItemJson[] };
export function generateBaseTheme(manifestPath?: string | null): { cssVars: Record<string, Record<string, string>>; css: string; missingCssVars: string[] };
export function build(options?: { root?: string; sha?: string | null; version?: string | null; gaTag?: string | null; manifest?: string | null; write?: boolean }): {
  index: { $schema: string; name: string; homepage: string; items: RegistryItemJson[] };
  report: BuildReport;
  published: string[];
  errors: string[];
};
export function main(argv?: string[]): void;
