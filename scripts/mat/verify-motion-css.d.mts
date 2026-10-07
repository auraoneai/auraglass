export interface MotionCssIssue { line: number; column: number; rule: string; message: string }
export interface CheckCssResult { issues: MotionCssIssue[]; literals: Record<string, number> }
export declare function checkCss(source: string, filename: string): CheckCssResult;
