/* Types for scripts/docs/lib/migration-guide.mjs (REQ-PLAT-105). */
import type { DeprecationEntry } from '../../../src/contracts/fragments';
import type { MigrationRow } from '../../../src/contracts/components';

export interface RegisterItem { id: string; title?: string; affected?: string; cdIn?: string; path?: string; codemod: string | null; escapeHatch?: string | null }
export interface CatalogueTransform { id: string; kind: 'core' | 'area'; automation: string; doc: string }
export interface Catalogue { version: number; transforms: CatalogueTransform[] }
export interface FixtureFile { path: string; lang: string; text: string }
export interface MigrationMeta { name: string; entry: string; file: string; migration: readonly MigrationRow[]; selectors?: Array<{ from: string; to: string }> }
export interface RemovedRow { stream: string; symbol: string; entry: string; reason: string; registryItem?: string; doc: string }
export type GuideEntry = Pick<DeprecationEntry, 'id' | 'doc'> & Partial<DeprecationEntry>;
export interface GuideInputs {
  template: string; catalogue: Catalogue; metas: MigrationMeta[]; removed: RemovedRow[];
  registry: Set<string>; entries: DeprecationEntry[]; register: RegisterItem[];
}

export declare const TEMPLATE_PATH: string;
export declare const GUIDE_OUT: string;
export declare const GUIDE_ROUTE: string;
export declare const CATALOGUE_PATH: string;
export declare const SECTIONS: readonly string[];
export declare const GLASS_TOKEN: RegExp;
export declare function entryAnchor(entry: { id: string; doc: string }): string;
export declare const bAnchor: (bId: string) => string;
export declare const codemodAnchor: (id: string) => string;
export declare function breakingMd(entries: readonly GuideEntry[], register?: readonly RegisterItem[], opts?: { depth?: number; codemodHref?: (id: string) => string }): string;
export declare function fixtureCases(root: string, id: string): Array<{ stream: string; name: string; dir: string }>;
export declare function basicFixture(root: string, id: string): { stream: string; input: FixtureFile; output: FixtureFile } | null;
export declare function codemodsMd(root: string, catalogue: Catalogue, register?: readonly RegisterItem[], opts?: { depth?: number }): string;
export declare function byComponentMd(metas: readonly MigrationMeta[], opts?: { depth?: number }): string;
export declare function removedMd(removedRows: readonly RemovedRow[], entries: readonly GuideEntry[], registryNames: Set<string>, opts?: { depth?: number }): string;
export declare function assembleGuide(template: string, parts: Record<string, string>): string;
export declare const handWritten: (template: string) => string;
export declare function registryNames(root: string): Set<string>;
export declare function loadCodemodRemoved(root: string): Promise<RemovedRow[]>;
export declare function loadMigrationMetas(root: string): Promise<MigrationMeta[]>;
export declare function guideInputs(root: string, o: { entries: DeprecationEntry[]; register: RegisterItem[] }): Promise<GuideInputs>;
export declare function buildGuide(root: string, inputs: GuideInputs): string;
