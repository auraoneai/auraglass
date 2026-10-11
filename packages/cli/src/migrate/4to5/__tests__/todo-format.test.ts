/** TODO marker format (S-38): `// TODO(aura-glass 5): <reason>, see <doc>`. */
import { describe, expect, it } from '@jest/globals';
import { todoLine } from '../todo.js';
describe('todo format', () => {
  it('matches verbatim spec', () => {
    expect(todoLine('why', 'where.md')).toBe('// TODO(aura-glass 5): why, see where.md');
  });
});
