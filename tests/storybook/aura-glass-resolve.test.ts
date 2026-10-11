/**
 * @jest-environment node
 */
/* REQ-QUAL-56 (REQ-FIN-106, FIN-452): AG_STORYBOOK_DIST=1 resolves `aura-glass[/<subpath>]` through package
   exports to dist/ and redirects src/ modules to their dist twins; the dev server resolves to entry sources. */
import { afterAll, describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { InlineConfig, Plugin } from 'vite';
import {
  auraGlassResolve, distTwin, exportKey, resolveMode, sourceAliases, withAuraGlassResolution,
} from '../../.storybook/build/aura-glass-resolve';

const root = mkdtempSync(join(tmpdir(), 'ag-sb-resolve-'));
afterAll(() => rmSync(root, { recursive: true, force: true }));
const put = (rel: string, text = '') => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };
put('package.json', JSON.stringify({ name: 'aura-glass', exports: {
  '.': { types: './dist/index.d.ts', default: './dist/index.js', css: './dist/styles.css' },
  './theme': { types: './dist/theme/public.d.ts', default: './dist/theme/public.js' },
  './charts': { types: './dist/charts/index.d.ts', default: './dist/charts/index.js' },
  './styles.css': './dist/styles.css',
} }));
put('build/exports.manifest.json', JSON.stringify({ version: 1, entries: [
  { subpath: '.', source: 'src/index.ts', default: 'dist/index.js' },
  { subpath: './theme', source: 'src/theme/public.ts', default: 'dist/theme/public.js' },
] }));
for (const f of ['src/index.ts', 'src/theme/public.ts', 'src/theme/index.ts', 'src/theme/AuraGlassProvider.tsx', 'src/root/mat.ts', 'src/theme/x.css']) put(f);
for (const f of ['dist/index.js', 'dist/theme/public.js', 'dist/theme/AuraGlassProvider.js', 'dist/styles.css']) put(f);

type Ctx = { error(msg: string): never; resolve(source: string, importer?: string): Promise<{ id: string; external?: boolean } | null> };
function harness(plugin: Plugin, resolved: Record<string, string> = {}) {
  const ctx: Ctx = {
    error(msg) { throw new Error(msg); },
    async resolve(source) { return resolved[source] ? { id: resolved[source]! } : null; },
  };
  const hook = plugin.resolveId as unknown as (this: Ctx, s: string, i: string | undefined, o: object) => Promise<unknown>;
  return (source: string, importer?: string) => hook.call(ctx, source, importer, {});
}

