// @auraglass/mcp package manifest invariants (REQ-FIN-09: `npm test -w packages/mcp` runs real
// assertions). Server behaviour (tools/list, initialize timing, --permission run) is
// REQ-FIN-44 / PLAT-106's packages/mcp/test/tools.test.ts and lands with next-fin/c-agent-dx.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
const tsconfig = JSON.parse(readFileSync(join(pkgDir, 'tsconfig.json'), 'utf8'));

const shipped = (rel) => {
  const p = rel.replace(/^\.\//, '');
  if (p === 'package.json') return true;
  return pkg.files.some((f) => p === f || p.startsWith(`${f}/`));
};

describe('@auraglass/mcp package.json', () => {
  test('is the public ESM package @auraglass/mcp', () => {
    expect(pkg.name).toBe('@auraglass/mcp');
    expect(pkg.type).toBe('module');
    expect(pkg.private).toBe(false);
    expect(pkg.publishConfig).toEqual(expect.objectContaining({ access: 'public' }));
  });

  test('the auraglass-mcp bin is shipped and is the tsc output of a source file that exists', () => {
    const bin = pkg.bin['auraglass-mcp'];
    expect(typeof bin).toBe('string');
    expect(shipped(bin)).toBe(true);
    const { outDir, rootDir } = tsconfig.compilerOptions;
    const rel = relative(outDir, bin.replace(/^\.\//, ''));
    expect(rel.startsWith('..')).toBe(false);
    expect(existsSync(join(pkgDir, rootDir, rel.replace(/\.js$/, '.ts')))).toBe(true);
  });

  test('the bundled data export is inside `files`', () => {
    expect(pkg.exports['./data/mcp-data.json']).toBe('./data/mcp-data.json');
    const notShipped = Object.values(pkg.exports).filter((t) => !shipped(t));
    expect(notShipped).toEqual([]);
  });

  test('the MCP SDK dependency is exact-pinned', () => {
    expect(pkg.dependencies['@modelcontextprotocol/sdk']).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('engines.node matches the repo floor (>=20.19)', () => {
    expect(pkg.engines.node).toBe('>=20.19');
  });
});
