/* Types for scripts/docs/verify-docs-out.mjs (REQ-PLAT-99). */
export interface NavLikeSection { title: string; groups: Array<{ title: string; entries: Array<{ title: string; href: string }> }> }
export declare function navHrefs(nav: NavLikeSection[]): string[];
export declare function htmlFor(outDir: string, href: string): string;
export declare function verifyOut(outDir: string): { hrefs: string[]; missing: string[]; error: string | null };
export declare function main(outDir?: string): 0 | 1;
