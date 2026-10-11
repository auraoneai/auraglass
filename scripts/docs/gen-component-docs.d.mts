/* Types for scripts/docs/gen-component-docs.mjs (REQ-PLAT-100). */
import type { ComponentMeta } from '../../src/contracts/components';
import type { PropRow } from './gen-props.mjs';

export declare const PUBLIC_DIR: string;
export declare const PAGES_DIR: string;
export declare const EXAMPLES_DIR: string;
export declare const TSDOC_BASELINE: string;
export interface ExampleFile { name: string; path: string; source: string }
export interface ReferenceComponent {
  name: string;
  slug: string;
  file: string;
  meta: ComponentMeta;
  props: PropRow[];
  examples: ExampleFile[];
}
export interface Reference {
  components: ReferenceComponent[];
  skipped: Array<{ name: string; file: string; reason: string }>;
  conflicts: Array<{ name: string; kept: string; dropped: string }>;
  props: Record<string, PropRow[]>;
  typesSource: string;
}
export interface TsdocBaselineRow { prop: string; owner?: string; reqFin?: string; expires: string }
export interface TierCoverage { documented: number; excused: number; total: number; undocumented: string[]; threshold: number | null; ratio: number }
export interface Coverage {
  tiers: Record<string, TierCoverage>;
  failures: Array<{ tier: string; ratio: number; threshold: number; undocumented: string[] }>;
  stale: string[];
  expired: string[];
  ok: boolean;
}
export declare const claimIds: (slug: string) => { size: string; perf: string };
export declare function collectExamples(root: string, slug: string): ExampleFile[];
export declare function buildReference(opts?: { root?: string; tarball?: string | null; requirePacked?: boolean; snapshotPath?: string | null }): Reference;
export declare function renderPublic(c: ReferenceComponent): string;
export declare function renderPage(c: ReferenceComponent, opts?: { claims?: Record<string, { value: unknown; unit?: string }> | null }): string;
export declare function sectionNames(md: string, heading: string): string[] | null;
export declare function tsdocThreshold(tier: string, version: string): number | null;
export declare function tsdocCoverage(components: ReferenceComponent[], version: string, baseline?: TsdocBaselineRow[]): Coverage;
export declare function baselineExpired(row: TsdocBaselineRow, version: string): boolean;
export declare function readTsdocBaseline(root: string): TsdocBaselineRow[] | null;
export declare function tsdocReportRows(components: ReferenceComponent[]): Array<TsdocBaselineRow & { tier: string; meta: string }>;
export declare function diffPublic(root: string, rendered: Map<string, string>): Array<{ file: string; kind: 'missing' | 'changed' | 'stale' }>;
export declare function run(opts?: {
  root?: string; check?: boolean; tsdoc?: boolean; tsdocReport?: string | null; tarball?: string | null;
  requirePacked?: boolean; snapshotPath?: string | null; log?: (msg: string) => void; error?: (msg: string) => void;
}): 0 | 1;
export declare function main(argv?: string[]): 0 | 1;
