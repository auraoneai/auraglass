#!/usr/bin/env node
/* scripts/registry/render-setup.mjs — PLAT-370 / REQ-PLAT-97 setup for the
   remote render gate (tests/dx/registry-render.spec.ts, plat:test:registry).

   Builds and packs the three workspace artifacts (aura-glass,
   @auraglass/cli, @auraglass/registry) — the CLI is never fetched from the
   public npm registry, since the gate certifies THIS commit — then scaffolds
   one fresh Next 16 app and one fresh Vite app outside the repository tree,
   installs the packed tarballs, runs the packed `auraglass init --yes` and
   `auraglass add <item> --yes` against the candidate registry (every
   discovered block/item, inlined by scripts/registry/build.mjs; publication
   is the gate's output, so it cannot be its input), mounts each item's
   `Default` story as a production route, and builds both apps.

   Per-item and per-framework outcomes go to <dir>/manifest.json; the spec
   fails each item whose add/demo/build did not succeed, with the reason.
   This script exits non-zero only when the shared setup itself cannot run
   (build, pack, install, init).

   Usage: node scripts/registry/render-setup.mjs [--dir <workdir>]
   Default <dir>: $AG_REGISTRY_RENDER_DIR or <os.tmpdir()>/ag-registry-render. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(import.meta.url);

export function renderDir() {
  return process.env.AG_REGISTRY_RENDER_DIR ?? join(tmpdir(), 'ag-registry-render');
}

const argDir = (() => { const i = process.argv.indexOf('--dir'); return i > -1 ? process.argv[i + 1] : undefined; })();
const DIR = argDir ?? renderDir();

const run = (cmd, args, cwd, opts = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}  (cwd: ${cwd})`);
  return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...opts });
};
const tail = (e) => String(e?.stderr || e?.stdout || e?.message || e).split('\n').slice(-40).join('\n');

/* ---------------------------------------------------------------- items */
const index = JSON.parse(readFileSync(join(ROOT, 'registry/registry.json'), 'utf8'));
const items = (index.items ?? []).filter((i) => i.type === 'registry:block' || i.type === 'registry:item');
const sourceDir = (item) => join(ROOT, 'registry', item.type === 'registry:block' ? 'blocks' : 'items', item.name);

/* --------------------------------------------------------- build + pack */
function pack(cwdArgs) {
  const out = run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', join(DIR, 'pack'), ...cwdArgs], ROOT);
  const rep = JSON.parse(out.slice(out.indexOf('[')));
  return join(DIR, 'pack', rep[0].filename);
}

/* ------------------------------------------------- Default story -> demo */
/** Transpile the item's CSF story to plain JSX (types stripped by tsc, not by
    regex) and append a `RenderDefault` component that renders its primary
    story exactly as Storybook would: render(args) or <component {...args}/>,
    wrapped by the story's decorators. */
export function demoSource(item) {
  const dir = sourceDir(item);
  const story = existsSync(dir) ? readdirSync(dir).find((f) => f.endsWith('.stories.tsx')) : undefined;
  if (!story) return { error: `no *.stories.tsx in ${dir.slice(ROOT.length + 1)}` };
  const src = readFileSync(join(dir, story), 'utf8');
  /* Storybook's primary story: `Default`, else the first exported story. */
  const primary = /export const Default\b/.test(src) ? 'Default' : src.match(/export const ([A-Z]\w*)\b/)?.[1];
  if (!primary) return { error: `${story} exports no story` };
  const ts = require('typescript');
  const js = ts.transpileModule(src, {
    compilerOptions: { jsx: ts.JsxEmit.Preserve, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false },
    fileName: story,
  }).outputText;
  return {
    code: `'use client';\n${js}\n
import * as __React from 'react';
export function RenderDefault() {
  const s = ${primary} ?? {};
  const m = (typeof meta !== 'undefined' ? meta : undefined) ?? {};
  const args = { ...(m.args ?? {}), ...(s.args ?? {}) };
  const Base = () => (s.render ? s.render(args, {}) : m.component ? __React.createElement(m.component, args) : null);
  const decorators = [...(s.decorators ?? []), ...(m.decorators ?? [])];
  return __React.createElement(decorators.reduce((Inner, d) => () => d(Inner, { args }), Base));
}
`,
  };
}

const REG = join(DIR, 'registry');
let tarballs = {};

/* ------------------------------------------------------------- scaffolds */
const VERSIONS = { next: '16.0.0', react: '19.3.0', 'react-dom': '19.3.0', typescript: '5.9.3', vite: '7.3.7', '@vitejs/plugin-react': '^5.0.0', '@types/react': '^19.0.0', '@types/react-dom': '^19.0.0', '@types/node': '^22.0.0' };

