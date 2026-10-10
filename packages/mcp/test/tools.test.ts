/* packages/mcp/test/tools.test.ts — REQ-PLAT-106 (REQ-FIN-44, AC-FIN-44).
   Spawns the built server (`pretest` runs scripts/build.mjs) under the Node
   permission model with read access to the package directory only, speaks
   MCP JSON-RPC over stdio, and checks: initialize ≤500 ms with version+sha
   in serverInfo, tools/list is exactly the five REQ tools, and the REQ
   examples (search_components "modal" → Dialog first; get_migration
   "GlassModal" → the canonical-names entry). */
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOL_NAMES, callTool, type McpData } from '../src/tools';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(PKG, '..', '..');
const SERVER = join(PKG, 'dist/server.js');
const DATA_PATH = join(PKG, 'data/mcp-data.json');
const data = JSON.parse(readFileSync(DATA_PATH, 'utf8')) as McpData;

/** Node ≥22.13/≥23.5 spell it --permission; Node 20.19 --experimental-permission. */
function permissionFlag(): string {
  const [maj, min] = process.versions.node.split('.').map(Number);
  return maj > 23 || (maj === 23 && min >= 5) || (maj === 22 && min >= 13) ? '--permission' : '--experimental-permission';
}

interface RpcResponse { id: number; result?: any; error?: { code: number; message: string } }

class StdioClient {
  private proc: ChildProcessWithoutNullStreams;
  private buf = '';
  private nextId = 1;
  private waiting = new Map<number, (r: RpcResponse) => void>();
  stderr = '';
  exit: Promise<number | null>;

  constructor() {
    this.proc = spawn(process.execPath, [permissionFlag(), `--allow-fs-read=${PKG}`, SERVER], { cwd: PKG, stdio: 'pipe' });
    this.proc.stdout.setEncoding('utf8');
    this.proc.stdout.on('data', (chunk: string) => {
      this.buf += chunk;
      let nl: number;
      while ((nl = this.buf.indexOf('\n')) >= 0) {
        const line = this.buf.slice(0, nl).trim();
        this.buf = this.buf.slice(nl + 1);
        if (!line) continue;
        const msg = JSON.parse(line) as RpcResponse;
        this.waiting.get(msg.id)?.(msg);
        this.waiting.delete(msg.id);
      }
    });
    this.proc.stderr.on('data', (c) => { this.stderr += String(c); });
    this.exit = new Promise((resolve) => this.proc.on('exit', resolve));
  }

  request(method: string, params: unknown = {}): Promise<RpcResponse> {
    const id = this.nextId++;
    const p = new Promise<RpcResponse>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`${method} timed out; stderr: ${this.stderr}`)), 10_000);
      this.waiting.set(id, (r) => { clearTimeout(t); resolve(r); });
    });
    this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    return p;
  }

  notify(method: string, params: unknown = {}): void {
    this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
  }

  async call(name: string, args: Record<string, unknown>) {
    const res = await this.request('tools/call', { name, arguments: args });
    return res;
  }

  async close(): Promise<number | null> {
    this.proc.stdin.end();
    return this.exit;
  }
}

const textOf = (res: RpcResponse) => res.result.content[0].text as string;

