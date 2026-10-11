/* Types for scripts/docs/gen-mcp-data.mjs (REQ-PLAT-106). The record shapes
   are the ones packages/mcp/src/tools.ts consumes. */
import type { MigrationEntry } from './agent-data.mjs';
export interface McpComponent {
  name: string; slug: string; import: string; entry: string; owner: string; tier: string; flagship?: number; rsc: string;
  parts: string[]; states: string[]; variants: Record<string, string[]>; material?: unknown; apg?: string;
  migratesFrom: string[]; props: Array<{ name: string; type: string; required: boolean; description?: string }>; docs: string; source: string;
}
export interface McpRegistryItem {
  name: string; type: string; title: string | null; description: string | null; status: string; reason?: string;
  surface: string | null; owner: string | null; ga: boolean; components: string[]; dependencies: string[];
  registryDependencies: string[]; install: string; url: string | null;
  files: Array<{ path: string; type: string; target?: string; content: string | null }>;
  cssVars?: unknown; css?: string;
}
export interface McpDataFile {
  version: string; sha: string; components: McpComponent[]; registry: McpRegistryItem[]; migrations: Record<string, MigrationEntry[]>;
}
export const MAX_BYTES: number;
export function generate(root?: string): Promise<McpDataFile>;
export function main(argv?: string[]): Promise<number>;
