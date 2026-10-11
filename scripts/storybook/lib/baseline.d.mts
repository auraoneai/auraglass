export interface GateViolation { check: string; rule: string; key: string; owner: string; file?: string; message: string }
export interface BaselineRow { check: string; rule: string; key: string; owner: string; file?: string }
export interface Baseline { version?: 1; expires?: 'RC-1'; rows: BaselineRow[]; missing?: boolean }
export declare const BASELINE_PATH: string;
export declare const CHECKS: string[];
export declare function rowKey(r: { check: string; rule: string; key: string }): string;
export declare function baselineExpired(version: string): boolean;
export declare function loadBaseline(root?: string, path?: string): Baseline;
export declare function compare<V extends GateViolation>(violations: V[], baseline: { rows: BaselineRow[] }, opts: { checks: string[]; version: string }):
  { expired: boolean; introduced: V[]; baselined: V[]; stale: BaselineRow[]; expiredRows: BaselineRow[] };
export declare function initBaseline(violations: GateViolation[], root?: string, path?: string): number;
export declare function pruneBaseline(violations: GateViolation[], checks: string[], root?: string, path?: string): number;
export declare function formatByOwner(violations: GateViolation[]): string;
export declare function packageVersion(root?: string): string;
