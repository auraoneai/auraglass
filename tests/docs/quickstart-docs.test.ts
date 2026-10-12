/** @jest-environment node */
/* tests/docs/quickstart-docs.test.ts — REQ-PLAT-103 (PLAT-386, PLAT-390).
   The quickstart documents themselves: every variant the remote spec runs is
   ≤6 one-command steps and ≤2 manual edits from create-next-app@latest /
   npm create vite@latest (react-ts) to the app-frame block, with no @source,
   tsconfig edit or optional-peer install; and the README quick start is the
   region gen-readme renders from next.md. The execution itself is the remote
   tests/dx/quickstart.spec.ts. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  commandOf, countSteps, parseQuickstart, renderReadmeQuickstart, stepsFor, validateVariant,
} from '../../scripts/docs/quickstart-steps.mjs';
import { fillQuickstart, generate } from '../../scripts/docs/gen-readme.mjs';

const root = join(__dirname, '..', '..');
const read = (rel: string) => readFileSync(join(root, rel), 'utf8');
const CELLS: ReadonlyArray<readonly ['next' | 'vite', 'tailwind' | 'plain']> = [
  ['next', 'tailwind'], ['next', 'plain'], ['vite', 'plain'], ['vite', 'tailwind'],
];

describe('docs/quickstart conform to REQ-PLAT-103', () => {
  it.each(CELLS)('%s × %s: ≤6 commands, ≤2 edits, no forbidden steps', (framework, variant) => {
    const blocks = parseQuickstart(read(`docs/quickstart/${framework}.md`));
    expect(validateVariant(blocks, variant, framework)).toEqual([]);
    const { commands, edits } = countSteps(stepsFor(blocks, variant));
    expect(commands).toBeGreaterThanOrEqual(5);
    expect(commands).toBeLessThanOrEqual(6);
    expect(edits).toBeGreaterThanOrEqual(1);
    expect(edits).toBeLessThanOrEqual(2);
  });

  it('each variant executes scaffold → install → init → add → edit → run in that order', () => {
    for (const [framework, variant] of CELLS) {
      const phases = stepsFor(parseQuickstart(read(`docs/quickstart/${framework}.md`)), variant)
        .filter((b: { kind: string }) => b.kind === 'step')
        .map((b: { phase: string }) => b.phase);
      const order = [...new Set(phases)];
      expect(order).toEqual(['scaffold', 'install', 'init', 'add', 'edit', 'run']);
    }
  });

  it('the Next variants differ only in the scaffold flags; both edit app/page.tsx', () => {
    const blocks = parseQuickstart(read('docs/quickstart/next.md'));
    const cmds = (v: string) => stepsFor(blocks, v).filter((b: { phase: string; file: string | null }) => b.phase === 'scaffold' && !b.file).map(commandOf);
    expect(cmds('tailwind')).toEqual(['npx create-next-app@latest my-app --yes', 'cd my-app']);
    expect(cmds('plain')).toEqual(['npx create-next-app@latest my-app --yes --no-tailwind', 'cd my-app']);
    for (const v of ['tailwind', 'plain']) {
      expect(stepsFor(blocks, v).filter((b) => b.file).map((b) => b.file)).toEqual(['app/page.tsx']);
    }
  });

  it('Tailwind setup on Vite is a counted-out precondition, not an AuraGlass step', () => {
    const blocks = parseQuickstart(read('docs/quickstart/vite.md'));
    const prep = stepsFor(blocks, 'tailwind').filter((b: { kind: string }) => b.kind === 'prepare');
    expect(prep.map((b: { file: string | null; body: string }) => b.file ?? b.body.trim())).toEqual([
      'npm install tailwindcss @tailwindcss/vite', 'vite.config.ts', 'src/index.css',
    ]);
    expect(stepsFor(blocks, 'plain').some((b: { kind: string }) => b.kind === 'prepare')).toBe(false);
  });
});

describe('quickstart step parser', () => {
  it('rejects a shell step with two commands (one command per block)', () => {
    const md = '{step scaffold}\n```bash\nnpx create-next-app@latest my-app --yes\ncd my-app\n```\n';
    const blocks = parseQuickstart(md);
    expect(blocks).toHaveLength(1);
    expect(() => commandOf(blocks[0]!)).toThrow(/exactly one command, found 2/);
  });

  it('rejects a tag without a fence and unknown attributes', () => {
    expect(() => parseQuickstart('{step run}\n\nnpm run dev\n')).toThrow(/not followed by a fenced block/);
    expect(() => parseQuickstart('{step run where=x}\n```bash\nnpm run dev\n```\n')).toThrow(/unknown attribute where/);
  });

  it('flags @source, tsconfig edits, optional peers and too many commands', () => {
    const md = [
      '{step scaffold}', '```bash', 'npx create-next-app@latest my-app --yes', '```',
      '{step install}', '```bash', 'npm install aura-glass@next three', '```',
      '{step init}', '```bash', 'npx aura-glass-cli@latest init --yes', '```',
      '{step add}', '```bash', 'npx aura-glass-cli@latest add app-frame --yes', '```',
      '{step edit file=tsconfig.json}', '```json', '{}', '```',
      '{step edit file=app/globals.css}', '```css', '@source "../node_modules/aura-glass";', '```',
      '{step edit file=app/page.tsx}', '```tsx', 'export default function Page() { return null; }', '```',
      '{step run}', '```bash', 'npm run build', '```',
      '{step run}', '```bash', 'npm run lint', '```',
      '{step run}', '```bash', 'npm run dev', '```',
    ].join('\n');
    const errors = validateVariant(parseQuickstart(md), 'tailwind', 'next').join('\n');
    expect(errors).toMatch(/no tsconfig\.json edit/);
    expect(errors).toMatch(/no @source line/);
    expect(errors).toMatch(/adds three/);
    expect(errors).toMatch(/7 shell commands \(max 6\)/);
    expect(errors).toMatch(/3 manual edits \(max 2\)/);
  });
});

describe('README quick start is generated from next.md (generated:quickstart)', () => {
  it('README.md equals gen-readme output (run node scripts/docs/gen-readme.mjs)', () => {
    expect(read('README.md')).toBe(generate(root));
  });

  it('the region carries every Tailwind-variant command of next.md, in order', () => {
    const blocks = parseQuickstart(read('docs/quickstart/next.md'));
    const region = read('README.md').match(/<!-- generated:quickstart -->([\s\S]*?)<!-- \/generated:quickstart -->/)?.[1] ?? '';
    const cmds = stepsFor(blocks, 'tailwind').filter((b: { kind: string; file: string | null }) => b.kind === 'step' && !b.file).map(commandOf);
    let at = -1;
    for (const c of cmds) {
      const i = region.indexOf(c, at + 1);
      expect(i).toBeGreaterThan(at);
      at = i;
    }
    expect(region).toContain(renderReadmeQuickstart(blocks, 'tailwind'));
  });

  it('a changed next.md changes the region; missing markers fail', () => {
    const tmpl = 'a\n<!-- generated:quickstart -->\nold\n<!-- /generated:quickstart -->\nb\n';
    const md = read('docs/quickstart/next.md').replace('npm run dev', 'npm run dev -- --turbopack');
    expect(fillQuickstart(tmpl, md)).toContain('npm run dev -- --turbopack');
    expect(fillQuickstart(tmpl, md)).not.toContain('old');
    expect(() => fillQuickstart('no markers', md)).toThrow(/missing <!-- generated:quickstart -->/);
  });
});
