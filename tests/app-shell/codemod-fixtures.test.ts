/** @jest-environment node */
// REQ-SURF-14 (REQ-FIN-80): fixture inventory for fragments/codemods/surf.ts.
// The cli engine (packages/cli/test/fixtures.test.ts) runs every case
// byte-equal; this suite pins the inventory the acceptance names: >= 80 SURF
// cases in <id>/<case>/{input,output} layout, every renames[].from has a
// canonical-names case importing it from its 4.x entry, and every case dir
// is named by a transform the engine registers.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const FIXTURES = join(ROOT, 'fragments', 'codemods', 'surf', 'fixtures');
const ENGINE_IDS = new Set([
  'imports-subpaths', 'providers', 'canonical-names', 'prop-grammar',
  'ai-chat', 'app-shell-slots', 'media-backdrops',
  'reduced-motion-initial', 'motion-imports', 'motion-props',
  'dead-optical-props', 'css-vars', 'deps', 'removed',
]);

const fragment = require('../../fragments/codemods/surf') as {
  default: { renames?: Array<{ from: string; fromEntry: string; to: string; toEntry: string; compatOnly?: boolean }> };
};

function entryOf(e: string): string {
  if (e === '.') return 'aura-glass';
  if (e.startsWith('./')) return `aura-glass/${e.slice(2)}`;
  return e;
}

interface Case { id: string; name: string; input: string }
function cases(): Case[] {
  const out: Case[] = [];
  for (const id of readdirSync(FIXTURES).sort()) {
    const idDir = join(FIXTURES, id);
    if (!statSync(idDir).isDirectory()) continue;
    for (const name of readdirSync(idDir).sort()) {
      const dir = join(idDir, name);
      if (!statSync(dir).isDirectory()) continue;
      const input = ['input.tsx', 'input.ts', 'input.css', 'input.json'].map((f) => join(dir, f)).find((p) => existsSync(p));
      if (input) out.push({ id, name, input });
    }
  }
  return out;
}

describe('REQ-SURF-14 codemod fixture inventory', () => {
  const all = cases();

  it('has at least 80 SURF cases', () => {
    expect(all.length).toBeGreaterThanOrEqual(80);
  });

  it('names every case dir by a registered engine transform and pairs input/output', () => {
    for (const c of all) {
      expect(ENGINE_IDS.has(c.id)).toBe(true);
      const ext = c.input.slice(c.input.lastIndexOf('.'));
      expect(existsSync(join(FIXTURES, c.id, c.name, `output${ext}`))).toBe(true);
    }
  });

  it('gives every renames[].from a canonical-names case that imports it from its 4.x entry', () => {
    const renames = fragment.default.renames ?? [];
    expect(renames.length).toBeGreaterThanOrEqual(80);
    const sources = all.filter((c) => c.id === 'canonical-names').map((c) => readFileSync(c.input, 'utf8'));
    const missing = renames.filter((r) => !sources.some((s) => new RegExp(`import \\{[^}]*\\b${r.from}\\b[^}]*\\} from '${entryOf(r.fromEntry)}'`).test(s)));
    expect(missing.map((r) => r.from)).toEqual([]);
  });

  it('has no duplicate rename sources', () => {
    const froms = (fragment.default.renames ?? []).map((r) => r.from);
    expect(froms.filter((f, i) => froms.indexOf(f) !== i)).toEqual([]);
  });
});
