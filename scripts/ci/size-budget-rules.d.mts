/* Types for size-budget-rules.mjs (REQ-PLAT-76) so typed callers such as
   tests/build/size-budgets-ratchet.test.ts import it without implicit any. */
export interface SizeBudgetRowLike {
  id: string;
  import: string;
  limitBytes: number;
  kind: string;
}

/** Row-id prefix of the derived compat rows (target row + 2048 B). */
export declare const COMPAT_ROW_PREFIX: 'plat:compat-';

/** Not-yet-public subpaths a row may name, mapped to the producer that ships them. */
export declare const AWAITING_PRODUCER: Readonly<Record<string, string>>;

/** PLAT provisional floors by row id. */
export declare const FLOORS: Readonly<Record<string, number>>;

export declare function isCompatRow(row: { id: string }): boolean;

export interface SizeBudgetBaselineRow { row: string; owner: string; reqFin: string; expires: 'RC-1' }

export declare function baselineProblems(
  baseline: unknown,
  results: Array<{ id: string; status: string }>,
): string[];

export declare function ratchetProblems(
  rows: SizeBudgetRowLike[],
  baseRows: Map<string, { limitBytes: number }> | null | undefined,
  commitMessages: string,
  changelogText: string,
): string[];
