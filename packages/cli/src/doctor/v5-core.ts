/**
 * doctor --v5 core (PLAT-315): per-file/line usage of removeIn:'5.0.0' deprecation
 * entries, grouped by codemod id, bucketed {automatic, needsReview, manual}.
 * Deterministic output (sorted) — used by the doctor-v5 golden test.
 */
import fs from 'node:fs';
import path from 'node:path';
import { walkFiles } from '../migrate/4to5/walk.js';

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

/**
 * The --v5 scan over an explicit deprecation entry list. @auraglass/cli passes
 * its compiled mappings (./v5.ts); the 4.x `aura-glass` bin passes the
 * package's deprecations.json through the generated bundle
 * (bin/doctor-v5.generated.cjs, REQ-PLAT-61) — one implementation for both.
 */
export function runV5WithEntries(cwd: string, deprecations: Array<Record<string, unknown>>): { findings: V5Finding[]; byCodemod: Record<string, V5Finding[]> } {
  const entries = deprecations.filter((e) => (e as { removeIn?: string }).removeIn === '5.0.0');
  const findings: V5Finding[] = [];
  const needles = entries.map((e) => {
    const row = e as { symbol?: string; entry?: string; codemod?: string | null; automation?: string; message?: string };
    return { symbol: row.symbol ?? '', entry: row.entry ?? '', codemod: row.codemod ?? null, automation: AUTOMATION_MAP[row.automation ?? 'manual'] ?? 'manual', message: row.message ?? '' };
  }).filter((n: any) => n.symbol);
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
        if (n.entry && n.entry !== '.' && !/css-var|subpath/.test(String((n as { kind?: string }).kind ?? '')) && !src.includes(n.entry)) continue;
        findings.push({ path: rel, line: i + 1, symbol: n.symbol, entry: n.entry, automation: n.automation, codemod: n.codemod, message: n.message });
      }
    });
  }
  // total order: two deprecation rows can name the same symbol (e.g. a peer
  // row and a deps row), so entry/codemod/message break ties — the output must
  // not depend on the order the entry list was assembled in (REQ-PLAT-61 parity).
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
