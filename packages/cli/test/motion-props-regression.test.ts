import { describe, expect, it } from '@jest/globals';
import { motionProps } from '../src/migrate/4to5/transforms/motion-props.js';
import { loadCompiledMappings, runOnSource, selectTransforms } from '../src/migrate/4to5/index.js';
import type { FileUnit } from '../src/migrate/4to5/transforms/shared.js';

const unit = (source: string): FileUnit => ({ path: 'input.tsx', abs: '/fixture/input.tsx', kind: 'code', source });
const mappings = loadCompiledMappings();
const transform = (source: string, renamedFrom = new Map<string, Set<string>>()) =>
  motionProps.run(unit(source), { file: unit(source), mappings, docBase: 'docs', renamedFrom });

describe('motion props preserve current component contracts', () => {
  it.each(['TreeView', 'Backdrop', 'Sheet'])('preserves native %s presets across import forms', (name) => {
    for (const source of [
      `import { ${name} } from 'aura-glass'; const x = <${name} preset="custom" />;`,
      `import { ${name} as Local } from 'aura-glass'; const x = <Local preset="custom" />;`,
      `import * as AG from 'aura-glass'; const x = <AG.${name} preset="custom" />;`,
      `import * as AG from 'aura-glass'; const x = <AG.${name}.Root preset="custom" />;`,
    ]) expect(transform(source).source).toBe(source);
  });

  it('does not edit props belonging to unrelated packages or local components', () => {
    for (const source of [
      `import { GlassButton } from 'aura-glass-other'; const x = <GlassButton disableAnimation />;`,
      `const GlassButton = () => null; const x = <GlassButton motionPreset="spring" />;`,
    ]) expect(transform(source).source).toBe(source);
  });

  it('removes obsolete motion props from legacy namespace components', () => {
    const source = `import * as AG from 'aura-glass'; const x = <AG.GlassButton disableAnimation />;`;
    expect(transform(source).source).not.toContain('disableAnimation');
  });

  it('removes legacy motion props after a canonical rename and is idempotent', () => {
    const source = `import { GlassButton } from 'aura-glass'; const x = <GlassButton disableAnimation motionPreset="spring" />;`;
    const transforms = selectTransforms(['canonical-names', 'motion-props']);
    const first = runOnSource(unit(source), transforms, { mappings, docBase: 'docs' });
    expect(first.final).not.toContain('disableAnimation');
    expect(first.final).not.toContain('motionPreset');
    expect(first.final).toContain('<Button');
    const second = runOnSource(unit(first.final), transforms, { mappings, docBase: 'docs' });
    expect(second.final).toBe(first.final);
    expect(second.changes).toEqual([]);
  });

  it('preserves the preset produced by the action-sheet prop migration', () => {
    const source = `import { GlassActionSheet } from 'aura-glass'; const x = <GlassActionSheet actions="actions" />;`;
    const transforms = selectTransforms(['canonical-names', 'prop-grammar', 'motion-props']);
    const result = runOnSource(unit(source), transforms, { mappings, docBase: 'docs' });
    expect(result.final).toContain('preset="actions"');
    expect(result.final).not.toContain('actions="actions"');
  });

  it('retains a target-owned preset even when the component was renamed in this run', () => {
    const source = `import { Sheet } from 'aura-glass'; const x = <Sheet preset="actions" disableAnimation />;`;
    const result = transform(source, new Map([['Sheet', new Set(['GlassActionSheet'])]]));
    expect(result.source).toContain('preset="actions"');
    expect(result.source).not.toContain('disableAnimation');
  });
});
