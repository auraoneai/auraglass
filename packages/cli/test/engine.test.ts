/** migrate 4to5 engine: order, report schema, dry-run, safety (PLAT-320..323,303/304). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMigration, selectTransforms, loadCompiledMappings, TRANSFORM_ORDER } from '../src/migrate/4to5/index.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ag4to5-'));

describe('migrate 4to5 engine', () => {
  it('TRANSFORM_ORDER is the frozen order', () => {
    expect(TRANSFORM_ORDER).toEqual([
      'imports-subpaths', 'providers', 'canonical-names', 'prop-grammar',
      'ai-chat', 'app-shell-slots', 'media-backdrops', 'reduced-motion-initial',
      'motion-imports', 'motion-props', 'dead-optical-props', 'css-vars', 'deps', 'removed',
    ]);
  });

  it('dry-run produces report + diffs, writes nothing', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'a.tsx'), `import { GlassButton } from 'aura-glass';\nexport const x = <GlassButton/>;\n`);
    const r = await runMigration({ cwd: dir, dryRun: true });
    expect(fs.readFileSync(path.join(dir, 'a.tsx'), 'utf8')).toContain('GlassButton');
    expect(r.report.version).toBe(1);
    expect(Array.isArray(r.report.files)).toBe(true);
    expect(r.report.summary.filesChanged).toBe(1);
    expect(r.diffs.size).toBe(1);
  });

  it('write mode rewrites the file and report lists changes', async () => {
    const dir = tmp();
    const f = path.join(dir, 'a.tsx');
    fs.writeFileSync(f, `import { GlassButton } from 'aura-glass';\nexport const x = <GlassButton variant="primary"/>;\n`);
    const r = await runMigration({ cwd: dir });
    const out = fs.readFileSync(f, 'utf8');
    expect(out).toContain('Button');
    expect(r.report.summary.filesChanged).toBe(1);
  });

  it('unchanged files are not reported', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'clean.tsx'), `import { Button } from 'aura-glass';\nexport const x = <Button/>;\n`);
    const r = await runMigration({ cwd: dir });
    expect(r.report.files.length).toBe(0);
  });

  it('todo files flag hasTodos', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 't.tsx'), `import { GlassChat } from 'aura-glass';\nexport const x = <GlassChat/>;\n`);
    const r = await runMigration({ cwd: dir });
    expect(r.hasTodos).toBe(true);
    expect(r.report.files[0]?.todos.length).toBeGreaterThan(0);
  });

  it('selectTransforms rejects unknown ids', () => {
    expect(() => selectTransforms(['nope'])).toThrow();
    expect(selectTransforms(undefined).length).toBe(TRANSFORM_ORDER.length);
  });

  it('compiled mappings load (S-39/S-50)', () => {
    const m = loadCompiledMappings();
    expect(Object.keys(m.components).length).toBeGreaterThan(50);
    expect(m.components['GlassButton']?.to).toBe('Button');
    expect(m.components['GlassButton']?.toEntry).toBe('aura-glass');
    expect(m.subpaths['aura-glass/styles']).toBe('aura-glass/styles.css');
    expect(Object.keys(m.removed).length).toBeGreaterThan(0);
  });
});
