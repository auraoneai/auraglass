/** Shared transform types + jscodeshift setup. */
/// <reference path="../../../types/jscodeshift.d.ts" />
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
  /** 1-based source line the change applies to (when the transform knows it). */
  line?: number;
  /** source text before the change (when the transform knows it). */
  before?: string;
  /** source text after the change (when the transform knows it). */
  after?: string;
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
  /**
   * Per-file provenance shared by the transforms of one run: 5.0 local JSX
   * name -> the 4.x export names canonical-names renamed onto it. prop-grammar
   * applies rows keyed on a 4.x name only to elements that were that 4.x name
   * in this run, so a second run over migrated code (where `Button` is the 5.0
   * export, not a GlassButton alias) changes nothing.
   */
  renamedFrom?: Map<string, Set<string>>;
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

/**
 * REQ-PLAT-90: the 4.x Glass* source names an area transform handles, read from
 * its stream-authored spec in the compiled mappings (never hard-coded in the
 * transform). `clause` selects the spec sentence(s) that describe one rewrite
 * (e.g. /images -> items/); without it every documented name is returned. Names
 * come back in spec order; a spec that documents none is a mapping error.
 */
const SPEC_GLASS_NAME = /\bGlass[A-Z][A-Za-z]+/g;
export function specNames(mappings: CompiledMappings, id: string, clause?: RegExp): string[] {
  const spec = mappings.areaSpecs[id];
  if (!spec) throw new Error(`migrate 4to5: no compiled spec for area transform '${id}'`);
  const sentences = clause ? spec.split(/(?<=[.;])\s+(?=[A-Z])/).filter((s) => clause.test(s)) : [spec];
  const names = [...new Set(sentences.flatMap((s) => s.match(SPEC_GLASS_NAME) ?? []))];
  if (!names.length) throw new Error(`migrate 4to5: spec '${id}' documents no Glass* name${clause ? ` for ${clause}` : ''}`);
  return names;
}

/** Escape a name for use inside a RegExp source. */
export function reEscape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
