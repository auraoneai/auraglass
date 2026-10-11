/* REQ-QUAL-02 (QUAL). No count literal: the inventory size is derived from source, so the archived
   hard-coded totals may not appear in QUAL code or certification data. The forbidden numbers are
   computed, never written, so this file does not match itself. */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const FORBIDDEN_COUNTS: readonly number[] = [47 * 10, 2 * 249, 4 * 89];
export const COUNT_LITERAL_RE = new RegExp(`\\b(${FORBIDDEN_COUNTS.join('|')})\\b`);
const TEXT = /\.(ts|tsx|js|mjs|cjs|json|md|mdx|ya?ml|css|html|txt|svg)$/i;

export interface CountLiteralHit { file: string; line: number; text: string }

export function findCountLiterals(root: string, dirs: readonly string[]): CountLiteralHit[] {
  const hits: CountLiteralHit[] = [];
  const walk = (abs: string): void => {
    let ents: import('node:fs').Dirent[];
    try { ents = readdirSync(abs, { withFileTypes: true }); } catch { return; }
    for (const d of ents) {
      if (d.name === 'node_modules' || d.name === '.git') continue;
      const p = join(abs, d.name);
      if (d.isDirectory()) walk(p);
      else if (d.isFile() && TEXT.test(d.name)) {
        readFileSync(p, 'utf8').split('\n').forEach((text, i) => {
          if (COUNT_LITERAL_RE.test(text)) hits.push({ file: relative(root, p).split(sep).join('/'), line: i + 1, text: text.trim().slice(0, 120) });
        });
      }
    }
  };
  for (const d of dirs) walk(join(root, d));
  return hits;
}
