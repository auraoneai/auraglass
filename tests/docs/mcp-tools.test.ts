/**
 * @jest-environment node
 */
/* tests/docs/mcp-tools.test.ts — REQ-PLAT-106 (REQ-FIN-44). Replaces the old
   hand-rolled-server test (wrong tool names, 10 s init bound). Server
   behaviour lives in packages/mcp/test/tools.test.ts (npm test -w
   packages/mcp); this suite checks that scripts/docs/gen-mcp-data.mjs builds
   data/mcp-data.json { version, sha, components, registry, migrations } from
   the repo sources and nothing else. */
import { describe, expect, it, beforeAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { MAX_BYTES, generate } from '../../scripts/docs/gen-mcp-data.mjs';
import { loadMetas } from '../../scripts/docs/agent-data.mjs';

const root = join(__dirname, '..', '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const mcpPkg = JSON.parse(readFileSync(join(root, 'packages/mcp/package.json'), 'utf8'));

type Data = Awaited<ReturnType<typeof generate>>;
let data: Data;
let metas: Array<{ meta: { name: string; entry: string } }>;

beforeAll(async () => {
  data = await generate(root);
  metas = await loadMetas(root);
}, 60_000);

describe('gen-mcp-data', () => {
  it('has exactly the five top-level keys', () => {
    expect(Object.keys(data).sort()).toEqual(['components', 'migrations', 'registry', 'sha', 'version']);
  });

  it('stamps the aura-glass version and the source commit', () => {
    expect(data.version).toBe(pkg.version);
    const head = process.env.AG_RELEASE_SHA ?? process.env.CI_COMMIT_SHA
      ?? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    expect(data.sha).toBe(head);
  });

  it('has one component per meta (name + entry), each with import, parts and docs link', () => {
    expect(data.components.map((c) => `${c.name}@${c.entry}`).sort())
      .toEqual(metas.map(({ meta }) => `${meta.name}@${meta.entry === '.' ? 'aura-glass' : `aura-glass/${meta.entry.slice(2)}`}`).sort());
    for (const c of data.components) {
      expect(c.import).toBe(`import { ${c.name} } from '${c.entry}';`);
      expect(Array.isArray(c.parts)).toBe(true);
      expect(c.docs).toMatch(new RegExp(`/components/${c.slug}\\.md$`));
    }
  });

  it('has one registry record per registry/{base,blocks,items}/<id>', () => {
    const ids = ['base', 'blocks', 'items'].flatMap((k) => {
      const dir = join(root, 'registry', k);
      return existsSync(dir) ? readdirSync(dir).filter((id) => existsSync(join(dir, id, 'registry-item.json'))) : [];
    });
    const names = data.registry.map((r) => r.name);
    for (const id of ids) expect(names).toContain(id);
    expect(names).toContain('auraglass');
    for (const r of data.registry) expect(['certified', 'omitted', 'invalid', 'pending']).toContain(r.status);
  });

  it('puts the canonical-names rename first for every renamed 4.x symbol', () => {
    const renamed = Object.entries(data.migrations).filter(([, list]) => list.some((e) => e.transform === 'canonical-names'));
    expect(renamed.length).toBeGreaterThan(0);
    for (const [, list] of renamed) expect(list[0]?.transform).toBe('canonical-names');
    expect(data.migrations.GlassModal?.[0]).toEqual(expect.objectContaining({ transform: 'canonical-names', to: 'Dialog' }));
  });

  it('stays under the 5 MB cap', () => {
    expect(Buffer.byteLength(JSON.stringify(data))).toBeLessThanOrEqual(MAX_BYTES);
  });
});

describe('@auraglass/mcp manifest', () => {
  it('pins the SDK and zod exactly and has a runnable permission-scoped start script', () => {
    expect(mcpPkg.dependencies['@modelcontextprotocol/sdk']).toMatch(/^\d+\.\d+\.\d+$/);
    expect(mcpPkg.dependencies.zod).toMatch(/^\d+\.\d+\.\d+$/);
    expect(mcpPkg.scripts.start).toBe('node --permission --allow-fs-read=. dist/server.js');
    expect(mcpPkg.scripts.prepack).toBe('node scripts/build.mjs');
  });
});
