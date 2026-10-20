/** Vendored shadcn v4 registry-item schema + `meta.auraglass` extension (PLAT-306).
 *  REQ-PLAT-87: runtime validation is BOTH the vendored draft-07 schema
 *  (schema/registry-item.json, sha-pinned in schema/source.md) via the
 *  dependency-free validator, AND the zod schema below for meta.auraglass. */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { z } from 'zod';
import { validateSchema } from '../audit/json-schema.js';

/* Package root resolution mirrors src/meta.ts (src/registry/schema.ts and the
   bundled dist/bin.js both sit one level below the root; `import.meta.url`
   is eval'd so the CJS jest transform never parses it). */
const HERE = typeof __dirname === 'undefined' ? moduleDir() : __dirname;
function moduleDir(): string {
  try {
    const req = createRequire(process.argv[1] ?? path.join(process.cwd(), 'x.js'));
    return path.dirname(req.resolve('aura-glass-cli/package.json'));
  } catch {
    return process.argv[1] ? path.dirname(process.argv[1]) : process.cwd();
  }
}
function vendoredSchemaPath(): string | null {
  for (const cand of [
    path.join(HERE, 'schema', 'registry-item.json'),
    path.join(HERE, '..', '..', 'schema', 'registry-item.json'),
    path.join(HERE, '..', 'schema', 'registry-item.json'),
    path.join(process.cwd(), 'schema', 'registry-item.json'),
    path.join(process.cwd(), 'packages', 'cli', 'schema', 'registry-item.json'),
  ]) if (fs.existsSync(cand)) return cand;
  return null;
}
let vendoredCache: Record<string, unknown> | null | undefined;
export function vendoredRegistryItemSchema(): Record<string, unknown> | null {
  if (vendoredCache !== undefined) return vendoredCache;
  const p = vendoredSchemaPath();
  vendoredCache = p ? (JSON.parse(fs.readFileSync(p, 'utf8')) as Record<string, unknown>) : null;
  return vendoredCache;
}
/** Errors from the vendored shadcn schema ([] = valid). A missing schema file
 *  is itself an error — validation never silently degrades to zod-only. */
export function validateVendoredRegistryItem(raw: unknown): string[] {
  const schema = vendoredRegistryItemSchema();
  if (!schema) return ['vendored schema/registry-item.json not found — cannot validate item'];
  return validateSchema(schema, raw);
}

export const registryFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: z.string().optional(),
  target: z.string().optional(),
});

export const auraMetaSchema = z.object({
  minVersion: z.string().optional(),
  certified: z.boolean().optional(),
  sha: z.string().optional(),
  surface: z.string().optional(),
  client: z.boolean().optional(),
  /* REQ-PLAT-87: eject gate reads meta.auraglass.tier when the source item
     carries it (T1 flagship / T2 core ejectable; T0/preview not). */
  tier: z.string().optional(),
  flagship: z.union([z.number(), z.boolean()]).optional(),
  components: z.array(z.string()).optional(),
}).partial();

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryFileSchema).optional(),
  cssVars: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  meta: z.object({ auraglass: auraMetaSchema.optional() }).passthrough().optional(),
}).passthrough();

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type AuraMeta = z.infer<typeof auraMetaSchema>;
