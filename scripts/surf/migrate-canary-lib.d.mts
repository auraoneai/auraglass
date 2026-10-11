// Types for scripts/surf/migrate-canary-lib.mjs (REQ-SURF-15).
export interface CanaryTodo { transform: string; reason: string; doc: string; line?: number }
export interface CanaryCase {
  file: string;
  families: string[];
  subset: 'flagship' | 'chart' | 'report';
  handlerOnlyItems?: number;
  render?: { export: string; props: Record<string, unknown> };
  renderExempt?: string;
}
export interface CanaryManifest { from: string; cases: CanaryCase[] }
export interface CaseResult {
  file: string;
  subset: CanaryCase['subset'];
  todos: CanaryTodo[];
  markers: number;
  handlerButtons: number;
  ok: boolean;
  failures: string[];
}
export declare const TODO_PREFIX: string;
export declare const SUBSETS: readonly string[];
export declare const CASE_GLOB_SUFFIX: string;
export declare function listCaseFiles(dir: string): string[];
export declare function validateManifest(manifest: unknown, caseFiles: string[]): string[];
export declare function stripTsNocheck(source: string): string;
export declare function countMarkers(source: string): number;
export declare function countHandlerButtons(source: string): number;
export declare function evaluateCase(c: Pick<CanaryCase, 'file' | 'subset' | 'handlerOnlyItems'> & Partial<CanaryCase>, input: { todos: CanaryTodo[]; source: string }): CaseResult;
export declare function reviveProps(value: unknown): unknown;
