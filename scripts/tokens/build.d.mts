// Declarations for build.mjs.
export const AXIS_ORDER: string[];
export interface TokenRecord { name: string; type?: string; ext?: Record<string, unknown>; value: unknown; file: string; group?: string }
export interface ResolvedCell { name?: string; cssVar?: string; axis?: string | null; axisValue?: string; renderType?: string; type?: string; value?: unknown; ext?: Record<string, unknown> }
export function loadTokens(tokenDir: string): Map<string, TokenRecord>;
export function resolveAliases(records: Map<string, TokenRecord>): Map<string, unknown>;
export function expandModes(records: Map<string, TokenRecord>, resolved: Map<string, unknown>, axisDefs: Record<string, { default: string; values: string[]; selectors?: Record<string, string[]> }>): ResolvedCell[];
export function renderValue(rec: ResolvedCell | TokenRecord): string;
export function emitTokensCss(cells: ResolvedCell[], axisDefs: Record<string, { default: string; values: string[]; selectors?: Record<string, string[]> }>, records: Map<string, TokenRecord>, resolved: Map<string, unknown>): Promise<string>;
export function runBuild(opts?: { tokenDir?: string; outRoot?: string; quiet?: boolean }): Promise<void>;
