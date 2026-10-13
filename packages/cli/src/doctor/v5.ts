/**
 * doctor --v5 (PLAT-315): per-file/line usage of 5.0 migration deprecation
 * entries, grouped by codemod id, bucketed {automatic, needsReview, manual}.
 * Deterministic output (sorted) — used by the doctor-v5 golden test.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadCompiledMappings } from '../migrate/4to5/mappings.js';
import { walkFiles } from '../migrate/4to5/index.js';

export interface V5Finding {
  path: string;
  line: number;
  symbol: string;
  entry: string;
  automation: 'automatic' | 'needsReview' | 'manual';
  codemod: string | null;
  message: string;
}

const AUTOMATION_MAP: Record<string, V5Finding['automation']> = {
  full: 'automatic',
  mostly: 'needsReview',
  partial: 'needsReview',
  manual: 'manual',
  none: 'manual',
};

export function runV5(cwd: string): { findings: V5Finding[]; byCodemod: Record<string, V5Finding[]> } {
  const mappings = loadCompiledMappings();
  // Compatibility aliases survive until 6.0 but their canonical-name migration
  // already applies in 5.0. A removal deadline is not a migration start date.
  const entries = mappings.deprecations.filter((e) =>
    e.status !== 'planned' && (e.removeIn === '5.0.0' || Boolean(e.codemod)),
  );
  const findings: V5Finding[] = [];
  const needles = entries.map((e) => {
    const row = e as { kind?: string; symbol?: string; entry?: string; codemod?: string | null; automation?: string; message?: string };
    return { kind: row.kind ?? '', symbol: row.symbol ?? '', entry: row.entry ?? '', codemod: row.codemod ?? null, automation: AUTOMATION_MAP[row.automation ?? 'manual'] ?? 'manual', message: row.message ?? '' };
  }).filter((n) => n.symbol);
  for (const abs of walkFiles(cwd)) {
    if (!/\.(tsx?|jsx?|mjs|cjs|css)$/.test(abs)) continue;
    let src: string;
    try { src = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    const rel = path.relative(cwd, abs).split(path.sep).join('/');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      for (const n of needles) {
        if (!line.includes(n.symbol)) continue;
        // entry scoping: a symbol only counts when its entry is imported in the file,
        // except css-var/subpath entries which match textually.
        if (n.entry && n.entry !== '.' && !/css-var|subpath/.test(n.kind) && !src.includes(n.entry)) continue;
        findings.push({ path: rel, line: i + 1, symbol: n.symbol, entry: n.entry, automation: n.automation, codemod: n.codemod, message: n.message });
      }
    });
  }
  // Multiple deprecation entries can match the same symbol and source line.
  // Keep output stable even when fragment assembly changes their input order.
  const cmp = (x: string | null, y: string | null) => (x ?? '').localeCompare(y ?? '');
  findings.sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.symbol.localeCompare(b.symbol)
    || cmp(a.entry, b.entry) || cmp(a.codemod, b.codemod) || cmp(a.automation, b.automation) || cmp(a.message, b.message));
  const byCodemod: Record<string, V5Finding[]> = {};
  for (const f of findings) {
    const key = f.codemod ?? 'manual';
    (byCodemod[key] ??= []).push(f);
  }
  return { findings, byCodemod };
}
