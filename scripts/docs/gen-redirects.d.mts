export interface RedirectRule { from: string; to: string; status: number }
export const V4_ORIGIN: string;
export const REDIRECTS_JSON: string;
export const REDIRECTS_FILE: string;
export function urlOf(docsPath: string): string;
export function rm13Paths(root?: string): string[];
export function buildRedirects(root?: string): Promise<RedirectRule[]>;
export function emitRedirects(rules: RedirectRule[]): string;
export function renderJson(rules: RedirectRule[]): string;
export function generate(root?: string): Promise<string>;
export function main(argv?: string[]): Promise<void>;
