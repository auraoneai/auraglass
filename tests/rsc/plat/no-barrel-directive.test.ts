/* @jest-environment node */
/* PLAT-262: barrels are directive-free and statement-free (re-exports only). */
import { describe, expect, it } from '@jest/globals';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../build/helpers';

const SRC = join(ROOT, 'src');
const RE_EXPORT_ONLY = /^\s*(export\s+(type\s+)?(\*|\{[\s\S]*?\}|\w+\s+as\s+\w+)\s+from\s+['"][^'"]+['"]\s*;?|export\s+type\s+\{[\s\S]*?\}\s*;?|\/\/|\/\*|\*\/|\s|$)/;

const barrels = async (): Promise<string[]> => {
  const { manifestEntries } = await import('../../../scripts/build/lib/graph.mjs');
  const out: string[] = [join(SRC, 'index.ts')];
  const root = join(SRC, 'root');
  if (existsSync(root)) for (const f of readdirSync(root)) if (f.endsWith('.ts')) out.push(join(root, f));
  for (const e of manifestEntries(ROOT).js) out.push(join(ROOT, e.source));
  for (const e of manifestEntries(ROOT).js) {
    const pub = join(ROOT, e.source.replace(/index\.ts$/, 'public.ts'));
    if (existsSync(pub)) out.push(pub);
  }
  return [...new Set(out)].filter(existsSync);
};

describe('no barrel directives (PLAT-262)', () => {
  it('no barrel carries a use client/use server directive', async () => {
    const bad = (await barrels()).filter(f => /^\s*['"]use (client|server)['"]/m.test(readFileSync(f, 'utf8')));
    expect(bad).toEqual([]);
  });

  it('barrels contain only re-export statements', async () => {
    const bad: string[] = [];
    for (const f of await barrels()) {
      const stmts = readFileSync(f, 'utf8').split(/(?<=;)\s*\n/);
      for (const s of stmts) {
        const t = s.trim();
        if (!t) continue;
        if (!RE_EXPORT_ONLY.test(t) && !/^(export\s+(type\s+)?(\*|\{))/m.test(t) && !/^(\/\/|\/\*|\s)/.test(t)) {
          if (/^(const|let|var|function|class|import\s+[^f{]|if|for|while)/.test(t)) bad.push(`${f}: ${t.slice(0, 60)}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
