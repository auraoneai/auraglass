/* Types for rewrite-dts-aliases.mjs. */
export function rewriteFile(dtsFile: string): boolean;
export function rewriteAll(root?: string): { files: number; rewritten: number };
export function copyMjsDeclarations(root?: string): number;
export function relocateRuntimeDeclarations(root?: string): { moved: number; droppedSeam: number; contractTwins: number };
