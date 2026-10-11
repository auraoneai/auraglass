/* Types for scripts/docs/install-pack.mjs (REQ-PLAT-99). */
export declare function packPath(root?: string): string;
export declare function verifyInstalled(root?: string): string[];
export declare function main(root?: string, opts?: { install?: boolean }): 0 | 1;
