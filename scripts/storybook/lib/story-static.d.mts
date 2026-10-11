export declare const ROOT: string;
export declare const UNKNOWN: unique symbol;
export interface StaticStory { exportName: string; name: string; id: string | null; tags: string[]; ag: unknown; hasPlay: boolean; line: number }
export interface ParsedStoryFile {
  file: string; title: string | null; explicitTitle: string | null; metaId: string | null; component: string | null;
  metaTags: string[]; metaAg: unknown; metaParsed: boolean; stories: StaticStory[];
  imports: { from: string; line: number }[]; anyUsages: { line: number; text: string }[];
  copy: { text: string; line: number; where: string }[];
}
export interface StaticMeta { name: string; owner: string; flagship?: number; file: string; [k: string]: unknown }
export interface IndexRecord { type: 'story' | 'docs'; id: string; title: string; name: string; importPath: string; tags: string[];
  subject?: string; kind?: string; owner: string; exportName?: string; hasPlay?: boolean }
export declare function walk(root: string, dir?: string): string[];
export declare function storyGlobs(root?: string): string[];
export declare function storyFiles(root?: string): { file: string; directory: string }[];
export declare function staticValue(node: unknown, consts?: Map<string, unknown>, depth?: number): unknown;
export declare function autoTitle(file: string, directory: string): string;
export declare function parseStoryFile(file: string, source: string, opts?: { directory?: string }): ParsedStoryFile;
export declare function loadMetas(root?: string): StaticMeta[];
export declare function flagshipOrder<M extends { name: string; flagship?: number }>(metas: readonly M[]): M[];
export declare function ownerOf(path: string, root?: string): string;
export declare function staticIndex(root?: string): { parsed: ParsedStoryFile[]; entries: IndexRecord[] };
export declare function builtIndex(indexPath: string, root?: string): { index: unknown; entries: IndexRecord[] };
export declare function isPlainObject(v: unknown): v is Record<string, unknown>;
