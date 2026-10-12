/* REQ-CMP-22: every CMP-owned meta is complete — budgetKb equals the
   size-budgets fragment row, material/apg/tier present, and each migration
   row carries props + selectors. */
import { describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');

/* row id -> meta names covered (shared/aggregate rows expanded) */
const ROW_EXPANSIONS: Record<string, string[]> = {
  'Checkbox+CheckboxGroup': ['Checkbox', 'CheckboxGroup'],
  'icon-glyph-each': ['Icon'],
  'aura-glass/primitives': ['Label', 'Slot', 'VisuallyHidden', 'Portal', 'FocusScope', 'DismissableLayer'],
};

function budgetRows(): Record<string, number> {
  const frag = readFileSync(join(ROOT, 'fragments/size-budgets/cmp.ts'), 'utf8');
  const kb: Record<string, number> = {};
  for (const line of frag.split('\n')) {
    const m = line.match(/\{ id: '([^']+)'.*limitBytes: (\d+), kind: 'js' \}/);
    if (!m) continue;
    const id = m[1] as string;
    const bytes = m[2] as string;
    const covered = ROW_EXPANSIONS[id] ?? (id.includes('+') || id.includes('/') || id === 'controls-all-families' ? [] : [id]);
    for (const n of covered) kb[n] = parseInt(bytes, 10) / 1024;
  }
  return kb;
}

interface MetaLite {
  name: string; owner: string; tier: string; budgetKb?: number; flagship?: number; entry?: string; rsc?: string;
  material?: { layer: string }; apg?: string;
  migration: { from: string; props?: unknown; selectors?: unknown }[];
}

function metas(): { file: string; meta: MetaLite }[] {
  const files = execSync('find src -name "*.meta.ts"', { cwd: ROOT }).toString().trim().split('\n');
  return files.map((f) => {
    const t = readFileSync(join(ROOT, f), 'utf8');
    const mod = require(join(ROOT, f)) as { default?: MetaLite } & Record<string, MetaLite>;
    const meta = mod.default ?? Object.values(mod).find((v) => v && typeof v === 'object' && 'name' in (v as object));
    return { file: f, meta: meta as MetaLite };
  }).filter((r) => r.meta?.owner === 'CMP');
}

describe('REQ-CMP-22 meta completeness', () => {
  const rows = budgetRows();
  const all = metas();

  it('has CMP metas', () => expect(all.length).toBeGreaterThan(50));

  it.each(all.map((r) => [r.meta.name, r] as const))('%s has a budget row and budgetKb == limitBytes/1024 (contract S-44: KiB)', (_n, { file, meta }) => {
    expect(rows[meta.name]).toBeDefined();
    expect({ file, got: meta.budgetKb }).toEqual({ file, got: rows[meta.name] });
  });

  it.each(all.map((r) => [r.meta.name, r] as const))('%s fills material/apg/tier', (_n, { file, meta }) => {
    expect({ file, tier: meta.tier }).toEqual({ file, tier: expect.stringMatching(/^(T0|T1|T2|preview)$/) });
    expect({ file, layer: meta.material?.layer }).toEqual({ file, layer: expect.stringMatching(/^(chrome|overlay|transient|content)$/) });
    expect(typeof meta.apg).toBe('string');
  });

  it.each(all.map((r) => [r.meta.name, r] as const))('%s migration rows carry props + selectors', (_n, { file, meta }) => {
    for (const row of meta.migration) {
      expect(row.props).toBeDefined();
      expect(row.selectors).toBeDefined();
      const sel = row.selectors as Record<string, string>;
      for (const [from, to] of Object.entries(sel)) {
        expect(from).toMatch(/^\.|role=/);
        expect(to).toMatch(/data-ag-part|data-state|^\.ag-/);
      }
    }
  });

  /* REQ-CMP-22 tier rule: `T1` flagships (1–13 controls, 15–21 overlays), `T2` core, `T0` layout/type/icon.
     The numbering is the CMP PRD §5.3/§5.4 headings (architecture §11.2): a CMP meta outside this table is not a
     flagship, and a flagship number never names a component the PRD did not give it. */
  const CMP_FLAGSHIPS: Record<number, readonly string[]> = {
    1: ['Button'], 2: ['IconButton'], 3: ['Toolbar', 'ToggleGroup'], 4: ['SegmentedControl'], 5: ['Switch'],
    6: ['Slider'], 7: ['Checkbox', 'CheckboxGroup'], 8: ['RadioGroup'], 9: ['Field', 'Fieldset', 'Form', 'TextField'],
    10: ['SearchField'], 11: ['Select'], 12: ['Combobox'], 13: ['NumberField'],
    15: ['Dialog'], 16: ['AlertDialog'], 17: ['Sheet'], 18: ['Popover'], 19: ['Tooltip'], 20: ['Menu'], 21: ['Toast'],
  };
  const isCmpFlagship = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && ((n >= 1 && n <= 13) || (n >= 15 && n <= 21));

  it.each(all.map((r) => [r.meta.name, r] as const))('%s: tier T1 iff flagship in 1–13/15–21; T0 is layout/type/icon only', (_n, { file, meta }) => {
    const got = { file, tier: meta.tier, flagship: meta.flagship ?? null };
    if (meta.tier === 'T1') expect({ ...got, inRange: isCmpFlagship(meta.flagship) }).toEqual({ ...got, inRange: true });
    if (meta.flagship !== undefined) expect({ ...got, inRange: isCmpFlagship(meta.flagship) }).toEqual({ ...got, tier: 'T1', inRange: true });
    if (meta.tier === 'T0') {
      expect(got.flagship).toBeNull();
      // layout/type/icon set: server components on the root or ./icons, or the ./primitives KEEP set
      expect({ file, ok: meta.entry === './primitives' || (meta.rsc === 'server' && (meta.entry === '.' || meta.entry === './icons')) }).toEqual({ file, ok: true });
    }
  });

  it('flagship numbers name exactly the PRD components (Accordion is T2 core; Menu is 20)', () => {
    const byNumber: Record<number, string[]> = {};
    for (const { meta } of all) if (meta.flagship !== undefined) (byNumber[meta.flagship] ??= []).push(meta.name);
    for (const names of Object.values(byNumber)) names.sort();
    const want = Object.fromEntries(Object.entries(CMP_FLAGSHIPS).map(([n, names]) => [n, [...names].sort()]));
    expect(byNumber).toEqual(want);
  });
});
