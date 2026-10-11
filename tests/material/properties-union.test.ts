/* @jest-environment node */
/* REQ-MAT-28 (REQ-FIN-55, FIN-D D.3-19): repo-wide @property budget.
   The union of @property registrations over every CSS file declared in any
   fragments/css/*.ts file has ≤ 16 registrations and registers each name
   exactly once (no stream re-registers a MAT property). Also: no source file
   under src/ calls CSS.registerProperty at runtime. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import postcss from 'postcss';
import { loadFragments } from '../../src/contracts/load-fragments.mjs';

const ROOT = join(__dirname, '../..');
const MAX_REGISTRATIONS = 16;

interface Registration { name: string; file: string }

interface Union { files: string[]; missing: string[]; parseErrors: string[]; regs: Registration[] }

const collect = async (): Promise<Union> => {
  const fragments = await loadFragments('css', ROOT);
  const files = [
    ...new Set(
      fragments.flatMap(({ value }) => (value as Array<{ file: string }>).map((row) => row.file)),
    ),
  ].sort();
  const missing: string[] = [];
  const parseErrors: string[] = [];
  const regs: Registration[] = [];
  for (const file of files) {
    const abs = join(ROOT, file);
    if (!existsSync(abs)) { missing.push(file); continue; }
    try {
      postcss.parse(readFileSync(abs, 'utf8'), { from: abs }).walkAtRules('property', (rule) => {
        regs.push({ name: rule.params.trim(), file });
      });
    } catch (err) {
      const e = err as { reason?: string; line?: number; message: string };
      parseErrors.push(`${file}:${e.line ?? '?'} ${e.reason ?? e.message}`);
    }
  }
  return { files, missing, parseErrors, regs };
};

let union: Union;
beforeAll(async () => { union = await collect(); });

const walkSrc = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== '__tests__' && name !== 'node_modules') walkSrc(p, out);
    } else if (/\.(ts|tsx|mts|mjs|js|jsx|css)$/.test(name)) out.push(p);
  }
  return out;
};

describe('@property union over fragments/css/*.ts (REQ-MAT-28)', () => {
  it('every fragment css file exists and parses (an unparsable file cannot be counted)', () => {
    expect(union.files.length).toBeGreaterThan(0);
    expect(union.missing).toEqual([]);
    expect(union.parseErrors).toEqual([]);
  });

  it(`registers ≤ ${MAX_REGISTRATIONS} properties in total`, () => {
    expect(union.missing).toEqual([]);
    expect(union.parseErrors).toEqual([]);
    expect(union.regs.length).toBeLessThanOrEqual(MAX_REGISTRATIONS);
  });

  it('registers each name exactly once', () => {
    expect(union.missing).toEqual([]);
    expect(union.parseErrors).toEqual([]);
    const byName = new Map<string, string[]>();
    for (const r of union.regs) byName.set(r.name, [...(byName.get(r.name) ?? []), r.file]);
    const duplicates = [...byName].filter(([, where]) => where.length > 1)
      .map(([name, where]) => `${name}: ${where.join(', ')}`);
    expect(duplicates).toEqual([]);
  });

  it('src/ never calls CSS.registerProperty at runtime', () => {
    const hits = walkSrc(join(ROOT, 'src'))
      .filter((f) => /registerProperty/.test(readFileSync(f, 'utf8')))
      .map((f) => relative(ROOT, f));
    expect(hits).toEqual([]);
  });
});
