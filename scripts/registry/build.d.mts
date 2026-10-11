/* Types for the parts of scripts/registry/build.mjs that tests import (PLAT-352). */
export declare function generateBaseTheme(manifestPath: string | null): {
  cssVars: { theme: Record<string, string>; light: Record<string, string>; dark: Record<string, string> };
  css: string;
  missingCssVars: string[];
};
export declare function stable<T>(value: T): T;
export declare function emit(value: unknown): string;
export declare function validate(schema: unknown, value: unknown, path?: string): string[];
export declare function build(options?: {
  root?: string; sha?: string | null; version?: string | null; gaTag?: string | null; manifest?: string | null; write?: boolean;
}): { index: unknown; report: { items: Array<{ status: string }> }; published: string[]; errors: string[] };
export declare function main(argv?: string[]): number;
