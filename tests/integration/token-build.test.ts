/** @jest-environment node */
import { describe, test, expect, beforeAll } from '@jest/globals';
// REQ-FIN-01 (REQ-MAT-01/-03/-13/-19 item 1/-21): token build remainder after #369.
// - emitted layered token CSS starts with LAYER_ORDER_STATEMENT on line 1
// - prettierFormat throws (no silent unformatted fallback) when prettier is missing
// - the build writes dist/compat/tokens.css once and never rewrites
//   tokens/contrast/busy-reference.json
// - the 4.x leftovers tokens/{schema,index}.json and tokens/personas/ stay deleted
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import postcss from 'postcss';
import { LAYER_ORDER_STATEMENT } from '../../src/contracts/tokens';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { layerFirst, loadPrettier, prettierFormat, LAYER_ORDER } from '../../scripts/tokens/formats/_shared.mjs';

const LAYERED_OUTPUTS = [
  'dist/tokens.css',
  'dist/css/tokens.css',
  'src/material/css/generated/ladders.css',
  'src/material/css/generated/floors.css',
  'src/material/css/generated/properties.css',
];

describe('layerFirst (REQ-MAT-19 item 1)', () => {
  test('emitter constant equals the contract constant', () => {
    expect(LAYER_ORDER).toBe(LAYER_ORDER_STATEMENT);
  });

  test('moves the statement above the header comment and keeps one copy', () => {
    const input = `/* @generated header */\n${LAYER_ORDER}\n\n@layer ag.material {\n  a { color: red; }\n}\n`;
    const out = layerFirst(input);
    const lines = out.split('\n');
    expect(lines[0]).toBe(LAYER_ORDER_STATEMENT);
    expect(lines[1]).toBe('/* @generated header */');
    expect(out.split(LAYER_ORDER_STATEMENT).length - 1).toBe(1);
    expect(out).toContain('@layer ag.material {\n  a { color: red; }\n}');
  });

  test('prepends the statement when the input has none', () => {
    const out = layerFirst('/* h */\n@property --x {\n  syntax: "<number>";\n  inherits: false;\n  initial-value: 0;\n}\n');
    expect(out.split('\n')[0]).toBe(LAYER_ORDER_STATEMENT);
    expect(out.split('\n')[1]).toBe('/* h */');
  });

  test('is idempotent', () => {
    const once = layerFirst(`/* h */\n\n${LAYER_ORDER}\n\n@layer ag.tokens {\n}\n`);
    expect(layerFirst(once)).toBe(once);
  });
});

describe('prettierFormat fails closed (REQ-MAT-03)', () => {
  const missing = () => { throw Object.assign(new Error("Cannot find module 'prettier'"), { code: 'MODULE_NOT_FOUND' }); };

  test('loadPrettier throws a named error when prettier cannot be resolved', () => {
    expect(() => loadPrettier(missing as unknown as NodeRequire)).toThrow(/prettier is required for tokens:build/);
  });

  test('prettierFormat rejects instead of returning unformatted code', async () => {
    await expect(prettierFormat('a{color:red}', 'css', missing as unknown as NodeRequire)).rejects.toThrow(/prettier is required/);
  });

  test('prettierFormat formats with the installed prettier', async () => {
    await expect(prettierFormat('a{color:red}', 'css')).resolves.toBe('a {\n  color: red;\n}\n');
  });
});

describe('token build outputs (REQ-FIN-01)', () => {
  let out: string;
  beforeAll(async () => {
    out = mkdtempSync(join(tmpdir(), 'ag-fin01-'));
    const { runBuild } = await import('../../scripts/tokens/build.mjs');
    await runBuild({ outRoot: out, quiet: true });
  }, 120000);

  test.each(LAYERED_OUTPUTS)('%s starts with LAYER_ORDER_STATEMENT on line 1', (rel) => {
    const css = readFileSync(join(out, rel), 'utf8');
    expect(css.split('\n')[0]).toBe(LAYER_ORDER_STATEMENT);
    const root = postcss.parse(css);
    const first = root.first as postcss.AtRule;
    expect(`@${first.name} ${first.params};`).toBe(LAYER_ORDER_STATEMENT);
  });

  test.each(LAYERED_OUTPUTS.filter((f) => f.startsWith('src/')))('committed %s equals a fresh build', (rel) => {
    expect(readFileSync(join(out, rel), 'utf8')).toBe(readFileSync(join(ROOT, rel), 'utf8'));
  });

  test('the build never writes tokens/contrast/busy-reference.json', () => {
    expect(existsSync(join(out, 'tokens/contrast/busy-reference.json'))).toBe(false);
  });

  test('dist/compat/tokens.css comes from the single compat writer', () => {
    const css = readFileSync(join(out, 'dist/compat/tokens.css'), 'utf8');
    expect(css).not.toContain('[object Object]');
    expect(css).not.toContain('$schema');
    const root = postcss.parse(css);
    let blocks = 0;
    root.walkAtRules('layer', (r) => { if (r.nodes && r.params.trim() === 'ag.compat') blocks += 1; });
    expect(blocks).toBe(1);
  });
});

test('4.x token leftovers are deleted (REQ-MAT-01)', () => {
  for (const rel of ['tokens/schema.json', 'tokens/index.json', 'tokens/personas'])
    expect({ rel, exists: existsSync(join(ROOT, rel)) }).toEqual({ rel, exists: false });
});
