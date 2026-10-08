/** TODO marker discipline (S-38): the only allowed shape, verbatim. */

export const TODO_MARKER = '// TODO(aura-glass 5): <reason>, see <doc>';
export const TODO_PREFIX = 'TODO(aura-glass 5):';

export interface TodoItem {
  transform: string;
  reason: string;
  doc: string;
  line?: number;
}

export function todoLine(reason: string, doc: string): string {
  return `// TODO(aura-glass 5): ${reason}, see ${doc}`;
}

export function cssTodoLine(reason: string, doc: string): string {
  return `/* TODO(aura-glass 5): ${reason}, see ${doc} */`;
}

/** Scan a source string for TODO markers authored by transforms. */
export function findTodos(source: string): Array<{ index: number; text: string }> {
  const out: Array<{ index: number; text: string }> = [];
  let idx = 0;
  while (true) {
    const i = source.indexOf(TODO_PREFIX, idx);
    if (i === -1) return out;
    const end = source.indexOf('\n', i);
    out.push({ index: i, text: source.slice(i, end === -1 ? undefined : end) });
    idx = i + TODO_PREFIX.length;
  }
}

export function lineOf(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i += 1) {
    if (source.charCodeAt(i) === 10) line += 1;
  }
  return line;
}
