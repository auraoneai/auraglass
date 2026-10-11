/* Type declarations for policy.mjs (PRD-1 §4.4, D-27), so TS tests can import it. */
export type ChangeClass = 'C-I' | 'C-I-VF' | 'C-E' | 'C-D' | 'C-D-IL' | 'C-B';
export type Bump = 'patch' | 'minor' | 'major';
export const CLASSES: ChangeClass[];
export const CLASS_NAMES: Record<ChangeClass, string>;
export const CLASS_RANK: Record<ChangeClass, number>;
export const CLASS_CHANGESET_FLOOR: Record<ChangeClass, Bump>;
export const BUMP_RANK: Record<Bump, number>;
export const TARGETS: string[];
export const ALLOWED: Record<string, ChangeClass[]>;
export function allowedOn(cls: string, target: string): boolean;
export function checkMarkers(cls: string, opts?: { hasBang?: boolean; hasBreaking?: boolean; line?: string }): string[];
export function checkChangesetBump(cls: string, bumps: string[]): string[];
export const VISUAL_TOLERANCE: { pixelmatchThreshold: number; includeAA: boolean; changedRatio: number };
export function installLevelViolations(opts: {
  depEntry: unknown; version: string; sources?: Record<string, unknown>; doctorReport?: unknown; releaseNotes?: unknown;
}): string[];
export interface RelPaths {
  root: string;
  artifacts: (line: string) => string;
  visualReport: (line: string) => string;
  changeClassOut: string;
  deprecationCoverage: string;
  changeClassesDoc: string;
  visualFixesDir: string;
  exceptionAllowlist: string;
  breakingRegister: string;
  ledgerCorrections: string;
  decisionsDir: string;
  removalsDir: string;
  schemaPath: string;
  deprecationsJson: string;
  generatedTs: string;
  docsMigrationOut: string;
  capabilityLedger: string;
  fragmentsDir: string;
  packageJson: string;
}
export function relPaths(root?: string): RelPaths;
