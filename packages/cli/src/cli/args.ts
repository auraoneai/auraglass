/** Minimal argv parser shared by every command (REQ-PLAT-84). */

export interface ParsedArgs {
  args: string[];
  flags: Record<string, string | boolean>;
}

const VALUE_FLAGS = new Set([
  'cwd', 'out', 'from', 'transform', 'report', 'url', 'selector', 'registry', 'source',
]);

export function parseArgs(argv: string[]): ParsedArgs {
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i]!;
    if (!value.startsWith('--')) {
      args.push(value);
      continue;
    }
    if (value === '--') {
      args.push(...argv.slice(i + 1));
      break;
    }
    const eq = value.indexOf('=');
    const rawKey = (eq === -1 ? value.slice(2) : value.slice(2, eq));
    const inlineValue = eq === -1 ? undefined : value.slice(eq + 1);
    if (VALUE_FLAGS.has(rawKey) && inlineValue === undefined && argv[i + 1] !== undefined) {
      flags[rawKey] = argv[i + 1]!;
      i += 1;
    } else {
      flags[rawKey] = inlineValue === undefined ? true : inlineValue;
    }
  }
  return { args, flags };
}

export function flagList(flags: ParsedArgs['flags'], name: string): string[] {
  const v = flags[name];
  if (v === undefined || v === true) return [];
  return String(v).split(',').map((s: any) => s.trim()).filter(Boolean);
}
