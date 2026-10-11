/* Types for rewrite-dts-aliases.mjs. */
export function rewriteFile(dtsFile: string): boolean;
export function rewriteAll(root?: string): { files: number; rewritten: number };
