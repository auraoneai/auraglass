/** add — fixture registry: diamond dedupe, true cycle exit-1, cssVars merge,
 *  dependency install collection, alias/target honoring, stamps, --source. */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { addCommand } from '../../src/commands/add.js';
import { CliError } from '../../src/cli/errors.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agadd-'));
const capture = () => {
  const buf: string[] = [];
  const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
  return { buf, stop: () => spy.mockRestore() };
};
function reg(items: Record<string, object>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agreg-'));
  for (const [name, item] of Object.entries(items)) {
    fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(item));
  }
  return dir;
}
const cmp = (name: string, extra: object = {}) => ({
  name, type: 'registry:component',
  files: [{ path: `${name}.tsx`, type: 'registry:component', content: `export const ${name.replace(/[^a-z0-9]/gi, '')}=1;\n` }],
  ...extra,
});

describe('add', () => {
  it('fails 4/1 on missing registry item', async () => {
    const dir = tmp();
    const code = await addCommand(['no-such-item'], { cwd: dir, json: true, silent: true, yes: true }).catch((e) => e.code);
    expect([1, 4]).toContain(code);
  });

  it('diamond deps: D fetched once; order deps-before-parents', async () => {
    const dir = tmp();
    const regDir = reg({
      a: cmp('a', { registryDependencies: ['b', 'c'] }),
      b: cmp('b', { registryDependencies: ['d'] }),
      c: cmp('c', { registryDependencies: ['d'] }),
      d: cmp('d'),
    });
    const cap = capture();
    try {
      await addCommand(['a'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true });
    } finally { cap.stop(); }
    const payload = JSON.parse(cap.buf.join(''));
    expect(payload.added).toEqual(['d', 'b', 'c', 'a']);
    const dFiles = payload.files.filter((f: string) => f.includes(`${path.sep}d${path.sep}`) || f.includes('/d/'));
    expect(dFiles.length).toBe(1);
  });

  it('true cycle exits 1 with the path a -> b -> a', async () => {
    const dir = tmp();
    const regDir = reg({
      a: cmp('a', { registryDependencies: ['b'] }),
      b: cmp('b', { registryDependencies: ['a'] }),
    });
    try {
      await addCommand(['a'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true });
      throw new Error('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(CliError);
      expect((e as CliError).code).toBe(1);
      expect((e as CliError).message).toContain('a -> b -> a');
    }
  });

  it('two items with cssVars produce ONE merged @layer ag in the configured css', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '19.0.0' } }));
    fs.writeFileSync(path.join(dir, 'auraglass.json'), JSON.stringify({ css: { global: 'styles/app.css' } }));
    fs.mkdirSync(path.join(dir, 'styles'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'styles', 'app.css'), ':root { color: red; }\n');
    const regDir = reg({
      x: cmp('x', { cssVars: { ':root': { '--ag-a': '1px' }, '.dark': { '--ag-a': '2px' } } }),
      y: cmp('y', { cssVars: { ':root': { '--ag-b': '3px' } } }),
    });
    await addCommand(['x'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true });
    await addCommand(['y'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true });
    const css = fs.readFileSync(path.join(dir, 'styles', 'app.css'), 'utf8');
    expect(css.split('@layer ag').length - 1).toBe(1);
    expect(css).toContain('--ag-a: 1px;');
    expect(css).toContain('--ag-b: 3px;');
    expect(css).toContain('color: red;');
    /* .dark scope merged too */
    expect(css).toContain('.dark');
  });

  it('collects dependencies into the printed install command', async () => {
    const dir = tmp();
    const regDir = reg({ dep: cmp('dep', { dependencies: ['clsx@2', 'zod@3'] }) });
    const cap = capture();
    try {
      await addCommand(['dep'], { cwd: dir, registry: regDir, 'allow-no-git': true, 'no-install': true, json: true, silent: true });
    } finally { cap.stop(); }
    const payload = JSON.parse(cap.buf.join(''));
    expect(payload.install).toMatch(/clsx@2.*zod@3|zod@3.*clsx@2/);
  });

  it('honors target and writes the provenance stamp', async () => {
    const dir = tmp();
    const regDir = reg({ t: cmp('t', { files: [{ path: 'x.tsx', type: 'registry:component', content: 'export const t=1;\n', target: 'custom/dir/x.tsx' }] }) });
    await addCommand(['t'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true });
    const p = path.join(dir, 'custom/dir/x.tsx');
    expect(fs.existsSync(p)).toBe(true);
    const body = fs.readFileSync(p, 'utf8');
    expect(body.startsWith('// aura-glass-registry t@')).toBe(true);
    expect(body).toMatch(/sha256:[0-9a-f]{64}/);
  });

  it('resolves the components alias through tsconfig paths for writes and imports (REQ-PLAT-87)', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '19.0.0' } }));
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
      compilerOptions: { baseUrl: '.', paths: { '@/*': ['./src/*'] } },
    }));
    fs.writeFileSync(path.join(dir, 'auraglass.json'), JSON.stringify({ aliases: { components: '@/components' } }));
    const regDir = reg({
      widget: cmp('widget', {
        files: [{ path: 'widget.tsx', type: 'registry:component', content: "import { x } from '@/components/ui/lib';\nimport { y } from '@/lib/util';\nexport const widget = 1;\n" }],
      }),
    });
    await addCommand(['widget'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true });
    const written = path.join(dir, 'src', 'components', 'widget', 'widget.tsx');
    expect(fs.existsSync(written)).toBe(true);
    expect(fs.existsSync(path.join(dir, 'components', 'widget', 'widget.tsx'))).toBe(false);
    const body = fs.readFileSync(written, 'utf8');
    expect(body).toContain("from '@/components/lib'");
    expect(body).toContain("from '@/lib/util'");
  });

  it('rejects an item that fails the vendored registry-item schema (REQ-PLAT-87)', async () => {
    const dir = tmp();
    const regDir = reg({
      bogus: { name: 'bogus', type: 'not-a-registry-type', files: [{ path: 'b.tsx', content: 'x' }] },
    });
    const code = await addCommand(['bogus'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true })
      .catch((e) => (e as CliError).code);
    expect(code).not.toBe(0);
    expect(fs.existsSync(path.join(dir, 'components'))).toBe(false);
  });

  it('add app-frame (fixture) completes under 3s', async () => {
    const dir = tmp();
    const regDir = reg({ 'app-frame': cmp('app-frame') });
    const t0 = Date.now();
    await addCommand(['app-frame'], { cwd: dir, registry: regDir, 'allow-no-git': true, json: true, silent: true });
    expect(Date.now() - t0).toBeLessThan(3000);
  });
});
