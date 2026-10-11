/** Byte preservation: untouched attributes/comments/formatting survive. */
import { describe, expect, it } from '@jest/globals';
import { runOnSource, selectTransforms, loadCompiledMappings } from '../index.js';
const m = loadCompiledMappings();
describe('preserve', () => {
  it('preserves non-aura code byte-for-byte', () => {
    const src = `// keep me\nimport React from 'react';\n\nexport const x = () => <div  className="a"   data-x="1" />;\n`;
    const r = runOnSource({ path: 'x.tsx', abs: 'x', kind: 'code', source: src }, selectTransforms(undefined), { mappings: m, docBase: 'docs' });
    expect(r.final).toBe(src);
  });
  it('preserves attributes next to renamed ones', () => {
    const src = `import { GlassButton } from 'aura-glass';\nconst x = <GlassButton  variant="primary"   aria-label="hi"  data-z  />;\n`;
    const r = runOnSource({ path: 'x.tsx', abs: 'x', kind: 'code', source: src }, selectTransforms(['prop-grammar']), { mappings: m, docBase: 'docs' });
    expect(r.final).toContain('aria-label="hi"');
    expect(r.final).toContain('data-z');
  });
});
