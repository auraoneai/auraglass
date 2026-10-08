// Declarations for validate.mjs (sibling .d.mts convention, cf. load-fragments.d.mts).
export const ROOT: string;
export function loadSchema(path?: string): unknown;
export function discoverTokenFiles(tokenDir: string): string[];
export function validateTokenFile(tree: unknown, schema: unknown, file: string): Array<{ path: string; message: string }>;
export function isAlias(v: unknown): boolean;
