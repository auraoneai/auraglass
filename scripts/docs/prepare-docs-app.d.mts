/* Types for scripts/docs/prepare-docs-app.mjs (REQ-PLAT-99). Row shapes are
   the docs app's own (apps/docs/nav.config.ts). */
import type { ApiRow, ComponentRow, NavData, SceneRow, SurfaceRow } from '../../apps/docs/nav.config';

export declare const slugify: (name: string) => string;
export declare function evalTsModule(file: string, allowImport: (spec: string) => unknown): Record<string, unknown>;
export declare function collectComponents(root: string): { components: ComponentRow[]; conflicts: Array<{ name: string; kept: string; dropped: string }> };
export declare function collectSurfaces(root: string, opts?: { sha?: string | null }): SurfaceRow[];
export declare function collectApi(root: string): ApiRow[];
export declare function collectScenes(root: string): SceneRow[];
export declare function collectExamples(appDir: string): Array<{ slug: string; name: string; path: string }>;
export declare function renderExamplesModule(examples: Array<{ slug: string; name: string; path: string }>): string;
export declare function collectNavData(root?: string, opts?: { sha?: string | null }): NavData;
export declare function main(root?: string): 0;