function scaffold(fw) {
  const app = join(DIR, 'apps', fw);
  mkdirSync(app, { recursive: true });
  const w = (p, c) => { mkdirSync(dirname(join(app, p)), { recursive: true }); writeFileSync(join(app, p), c); };
  const deps = { 'aura-glass': `file:${tarballs['aura-glass']}`, react: VERSIONS.react, 'react-dom': VERSIONS['react-dom'] };
  const dev = { '@auraglass/cli': `file:${tarballs['@auraglass/cli']}`, '@auraglass/registry': `file:${tarballs['@auraglass/registry']}`, typescript: VERSIONS.typescript, '@types/react': VERSIONS['@types/react'], '@types/react-dom': VERSIONS['@types/react-dom'], '@types/node': VERSIONS['@types/node'] };
  if (fw === 'next') {
    deps.next = VERSIONS.next;
    w('package.json', JSON.stringify({ name: 'ag-render-next', private: true, scripts: { build: 'next build' }, dependencies: deps, devDependencies: dev }, null, 2) + '\n');
    w('next.config.ts', "import type { NextConfig } from 'next';\nconst nextConfig: NextConfig = { output: 'export', trailingSlash: true, images: { unoptimized: true }, turbopack: {} };\nexport default nextConfig;\n");
    w('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', incremental: true, plugins: [{ name: 'next' }], paths: { '@/*': ['./*'] } }, include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }, null, 2) + '\n');
    w('app/globals.css', '');
    w('app/layout.tsx', "import './globals.css';\nimport { AuraGlassProvider, AuraGlassScript } from 'aura-glass';\nimport type { ReactNode } from 'react';\n\nexport const metadata = { title: 'AuraGlass registry render' };\n\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang=\"en\" suppressHydrationWarning>\n      <head><AuraGlassScript /></head>\n      <body><AuraGlassProvider>{children}</AuraGlassProvider></body>\n    </html>\n  );\n}\n");
    w('app/page.tsx', 'export default function Home() { return null; }\n');
  } else {
    Object.assign(dev, { vite: VERSIONS.vite, '@vitejs/plugin-react': VERSIONS['@vitejs/plugin-react'] });
    w('package.json', JSON.stringify({ name: 'ag-render-vite', private: true, type: 'module', scripts: { build: 'vite build' }, dependencies: deps, devDependencies: dev }, null, 2) + '\n');
    w('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom', 'dom.iterable', 'es2022'], module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, allowJs: true, isolatedModules: true, noEmit: true, paths: { '@/*': ['./*'] } }, include: ['src', 'components'] }, null, 2) + '\n');
    w('src/index.css', '');
    w('index.html', '<!doctype html>\n<html lang="en"><head><meta charset="utf-8" /><title>AuraGlass registry render</title></head><body><div id="root"></div></body></html>\n');
  }
  run('git', ['init', '-q'], app);
  run('npm', ['install', '--no-audit', '--no-fund', '--legacy-peer-deps'], app, { stdio: 'inherit' });
  const commit = (msg) => {
    run('git', ['add', '-A'], app);
    run('git', ['-c', 'user.name=ag-render', '-c', 'user.email=ag-render@invalid', 'commit', '-q', '--allow-empty', '-m', msg], app);
  };
  writeFileSync(join(app, '.gitignore'), 'node_modules\n.next\nout\ndist\n');
  commit('scaffold');
  run(join(app, 'node_modules/.bin/auraglass'), ['init', '--yes'], app);
  commit('auraglass init');
  return app;
}

/* PLAT's Vite entry-css resolver (canaries/vite): maps `aura-glass/<entry>.css`
   to the `css` condition of the installed package's `./<entry>` export. */
function viteConfig(inputs) {
  const canary = readFileSync(join(ROOT, 'canaries/vite/vite.config.ts'), 'utf8');
  const input = Object.fromEntries(inputs.map((n) => [n, `r/${n}/index.html`]));
  return canary.replace(/export default defineConfig\(\{[\s\S]*\}\);\s*$/, `export default defineConfig({\n  plugins: [auraGlassEntryCss(), react()],\n  build: { rollupOptions: { input: ${JSON.stringify(input)} } },\n});\n`);
}

