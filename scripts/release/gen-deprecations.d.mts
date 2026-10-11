/* Types for scripts/release/gen-deprecations.mjs (REQ-PLAT-25, REQ-PLAT-105).
   Row inputs stay loose: tests feed partial fixture rows. */
import type { DeprecationEntry } from '../../src/contracts/fragments';
import type { RegisterItem } from '../docs/lib/migration-guide.mjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;
export type LoadedEntry = DeprecationEntry & { stream: string; file: string };
export declare function loadEntries(root?: string): Promise<LoadedEntry[]>;
export declare function jsonOut(entries: readonly Row[]): string;
export declare function tsTable(entries: readonly Row[]): string;
export declare function docsMd(entries: readonly Row[], breaking?: readonly Row[]): string;
export declare function genSchema(tsModule: unknown, opts?: { contractsFile?: string }): string;
export declare function loadBreakingRegister(path: string): RegisterItem[];
export declare function outputs(entries: readonly Row[], opts?: { line?: string; breaking?: readonly Row[] }): { json: string; ts: string; docs: string };
export declare function main(argv?: string[], opts?: { root?: string }): Promise<0 | 1>;
