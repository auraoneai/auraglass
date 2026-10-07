/** @jest-environment node */
// MAT-006: schema validation — every tokens/**.tokens.json validates, plus failure fixtures.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
// @ts-ignore mjs module
import { ROOT, loadSchema, validateTokenFile } from '../../scripts/tokens/validate.mjs';

const tokenFiles = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) tokenFiles(p, out);
    else if (name.endsWith('.tokens.json')) out.push(p);
  }
  return out;
};

describe('token schema (MAT-006)', () => {
  const schema = loadSchema(join(ROOT, 'tokens/$schema.json'));
  const files = tokenFiles(join(ROOT, 'tokens'));

  test('all token sources validate', () => {
    const errors: string[] = [];
    for (const f of files) {
      const tree = JSON.parse(readFileSync(f, 'utf8'));
      for (const e of validateTokenFile(tree, schema, f)) errors.push(`${f} at ${e.path}: ${e.message}`);
    }
    expect(errors).toEqual([]);
    console.log(`schema: validated ${files.length} files`);
  });

  test('unknown-type fixture fails naming the path', () => {
    const f = join(ROOT, 'tests/tokens/fixtures/unknown-type.tokens.json');
    const errors = validateTokenFile(JSON.parse(readFileSync(f, 'utf8')), schema, f) as Array<{ path: string; message: string }>;
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map((e) => `${e.path}: ${e.message}`).join('\n')).toMatch(/unregistered-type|enum/);
  });

  test('missing ag.tier fails', () => {
    const f = join(ROOT, 'tests/tokens/fixtures/missing-tier.tokens.json');
    const errors = validateTokenFile(JSON.parse(readFileSync(f, 'utf8')), schema, f) as Array<{ path: string; message: string }>;
    expect(errors.map((e) => `${e.path}: ${e.message}`).join('\n')).toMatch(/ag\.tier/);
  });
});
