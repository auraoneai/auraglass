/* Types for verify-size-budgets.mjs (REQ-PLAT-76) so typed callers such as
   tests/build/size-budgets-ratchet.test.ts import it without implicit any. */
export interface SizeBudgetRowLike {
  id: string;
  import: string;
  limitBytes: number;
  kind: string;
}

export declare function ratchetProblems(
  rows: SizeBudgetRowLike[],
  baseRows: Map<string, { limitBytes: number }> | null | undefined,
  commitMessages: string,
  changelogText: string,
): string[];

export declare function run(): Promise<void>;
