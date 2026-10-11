// tests/capability/no-alias-exports.test.ts — REQ-SURF-185.
// None of the twelve alias names is a value export of any entry barrel named in
// src/contracts/entries.ts (followed through `export *`). Registry items may
// legitimately export these names, so registry sources are out of scope. The
// first eight are rejected row X-R11; ModelPicker, QueryBuilder, TraceTree and
// Artifact belong to the registry-item-only rows X-35, X-29 and X-36 (not
// rejected: their capability ships as registry items, never as exports).
import { describe, expect, it } from '@jest/globals';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '../..');
const X_R11 = ['Autocomplete', 'TagInput', 'HoverCard', 'NotificationCenter', 'Banner', 'Lightbox', 'Dock', 'NavBar'];
const REGISTRY_ONLY: Record<string, string> = { ModelPicker: 'X-35', QueryBuilder: 'X-29', TraceTree: 'X-36', Artifact: 'X-36' };
const ALIASES = [...X_R11, ...Object.keys(REGISTRY_ONLY)];

const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

function resolve(from: string, spec: string): string | null {
  const base = join(dirname(from), spec).replace(/\.js$/, '');
  for (const c of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

/** Value-export names of a barrel, following relative `export *`. */
function valueExports(file: string, seen = new Set<string>()): Set<string> {
  const out = new Set<string>();
  if (seen.has(file) || !existsSync(file)) return out;
  seen.add(file);
  const src = strip(readFileSync(file, 'utf8'));
  for (const m of src.matchAll(/\bexport\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|function\*?|class|enum|abstract\s+class)\s+([A-Za-z_$][\w$]*)/g)) out.add(m[1]!);
  for (const m of src.matchAll(/\bexport\s+(type\s+)?\{([^}]*)\}/g)) {
    if (m[1]) continue;
    for (const part of m[2]!.split(',')) {
      const p = part.trim();
      if (!p || /^type\s/.test(p)) continue;
      out.add(p.split(/\s+as\s+/).pop()!.trim());
    }
  }
  for (const m of src.matchAll(/\bexport\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from/g)) out.add(m[1]!);
  for (const m of src.matchAll(/\bexport\s+\*\s+from\s+['"](\.[^'"]+)['"]/g)) {
    const r = resolve(file, m[1]!);
    if (r) for (const n of valueExports(r, seen)) out.add(n);
  }
  return out;
}

/** `<subpath>: <alias>` for every alias exported by an entries.ts barrel under root. */
function aliasHits(root: string): string[] {
  const entries = readFileSync(join(root, 'src/contracts/entries.ts'), 'utf8');
  const hits: string[] = [];
  for (const m of entries.matchAll(/\{\s*subpath:\s*'([^']+)',\s*source:\s*'([^']+\.tsx?)'/g)) {
    const names = valueExports(join(root, m[2]!));
    for (const a of ALIASES) if (names.has(a)) hits.push(`${m[1]}: ${a}`);
  }
  return hits;
}

describe('no alias exports (REQ-SURF-185)', () => {
  it('no alias name is a value export of any entry barrel', () => {
    expect(aliasHits(ROOT)).toEqual([]);
  });
  it('the barrel walk sees real exports (guards a vacuous scan)', () => {
    expect(valueExports(join(ROOT, 'src/ai/index.ts')).has('Thread')).toBe(true);
    expect(valueExports(join(ROOT, 'src/media/index.ts')).has('ImageViewer')).toBe(true);
  });
  it('adding `export { ModelPicker }` to src/ai/index.ts is caught', () => {
    const dir = mkdtempSync(join(tmpdir(), 'alias-'));
    mkdirSync(join(dir, 'src/contracts'), { recursive: true });
    mkdirSync(join(dir, 'src/ai/picker'), { recursive: true });
    writeFileSync(join(dir, 'src/contracts/entries.ts'), readFileSync(join(ROOT, 'src/contracts/entries.ts'), 'utf8'));
    writeFileSync(join(dir, 'src/ai/picker/ModelPicker.tsx'), 'export function ModelPicker() { return null; }\n');
    writeFileSync(join(dir, 'src/ai/index.ts'), "export { ModelPicker } from './picker/ModelPicker';\nexport * from './picker/ModelPicker';\n");
    expect(aliasHits(dir)).toEqual(['./ai: ModelPicker']);
  });
  it('X-R11 remains a rejected row naming every X-R11 alias', () => {
    const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8'));
    const r11 = ledger.rows.find((r: any) => r.id === 'X-R11');
    expect(r11.status).toBe('rejected');
    for (const a of X_R11) expect(r11.names).toContain(a);
  });
  it('ModelPicker, QueryBuilder, TraceTree, Artifact belong to registry-item rows without an export form', () => {
    const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8'));
    for (const [name, id] of Object.entries(REGISTRY_ONLY)) {
      const row = ledger.rows.find((r: any) => r.id === id);
      expect(row.form).toContain('registry-item');
      expect(row.form).not.toContain('export');
      expect(`${row.capability} ${row.names.join(' ')}`.toLowerCase().replace(/[^a-z]/g, '')).toContain(name.toLowerCase());
    }
  });
});
