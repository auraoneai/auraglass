#!/usr/bin/env node
/* packages/mcp/src/server.ts — REQ-PLAT-106 (REQ-FIN-44). @auraglass/mcp:
   an MCP stdio server (SDK McpServer + StdioServerTransport) with exactly
   five read-only tools answered from the bundled data/mcp-data.json.
   It performs no network I/O, no file writes and spawns no processes; the
   only file it reads is its own data file, so it runs under
   `node --permission --allow-fs-read=<package dir>` (the build bundles the
   SDK and zod into dist/server.js). It calls no LLM. */
import { readFileSync } from 'node:fs';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { TOOL_NAMES, callTool, descriptions, schemas, type McpData, type ToolName } from './tools.js';

export function loadData(url: URL = new URL('../data/mcp-data.json', import.meta.url)): McpData {
  return JSON.parse(readFileSync(url, 'utf8')) as McpData;
}

export function createServer(data: McpData): McpServer {
  const server = new McpServer(
    { name: 'auraglass-mcp', title: 'AuraGlass', version: `${data.version}+${data.sha}` },
    { instructions: `AuraGlass ${data.version} (${data.sha}) component, registry and migration data. Use canonical 5.0 names; get_migration maps 4.x Glass* names.` },
  );
  for (const name of TOOL_NAMES) {
    server.registerTool(
      name,
      { description: descriptions[name], inputSchema: schemas[name], annotations: { readOnlyHint: true, openWorldHint: false } },
      async (args: Record<string, unknown>) => {
        const res = callTool(data, name as ToolName, args);
        return res.ok
          ? { content: [{ type: 'text' as const, text: JSON.stringify(res.value) }] }
          : { content: [{ type: 'text' as const, text: res.error }], isError: true };
      },
    );
  }
  return server;
}

export async function main(): Promise<void> {
  const server = createServer(loadData());
  await server.connect(new StdioServerTransport());
}

main().catch((err: unknown) => {
  process.stderr.write(`auraglass-mcp: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
