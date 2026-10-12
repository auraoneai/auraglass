export interface MotionCssIssue { file: string; line: number; col: number; rule: string; message: string }
export interface CheckCssResult { issues: MotionCssIssue[]; literals: Record<string, number> }
export declare function checkCss(source: string, filename: string, opts?: { registered?: ReadonlySet<string> }): CheckCssResult;

/** REQ-MAT-42/-51: ANIMATABLE read from src/contracts/motion.ts. */
export declare function readAnimatable(file?: string): string[];
export declare const ALLOWED_PROPS: ReadonlySet<string>;
export declare const BANNED_IN_MOTION: ReadonlySet<string>;
export declare function collectRegistered(sources: readonly string[]): Set<string>;
export declare function registeredCustomProps(): ReadonlySet<string>;
export declare function selectorGated(selector: string): boolean;

export interface BaselineRow { file: string; owner: string; reqFin?: string; req?: string; rule?: string; expires: 'RC-1' }
export declare const DEFAULT_BASELINE: string;
export declare const MOTION_CSS_BASELINE: string;
export declare const BASELINE_RULE: 'ungated-loop';
export declare const BASELINABLE: ReadonlySet<string>;
export declare function rcReached(version: string | undefined): boolean;
export declare function applyBaseline(
  issues: readonly MotionCssIssue[],
  baseline: readonly unknown[],
  opts?: { checkedFiles?: readonly string[] | null; version?: string | undefined },
): string[];
