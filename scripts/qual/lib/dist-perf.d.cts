/* Types for scripts/qual/lib/dist-perf.cjs (REQ-QUAL-46). QUAL-owned. */
export interface ScanHit { rule: string; line: number; snippet: string; detail?: string }
export interface Owner { owner: string; wp: string; reqFin: string }
export interface Violation extends Partial<Owner> { file: string; rule: string; dist?: string; line?: number; snippet?: string; detail?: string; baselined?: boolean }
export interface BaselineRow { file: string; rule: string; owner: string; reqFin: string; expires: string }
export interface Problem { kind: 'new-offender' | 'stale-baseline-row' | 'expired-baseline-row' | 'malformed-baseline-row' | 'missing-dist'; row: any }
export interface BundleResult { bytes: number; bannedModules: string[] }
export interface DistPerfReport {
  version: 1; tool: string; req: 'REQ-QUAL-46'; mode: 'scan' | 'bytes' | 'all'; sha: string | null; runnerTags: string | null;
  input: { kind: 'dir' | 'tarball' | 'repo'; path: string; sha256?: string }; scanned: { files: number };
  violations: Violation[]; problems: Problem[]; bytes: Record<string, number>; bundles: Record<string, BundleResult>;
  exports?: string[]; method: Record<string, unknown> | null; status: 'pass' | 'fail';
}
export interface RunOptions { pkg?: string; tarball?: string; mode?: 'scan' | 'bytes' | 'all'; baseline?: string | false; today?: Date }
export const ROOT: string;
export const DEFAULT_BASELINE: string;
export const BANNED_MODULE_RE: RegExp;
export const MUTATION_OBSERVER_ALLOW: string[];
export const RULES: string[];
export function transitionProperties(text: string): string[];
export function scanSource(text: string, fileName?: string): ScanHit[];
export function resolveInput(opts?: { pkg?: string; tarball?: string }): { kind: 'dir' | 'tarball' | 'repo'; pkgDir: string; path: string; sha256?: string };
export function reqFinFor(src: string, wp: string): string;
export function ownerOf(src: string): Owner;
export function sourceOf(distRel: string, text: string): string;
export function rootExports(pkgDir: string): Promise<string[]>;
export function measureExport(pkgDir: string, name: string, opts?: { nodePaths?: string[] }): Promise<BundleResult>;
export function expiryPassed(expires: string, version: string, today?: Date): boolean;
export function applyBaseline(violations: Violation[], baseline: any[], opts?: { version?: string; today?: Date }): Problem[];
export function run(opts?: RunOptions): Promise<DistPerfReport>;
export function baselineRows(violations: Violation[], expires?: string): BaselineRow[];
