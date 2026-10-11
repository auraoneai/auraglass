/* Types for react19-gate.mjs (consumed by tests/react19/*.test.ts). */
import type { CompilerOptions } from 'typescript';

export type React19Rule = 'forwardRef' | 'compiler';
export interface React19BaselineRow {
  rule: React19Rule;
  file: string;
  count: number;
  owner: string;
  reqFin: string;
  expires: 'RC-1';
}
export interface BaselineDiff { fresh: string[]; stale: string[]; malformed: string[] }

export const BASELINE_REL: string;
export const RULES: readonly React19Rule[];
export const BANNED_REACT_NAMED_IMPORT: RegExp;
export function ownerOf(file: string): { owner: string; reqFin: string };
export function walkFiles(dir: string, filter?: (p: string) => boolean, out?: string[]): string[];
export function srcFiles(root: string): string[];
export function srcCounterpart(root: string, distFile: string): string | null;
export function countForwardRefIdentifiers(fileName: string, text: string): number;
export function forwardRefOffenders(root: string): Map<string, number>;
export function elementRefReads(root: string, files: string[], options?: CompilerOptions): string[];
/** Rows as read from disk; diffBaseline reports any row that is not a valid React19BaselineRow as malformed. */
export function loadBaseline(root: string): React19BaselineRow[];
export function diffBaseline(rule: React19Rule, offenders: Map<string, number>, rows: readonly unknown[]): BaselineDiff;
export function rowsFor(rule: React19Rule, offenders: Map<string, number>): React19BaselineRow[];
