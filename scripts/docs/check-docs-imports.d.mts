import type { Snippet } from './compile-snippets.mjs';
export interface ImportViolation { file: string; line: number; specifier: string; reason: string }
export function exportedSpecifiers(pkg: { name: string; exports?: unknown }): Set<string>;
export function banReason(spec: string, exported: Set<string>, name?: string): string | null;
export function importsOf(text: string): string[];
export function findViolations(opts?: { root?: string; snippets?: Snippet[]; pkg?: { name: string; exports?: unknown } }): ImportViolation[];
export function main(root?: string): number;
