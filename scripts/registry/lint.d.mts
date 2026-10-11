/* Types for lint.mjs. */
export interface RegistryLintViolation { file: string; line: number; rule: string; excerpt: string }
export function stripAll(src: string): string;
export function lintFile(input: { file: string; rel: string; src: string; id: string; deps: readonly string[]; tailwind: boolean }): RegistryLintViolation[];
export function lint(options?: { root?: string; only?: string | null }): RegistryLintViolation[];
export function main(argv?: string[]): void;
