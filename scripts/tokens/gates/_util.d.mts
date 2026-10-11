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
export const PRODUCERS: Array<{ test: (p: string) => boolean; producer: string }>;
export function streamOf(relPath: string): string;
export function reportByStream<F extends { stream: string }>(
  gate: string,
  findings: F[],
  describe: (f: F) => string,
): { mat: F[]; other: F[] };
export function scanCss(
  text: string,
  from?: string,
): {
  defs: Array<{ name: string; value: string; line: number }>;
  uses: Array<{ name: string; hasFallback: boolean; via: string | null; line: number }>;
  properties: string[];
  parseError: string | null;
};
