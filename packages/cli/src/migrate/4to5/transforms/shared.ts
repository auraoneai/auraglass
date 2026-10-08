/** Shared transform types + jscodeshift setup. */
import jscodeshift from 'jscodeshift';
import tsx from 'jscodeshift/parser/tsx.js';
import babylon from 'jscodeshift/parser/babylon.js';
import type { CompiledMappings } from '../mappings.js';
import type { TodoItem } from '../todo.js';

export const j = jscodeshift.withParser(tsx());
export const jbab = jscodeshift.withParser(babylon());

export interface FileUnit {
  /** project-relative path (posix). */
  path: string;
  /** absolute path. */
  abs: string;
  kind: 'code' | 'css' | 'json' | 'skip';
  source: string;
}

export interface Change {
  transform: string;
  description: string;
}

export interface TransformResult {
  source: string;
  changes: Change[];
  todos: TodoItem[];
}

export interface TransformCtx {
  file: FileUnit;
  mappings: CompiledMappings;
  docBase: string;
}

export interface Transform {
  id: string;
  run(unit: FileUnit, ctx: TransformCtx): TransformResult;
}

export const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts']);
export const CSS_EXTS = new Set(['.css', '.scss', '.sass', '.less']);

export function docRef(id: string, docBase = 'docs/auraglass-5'): string {
  return `${docBase}#${id}`;
}

export function hasTodoHeader(source: string): boolean {
  return source.includes('TODO(aura-glass 5):');
}

/** Replace JSX opening-element tag name text, preserving attributes byte-for-byte. */
export function renameJsxTag(source: string, from: string, to: string): { source: string; count: number } {
  let count = 0;
  const next = source.replace(new RegExp(`<${from}([\\s/>])`, 'g'), (m, tail: string) => {
    count += 1;
    return `<${to}${tail}`;
  }).replace(new RegExp(`</${from}>`, 'g'), (m: any) => {
    count += 1;
    return `</${to}>`;
  });
  return { source: next, count };
}
