export interface LinkFinding { file: string; line: number; href: string; message: string }
export const PAGE_ROOTS: Array<{ dir: string; prefix: string }>;
export const PLAIN_ROOTS: string[];
export const PLAIN_EXCLUDE: string[];
export function existsExactCase(p: string): boolean;
export function stripCode(src: string): string;
export function extractLinks(src: string): Array<{ href: string; line: number }>;
export function anchorsOf(src: string): Set<string>;
export function discoverPages(root: string): { byRoute: Map<string, string>; byFile: Map<string, string> };
export function routesFromOut(outDir: string): Map<string, string>;
export function redirectSources(root: string): Set<string>;
export function checkLinks(opts?: { root?: string; outDir?: string | null }): { findings: LinkFinding[]; mode: 'out' | 'source'; routes: number; pages: number; plain: number };
export function main(argv?: string[], root?: string): number;
