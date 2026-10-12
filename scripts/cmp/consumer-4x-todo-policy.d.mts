/* Types for consumer-4x-todo-policy.mjs (REQ-CMP-135) so the typed jest leg
   tests/dx/consumer-4x-cmp.test.ts imports it without implicit any (TS7016). */
export interface MappingRowLike {
  from: string;
  to: string | null;
  todo?: string;
  values?: unknown;
}

export interface MappingComponentLike {
  to?: string;
  compatOnly?: boolean;
  props?: MappingRowLike[];
}

export type MappingComponents = Record<string, MappingComponentLike>;

export declare function rowsFor(components: MappingComponents, name: string): MappingRowLike[];

export declare function isUnmappableRow(r: MappingRowLike): boolean;

export declare function isExcusedTodo(
  todo: { transform?: string; reason: string },
  components: MappingComponents,
): boolean;
