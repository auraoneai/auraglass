/** Byte preservation (REQ-PLAT-90): untouched attributes, comments and
 *  formatting survive every transform; attributes next to rewritten ones keep
 *  their exact text and order; a file no transform changes is never rewritten. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMigration, runOnSource, selectTransforms, loadCompiledMappings } from '../index.js';
const m = loadCompiledMappings();
const run = (src: string, only?: string[]) =>
  runOnSource({ path: 'x.tsx', abs: 'x', kind: 'code', source: src }, selectTransforms(only), { mappings: m, docBase: 'docs' });

/** One case per preserved attribute kind, each written with odd spacing/quoting. */
const PRESERVED: Array<[kind: string, text: string]> = [
  ['aria-*', 'aria-label="Save draft"'],
  ['role', "role='switch'"],
  ['id', 'id={`save-${n}`}'],
  ['htmlFor', 'htmlFor="field-1"'],
  ['tabIndex', 'tabIndex={-1}'],
  ['data-testid', 'data-testid="save"'],
  ['className', 'className={cx("a",  b)}'],
  ['style', 'style={{ marginTop: 4 ,  color: "red" }}'],
  ['ref', 'ref={(el) => { node = el; }}'],
  ['key', 'key={item.id}'],
  ['spread', '{...rest}'],
];

describe('preserve', () => {
  it('preserves non-aura code byte-for-byte', () => {
    const src = `// keep me\nimport React from 'react';\n\nexport const x = () => <div  className="a"   data-x="1" />;\n`;
    expect(run(src).final).toBe(src);
  });

  it('preserves attributes next to renamed ones', () => {
    const src = `import { GlassButton } from 'aura-glass';\nconst x = <GlassButton  variant="primary"   aria-label="hi"  data-z  />;\n`;
    const r = run(src, ['prop-grammar']);
    expect(r.final).toContain('aria-label="hi"');
    expect(r.final).toContain('data-z');
  });

  it.each(PRESERVED)('%s survives the full transform chain byte-for-byte', (_kind, attr) => {
    const src = `import { GlassButton } from 'aura-glass';\nexport const x = (rest: object, n: number, cx: any, b: string, item: { id: string }, node: unknown) => (\n  <GlassButton variant="primary" ${attr} />\n);\n`;
    const r = run(src);
    expect(r.final).not.toBe(src); // the element itself was migrated
    expect(r.changes.length).toBeGreaterThan(0);
    expect(r.final).toContain(attr);
  });

  it('all preserved attributes keep their relative order on one migrated element', () => {
    const attrs = PRESERVED.map(([, t]) => t);
    const src = `import { GlassButton } from 'aura-glass';\nexport const x = (rest: object, n: number, cx: any, b: string, item: { id: string }, node: unknown) => (\n  <GlassButton\n    ${attrs.join('\n    ')}\n    variant="primary"\n  />\n);\n`;
    const r = run(src);
    expect(r.changes.length).toBeGreaterThan(0);
    const positions = attrs.map((a) => r.final.indexOf(a));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    // lines between the preserved attributes are untouched (indentation and newlines)
    expect(r.final).toContain(attrs.join('\n    '));
  });

  it('a file no transform changes is not rewritten (no write, no report row)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-preserve-'));
    try {
      const untouched = `// unrelated\nimport React from 'react';\nexport const y = () => <span  role="note"  >ok</span>;\n`;
      const migrated = `import { GlassButton } from 'aura-glass';\nexport const z = () => <GlassButton variant="primary" />;\n`;
      fs.writeFileSync(path.join(dir, 'untouched.tsx'), untouched);
      fs.writeFileSync(path.join(dir, 'migrated.tsx'), migrated);
      const before = fs.statSync(path.join(dir, 'untouched.tsx')).mtimeMs;
      const { report, writes } = runMigration({ cwd: dir, transforms: ['imports-subpaths', 'canonical-names', 'prop-grammar'] });
      const written = [...writes.keys()].map((k) => path.basename(k));
      expect(written).toContain('migrated.tsx');
      expect(written).not.toContain('untouched.tsx');
      expect(report.files.map((f) => f.path)).not.toContain('untouched.tsx');
      expect(fs.readFileSync(path.join(dir, 'untouched.tsx'), 'utf8')).toBe(untouched);
      expect(fs.statSync(path.join(dir, 'untouched.tsx')).mtimeMs).toBe(before);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
