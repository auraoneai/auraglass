/* Types for scripts/qual/lint-tests.mjs (REQ-QUAL-31). */
export type RuleId =
  | 'container-in-document'
  | 'expect-in-if'
  | 'unguarded-query-loop'
  | 'jsdom-animation-duration'
  | 'dom-snapshot-under-src'
  | 'jsdom-color-contrast'
  | 'missing-subject-return';
export type Phase = 'pre-rc' | 'rc';
export type Severity = 'error' | 'report';
export interface Diagnostic { rule: RuleId | 'parse-error'; line: number; column: number; message: string }
export interface OwnedDiagnostic extends Diagnostic { file: string; owner: string; severity: Severity }
export interface OwnershipRow { owner: string; match: (file: string) => boolean }
export interface LintReport {
  version: 1;
  gate: 'REQ-QUAL-31';
  phase: Phase;
  filesScanned: number;
  errors: number;
  reports: number;
  byOwner: Record<string, { error: number; report: number; rules: Record<string, number>; files: Record<string, number> }>;
  diagnostics: OwnedDiagnostic[];
}
export const RULE_IDS: readonly RuleId[];
export function lintTestSource(code: string, file: string): Diagnostic[];
export function loadOwnership(root?: string): OwnershipRow[];
export function ownerOf(file: string, rows: readonly OwnershipRow[]): string;
export function phaseFromEnv(env?: Record<string, string | undefined>): Phase;
export function severityFor(owner: string, phase: Phase): Severity;
export function listTestFiles(root?: string, prefixes?: readonly string[]): string[];
export function run(opts?: { root?: string; phase?: Phase; prefixes?: readonly string[]; files?: readonly string[] }): LintReport;
