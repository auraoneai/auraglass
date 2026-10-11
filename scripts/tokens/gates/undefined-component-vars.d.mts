/* Type declarations for undefined-component-vars.mjs (REQ-FIN-11), so TS tests can import it. */
export interface UndefinedVarsBaselineRow { file: string; owner: string; reqFin: string; expires: string; vars: string[]; [key: string]: unknown }
export const REPLACEMENTS: Record<string, string>;
export function replacementFor(name: string): string;
export const REPLACEMENT_TABLE: string;
export function contractVars(): Promise<Set<string>>;
export function manifestVars(manifestPath?: string): Set<string>;
export function varUses(css: string): { name: string; line: number }[];
export function evaluate(o: {
  files: { file: string; css: string }[]; allowed: Set<string>; baseline: unknown[];
  today?: string | null; rc1Date?: string | null; atRc?: boolean;
}): { findings: string[]; baselined: number };
