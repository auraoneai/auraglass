/* tests/registry/schema.test.ts — every authored registry-item.json
   validates against the vendored shadcn schema + meta.auraglass (PLAT-352). */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { validate } from '../../scripts/registry/build.mjs';

const ROOT = join(__dirname, '..', '..');
const schema = JSON.parse(readFileSync(join(ROOT, 'registry/schema/registry-item.json'), 'utf8'));

function authoredItems() {
  const out: { id: string; kind: string; item: any }[] = [];
  for (const kind of ['base', 'blocks', 'items']) {
    const dir = join(ROOT, 'registry', kind);
    if (!existsSync(dir)) continue;
    for (const id of readdirSync(dir).sort()) {
      const file = join(dir, id, 'registry-item.json');
      if (existsSync(file)) out.push({ id, kind, item: JSON.parse(readFileSync(file, 'utf8')) });
    }
  }
  return out;
}

describe('registry schema', () => {
  it('discovers at least the base item', () => {
    expect(authoredItems().some((i) => i.item.type === 'registry:base')).toBe(true);
  });

  it.each(authoredItems().map((i) => [i.id, i] as const))('%s validates against the vendored schema', (_id, { item }) => {
    expect(validate(schema, item, item.name ?? 'item')).toEqual([]);
  });

  it('meta.auraglass declares owner, surface, client and components', () => {
    const errors = validate(schema, {
      name: 'x', type: 'registry:block', files: [{ path: 'a.tsx', type: 'registry:item' }],
      meta: { auraglass: { owner: 'PLAT', surface: 'block', client: true, components: ['Button'] } },
    });
    expect(errors).toEqual([]);
  });

  it('rejects a malformed item', () => {
    const errors = validate(schema, { name: 'Bad Name!', type: 'registry:block', files: [] });
    expect(errors.length).toBeGreaterThan(0);
  });
});
