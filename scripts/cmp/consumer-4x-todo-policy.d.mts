/** Mapping-table prop row (CompiledMappings.components[name].props[i]). */
export interface MappingPropRow {
  from: string;
  to: string | null;
  todo?: string | undefined;
  values?: Record<string, unknown> | undefined;
}
/** CompiledMappings.components entry (4.x name -> { to, compatOnly, props }). */
export interface MappingComponent {
  to?: string | undefined;
  compatOnly?: boolean | undefined;
  props?: readonly MappingPropRow[] | undefined;
}
export type MappingComponents = Readonly<Record<string, MappingComponent>>;

export function rowsFor(components: MappingComponents, name: string): MappingPropRow[];
export function isUnmappableRow(r: MappingPropRow): boolean;
export function isExcusedTodo(todo: { transform?: string | undefined; reason: string }, components: MappingComponents): boolean;
