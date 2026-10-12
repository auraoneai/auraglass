/**
 * REQ-CMP-135 / CMP-426 TODO policy shared by the consumer-4x jest leg
 * (tests/dx/consumer-4x-cmp.test.ts) and the remote L11 driver
 * (scripts/cmp/consumer-4x-l11.mjs): after `migrate 4to5` the cmp cases may
 * carry a TODO(aura-glass 5) marker only where the mapping tables cannot map
 * mechanically. Anything else is a migration gap on the CMP surface.
 *
 * Excused:
 *  - canonical-names `'<Name>' is compat-only in 5.0` for a compatOnly row
 *    (aura-glass/compat is the designed deprecation path);
 *  - prop-grammar markers that trace to an unmappable row reachable from the
 *    element: `to: null`, a `todo` note, a dotted/structured target, a
 *    migration note in place of a prop name, or a dynamic value on a
 *    value-mapped prop.
 *
 * `components` is CompiledMappings.components (4.x name -> { to, compatOnly, props }).
 */

/** Rows reachable from a post-migration element name: its own rows plus the
 * rows of every 4.x name renamed onto it. */
export function rowsFor(components, name) {
  const rows = [...(components[name]?.props ?? [])];
  for (const [old, c] of Object.entries(components)) {
    if (c.to === name && old !== name) rows.push(...(c.props ?? []));
  }
  return rows;
}

const isPropTarget = (to) => /^[A-Za-z_$][\w$-]*(?::[^\s]+)?$/.test(to);

/** Row the tables cannot apply mechanically. */
export function isUnmappableRow(r) {
  return r.to === null || typeof r.todo === 'string' || r.to.includes('.') || !isPropTarget(r.to);
}

/** @param {{ transform?: string, reason: string }} todo */
export function isExcusedTodo(todo, components) {
  const compat = /^'(.+?)' is compat-only in 5\.0/.exec(todo.reason);
  if (compat) return components[compat[1]]?.compatOnly === true;
  if (todo.transform !== undefined && todo.transform !== 'prop-grammar') return false;
  // `<Name> <from>: <note>` (to: null / todo) | `<Name> <from> -> <target>` (dotted / note)
  let m = /^(\S+) (\S+?)(?:: | -> )/.exec(todo.reason);
  if (m) {
    const [, name, from] = m;
    return rowsFor(components, name).some((r) => r.from === from && isUnmappableRow(r));
  }
  // `<Name>.<prop>: <todo>` | `<Name>.<prop> value is dynamic` | `<Name>.<prop>="v" needs structured migration`
  m = /^(\S+?)\.([A-Za-z][\w-]*)(?:: | value is dynamic|="[^"]*" needs structured migration)/.exec(todo.reason);
  if (m) {
    const [, name, prop] = m;
    const rows = rowsFor(components, name).filter((r) => r.from === prop || r.to === prop || r.from.startsWith(`${prop}:`));
    if (/ value is dynamic/.test(todo.reason)) return rows.some((r) => r.values !== undefined);
    return rows.some(isUnmappableRow);
  }
  return false;
}
