/** Vendored shadcn v4 registry-item schema + `meta.auraglass` extension (PLAT-306). */
import { z } from 'zod';

export const registryFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: z.string().optional(),
  target: z.string().optional(),
});

export const auraMetaSchema = z.object({
  minVersion: z.string().optional(),
  certified: z.boolean().optional(),
  surface: z.string().optional(),
  client: z.boolean().optional(),
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
