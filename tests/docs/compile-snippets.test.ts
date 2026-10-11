/**
 * @jest-environment node
 */
/* tests/docs/compile-snippets.test.ts — REQ-PLAT-102 (PLAT-382). The snippet
   gate is one strict ts.Program (jsx react-jsx, moduleResolution bundler)
   against the packed .d.ts; fixtures prove a broken block fails, a correct
   block passes, {fragment} blocks are wrapped, jsx fences are checked, a
   subpath outside the exports map does not resolve, and a missing pack is an
   error when required. The repo-wide run is the CLI step `docs:snippets` in
   plat:test:docs (it needs the plat:package:pack tarball). */
import { describe, expect, it, beforeAll } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectSnippets, compile, main, parseFences, wrapSnippet, type Snippet } from '../../scripts/docs/compile-snippets.mjs';

const REPO = join(__dirname, '..', '..');

const BUTTON_DTS = `import type { ReactNode } from 'react';
export interface ButtonProps { variant?: 'primary' | 'ghost'; children?: ReactNode }
export declare function Button(props: ButtonProps): ReactNode;
`;

/** Fixture repo: package.json, exports manifest + source entries, md sources, a packed tarball. */
function fixture(md: Record<string, string>) {
  const root = mkdtempSync(join(tmpdir(), 'ag-snippets-'));
  symlinkSync(join(REPO, 'node_modules'), join(root, 'node_modules'), 'dir');
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'aura-glass', version: '5.0.0-alpha.0', type: 'module' }));
  mkdirSync(join(root, 'build'));
  writeFileSync(join(root, 'build/exports.manifest.json'), JSON.stringify({ entries: [
    { subpath: '.', source: 'src/index.ts' },
    { subpath: './theme', source: 'src/theme.ts' },
  ] }));
  mkdirSync(join(root, 'src'));
  writeFileSync(join(root, 'src/index.ts'), BUTTON_DTS.replace('export declare function Button(props: ButtonProps): ReactNode;', 'export function Button(props: ButtonProps): ReactNode { return props.children ?? null; }'));
  writeFileSync(join(root, 'src/theme.ts'), 'export const theme = { mode: "dark" as const };\n');
  writeFileSync(join(root, 'src/internal.ts'), 'export const secret = 1;\n');
  for (const [p, text] of Object.entries(md)) {
    mkdirSync(join(root, p, '..'), { recursive: true });
    writeFileSync(join(root, p), text);
  }
  // Packed tarball: package/{package.json,dist/index.d.ts} with an exports map that has no ./internal.
  const pkg = join(root, 'pack-src', 'package');
  mkdirSync(join(pkg, 'dist'), { recursive: true });
  writeFileSync(join(pkg, 'package.json'), JSON.stringify({
    name: 'aura-glass', version: '5.0.0-alpha.0', type: 'module',
    exports: { '.': { types: './dist/index.d.ts', default: './dist/index.js' }, './theme': { types: './dist/theme.d.ts', default: './dist/theme.js' } },
  }));
  writeFileSync(join(pkg, 'dist/index.d.ts'), BUTTON_DTS);
  writeFileSync(join(pkg, 'dist/theme.d.ts'), 'export declare const theme: { mode: "dark" };\n');
  mkdirSync(join(root, '.artifacts/pack'), { recursive: true });
  execFileSync('tar', ['-czf', join(root, '.artifacts/pack/aura-glass-5.0.0-alpha.0.tgz'), '-C', join(root, 'pack-src'), 'package']);
  return root;
}

const fence = (lang: string, code: string, meta = '') => '```' + lang + (meta ? ` ${meta}` : '') + '\n' + code + '\n```\n';

describe('parseFences / wrapSnippet', () => {
  it('finds indented, tilde and info-string fences and keeps the meta', () => {
    const src = ['# t', '  ```tsx {fragment}', '  <Button />', '  ```', '~~~ts', 'const a = 1;', '~~~', '````jsx', '```', '````'].join('\n');
    const f = parseFences(src);
    expect(f.map((x) => [x.line, x.lang, x.meta, x.code])).toEqual([[2, 'tsx', '{fragment}', '<Button />'], [5, 'ts', '', 'const a = 1;'], [8, 'jsx', '', '```']]);
  });
  it('wraps a {fragment} block in a generated component with imports hoisted', () => {
    const s: Snippet = { source: 'x.md', line: 1, lang: 'tsx', fragment: true, code: "import { Button } from 'aura-glass';\n<Button>Save</Button>" };
    const w = wrapSnippet(s);
    expect(w.text.startsWith("import { Button } from 'aura-glass';\n")).toBe(true);
    expect(w.text).toContain('export default function Snippet()');
    expect(w.text.split('\n')[w.offset]).toBe('<Button>Save</Button>');
  });
});

