import type { GateViolation } from './baseline.mjs';
import type { ParsedStoryFile } from './story-static.mjs';
export declare const STORY_TAGS: string[];
export declare const STORY_KINDS: string[];
export declare const REQUIRED_FLAGSHIP_STORIES: string[];
export declare const AG_KEYS: string[];
export declare const FLAGSHIP_COUNT: number;
type MetaLike = { name: string; owner: string; flagship?: number; file?: string; [k: string]: unknown };
export declare function validateStoryContract(parsed: ParsedStoryFile[], metas: readonly MetaLike[],
  apg: { references: readonly { storyId: string; owner: string; spec: string }[] }, ownerFor?: (file: string) => string): GateViolation[];
export declare function validateRepository(root?: string): GateViolation[];
export declare function docsPageViolations(metas: readonly MetaLike[]): GateViolation[];
