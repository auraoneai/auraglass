/** Registry client (PLAT-306/307, S-46): `<registry>/<name>.json` fetch + validate. */
import fs from 'node:fs';
import path from 'node:path';
import { networkError } from '../cli/errors.js';
import { registryItemSchema, type RegistryItem } from './schema.js';
import { DOCS_BASE_URL } from '../meta.js';

export function defaultRegistry(): string {
  return process.env.AURAGLASS_REGISTRY ?? `${DOCS_BASE_URL}r`;
}

function isLocal(reg: string): boolean {
  return !/^https?:\/\//.test(reg);
}

/** Resolve the local fixture registry file for a name. */
function localPath(reg: string, name: string): string {
  const p = reg.startsWith('file://') ? reg.slice(7) : reg;
  const cand = [path.join(p, `${name}.json`), path.join(p, 'registry', `${name}.json`)];
  for (const c of cand) if (fs.existsSync(c)) return c;
  return cand[0]!;
}

export async function fetchItem(name: string, registry?: string): Promise<RegistryItem> {
  const reg = registry ?? defaultRegistry();
  let raw: unknown;
  if (isLocal(reg)) {
    const file = localPath(reg, name);
    if (!fs.existsSync(file)) throw networkError(`registry item not found: ${name} (${reg})`);
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } else {
    const url = `${reg.replace(/\/$/, '')}/${name}.json`;
    let res: Response;
    try {
      res = await fetch(url);
    } catch (e) {
      throw networkError(`registry fetch failed: ${url} (${String(e)})`);
    }
    if (!res.ok) throw networkError(`registry fetch ${res.status}: ${url}`);
    raw = await res.json();
  }
  const parsed = registryItemSchema.safeParse(raw);
  if (!parsed.success) throw networkError(`registry item ${name} failed schema validation: ${parsed.error.issues[0]?.message ?? 'invalid'}`);
  return parsed.data;
}

export async function listItems(registry?: string): Promise<Array<{ name: string; type: string; title?: string | undefined; description?: string }>> {
  const reg = registry ?? defaultRegistry();
  if (isLocal(reg)) {
    const p = reg.startsWith('file://') ? reg.slice(7) : reg;
    const items: Array<{ name: string; type: string; title?: string | undefined; description?: string }> = [];
    for (const dir of [p, path.join(p, 'items'), path.join(p, 'blocks')]) {
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        const itemFile = f.endsWith('.json') ? path.join(dir, f) : path.join(dir, f, 'registry-item.json');
        if (!fs.existsSync(itemFile)) continue;
        try {
          const item = registryItemSchema.safeParse(JSON.parse(fs.readFileSync(itemFile, 'utf8')));
          if (item.success) items.push({ name: item.data.name, type: item.data.type, title: item.data.title, description: item.data.description } as { name: string; type: string; title?: string; description?: string });
        } catch { /* skip unreadable */ }
      }
    }
    return items;
  }
  const url = `${reg.replace(/\/$/, '')}/index.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw networkError(`registry index ${res.status}: ${url}`);
    const raw = (await res.json()) as { items?: Array<{ name: string; type: string; title?: string | undefined; description?: string }> };
    return raw.items ?? [];
  } catch (e) {
    if (e instanceof Error && 'code' in e) throw e;
    throw networkError(`registry index fetch failed: ${url}`);
  }
}
