/** REQ-CMP-135 / CMP-426: consumer-4x cmp cases — run `migrate 4to5` over each
 * frozen case and assert 0 TODO(aura-glass 5) markers on mechanically mappable
 * props (G-08). Unmappable props (mapping rows with `to: null` or a `todo`
 * note) are expected to mark; a TODO on a prop the tables map mechanically is
 * a bug. The remote L11 leg additionally compiles the same files on the 4.x
 * line; this jest leg is the always-on half. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { runOnSource, selectTransforms, loadCompiledMappings } from '../../packages/cli/src/migrate/4to5/index';

const FIX = path.join(__dirname, '..', 'fixtures', 'consumer-4x', 'cases', 'cmp');
const mappings = loadCompiledMappings();
const all = selectTransforms(undefined);

const cases = fs.existsSync(FIX)
  ? fs.readdirSync(FIX).filter((f) => f.endsWith('.tsx'))
  : [];

/** new-name -> old names (renames may target dotted members like Toast.Provider) */
const byNewName = new Map<string, string[]>();
for (const [old, c] of Object.entries(mappings.components)) {
  if (!c.to || c.to === old) continue;
  (byNewName.get(c.to) ?? byNewName.set(c.to, []).get(c.to)!).push(old);
}

/** Prop rows reachable from a post-migration component name. */
function rowsFor(exportName: string): Array<{ from: string; to: string | null; todo?: string }> {
  const olds = byNewName.get(exportName) ?? [];
  return [
    ...(mappings.components[exportName]?.props ?? []),
    ...olds.flatMap((o) => mappings.components[o]?.props ?? []),
  ];
}

/** A TODO is legitimate only when it traces to an unmappable prop row or a
 * compat-only routing (aura-glass/compat is the designed deprecation path). */
function todoIsUnmappableProp(reason: string): boolean {
  const compat = /^'(.+?)' is compat-only/.exec(reason);
  if (compat) {
    return mappings.components?.[compat[1]!]?.compatOnly === true;
  }
  // Reason shapes: `<Name> <prop>: <note>` | `<Name>.<prop> ...` | `<Name> <from> -> <to>: <note>`
  const m = /^(\S+?)(?:\.| )(\S+?)(?::| )/.exec(reason);
  if (!m) return false;
  const [, name, prop] = m;
  const rows = rowsFor(name!) as Array<{ from: string; to: string | null; todo?: string }>;
  const hit = rows.find((r) => r.from === prop || r.to === prop);
  return hit !== undefined && (hit.to === null || typeof hit.todo === 'string');
}

describe('consumer-4x cmp cases', () => {
  it('manifest covers all 13 names', () => {
    const m = JSON.parse(fs.readFileSync(path.join(FIX, 'manifest.json'), 'utf8'));
    const covered = new Set(m.cases.flatMap((c: { covers: string[] }) => c.covers));
    for (const name of [
      'GlassButton', 'GlassInput', 'GlassSelectCompound', 'GlassSwitch', 'GlassCheckbox',
      'GlassModal', 'GlassDrawer', 'GlassPopover', 'GlassTooltip', 'GlassDropdownMenu',
      'GlassToast', 'GlassCard', 'Typography',
    ]) {
      expect(covered.has(name)).toBe(true);
    }
    expect(cases.length).toBe(3);
  });

  for (const f of cases) {
    it(`${f}: migrate leaves 0 TODOs on mechanically mappable props`, () => {
      const source = fs.readFileSync(path.join(FIX, f), 'utf8');
      const r = runOnSource({ path: f, abs: path.join(FIX, f), kind: 'code', source }, all, {
        mappings,
        docBase: 'docs',
      });
      const bad = r.todos
        .filter((t) => !todoIsUnmappableProp(t.reason))
        .map((t) => t.reason);
      expect(bad).toEqual([]);
    });
  }
});
