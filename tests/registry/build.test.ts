/* tests/registry/build.test.ts — REQ-PLAT-94 behaviors on fixture roots
   (PLAT-353): schema+meta validation, certified-SHA publication, omitted→
   report, GA fail, determinism, generated base theme, size limits. */
import { describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build, emit } from '../../scripts/registry/build.mjs';

const SHA = 'abc1234def56789012345678901234567890abcd';

function fixture(items: Record<string, any>) {
  const root = mkdtempSync(join(tmpdir(), 'ag-reg-'));
  mkdirSync(join(root, 'registry/schema'), { recursive: true });
  writeFileSync(join(root, 'registry/schema/registry-item.json'), readFileSync(join(__dirname, '../../registry/schema/registry-item.json')));
  writeFileSync(join(root, 'package.json'), '{"name":"x","version":"5.0.0-rc.1"}');
  for (const [kind, list] of Object.entries(items)) {
    for (const [id, item] of Object.entries(list as Record<string, any>)) {
      const dir = join(root, 'registry', kind, id);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'registry-item.json'), JSON.stringify(item));
      writeFileSync(join(dir, 'index.tsx'), 'export const X = () => null;\n');
    }
  }
  return root;
}
const meta = (over: object = {}) => ({ auraglass: { owner: 'PLAT', surface: 'block', client: true, components: ['Button'], ga: true, ...over } });
const item = (name: string, over: object = {}) => ({
  $schema: 'https://ui.shadcn.com/schema/registry-item.json', name, type: 'registry:block', title: name,
  files: [{ path: 'index.tsx', type: 'registry:item' }], meta: meta(), ...over,
});

describe('registry build', () => {
  it('publishes certified items, omits uncertified ones into the report', () => {
    const root = fixture({ blocks: { good: item('good', { meta: meta({ certified: SHA }) }), bad: item('bad') } });
    const { published, report, errors } = build({ root, sha: SHA });
    expect(errors).toEqual([]);
    expect(published).toEqual(['auraglass', 'good']);
    expect(report.items.find((i) => i.name === 'bad')?.status).toBe('omitted');
    expect(readFileSync(join(root, 'apps/docs/public/r/good.json'), 'utf8')).toContain('"content"');
    expect(existsSync(join(root, 'apps/docs/public/r/bad.json'))).toBe(false);
    expect(existsSync(join(root, 'apps/docs/public/r/v/5.0.0-rc.1/good.json'))).toBe(true);
    expect(existsSync(join(root, 'packages/registry/index.json'))).toBe(true);
    rmSync(root, { recursive: true });
  });

  it('fails an invalid item with its schema errors', () => {
    const root = fixture({ blocks: { broken: { name: 'Broken Name', type: 'registry:block' } } });
    const { errors, report } = build({ root, sha: SHA });
    expect(errors.length).toBeGreaterThan(0);
    expect(report.items.find((i) => i.name === 'Broken Name')?.status).toBe('invalid');
    rmSync(root, { recursive: true });
  });

  it('fails a GA-tag build when a GA block is uncertified', () => {
    const root = fixture({ blocks: { bad: item('bad') } });
    const { errors } = build({ root, sha: SHA, gaTag: 'v5.0.0' });
    expect(errors.some((e) => e.includes('GA build omits bad'))).toBe(true);
    rmSync(root, { recursive: true });
  });

  it('is byte-identical across runs', () => {
    const root = fixture({ blocks: { good: item('good', { meta: meta({ certified: SHA }) }) } });
    build({ root, sha: SHA });
    const a = readFileSync(join(root, 'registry/registry.json'), 'utf8');
    build({ root, sha: SHA });
    expect(readFileSync(join(root, 'registry/registry.json'), 'utf8')).toBe(a);
    rmSync(root, { recursive: true });
  });

  it('emits the real tree: base published, owner items pending certification', () => {
    const root = join(__dirname, '..', '..');
    const { published, report, errors } = build({ root, write: false });
    expect(errors).toEqual([]);
    expect(published).toContain('auraglass');
    expect(report.items.filter((i) => i.status === 'omitted').length).toBeGreaterThan(0);
  });

  it('generated base cssVars bridge the shadcn names to --ag-* vars', () => {
    const root = fixture({});
    const { index } = build({ root, sha: SHA });
    const base = index.items.find((i) => i.name === 'auraglass');
    expect(base.cssVars.light['--foreground']).toContain('--ag-on-surface');
    expect(base.cssVars.dark['--border']).toBe('var(--ag-surface-rim)');
    expect(base.css).toContain('@import "aura-glass/styles.css" layer(ag);');
    expect(base.css).not.toContain('tailwind'); // tailwind import only for v4 targets
    rmSync(root, { recursive: true });
  });

  it('adds the tailwind import only for Tailwind v4 targets', () => {
    const root = fixture({});
    const { index: i4 } = build({ root, sha: SHA, tailwind4: true });
    const base4 = i4.items.find((i) => i.name === 'auraglass');
    expect(base4.css).toContain('@import "aura-glass/tailwind.css";');
    rmSync(root, { recursive: true });
  });

  it('theme.radius bridges to --ag-surface-radius and deps are exactly aura-glass@^5', () => {
    const root = fixture({});
    const { index } = build({ root, sha: SHA });
    const base = index.items.find((i) => i.name === 'auraglass');
    expect(base.cssVars.theme.radius).toBe('var(--ag-surface-radius)');
    expect(base.dependencies).toEqual(['aura-glass@^5']);
    rmSync(root, { recursive: true });
  });

  it('fails when the manifest misses a referenced --ag-* var', () => {
    const root = fixture({});
    mkdirSync(join(root, 'manifest'), { recursive: true });
    writeFileSync(join(root, 'manifest/m.json'), JSON.stringify({ tokens: [] }));
    const { errors, report } = build({ root, sha: SHA, manifest: join(root, 'manifest/m.json') });
    expect(errors.some((e) => e.includes('manifest misses vars'))).toBe(true);
    expect(report.base.missingCssVars.length).toBeGreaterThan(0);
    rmSync(root, { recursive: true });
  });

  it('enforces the size limits', () => {
    const huge = item('huge', { meta: meta({ certified: SHA }), description: 'x'.repeat(200 * 1024) });
    const root = fixture({ blocks: { huge } });
    const { report, errors } = build({ root, sha: SHA });
    expect(errors.some((e) => e.includes('exceeds'))).toBe(true);
    expect(report.items.find((i) => i.name === 'huge')?.status).toBe('invalid');
    rmSync(root, { recursive: true });
  });
});
