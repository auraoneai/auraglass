/* Types for scripts/docs/gen-migration-stories.mjs (REQ-PLAT-105). */
export declare const STORIES_DIR: string;
export declare function storyMdx(o: { name: string; metaFile: string }): string;
export declare function pages(root?: string): Promise<Record<string, string>>;
export declare function main(argv?: string[], o?: { root?: string }): Promise<0 | 1>;
