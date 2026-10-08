/* @jest-environment node */
/* MAT-096: material-css-api generates {public, private, attributes,
   privateAttributes} from the contract registries and material sources.
   --check fails when a committed public name disappears without a css-var
   deprecations entry; data-ag-material in input exits non-zero (D-20). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(__dirname, '../../scripts/mat/material-css-api.mjs');
const FIX = join(__dirname, 'fixtures/css-api');

/** Assemble a fixture tree: shared contracts/material + a variant overlay. */
const makeTree = (variant: string) => {
  const root = mkdtempSync(join(tmpdir(), `ag-cssapi-${variant}-`));
  cpSync(join(FIX, 'shared'), root, { recursive: true });
  const vdir = join(FIX, variant);
  try {
    cpSync(vdir, root, { recursive: true });
  } catch { /* variant has no overlay */ }
  return root;
};

const run = (root: string, extra: string[] = []) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, '--root', root, ...extra], { encoding: 'utf8' });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('material-css-api', () => {
  it('emits public/private vars and attributes minus private attributes', () => {
    const root = makeTree('shared');
    const r = run(root);
    expect(r.code).toBe(0);
    const json = JSON.parse(readFileSync(join(root, 'etc/api/material.css-api.json'), 'utf8'));
    expect(json.public).toEqual([
      '--ag-duration-micro', '--ag-glass-opacity', '--ag-radius-outer', '--ag-specular',
    ]);
    expect(json.private).toEqual(['--_ag-blur']);
    expect(json.attributes).toEqual(['data-ag-layer', 'data-ag-surface']);
    expect(json.privateAttributes).toContain('data-ag-sizeclass');
    expect(json.privateAttributes).toContain('data-ag-lens-defs');
  });

  it('--check fails when a committed public name disappeared without a deprecation', () => {
    const root = makeTree('removed-var');
    const r = run(root, ['--check']);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/--ag-old-var/);
    expect(r.err).toMatch(/data-ag-gone/);
  });

  it('--check passes when removed names have css-var deprecation entries', () => {
    const root = makeTree('deprecated-var');
    const r = run(root, ['--check', '--deprecations', join(root, 'deprecations.json')]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/--check OK/);
  });

  it('exits non-zero when input contains data-ag-material (D-20)', () => {
    const root = makeTree('forbidden-attr');
    const r = run(root);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/data-ag-material/);
  });
});
