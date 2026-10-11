// Types for scripts/qual/lint-stories.mjs (REQ-QUAL-55), for TypeScript tests.
export interface StoryGlassViolation { check: string; file: string; line: number | null; message: string; owner?: string; why?: string }
export interface StoryGlassBaselineRow { check: string; file: string; owner: string; reqFin: string; count: number }
export interface StoryGlassBaseline { version: 1; gate: 'story-glass'; expires: 'RC-1'; rows: StoryGlassBaselineRow[]; [k: string]: unknown }
export const ROOT: string;
export const CHECKS: string[];
export const BASELINE_PATH: string;
export const LEGACY_DECISION: string;
export const EXCLUDED: RegExp[];
export function reqFinFor(file: string, owner: string): string;
export function isLabPath(file: string): boolean;
export function lintCssText(text: string, file: string): StoryGlassViolation[];
export function compileMdx(code: string, file: string): Promise<string>;
export function lintSource(code: string, file: string): Promise<StoryGlassViolation[]>;
export function scanFiles(root?: string): string[];
export function ownerOf(path: string, root?: string): string;
export function lintRepo(root?: string, files?: string[]): Promise<{ files: string[]; violations: StoryGlassViolation[] }>;
export function baselineExpired(version: string): boolean;
export function loadBaseline(root?: string): StoryGlassBaseline | null;
export function classify(violations: StoryGlassViolation[], baseline: { rows: StoryGlassBaselineRow[] } | null, version: string): {
  expired: boolean; errors: StoryGlassViolation[]; reported: StoryGlassViolation[]; stale: StoryGlassBaselineRow[];
  expiredRows: StoryGlassBaselineRow[]; perStream: Record<string, Record<string, number>>;
};
export function initBaseline(violations: StoryGlassViolation[], root?: string): number;
export function pruneBaseline(violations: StoryGlassViolation[], root?: string): boolean;
export function main(argv?: string[], env?: Record<string, string | undefined>): Promise<number>;
