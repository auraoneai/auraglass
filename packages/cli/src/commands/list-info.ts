import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, usageError } from '../cli/errors.js';
import { fetchItem, listItems } from '../registry/client.js';

export async function listCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const registry = typeof flags.registry === 'string' ? flags.registry : undefined;
  const items = await listItems(registry);
  const filter = args[0];
  const shown = filter ? items.filter((i) => i.name.includes(filter)) : items;
  if (out.json) printJson({ version: 1, items: shown });
  else for (const i of shown) status(out, 'info', `${i.name} (${i.type})${i.description ? ` — ${i.description}` : ''}`);
  return EXIT.ok;
}

export async function infoCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const [name] = args;
  if (!name) throw usageError('info <name> expected');
  const registry = typeof flags.registry === 'string' ? flags.registry : undefined;
  const item = await fetchItem(name, registry);
  if (out.json) {
    printJson(item);
  } else {
    status(out, 'info', `${item.name} (${item.type})`);
    if (item.description) status(out, 'info', item.description);
    for (const d of item.dependencies ?? []) status(out, 'info', `dep: ${d}`);
    for (const d of item.registryDependencies ?? []) status(out, 'info', `registry-dep: ${d}`);
    for (const f of item.files ?? []) status(out, 'info', `file: ${f.path}`);
    const meta = item.meta?.auraglass;
    if (meta) status(out, 'info', `auraglass: ${JSON.stringify(meta)}`);
  }
  return EXIT.ok;
}
