// Declarations for gates/_util.mjs.
export const ROOT: string;
export function walkFiles(dir: string, exts: string[]): string[];
export const rel: (p: string) => string;
export function cssVarUses(text: string): Array<{ name: string; file?: string; line?: number }>;
export function cssVarDefs(text: string): Set<string>;
export function importClosure(entryFile: string, seen?: Map<string, string[]>): Map<string, string[]>;
export function tsVarRefs(text: string): Array<{ name: string }>;
export function tsVarUses(text: string): Array<{ name: string }>;
export function tsVarDefs(text: string): Set<string>;
