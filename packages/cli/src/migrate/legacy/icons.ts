/**
 * Legacy migrate parity (PLAT-317/318): `migrate icons --from lucide` keeps
 * the 4.1.0 output shape; `migrate radix|mui` is report-only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { walkFiles } from '../4to5/index.js';
import { atomicWrite } from '../../core/fs-safety.js';

export const ICON_USAGE = 'migrate icons --from <lucide|radix|mui> [--write] [--json]';

/** lucide -> aura-glass/icons map (carried from the 4.1.0 CLI). */
export const LUCIDE_MAP: Record<string, string> = {
  check: 'check', x: 'x', 'chevron-down': 'chevron-down', 'chevron-up': 'chevron-up',
  'chevron-left': 'chevron-left', 'chevron-right': 'chevron-right', search: 'search',
  menu: 'menu', plus: 'plus', minus: 'minus', 'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right', 'arrow-up': 'arrow-up', 'arrow-down': 'arrow-down',
  settings: 'settings', user: 'user', users: 'users', home: 'home', bell: 'bell',
  star: 'star', heart: 'heart', trash: 'trash', edit: 'edit', copy: 'copy',
  download: 'download', upload: 'upload', link: 'link', external: 'external',
  info: 'info', warning: 'warning', error: 'error', success: 'success',
  calendar: 'calendar', clock: 'clock', filter: 'filter', sort: 'sort',
};

export interface LegacyResult { lines: string[]; report: Record<string, unknown>; changed: number }

export function migrateIcons(cwd: string, from: 'lucide' | 'radix' | 'mui', write: boolean): LegacyResult {
  if (from !== 'lucide') return reportOnly(cwd, from);
  const lines: string[] = [];
  const files: string[] = [];
  let changed = 0;
  for (const abs of walkFiles(cwd)) {
    if (!/\.(tsx?|jsx?)$/.test(abs)) continue;
    let src: string;
    try { src = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    if (!src.includes('lucide')) continue;
    const rel = path.relative(cwd, abs);
    const next = src.replace(/from\s+['"]lucide-react['"]/g, "from 'aura-glass/icons'")
      .replace(/from\s+['"]@lucide\/(\w+)['"]/g, (_, n: string) => `from 'aura-glass/icons/${n}'`);
    const imports = src.match(/from\s+['"]lucide-react['"]/g) ?? [];
    if (imports.length) {
      files.push(rel);
      lines.push(`INFO    ${rel}: lucide-react -> aura-glass/icons (${imports.length} import(s))`);
      if (write && next !== src) {
        atomicWrite(cwd, abs, next);
        changed += 1;
      }
    }
  }
  if (!files.length) lines.push('INFO    no lucide imports found');
  return { lines, report: { version: 1, kind: 'icons', from, files, changed }, changed };
}

export function reportOnly(cwd: string, kind: 'radix' | 'mui' | string): LegacyResult {
  const lines: string[] = [];
  const pattern = kind === 'radix' ? /@radix-ui\// : /@mui\//;
  const files: string[] = [];
  for (const abs of walkFiles(cwd)) {
    if (!/\.(tsx?|jsx?)$/.test(abs)) continue;
    let src: string;
    try { src = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    if (pattern.test(src)) files.push(path.relative(cwd, abs));
  }
  for (const f of files) lines.push(`INFO    ${f}: ${kind} usage — see the migration guide`);
  lines.push(`INFO    ${kind}: report-only; no automated migration (${files.length} file(s))`);
  return { lines, report: { version: 1, kind, files, reportOnly: true }, changed: 0 };
}
