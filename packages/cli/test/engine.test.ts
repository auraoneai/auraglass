/** migrate 4to5 engine: order, report schema, dry-run, safety (PLAT-320..323,303/304). */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMigration, selectTransforms, loadCompiledMappings, TRANSFORM_ORDER } from '../src/migrate/4to5/index.js';
import { migrateCommand } from '../src/commands/migrate.js';

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
    fs.writeFileSync(path.join(dir, 'a.tsx'), `import { Nav } from 'aura-glass/navigation';\nexport const x = <Nav/>;\n`);
    const r = await runMigration({ cwd: dir, dryRun: true });
    expect(fs.readFileSync(path.join(dir, 'a.tsx'), 'utf8')).toContain('aura-glass/navigation');
    expect(r.report.version).toBe(1);
    expect(Array.isArray(r.report.files)).toBe(true);
    expect(r.report.summary.filesChanged).toBe(1);
    expect(r.diffs.size).toBe(1);
  });

  it('write mode rewrites the file and report lists changes', async () => {
    const dir = tmp();
    const f = path.join(dir, 'a.tsx');
    fs.writeFileSync(f, `import { Nav } from 'aura-glass/navigation';\nexport const x = <Nav/>;\n`);
    fs.writeFileSync(path.join(dir, '.git'), 'x'); // marker so the guard is bypassed with --allow-no-git
    const code = await migrateCommand(['4to5'], { cwd: dir, 'allow-no-git': true, silent: true });
    expect(code).toBe(0);
    const out = fs.readFileSync(f, 'utf8');
    expect(out).toContain(`from 'aura-glass'`);
    expect(out).not.toContain('aura-glass/navigation');
  });

  it('unchanged files are not reported', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'clean.tsx'), `import { Button } from 'aura-glass';\nexport const x = <Button/>;\n`);
    const r = await runMigration({ cwd: dir });
    expect(r.report.files.length).toBe(0);
  });

  it('todo files flag hasTodos', async () => {
    const dir = tmp();
    // GlassChat hits the spec-driven ai-chat area transform — line-neutral.
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
    // Assert on PLAT-owned rows only: sibling stream fragments may be seeds
    // (on release/4.x they always are), but plat rows must be present on both
    // lines for `migrate 4to5` to do its job.
    expect(m.components['GlassProvider']?.to).toBe('AuraGlassProvider');
    expect(m.components['AuraGlassProvider4']?.to).toBe('AuraGlassProvider');
    expect(m.subpaths['aura-glass/styles']).toBe('aura-glass/styles.css');
    expect(m.subpaths['aura-glass/navigation']).toBe('aura-glass');
    expect(m.deps.some((d) => d.pkg === 'aura-glass' && d.range === '^5.0.0')).toBe(true);
    expect(Object.keys(m.removed).length).toBeGreaterThan(0);
  });
});
