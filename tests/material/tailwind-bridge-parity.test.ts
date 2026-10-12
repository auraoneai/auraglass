/* @jest-environment node */
/* MAT-133 — tailwind-bridge parity (REQ-MAT-01): the normalised declaration
   blocks of @utility glass-regular, glass-clear, glass-thin, glass-thick and
   content-raised in the DS Tailwind bridge equal their [data-ag-*] attribute
   counterparts byte for byte.
   The bridge is a token-compiler output (scripts/tokens/build.mjs writes
   dist/tailwind.css, the ./tailwind.css subpath file, MAT-068). The
   suite compiles the tokens into a temp root (the same --out flag the
   determinism test uses) and reads the bridge and ladders.css from there, so it
   needs no prior dist build and never touches the working tree. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import postcss from 'postcss';

const ROOT = join(__dirname, '../..');

/** [utility, attribute selector of its counterpart cell]. */
const PAIRS: Array<[string, string]> = [
  ['glass-regular', '[data-ag-surface][data-ag-variant="regular"][data-ag-thickness="regular"]'],
  ['glass-clear', '[data-ag-surface][data-ag-variant="clear"][data-ag-thickness="regular"]'],
  ['glass-thin', '[data-ag-surface][data-ag-variant="regular"][data-ag-thickness="thin"]'],
  ['glass-thick', '[data-ag-surface][data-ag-variant="regular"][data-ag-thickness="thick"]'],
  ['content-raised', '[data-ag-surface][data-ag-content="content-raised"][data-ag-thickness="regular"]'],
];

const normalise = (decl: postcss.Declaration) => `${decl.prop}: ${decl.value}`.replace(/\s+/g, ' ');

let bridge: postcss.Root;
let ladders: postcss.Root;

beforeAll(() => {
  const out = mkdtempSync(join(tmpdir(), 'ag-mat133-'));
  execFileSync(process.execPath, ['scripts/tokens/build.mjs', '--out', out], { cwd: ROOT, stdio: 'pipe' });
  const bridgeFile = join(out, 'dist/tailwind.css');
  const laddersFile = join(out, 'src/material/css/generated/ladders.css');
  expect(existsSync(bridgeFile)).toBe(true);
  expect(existsSync(laddersFile)).toBe(true);
  bridge = postcss.parse(readFileSync(bridgeFile, 'utf8'));
  ladders = postcss.parse(readFileSync(laddersFile, 'utf8'));
}, 120_000);

/** Declarations of `@utility <name>` in the bridge (null when absent). */
const utilityDecls = (name: string): string[] | null => {
  let decls: string[] | null = null;
  bridge.walkAtRules('utility', (r) => {
    if (r.params.trim() === name) {
      decls = (r.nodes ?? []).filter((n): n is postcss.Declaration => n.type === 'decl').map(normalise);
    }
  });
  return decls;
};

/** Declarations of the base (@layer ag.material, not @media-scoped) attribute rule. */
const attributeDecls = (selector: string): string[] | null => {
  let decls: string[] | null = null;
  ladders.walkRules((r) => {
    if ((r.parent as postcss.AtRule | undefined)?.name !== 'layer') return;
    if (r.selector.replace(/\s+/g, ' ') !== selector) return;
    decls = (r.nodes ?? [])
      .filter((n): n is postcss.Declaration => n.type === 'decl')
      .map(normalise)
      .filter((d) => !d.startsWith('--_ag-ladder-'));
  });
  return decls;
};

describe('tailwind bridge parity (MAT-133)', () => {
  it.each(PAIRS)('@utility %s equals its attribute rule byte for byte', (utility, selector) => {
    const util = utilityDecls(utility);
    const attr = attributeDecls(selector);
    expect(util).not.toBeNull();
    expect(attr).not.toBeNull();
    expect(attr!.length).toBeGreaterThan(0);
    expect(util).toEqual(attr);
  });
});
