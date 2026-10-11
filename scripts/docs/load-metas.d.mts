/* Types for scripts/docs/load-metas.mjs (REQ-PLAT-100). */
import type { ComponentMeta } from '../../src/contracts/components';

export declare const slugify: (name: string) => string;
export declare function evalMetaModule(file: string): Record<string, unknown>;
export interface MetaRecord { meta: ComponentMeta; file: string }
export declare function loadMetas(root: string): {
  metas: MetaRecord[];
  conflicts: Array<{ name: string; kept: string; dropped: string }>;
};
