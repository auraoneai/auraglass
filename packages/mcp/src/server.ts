// packages/mcp/src/server.ts — PLAT-394/395. AuraGlass MCP stdio server:
// exactly 5 read-only tools answered from the bundled data/mcp-data.json
// (built from the published registry index + docs inventory). No network
// I/O, no file writes, no child processes, no LLM calls — designed to run
// under `node --permission --allow-fs-read=./data`.
import { createInterface } from 'node:readline';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const DATA = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'mcp-data.json'), 'utf8')) as {
  version: string; components: Record<string, { subpath: string; props?: { name: string; type: string; required?: boolean }[] }>;
  items: { name: string; type: string; title?: string; description?: string }[];
  docs: { path: string; title?: string }[];
};

const TOOLS = [
  { name: 'component_info', description: 'Props and import subpath for one exported component', schema: z.object({ name: z.string() }) },
  { name: 'registry_get', description: 'Fetch a registry block/item record (deps, files, meta)', schema: z.object({ name: z.string() }) },
  { name: 'registry_search', description: 'Search registry items by name/description', schema: z.object({ query: z.string(), kind: z.enum(['block', 'item']).optional() }) },
  { name: 'docs_search', description: 'Search docs pages by path/title', schema: z.object({ query: z.string() }) },
  { name: 'version_info', description: 'AuraGlass version + data freshness', schema: z.object({}) },
] as const;

function call(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'component_info': {
      const c = DATA.components[args.name as string];
      return c ?? { error: `no component '${args.name}'` };
    }
    case 'registry_get': {
      const it = DATA.items.find((i) => i.name === args.name);
      return it ?? { error: `no item '${args.name}'` };
    }
    case 'registry_search': {
      const q = String(args.query ?? '').toLowerCase();
      return DATA.items.filter((i) => (!args.kind || i.type === `registry:${args.kind}`) && (`${i.name} ${i.description ?? ''}`.toLowerCase().includes(q)));
    }
    case 'docs_search': {
      const q = String(args.query ?? '').toLowerCase();
      return DATA.docs.filter((d) => `${d.path} ${d.title ?? ''}`.toLowerCase().includes(q));
    }
    case 'version_info':
      return { version: DATA.version, items: DATA.items.length, components: Object.keys(DATA.components).length, docs: DATA.docs.length };
    default:
      return { error: `unknown tool ${name}` };
  }
}

/* Minimal JSON-RPC loop on stdio (MCP transport): initialize →
   tools/list → tools/call. ≤500ms to first response — data is one JSON. */
const rl = createInterface({ input: process.stdin });
rl.on('line', (line) => {
  let msg: { id?: number | string; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };
  try { msg = JSON.parse(line); } catch { return; }
  const reply = (result: unknown) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id ?? null, result }) + '\n');
  const error = (code: number, message: string) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id ?? null, error: { code, message } }) + '\n');
  switch (msg.method) {
    case 'initialize': reply({ protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'auraglass-mcp', version: DATA.version } }); break;
    case 'notifications/initialized': break;
    case 'tools/list': reply({ tools: TOOLS.map(({ name, description }) => ({ name, description })) }); break;
    case 'tools/call': {
      const t = TOOLS.find((t) => t.name === msg.params?.name);
      if (!t) { error(-32601, `no tool ${msg.params?.name}`); break; }
      const parsed = (t.schema as z.ZodTypeAny).safeParse(msg.params?.arguments ?? {});
      if (!parsed.success) { error(-32602, String(parsed.error)); break; }
      reply({ content: [{ type: 'text', text: JSON.stringify(call(t.name, parsed.data)) }] });
      break;
    }
    default: if (msg.id != null) error(-32601, `unknown method ${msg.method}`);
  }
});
export { TOOLS, call };