function main() {
  rmSync(DIR, { recursive: true, force: true });
  mkdirSync(join(DIR, 'pack'), { recursive: true });
  if (!existsSync(join(ROOT, 'dist'))) run('npm', ['run', 'build'], ROOT, { stdio: 'inherit' });
  run('npm', ['run', 'build', '--workspace=@auraglass/cli'], ROOT, { stdio: 'inherit' });
  tarballs = {
    'aura-glass': pack([]),
    '@auraglass/cli': pack(['--workspace=@auraglass/cli']),
    '@auraglass/registry': pack(['--workspace=@auraglass/registry']),
  };

  /* --------------------------------------------------- candidate registry */
  mkdirSync(REG, { recursive: true });
  for (const item of index.items ?? []) writeFileSync(join(REG, `${item.name}.json`), JSON.stringify(item, null, 2) + '\n');

  const manifest = { version: 1, sha: process.env.CI_COMMIT_SHA ?? null, dir: DIR, tarballs, frameworks: {}, items: {} };
  for (const item of items) manifest.items[item.name] = { type: item.type, next: { status: 'pending' }, vite: { status: 'pending' } };

  for (const fw of ['next', 'vite']) {
    const app = scaffold(fw);
    const ok = [];
    for (const item of items) {
      const cell = manifest.items[item.name][fw];
      try {
        run(join(app, 'node_modules/.bin/auraglass'), ['add', item.name, '--yes', '--allow-dirty', '--registry', REG], app);
      } catch (e) { Object.assign(cell, { status: 'failed', stage: 'add', error: tail(e) }); continue; }
      const demo = demoSource(item);
      if (demo.error) { Object.assign(cell, { status: 'failed', stage: 'demo', error: demo.error }); continue; }
      const cfg = JSON.parse(readFileSync(join(app, 'auraglass.json'), 'utf8'));
      const compDir = String(cfg.components ?? 'components/aura').replace(/^@\//, '').replace(/\/$/, '');
      writeFileSync(join(app, compDir, item.name, 'ag-render-demo.jsx'), demo.code);
      if (fw === 'next') {
        mkdirSync(join(app, 'app/r', item.name), { recursive: true });
        writeFileSync(join(app, 'app/r', item.name, 'page.tsx'), `'use client';\nimport { RenderDefault } from '@/${compDir}/${item.name}/ag-render-demo.jsx';\n\nexport default function Page() {\n  return <RenderDefault />;\n}\n`);
      } else {
        mkdirSync(join(app, 'r', item.name), { recursive: true });
        mkdirSync(join(app, 'src/entries'), { recursive: true });
        writeFileSync(join(app, 'src/entries', `${item.name}.jsx`), `import { StrictMode, createElement } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport '../index.css';\nimport { RenderDefault } from '../../${compDir}/${item.name}/ag-render-demo.jsx';\n\ncreateRoot(document.getElementById('root')).render(createElement(StrictMode, null, createElement(RenderDefault)));\n`);
        writeFileSync(join(app, 'r', item.name, 'index.html'), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${item.name}</title></head><body><div id="root"></div><script type="module" src="/src/entries/${item.name}.jsx"></script></body></html>\n`);
      }
      ok.push(item.name);
      Object.assign(cell, { status: 'added' });
    }
    if (fw === 'vite') writeFileSync(join(app, 'vite.config.ts'), viteConfig(ok));
    const t0 = Date.now();
    try {
      run('npm', ['run', 'build'], app, { timeout: 900_000 });
      const outDir = join(app, fw === 'next' ? 'out' : 'dist');
      manifest.frameworks[fw] = { status: 'built', app, outDir, seconds: (Date.now() - t0) / 1000 };
      for (const n of ok) {
        const html = join(outDir, 'r', n, 'index.html');
        Object.assign(manifest.items[n][fw], existsSync(html) ? { status: 'built', route: `/r/${n}/` } : { status: 'failed', stage: 'build', error: `build emitted no r/${n}/index.html` });
      }
    } catch (e) {
      manifest.frameworks[fw] = { status: 'failed', app, error: tail(e) };
      for (const n of ok) Object.assign(manifest.items[n][fw], { status: 'failed', stage: 'build', error: `${fw} build failed:\n${tail(e)}` });
    }
  }

  writeFileSync(join(DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  if (process.env.AURAGLASS_EVIDENCE_DIR) {
    mkdirSync(process.env.AURAGLASS_EVIDENCE_DIR, { recursive: true });
    copyFileSync(join(DIR, 'manifest.json'), join(process.env.AURAGLASS_EVIDENCE_DIR, 'registry-render-setup.json'));
  }
  const counts = Object.values(manifest.items).flatMap((i) => [i.next.status, i.vite.status]).reduce((m, s) => ({ ...m, [s]: (m[s] ?? 0) + 1 }), {});
  console.log(`registry render setup: ${items.length} items, cells ${JSON.stringify(counts)}, manifest ${join(DIR, 'manifest.json')}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