describe('@auraglass/mcp over stdio under the permission model', () => {
  let client: StdioClient;
  let initMs = Number.POSITIVE_INFINITY;
  let init: RpcResponse;

  beforeAll(async () => {
    const t0 = performance.now();
    client = new StdioClient();
    init = await client.request('initialize', {
      protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'auraglass-mcp-test', version: '0.0.0' },
    });
    initMs = performance.now() - t0;
    client.notify('notifications/initialized');
  });

  afterAll(async () => { await client.close(); });

  test('initialize answers within 500 ms of process start', () => {
    expect(init.error).toBeUndefined();
    expect(initMs).toBeLessThanOrEqual(500);
  });

  test('serverInfo carries the bundled data version and sha; data version == aura-glass package.json', () => {
    const rootVersion = JSON.parse(readFileSync(join(REPO, 'package.json'), 'utf8')).version;
    expect(data.version).toBe(rootVersion);
    expect(data.sha).toMatch(/^[0-9a-f]{40}$/);
    expect(init.result.serverInfo).toEqual(expect.objectContaining({ name: 'auraglass-mcp', version: `${data.version}+${data.sha}` }));
    expect(init.result.capabilities.tools).toBeDefined();
  });

  test('tools/list returns exactly the five REQ tools, each with a zod-derived input schema', async () => {
    const res = await client.request('tools/list');
    const tools = res.result.tools as Array<{ name: string; inputSchema: { type: string; properties: Record<string, unknown>; required?: string[] } }>;
    expect(tools.map((t) => t.name).sort()).toEqual(['get_component', 'get_migration', 'get_registry_item', 'list_registry', 'search_components']);
    const byName = Object.fromEntries(tools.map((t) => [t.name, t.inputSchema]));
    expect(Object.keys(byName.search_components.properties).sort()).toEqual(['query', 'surface']);
    expect(byName.search_components.required).toEqual(['query']);
    expect(byName.get_component.required).toEqual(['name']);
    expect(byName.list_registry.required ?? []).toEqual([]);
    expect(byName.get_registry_item.required).toEqual(['name']);
    expect(byName.get_migration.required).toEqual(['symbol']);
  });

  test('search_components({query:"modal"}) returns Dialog first', async () => {
    const res = await client.call('search_components', { query: 'modal' });
    const hits = JSON.parse(textOf(res)) as Array<{ name: string; import: string }>;
    expect(hits[0]).toEqual(expect.objectContaining({ name: 'Dialog', import: "import { Dialog } from 'aura-glass';" }));
  });

  test('search_components honours surface', async () => {
    const res = await client.call('search_components', { query: 'date', surface: 'date' });
    const hits = JSON.parse(textOf(res)) as Array<{ import: string }>;
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) expect(h.import).toMatch(/from 'aura-glass\/date';$/);
  });

  test('get_migration({symbol:"GlassModal"}) returns the canonical-names entry first', async () => {
    const res = await client.call('get_migration', { symbol: 'GlassModal' });
    const out = JSON.parse(textOf(res)) as { symbol: string; entries: Array<Record<string, unknown>> };
    expect(out.symbol).toBe('GlassModal');
    expect(out.entries[0]).toEqual(expect.objectContaining({ transform: 'canonical-names', from: 'GlassModal', to: 'Dialog', toEntry: 'aura-glass' }));
  });

  test('get_component returns the Dialog meta and points 4.x names at the rename', async () => {
    const ok = JSON.parse(textOf(await client.call('get_component', { name: 'Dialog' })));
    expect(ok).toEqual(expect.objectContaining({ name: 'Dialog', entry: 'aura-glass', tier: 'T1' }));
    expect(ok.parts).toContain('popup');
    expect(ok.migratesFrom).toContain('GlassModal');
    const old = await client.call('get_component', { name: 'GlassModal' });
    expect(old.result.isError).toBe(true);
    expect(textOf(old)).toContain("'Dialog'");
  });

  test('list_registry filters by type and get_registry_item returns one item', async () => {
    const all = JSON.parse(textOf(await client.call('list_registry', {}))) as Array<{ name: string; type: string; status: string }>;
    expect(all.length).toBe(data.registry.length);
    const blocks = JSON.parse(textOf(await client.call('list_registry', { type: 'block' }))) as Array<{ type: string }>;
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.every((b) => b.type === 'registry:block')).toBe(true);
    const base = JSON.parse(textOf(await client.call('get_registry_item', { name: 'auraglass' })));
    expect(base).toEqual(expect.objectContaining({ name: 'auraglass', type: 'registry:base', status: 'certified' }));
    const missing = await client.call('get_registry_item', { name: 'no-such-item' });
    expect(missing.result.isError).toBe(true);
  });

  test('arguments are validated by the zod schemas', async () => {
    const res = await client.call('get_migration', {});
    expect(res.result.isError).toBe(true);
    expect(textOf(res)).toMatch(/Input validation error.*symbol/);
  });

  test('the server exits cleanly when stdin closes', async () => {
    const extra = new StdioClient();
    await extra.request('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } });
    await expect(extra.close()).resolves.toBe(0);
    expect(extra.stderr).toBe('');
  });
});

describe('bundled data', () => {
  test('mcp-data.json stays under 5 MB and covers every exported tool', () => {
    expect(statSync(DATA_PATH).size).toBeLessThanOrEqual(5 * 1024 * 1024);
    expect(TOOL_NAMES).toHaveLength(5);
    expect(data.components.length).toBeGreaterThan(0);
    expect(data.registry.length).toBeGreaterThan(0);
    expect(Object.keys(data.migrations).length).toBeGreaterThan(0);
  });

  test('callTool rejects an unknown component without throwing', () => {
    const res = callTool(data, 'get_component', { name: 'DefinitelyNotAComponent' });
    expect(res.ok).toBe(false);
  });
});
