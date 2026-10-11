/* Types for scripts/docs/gen-props.mjs (REQ-PLAT-100). */
import type ts from 'typescript';

export declare const ROOT: string;
export declare const COMPILER_OPTIONS: ts.CompilerOptions;
export interface PropRow {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string | null;
  deprecated: string | null;
}
export interface TypesSource {
  kind: 'packed' | 'source';
  entries: Array<{ subpath: string; file: string }>;
  describe: string;
  isOwn(fileName: string): boolean;
  cleanup(): void;
}
export declare function findPackedTarball(root: string): string | null;
export declare function exportTypes(exportsMap: unknown): Array<{ subpath: string; file: string }>;
export declare function resolveTypesSource(opts?: { root?: string; tarball?: string | null; requirePacked?: boolean }): TypesSource;
export declare function createTypesProgram(source: TypesSource, opts?: { root?: string }): { program: ts.Program; checker: ts.TypeChecker };
export declare function moduleExports(program: ts.Program, checker: ts.TypeChecker, file: string): Map<string, ts.Symbol>;
export declare function isValueExport(checker: ts.TypeChecker, sym: ts.Symbol): boolean;
export declare function componentPropsType(checker: ts.TypeChecker, sym: ts.Symbol): ts.Type | null;
export declare function unwrapParens(text: string): string;
export declare function propRows(checker: ts.TypeChecker, propsType: ts.Type | null, isOwn: (f: string) => boolean): PropRow[];
export declare function extractProps(opts: { root?: string; source: TypesSource; wanted: Array<{ name: string; entry: string }> }): {
  props: Record<string, PropRow[]>;
  exported: Record<string, boolean>;
};
export declare function serializeProps(props: Record<string, PropRow[]>): string;
export declare function main(argv?: string[], root?: string): Promise<0>;
