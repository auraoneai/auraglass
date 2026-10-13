/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
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

  // REQ-MAT-01 layout: every tracked file under tokens/ sits on an allowed path
  // (the PRD layout list plus the generator inputs/outputs other REQs place there).
  const LAYOUT: RegExp[] = [
    /^tokens\/\$schema\.json$/,
    /^tokens\/ref\/[a-z0-9-]+\.tokens\.json$/,
    /^tokens\/sys\/(color|type|space|shape|motion|interaction|environment|elevation|breakpoint)\.tokens\.json$/,
    /^tokens\/material\/material\.tokens\.json$/,
    /^tokens\/modes\/(scheme|contrast|transparency|density)\.tokens\.json$/,
    /^tokens\/presets\/[a-z0-9-]+\.tokens\.json$/,
    /^tokens\/contrast\/(busy-reference\.json|contrast-matrix\.tokens\.json)$/,
    /^tokens\/legacy\/(4x-rendered\.tokens\.json|4x-primitives\.css|4x-reader-set\.json|4x-glass-source\.json)$/,
    /^tokens\/comp\/(README\.md|[a-z0-9-]+\.tokens\.json)$/,
    /^tokens\/compat-alias-map\.json$/,
    /^tokens\/generated\/(compat-alias-map|opacity-floors|persona-preset-map)\.json$/,
  ];
  const outsideLayout = (paths: string[]) => paths.filter((p) => !LAYOUT.some((re) => re.test(p)));

  test('every tracked tokens/ file is on the REQ-MAT-01 layout', () => {
    const tracked = execFileSync('git', ['ls-files', 'tokens'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
    expect(tracked.length).toBeGreaterThan(20);
    expect(outsideLayout(tracked)).toEqual([]);
    // failing fixture: the removed 4.x-era files are rejected
    expect(outsideLayout(['tokens/schema.json', 'tokens/index.json', 'tokens/personas/aura.json', 'tokens/sys/app-shell.tokens.json']))
      .toHaveLength(4);
  });

  test('every comp/ row names the task that requested it (ag.requestedBy)', () => {
    const missing: string[] = [];
    const walk = (node: Record<string, unknown>, path: string[], file: string) => {
      for (const [k, v] of Object.entries(node)) {
        if (k.startsWith('$') || !v || typeof v !== 'object') continue;
        const leaf = v as Record<string, unknown>;
        if ('$value' in leaf) {
          const ext = (leaf.$extensions ?? {}) as Record<string, unknown>;
          if (typeof ext['ag.requestedBy'] !== 'string') missing.push(`${file}: ${[...path, k].join('.')}`);
        } else walk(leaf, [...path, k], file);
      }
    };
    const comp = files.filter((f) => /[\\/]tokens[\\/]comp[\\/]/.test(f));
    expect(comp.length).toBeGreaterThan(0);
    for (const f of comp) walk(JSON.parse(readFileSync(f, 'utf8')), [], f);
    expect(missing).toEqual([]);
  });

  test('missing ag.tier fails', () => {
    const f = join(ROOT, 'tests/tokens/fixtures/missing-tier.tokens.json');
    const errors = validateTokenFile(JSON.parse(readFileSync(f, 'utf8')), schema, f) as Array<{ path: string; message: string }>;
    expect(errors.map((e) => `${e.path}: ${e.message}`).join('\n')).toMatch(/ag\.tier/);
  });
});