describe('compile (one strict program)', () => {
  let root: string;
  beforeAll(() => {
    root = fixture({
      'docs/guides/ok.md': fence('tsx', "import { Button } from 'aura-glass';\nexport const A = () => <Button variant=\"primary\">Save</Button>;") +
        fence('tsx', "import { Button } from 'aura-glass';\n<Button variant=\"ghost\">Go</Button>", '{fragment}') +
        fence('jsx', "import { Button } from 'aura-glass';\nexport const J = () => <Button>jsx</Button>;"),
      'docs/guides/bad.md': fence('tsx', "import { Button } from 'aura-glass';\nexport const B = () => <Button variant=\"nope\">x</Button>;"),
      'docs/guides/sub.md': fence('ts', "import { secret } from 'aura-glass/internal';\nexport const s = secret;"),
      'docs/guides/frag-unwrapped.md': fence('tsx', "import { Button } from 'aura-glass';\n<Button>a</Button>\n<Button>b</Button>"),
      'README.md': fence('ts', "import { theme } from 'aura-glass/theme';\nconst m: 'dark' = theme.mode;\nexport { m };"),
      'docs/guides/text.md': fence('text', 'not code') + fence('bash', 'npm i aura-glass'),
    });
  });

  it('collects ts/tsx/jsx fences from the roots and README, nothing else', () => {
    const s = collectSnippets(root);
    expect(s.map((x) => `${x.source}:${x.lang}${x.fragment ? '+f' : ''}`).sort()).toEqual([
      'README.md:ts', 'docs/guides/bad.md:tsx', 'docs/guides/frag-unwrapped.md:tsx',
      'docs/guides/ok.md:jsx', 'docs/guides/ok.md:tsx', 'docs/guides/ok.md:tsx+f', 'docs/guides/sub.md:ts',
    ]);
  });

  it('packed mode: types come from the tarball; broken, non-exported and multi-root JSX blocks fail', () => {
    const r = compile({ root, requirePacked: true });
    expect(r.types.mode).toBe('packed');
    expect(r.types.tarball).toBe('.artifacts/pack/aura-glass-5.0.0-alpha.0.tgz');
    expect(r.total).toBe(7);
    const failing = r.failures.map((f) => f.source).sort();
    expect(failing).toEqual(['docs/guides/bad.md', 'docs/guides/frag-unwrapped.md', 'docs/guides/sub.md']);
    const bad = r.failures.find((f) => f.source === 'docs/guides/bad.md')!;
    expect(bad.errors[0]!.code).toBe(2322);
    expect(bad.errors[0]!.line).toBe(3); // fence on line 1, author line 2
    expect(r.failures.find((f) => f.source === 'docs/guides/sub.md')!.errors[0]!.code).toBe(2307);
    expect(r.durationMs).toBeLessThan(r.budgetMs);
  });

  it('source mode maps exported subpaths only (no wildcard)', () => {
    const r = compile({ root, tarball: join(root, 'missing.tgz') });
    expect(r.types.mode).toBe('source');
    expect(r.failures.map((f) => f.source).sort()).toEqual(['docs/guides/bad.md', 'docs/guides/frag-unwrapped.md', 'docs/guides/sub.md']);
  });

  it('requirePacked without a tarball is an error; main exits 1 on failures', () => {
    expect(() => compile({ root, tarball: join(root, 'missing.tgz'), requirePacked: true })).toThrow(/plat:package:pack must run first/);
    expect(main(['--require-packed'], root)).toBe(1);
    expect(existsSync(join(root, '.artifacts/plat/docs-snippets.json'))).toBe(true);
  });

  it('main exits 0 when every snippet type-checks', () => {
    const clean = fixture({ 'docs/guides/ok.md': fence('tsx', "import { Button } from 'aura-glass';\n<Button>ok</Button>", '{fragment}') });
    expect(main(['--require-packed'], clean)).toBe(0);
  });

  it('the old snippets-baseline.json is gone', () => {
    expect(existsSync(join(REPO, 'scripts/docs/snippets-baseline.json'))).toBe(false);
  });
});