describe('aura-glass resolution (REQ-QUAL-56)', () => {
  it('AG_STORYBOOK_DIST=1 selects dist mode; anything else is source mode', () => {
    expect(resolveMode({ AG_STORYBOOK_DIST: '1' })).toBe('dist');
    expect(resolveMode({ AG_STORYBOOK_DIST: '0' })).toBe('source');
    expect(resolveMode({})).toBe('source');
    expect(exportKey('aura-glass')).toBe('.');
    expect(exportKey('aura-glass/ai')).toBe('./ai');
    expect(exportKey('aura-glass-x')).toBeNull();
  });

  it('dist mode resolves the root, subpaths and CSS through package exports to dist/', async () => {
    const resolveId = harness(auraGlassResolve({ root, mode: 'dist' }));
    await expect(resolveId('aura-glass', join(root, 'showcase/a.tsx'))).resolves.toBe(join(root, 'dist/index.js'));
    await expect(resolveId('aura-glass/theme', join(root, 'showcase/a.tsx'))).resolves.toBe(join(root, 'dist/theme/public.js'));
    await expect(resolveId('aura-glass/styles.css', undefined)).resolves.toBe(join(root, 'dist/styles.css'));
  });

  it('dist mode rejects a non-export subpath and an export that was not built', async () => {
    const resolveId = harness(auraGlassResolve({ root, mode: 'dist' }));
    await expect(resolveId('aura-glass/internal', undefined)).rejects.toThrow(/not a package export/);
    await expect(resolveId('aura-glass/charts', undefined)).rejects.toThrow(/dist\/charts\/index\.js, which is not built; run `npm run build`/);
  });

  it('dist mode redirects src/ modules to their dist twin and reports modules without one', async () => {
    const reportPath = join(root, '.artifacts/qual/resolution.json');
    const plugin = auraGlassResolve({ root, mode: 'dist', reportPath });
    const resolveId = harness(plugin, {
      '../../src/theme/AuraGlassProvider': join(root, 'src/theme/AuraGlassProvider.tsx'),
      '../../src/root/mat': join(root, 'src/root/mat.ts'),
      '../src/theme/x.css': join(root, 'src/theme/x.css'),
      './helper': join(root, 'stories/helper.ts'),
    });
    const importer = join(root, '.storybook/contract/StoryFrame.tsx');
    await expect(resolveId('../../src/theme/AuraGlassProvider', importer)).resolves.toBe(join(root, 'dist/theme/AuraGlassProvider.js'));
    await expect(resolveId('../../src/root/mat', importer)).resolves.toEqual({ id: join(root, 'src/root/mat.ts') });
    await expect(resolveId('../src/theme/x.css', importer)).resolves.toEqual({ id: join(root, 'src/theme/x.css') });
    await expect(resolveId('./helper', join(root, 'stories/a.stories.tsx'))).resolves.toEqual({ id: join(root, 'stories/helper.ts') });
    await expect(resolveId('./x.js', join(root, 'dist/index.js'))).resolves.toBeNull(); // dist-internal imports untouched
    (plugin.buildEnd as unknown as () => void)();
    expect(JSON.parse(readFileSync(reportPath, 'utf8'))).toEqual({
      version: 1, mode: 'dist', packageImports: {}, redirectedToDist: 1, sourceFallbacks: ['src/root/mat.ts', 'src/theme/x.css'],
    });
    expect(distTwin(root, join(root, 'src/theme/AuraGlassProvider.tsx'))).toBe(join(root, 'dist/theme/AuraGlassProvider.js'));
    expect(distTwin(root, join(root, 'stories/helper.ts'))).toBeNull();
  });

  it('source mode (dev server) aliases aura-glass to the entry sources and leaves relative imports alone', async () => {
    const resolveId = harness(auraGlassResolve({ root, mode: 'source' }), { '../../src/root/mat': join(root, 'src/root/mat.ts') });
    await expect(resolveId('aura-glass', undefined)).resolves.toBe(join(root, 'src/index.ts'));
    await expect(resolveId('aura-glass/theme', undefined)).resolves.toBe(join(root, 'src/theme/public.ts'));
    await expect(resolveId('aura-glass/styles.css', undefined)).resolves.toBe(join(root, 'dist/styles.css'));
    await expect(resolveId('../../src/root/mat', join(root, '.storybook/x.tsx'))).resolves.toBeNull();
  });

  it('dist mode refuses src/ and @/ aliases; source mode allows them', () => {
    const withAlias: InlineConfig = { resolve: { alias: { '@': join(root, 'src'), react: join(root, 'node_modules/react') } } };
    expect(sourceAliases(withAlias, root)).toEqual([`@ → ${join(root, 'src')}`]);
    expect(sourceAliases({ resolve: { alias: [{ find: 'x', replacement: join(root, 'src/x.ts') }] } }, root)).toHaveLength(1);
    expect(() => withAuraGlassResolution(withAlias, { root, mode: 'dist' })).toThrow(/remove these aliases: @ →/);
    const dev = withAuraGlassResolution(withAlias, { root, mode: 'source' });
    expect(dev.define).toEqual({ __AG_STORYBOOK_DIST__: 'false' });
    const dist = withAuraGlassResolution({ plugins: [] }, { root, mode: 'dist' });
    expect((dist.plugins as Plugin[])[0]!.name).toBe('aura-glass:resolve');
    expect(dist.define).toEqual({ __AG_STORYBOOK_DIST__: 'true' });
  });
});
