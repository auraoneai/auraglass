/* Type declarations for formats/_shared.mjs, so TS tests can import it. */
export function die(msg: string): never;
export const PRETTIER_MISSING: string;
export interface PrettierLike { format(code: string, opts: { parser: string }): string | Promise<string> }
export function loadPrettier(req?: (id: string) => unknown): PrettierLike;
export function prettierFormat(code: string, parser: string, req?: (id: string) => unknown): Promise<string>;
export function dim(v: { value: number | string; unit: string }): string;
export const AXIS_ORDER: string[];
export function renderValue(rec: Record<string, unknown>): string;
export const HEADER_CSS: string;
export const LAYER_ORDER: string;
export function layerFirst(css: string): string;
export const SHADCN_MAP: Record<string, string>;
