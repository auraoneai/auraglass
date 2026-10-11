/* packages/mcp/src/tools.ts — REQ-PLAT-106 (REQ-FIN-44). The five read-only
   @auraglass/mcp tools as pure functions over the bundled data/mcp-data.json
   (written by scripts/docs/gen-mcp-data.mjs). No I/O happens here. */
import { z } from 'zod';

export interface PropRow { name: string; type: string; required: boolean; description?: string }
export interface ComponentRecord {
  name: string; slug: string; import: string; entry: string; owner: string; tier: string; flagship?: number; rsc: string;
  parts: string[]; states: string[]; variants: Record<string, string[]>; material?: unknown; apg?: string;
  migratesFrom: string[]; props: PropRow[]; docs: string; source: string;
}
export interface RegistryRecord {
  name: string; type: string; title: string | null; description: string | null; status: string; reason?: string;
  surface: string | null; owner: string | null; ga: boolean; components: string[]; dependencies: string[];
  registryDependencies: string[]; install: string; url: string | null;
  files: Array<{ path: string; type: string; target?: string; content: string | null }>;
  cssVars?: unknown; css?: string;
}
export interface MigrationEntry { transform: string; [key: string]: unknown }
export interface McpData {
  version: string; sha: string;
  components: ComponentRecord[];
  registry: RegistryRecord[];
  migrations: Record<string, MigrationEntry[]>;
}

export const TOOL_NAMES = ['search_components', 'get_component', 'list_registry', 'get_registry_item', 'get_migration'] as const;
export type ToolName = (typeof TOOL_NAMES)[number];

export const schemas = {
  search_components: {
    query: z.string().min(1).describe('Free text, e.g. "modal", "date range", or a 4.x name such as "GlassModal"'),
    surface: z.string().optional().describe('Restrict to one import subpath: "core" (aura-glass) or e.g. "ai", "data", "date", "media"'),
  },
  get_component: { name: z.string().min(1).describe('5.0 component name, e.g. "Dialog"') },
  list_registry: { type: z.string().optional().describe('Registry item type: "base", "block", "item" (or the full "registry:<type>")') },
  get_registry_item: { name: z.string().min(1).describe('Registry item name, e.g. "auth"') },
  get_migration: { symbol: z.string().min(1).describe('4.x symbol, subpath, CSS variable or package, e.g. "GlassModal"') },
} as const;

export const descriptions: Record<ToolName, string> = {
  search_components: 'Search AuraGlass 5 components by name, purpose or 4.x name; best match first.',
  get_component: 'Import, parts, states, variants, props and migration sources for one AuraGlass 5 component.',
  list_registry: 'List AuraGlass registry items (shadcn format) with certification status and install command.',
  get_registry_item: 'One registry item with dependencies, files and certification status.',
  get_migration: 'How a 4.x symbol migrates to 5.0: canonical rename first, then prop, removal and deprecation rows.',
};

export type ToolResult = { ok: true; value: unknown } | { ok: false; error: string };

const lc = (s: string) => s.toLowerCase();
const surfaceOf = (entry: string) => (entry === 'aura-glass' ? 'core' : entry.replace(/^aura-glass\//, ''));

export function searchComponents(data: McpData, args: { query: string; surface?: string }) {
  const tokens = lc(args.query).split(/[^a-z0-9]+/).filter(Boolean);
  const renamedFrom = new Map<string, string[]>();
  for (const [symbol, entries] of Object.entries(data.migrations)) {
    for (const e of entries) {
      if (e.transform === 'canonical-names' && typeof e.to === 'string') {
        (renamedFrom.get(e.to) ?? renamedFrom.set(e.to, []).get(e.to)!).push(lc(symbol));
      }
    }
  }
  const surface = args.surface ? lc(args.surface).replace(/^(\.\/|aura-glass\/?)/, '') || 'core' : null;
  const scored = data.components
    .filter((c) => !surface || surfaceOf(c.entry) === surface)
    .map((c) => {
      const name = lc(c.name);
      const from = [...c.migratesFrom.map(lc), ...(renamedFrom.get(c.name) ?? [])];
      let score = 0;
      for (const t of tokens) {
        if (name === t) score += 100;
        else if (name.startsWith(t)) score += 60;
        else if (name.includes(t)) score += 40;
        if (from.some((f) => f === t || f === `glass${t}` || f === `liquidglass${t}`)) score += 50;
        else if (from.some((f) => f.includes(t))) score += 20;
        if (c.apg && lc(c.apg).includes(t)) score += 10;
        if (c.parts.some((p) => p.includes(t))) score += 5;
        if (c.states.some((s) => lc(s).includes(t))) score += 2;
      }
      return { c, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score
      || (a.c.flagship ?? Number.MAX_SAFE_INTEGER) - (b.c.flagship ?? Number.MAX_SAFE_INTEGER)
      || a.c.name.localeCompare(b.c.name));
  return scored.slice(0, 10).map(({ c, score }) => ({
    name: c.name, import: c.import, tier: c.tier, ...(c.flagship != null ? { flagship: c.flagship } : {}), score, docs: c.docs,
  }));
}

export function getComponent(data: McpData, args: { name: string }): ToolResult {
  const c = data.components.find((x) => x.name === args.name) ?? data.components.find((x) => lc(x.name) === lc(args.name));
  if (c) return { ok: true, value: c };
  const rename = data.migrations[args.name]?.find((e) => e.transform === 'canonical-names');
  return {
    ok: false,
    error: rename
      ? `'${args.name}' is a 4.x name; in 5.0 it is '${String(rename.to)}' from '${String(rename.toEntry)}' (see get_migration)`
      : `no AuraGlass 5 component named '${args.name}' (try search_components)`,
  };
}

export function listRegistry(data: McpData, args: { type?: string }) {
  const type = args.type ? (args.type.startsWith('registry:') ? args.type : `registry:${args.type}`) : null;
  return data.registry
    .filter((r) => !type || r.type === type)
    .map(({ name, type: t, title, description, status, install }) => ({ name, type: t, title, description, status, install }));
}

export function getRegistryItem(data: McpData, args: { name: string }): ToolResult {
  const r = data.registry.find((x) => x.name === args.name) ?? data.registry.find((x) => lc(x.name) === lc(args.name));
  return r ? { ok: true, value: r } : { ok: false, error: `no registry item named '${args.name}' (try list_registry)` };
}

export function getMigration(data: McpData, args: { symbol: string }): ToolResult {
  const key = data.migrations[args.symbol] ? args.symbol : Object.keys(data.migrations).find((k) => lc(k) === lc(args.symbol));
  if (key) return { ok: true, value: { symbol: key, entries: data.migrations[key] } };
  const near = Object.keys(data.migrations).filter((k) => lc(k).includes(lc(args.symbol))).slice(0, 10);
  return { ok: false, error: `no migration entry for '${args.symbol}'${near.length ? `; similar: ${near.join(', ')}` : ''}` };
}

export function callTool(data: McpData, name: ToolName, args: Record<string, unknown>): ToolResult {
  switch (name) {
    case 'search_components': return { ok: true, value: searchComponents(data, args as { query: string; surface?: string }) };
    case 'get_component': return getComponent(data, args as { name: string });
    case 'list_registry': return { ok: true, value: listRegistry(data, args as { type?: string }) };
    case 'get_registry_item': return getRegistryItem(data, args as { name: string });
    case 'get_migration': return getMigration(data, args as { symbol: string });
  }
}
