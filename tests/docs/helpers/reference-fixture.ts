/* tests/docs/helpers/reference-fixture.ts — REQ-PLAT-100. A minimal repo on disk
   for the generated-reference tests: package.json, build/exports.manifest.json,
   src/foundation (defineMeta), one or more components with *.meta.ts, and
   optional apps/docs/examples. Components are plain functions (no React import)
   so the TypeScript program needs nothing from node_modules. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export interface FixtureProp { name: string; type: string; optional?: boolean; doc?: string | null; default?: string }
export interface FixtureComponent {
  name: string;
  dir: string;                 // under src/, e.g. 'widget'
  tier?: 'T0' | 'T1' | 'T2' | 'preview';
  parts?: string[];
  states?: string[];
  props: FixtureProp[];
  exported?: boolean;          // false: meta exists but the entry does not export the component
  selectors?: Record<string, string>;
}

const propLine = (p: FixtureProp) => {
  const tags = [p.doc ?? '', p.default ? `@default ${p.default}` : ''].filter(Boolean);
  const doc = p.doc === null || !tags.length ? '' : `  /** ${tags.join('\n   * ')} */\n`;
  return `${doc}  ${p.name}${p.optional ? '?' : ''}: ${p.type};`;
};

export function propsInterface(c: FixtureComponent): string {
  return `export interface ${c.name}Props {\n${c.props.map(propLine).join('\n')}\n}\n`;
}

export function metaSource(c: FixtureComponent): string {
  return `import { defineMeta } from '../foundation';

export default defineMeta({
  name: '${c.name}',
  owner: 'CMP',
  entry: '.',
  tier: '${c.tier ?? 'T1'}',
  rsc: 'client',
  parts: ${JSON.stringify(c.parts ?? ['root'])},
  states: ${JSON.stringify(c.states ?? ['open'])},
  variants: { size: ['sm', 'md'] },
  apg: 'button',
  migration: [{ from: 'Glass${c.name}', selectors: ${JSON.stringify(c.selectors ?? { [`.glass-${c.dir}`]: '[data-ag-part="root"]' })}, automation: 'full', compat: false }],
});
`;
}

export interface Fixture { root: string; write(rel: string, text: string): void; cleanup(): void }

export function makeFixture(components: FixtureComponent[], { version = '5.0.0-alpha.0', examples = {} as Record<string, Record<string, string>> } = {}): Fixture {
  const root = mkdtempSync(join(tmpdir(), 'ag-docs-ref-'));
  const write = (rel: string, text: string) => { const p = join(root, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, text); };
  write('package.json', JSON.stringify({ name: 'aura-glass', version, type: 'module' }, null, 2));
  write('build/exports.manifest.json', JSON.stringify({ version: 1, entries: [{ subpath: '.', source: 'src/index.ts', types: 'dist/index.d.ts', default: 'dist/index.js' }] }, null, 2));
  write('src/foundation/index.ts', 'export const defineMeta = <M>(meta: M): M => meta;\n');
  const index: string[] = [];
  for (const c of components) {
    write(`src/${c.dir}/${c.name}.tsx`, `${propsInterface(c)}\nexport function ${c.name}(props: ${c.name}Props): null { void props; return null; }\n`);
    write(`src/${c.dir}/${c.name}.meta.ts`, metaSource(c));
    if (c.exported !== false) index.push(`export { ${c.name} } from './${c.dir}/${c.name}';`, `export type { ${c.name}Props } from './${c.dir}/${c.name}';`);
  }
  write('src/index.ts', `${index.join('\n')}\nexport {};\n`);
  for (const [slug, files] of Object.entries(examples)) for (const [name, text] of Object.entries(files)) write(`apps/docs/examples/${slug}/${name}.tsx`, text);
  return { root, write, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

/** Pack the fixture's components as a published-style tarball whose only types are dist/index.d.ts. */
export function packFixture(fixture: Fixture, components: FixtureComponent[]): string {
  const stage = join(fixture.root, '.stage', 'package');
  mkdirSync(join(stage, 'dist'), { recursive: true });
  writeFileSync(join(stage, 'package.json'), JSON.stringify({
    name: 'aura-glass', version: '5.0.0-alpha.0', type: 'module',
    exports: { '.': { types: './dist/index.d.ts', default: './dist/index.js' }, './package.json': './package.json' },
  }, null, 2));
  const dts = components.filter((c) => c.exported !== false)
    .map((c) => `${propsInterface(c)}export declare function ${c.name}(props: ${c.name}Props): null;\n`).join('\n');
  writeFileSync(join(stage, 'dist/index.d.ts'), `${dts}export {};\n`);
  writeFileSync(join(stage, 'dist/index.js'), 'export {};\n');
  const tgz = join(fixture.root, '.artifacts', 'pack', 'aura-glass-5.0.0-alpha.0.tgz');
  mkdirSync(dirname(tgz), { recursive: true });
  execFileSync('tar', ['-czf', tgz, '-C', join(fixture.root, '.stage'), 'package']);
  return tgz;
}
