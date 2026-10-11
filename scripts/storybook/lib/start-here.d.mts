export declare const START_HERE_GROUPS: readonly string[];
export declare const START_HERE_ID: string;
export declare const VERSION_LITERAL_RE: RegExp;
export declare const PATH_LINK_RE: RegExp;
export interface IndexEntryLike { type: 'story' | 'docs'; id: string; title: string; name: string; tags?: readonly string[] }
export interface IndexLike { entries: Record<string, IndexEntryLike> }
export interface StartHereData {
  version: string;
  counts: { flagships: number; core: number; stories: number; flows: number };
  groups: { name: string; count: number; path: string | null }[];
}
export declare function entryPath(e: IndexEntryLike): string;
export declare function computeStartHere(input: { index: IndexLike; metas: readonly { name: string; flagship?: number }[]; version: string }): StartHereData;
export declare function brokenPathLinks(text: string, index: IndexLike): string[];
