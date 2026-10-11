// Types for scripts/qual/verify-lab-not-shipped.mjs (REQ-QUAL-54), for TypeScript tests.
export interface ShippedEntry { path: string; read(): string }
export const ROOT: string;
export const STORY_ONLY_ATTRIBUTES: string[];
export function specifiers(code: string, file: string): string[];
export function reachesStorybook(spec: string, file: string): boolean;
export function importViolations(files: Array<{ file: string; code: string }>): string[];
export function guardedFiles(root?: string): Array<{ file: string; code: string }>;
export function shippedViolations(entries: ShippedEntry[]): string[];
export function dirEntries(dir: string, prefix: string): ShippedEntry[];
export function scanTarball(tgz: string): string[];
export function main(argv?: string[], env?: Record<string, string | undefined>, root?: string): number;
