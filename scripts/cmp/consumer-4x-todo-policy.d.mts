/* Types for consumer-4x-todo-policy.mjs (REQ-CMP-135 / CMP-426). */
export interface MappingRow {
  from: string;
  to: string | null;
  values?: Record<string, unknown>;
  todo?: string;
}
export interface MappingComponent {
  to?: string;
  compatOnly: boolean;
  props?: MappingRow[];
}
export interface MigrationTodo {
  transform?: string;
  reason: string;
}
export function rowsFor(components: Record<string, MappingComponent>, name: string): MappingRow[];
export function isUnmappableRow(r: MappingRow): boolean;
export function isExcusedTodo(todo: MigrationTodo, components: Record<string, MappingComponent>): boolean;
