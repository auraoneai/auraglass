/* Types for scripts/storybook/lib/storybook-build.mjs (REQ-QUAL-56), consumed by the TS flow specs. */
export declare const BUILD_MANIFEST: 'ag-build.json';
export declare const INDEX_FILE: 'index.json';
export declare const MANIFEST_KEYS: readonly string[];
export declare const BUDGET: { maxBytesExcludingMaps: number; maxBuildMs: number };
export declare const STORY_GLOBS: readonly string[];
export interface BuildManifest {
  sha: string; dirty: boolean; builtAt: string; storybookVersion: string; packageVersion: string; storyCount: number; indexSha256: string;
}
export declare function sha256(buf: string | Uint8Array): string;
export declare function parseStoryGlob(glob: string): { dir: string; kind: 'docs' | 'stories'; test: (file: string) => boolean };
export declare function storyFiles(root: string, globs?: readonly string[]): Map<string, 'docs' | 'stories'>;
export declare function readIndex(dir: string): { index: { v?: number; entries: Record<string, { id: string; type: string; importPath: string; tags?: string[] }> }; sha: string };
export declare function storyEntries(index: { entries: Record<string, { type: string }> }): Array<{ type: string }>;
export declare function sizeExcludingMaps(dir: string): number;
export declare function gitSha(root: string): string;
export declare function gitDirtyPaths(root: string): string[];
export declare function isCi(env?: Record<string, string | undefined>): boolean;
export declare function expectedSha(root: string, explicit?: string, env?: Record<string, string | undefined>): string;
export declare function freshnessProblems(input: {
  manifest: Partial<BuildManifest> | null | undefined; indexText: string | Uint8Array | null | undefined; sha: string; requireClean: boolean;
}): string[];
export declare function verifyFreshDir(input: { dir: string; sha: string; requireClean: boolean }): string[];
export declare function parseArgs(argv: string[]): Record<string, string | true>;
