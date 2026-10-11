/* Type declarations for css-layered.mjs (MAT-070), so TS tests can import it. */
export const HEADER_CSS: string;
export const LAYER_ORDER: string;
export const SHADCN_SOURCE_ATTR: string;
export function shadcnSourceRegistered(contractPath?: string): boolean;
export function assertShadcnAcyclic(decls: Array<[string, string]>, mode: string): void;
export function emitTokensCss(cells: unknown, axisDefs: unknown, records: unknown, resolved: unknown, opts?: Record<string, unknown>): Promise<unknown>;
