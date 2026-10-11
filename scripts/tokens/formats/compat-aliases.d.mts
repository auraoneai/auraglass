// Declarations for formats/compat-aliases.mjs.
export const COMPAT_ROOT: string;
export const LEGACY_COMMIT: string;
export const LEGACY_CSS_PATH: string;
export interface LegacyDecl { name: string; value: string }
export interface CompatEntry { successor: string | null; frozen: string | null; defined: boolean }
export const SHIM_VARS: Record<string, string>;
export const SUCCESSOR_RULES: Array<[RegExp, unknown]>;
export function extractLegacyDeclarations(cssText: string): LegacyDecl[];
export function legacyReaderSet(): string[];
export function legacySourceCss(): string;
export function buildCompatMap(legacyDecls: LegacyDecl[], readers: string[]): Record<string, CompatEntry>;
export function legacyTokensJson(legacyDecls: LegacyDecl[]): Record<string, unknown>;
export function compatCss(map: Record<string, CompatEntry>): string;
export function emitCompat(write: (rel: string, content: string) => void, tokenDir: string): { count: number };
