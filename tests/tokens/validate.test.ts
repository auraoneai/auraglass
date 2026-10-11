/** @jest-environment node */
import { describe, test, expect, afterAll } from '@jest/globals';
// FIN-D D.3-01 (R22, MAT-328): scripts/tokens/validate.mjs is the single owner of the
// 'ag-rendered' value shape. tokens/legacy/* carries pre-resolved, verbatim rendered CSS
// strings; such a token validates, and a non-string $value fails with its message.
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
// @ts-ignore mjs module
import { ROOT, loadSchema, validateTokenFile } from '../../scripts/tokens/validate.mjs';

type Err = { path: string; message: string };

const schema = loadSchema(join(ROOT, 'tokens/$schema.json'));
const LEGACY_FILE = join(ROOT, 'tokens/legacy/4x-rendered.tokens.json');

/** First real token of tokens/legacy/4x-rendered.tokens.json, re-typed as 'ag-rendered'. */
function legacyTokenAsRendered(): { name: string; token: Record<string, unknown> } {
  const tree = JSON.parse(readFileSync(LEGACY_FILE, 'utf8'));
  const [name, token] = Object.entries(tree.legacy as Record<string, Record<string, unknown>>)
    .find(([, t]) => t && typeof t === 'object' && '$value' in t)!;
  return { name, token: { ...token, $type: 'ag-rendered' } };
}

const tmp = mkdtempSync(join(tmpdir(), 'ag-validate-rendered-'));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe("validate.mjs 'ag-rendered' value shape (D.3-01, MAT-328)", () => {
  test('a tokens/legacy token with $type ag-rendered and a string $value validates', () => {
    const { name, token } = legacyTokenAsRendered();
    expect(typeof token.$value).toBe('string');
    expect((token.$extensions as Record<string, unknown>)['ag.tier']).toBe('legacy');
    const errors = validateTokenFile({ legacy: { [name]: token } }, schema, LEGACY_FILE) as Err[];
    expect(errors).toEqual([]);
  });

  test('group-level $type ag-rendered is inherited and validates rendered CSS strings', () => {
    const tree = {
      legacy: {
        $type: 'ag-rendered',
        'glass-blur-md': {
          $value: 'blur(12px) saturate(1.4)',
          $extensions: { 'ag.legacyVar': '--glass-blur-md', 'ag.legacy': true, 'ag.tier': 'legacy' },
        },
      },
    };
    expect(validateTokenFile(tree, schema, LEGACY_FILE)).toEqual([]);
  });

  test.each([
    ['number', 12, 'type number not in string'],
    ['object', { value: 12, unit: 'px' }, 'type object not in string'],
    ['array', ['255', '255', '255'], 'type array not in string'],
  ])('a non-string (%s) ag-rendered $value fails with its message', (_kind, value, message) => {
    const { name, token } = legacyTokenAsRendered();
    const errors = validateTokenFile({ legacy: { [name]: { ...token, $value: value } } }, schema, LEGACY_FILE) as Err[];
    expect(errors).toHaveLength(1);
    expect(errors[0]?.path).toBe(`${LEGACY_FILE} at $.legacy.${name}`);
    expect(errors[0]?.message).toBe(`$.legacy.${name}.$value: ${message}`);
  });

  test('an alias $value is still accepted for ag-rendered (aliases skip the shape check)', () => {
    const { name, token } = legacyTokenAsRendered();
    expect(validateTokenFile({ legacy: { [name]: { ...token, $value: '{legacy.glass-color-black}' } } }, schema, LEGACY_FILE))
      .toEqual([]);
  });

  test('CLI: exits 0 for a valid ag-rendered file and 1 naming the path for a non-string value', () => {
    const { name, token } = legacyTokenAsRendered();
    const good = join(tmp, 'good.tokens.json');
    const bad = join(tmp, 'bad.tokens.json');
    writeFileSync(good, JSON.stringify({ legacy: { [name]: token } }));
    writeFileSync(bad, JSON.stringify({ legacy: { [name]: { ...token, $value: 42 } } }));
    const cli = join(ROOT, 'scripts/tokens/validate.mjs');

    const ok = spawnSync(process.execPath, [cli, good], { encoding: 'utf8' });
    expect(ok.status).toBe(0);
    expect(ok.stdout).toMatch(/tokens: 1 file\(s\) valid/);

    const ko = spawnSync(process.execPath, [cli, bad], { encoding: 'utf8' });
    expect(ko.status).toBe(1);
    expect(ko.stderr).toContain(`${bad} at $.legacy.${name}: $.legacy.${name}.$value: type number not in string`);
  });
});
