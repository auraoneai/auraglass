#!/usr/bin/env node
/* scripts/storybook/verify-showcase-imports.mjs — QUAL, REQ-QUAL-59 showcase hygiene (FIN-G G-27, REQ-FIN-107, FIN-455).

   Two modes:

   static (default; L1, runs anywhere):
     node scripts/storybook/verify-showcase-imports.mjs [--root <dir>] [--json <file>]
     Parses every file under showcase/** with the TypeScript compiler API and fails on:
       - imports other than `aura-glass`, `aura-glass/<subpath>` (a package.json export, never ./compat*),
         `registry/blocks/<id>/{index.tsx,fixtures.ts}`, files in the showcase's own folder, and the React peers
         (`@storybook/*` is allowed in *.stories.tsx as a type-only import);
       - explicitly banned specifiers: any `src/` path, `@/…`, `.storybook/…`, `aura-glass/compat`, stream internal
         fixtures (any fixtures path other than a registry block's fixtures.ts), tests/;
       - any 4.x `Glass*` name (deprecations.json `symbol`s) used as an identifier;
       - `!important`, colour literals (hex, colour functions, literal colour attributes), `[data-ag-part` selectors;
       - `style` props that set background*, backdrop*, filter, box-shadow, border*, color, opacity or
         mix-blend-mode (or any `style` value that is not an inline object literal, which cannot be checked);
       - non-deterministic calls in source: Math.random, Date.now, `new Date()`/`Date()` without an epoch,
         performance.now, crypto.randomUUID/getRandomValues, fetch, XMLHttpRequest, WebSocket, EventSource,
         navigator.sendBeacon (time comes from the fixed epoch through the `now` prop);
       - meta copy in the showcase's own strings: AuraGlass, glass, certification, Storybook (rule `copy`);
       - assets: only AVIF (checked by `ftyp` brand), <=300 KB each, <=12 per showcase, every file listed in
         assets/ASSETS.json with a licence, no image files outside assets/.

   build (L2, remote only — GitLab CI or the gated remote runner):
     AURAGLASS_TARBALL=<aura-glass-*.tgz> node scripts/storybook/verify-showcase-imports.mjs --build
     Installs the packed tarball (plus the React peers) into a temp project, copies showcase/ and the registry
     blocks the showcases import, and runs one Vite build over every showcase/**\/*.showcase.tsx. Fails on any
     unresolved import, and on any module that resolves outside the temp project (so nothing can silently come
     from the repository's src/). Invoked locally it prints the remote command and exits 2 (PRD-F §12 rule 6).

   Exit codes: 0 clean · 1 violations / build failure · 2 build mode outside a remote runner · 64 usage error.
   The report is written to --json <file>, else to .artifacts/qual/<CI_JOB_NAME_SLUG>/showcase-imports[-build].json
   when CI_JOB_NAME_SLUG is set (REQ-QUAL-60). */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(REPO, 'package.json'));

export const MAX_ASSET_BYTES = 300 * 1024;
export const MAX_ASSETS = 12;
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.tif', '.tiff', '.heic', '.avif']);
const SOURCE_EXT = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);
const REACT_PEERS = new Set(['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client']);
/** camelCase / kebab-case style keys a showcase may never set (REQ-QUAL-59). */
const BANNED_STYLE = /^(?:background|backdrop|webkitbackdrop|-webkit-backdrop|border|filter$|boxshadow$|box-shadow$|color$|opacity$|mixblendmode$|mix-blend-mode$)/i;
const COLOUR_ATTRS = new Set(['fill', 'stroke', 'color', 'stopColor', 'floodColor', 'lightingColor', 'bgcolor']);
const COLOUR_FN = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(/i;
const HEX = /(?:^|[^&\w])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})(?![\w-])/i;
const IMPORTANT = /!\s*important/i;
const PART_SELECTOR = /\[\s*data-ag-part/;
/** REQ-QUAL-59: no meta copy about AuraGlass, glass, certification or Storybook in the showcase's own strings
    (library components' own labels, e.g. the preferences panel's "Glass" transparency option, are not showcase
    copy; the rendered REQ-QUAL-50 list is checked in tests/showcase/showcase-a11y.test.tsx). */
export const META_COPY = [
  ['AuraGlass', /aura\s*-?\s*glass/i],
  ['glass', /\bglass(?:es|y)?\b|glass\s*morphism/i],
  ['certification', /\bcertif(?:y|ied|ication|icate)/i],
  ['Storybook', /story\s*book/i],
];

function loadTs() {
  return require('typescript');
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out.sort();
}

const posix = (p) => p.split(sep).join('/');

/** `aura-glass/<subpath>` specifiers the package exports (S-35 entries), minus compat and metadata files. */
export function allowedEntries(root) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const keys = Object.keys(pkg.exports ?? {});
  return new Set(keys
    .filter((k) => !/^\.\/compat(\/|$)/.test(k) && k !== './package.json' && k !== './deprecations.json')
    .map((k) => (k === '.' ? pkg.name : `${pkg.name}/${k.slice(2)}`)));
}

/** Every 4.x `Glass*` export name recorded in deprecations.json (the 5.0 names never start with `Glass`, except
    5.x-native names such as GlassPreferencesPanel, which are not deprecation symbols). */
export function legacyGlassNames(root) {
  const file = join(root, 'deprecations.json');
  if (!existsSync(file)) return new Set();
  const d = JSON.parse(readFileSync(file, 'utf8'));
  const names = new Set();
  for (const e of d.entries ?? []) {
    for (const n of [e.symbol, e.compat]) if (typeof n === 'string' && /^Glass[A-Z0-9]/.test(n)) names.add(n);
  }
  return names;
}

/** Classifies one import specifier of `file` (absolute). Returns null when allowed, else a violation message. */
export function classifyImport(spec, file, ctx) {
  const rel = posix(relative(ctx.root, file));
  const showcaseDir = rel.split('/').slice(0, 2).join('/');
  const isStory = /\.stories\.[jt]sx?$/.test(file);
  if (spec.startsWith('.') || spec.startsWith('/')) {
    const target = posix(relative(ctx.root, resolve(dirname(file), spec)));
    if (/(^|\/)src\//.test(target)) return `imports library source (${spec}); showcases import only public entries`;
    if (target.startsWith('.storybook/')) return `imports the Storybook shell (${spec})`;
    if (target.startsWith(`${showcaseDir}/`)) return null;
    const block = target.match(/^registry\/blocks\/([a-z0-9-]+)\/(index|fixtures)(\.tsx?|)$/);
    if (block) {
      const want = block[2] === 'index' ? 'index.tsx' : 'fixtures.ts';
      if (block[3] && block[3] !== extname(want)) return `registry block ${block[1]}: only ${want} may be imported (${spec})`;
      if (!existsSync(join(ctx.root, 'registry/blocks', block[1], want))) return `registry block ${block[1]}/${want} does not exist (${spec})`;
      return null;
    }
    if (/fixture/i.test(target) || target.startsWith('tests/')) return `imports a stream internal fixture (${spec}); only registry/blocks/<id>/fixtures.ts is allowed`;
    return `import outside the showcase folder (${spec} -> ${target}); allowed: own folder, registry/blocks/<id>/{index.tsx,fixtures.ts}`;
  }
  if (spec.startsWith('@/')) return `path alias import (${spec}) is banned`;
  if (/(^|\/)\.storybook(\/|$)/.test(spec)) return `imports the Storybook shell (${spec})`;
  if (/(^|\/)src(\/|$)/.test(spec)) return `imports library source (${spec})`;
  if (/^aura-glass\/compat(\/|$)/.test(spec)) return `aura-glass/compat is banned in showcases (${spec})`;
  if (ctx.entries.has(spec)) return null;
  if (spec === 'aura-glass' || spec.startsWith('aura-glass/')) return `${spec} is not a package export (allowed: ${[...ctx.entries].join(', ')})`;
  if (REACT_PEERS.has(spec)) return null;
  if (isStory && spec.startsWith('@storybook/')) return ctx.typeOnly ? null : `stories may import ${spec} only as a type-only import`;
  return `import of ${spec} is not allowed in showcases`;
}

function lineOf(sf, node) {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

function propName(ts, name) {
  if (!name) return null;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  return null;
}

/** Attributes/properties whose `#…` value is an in-page fragment or id reference, never a colour (`href="#feed"`). */
const FRAGMENT_KEYS = new Set(['href', 'xlinkHref', 'id', 'htmlFor', 'aria-controls', 'aria-labelledby', 'aria-describedby', 'aria-owns']);
function isFragmentRef(ts, node) {
  let p = node.parent;
  if (p && ts.isJsxExpression(p)) p = p.parent;
  if (p && ts.isJsxAttribute(p)) return FRAGMENT_KEYS.has(p.name.getText());
  if (p && ts.isPropertyAssignment(p)) return FRAGMENT_KEYS.has(propName(ts, p.name) ?? '');
  return false;
}

/** Static checks on one TS/TSX source. */
export function checkSource(file, text, ctx) {
  const ts = ctx.ts;
  const out = [];
  const rel = posix(relative(ctx.root, file));
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const add = (node, rule, message) => out.push({ file: rel, line: node ? lineOf(sf, node) : 1, rule, message });
  if (file.endsWith('.d.ts')) return out;

  const checkSpec = (node, spec, typeOnly) => {
    const msg = classifyImport(spec, file, { ...ctx, typeOnly });
    if (msg) add(node, 'import', msg);
  };
  const literalText = (node) => (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node)
    || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) || ts.isJsxText(node) ? node.text : null);

  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      checkSpec(node, node.moduleSpecifier.text, !!node.importClause?.isTypeOnly);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      checkSpec(node, node.moduleSpecifier.text, node.isTypeOnly);
    } else if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const arg = node.arguments[0];
      if ((callee.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(callee) && callee.text === 'require'))) {
        if (arg && ts.isStringLiteral(arg)) checkSpec(node, arg.text, false);
        else add(node, 'import', 'dynamic import/require with a computed specifier cannot be verified');
      }
      const callText = callee.getText(sf).replace(/\s+/g, '');
      if (/^(?:Math\.random|Date\.now|performance\.now|crypto\.randomUUID|crypto\.getRandomValues|(?:window\.|globalThis\.)?fetch|navigator\.sendBeacon)$/.test(callText)) {
        add(node, 'determinism', `${callText}() is non-deterministic; derive values from fixtures and the fixed-epoch \`now\` prop`);
      }
      if (callText === 'Date' && node.arguments.length === 0) add(node, 'determinism', 'Date() reads the wall clock; use the `now` prop');
    } else if (ts.isNewExpression(node)) {
      const ctor = node.expression.getText(sf);
      if (ctor === 'Date' && (!node.arguments || node.arguments.length === 0)) add(node, 'determinism', 'new Date() reads the wall clock; use new Date(now)');
      if (/^(?:XMLHttpRequest|WebSocket|EventSource)$/.test(ctor)) add(node, 'determinism', `new ${ctor}() makes a network request in a showcase`);
    } else if (ts.isIdentifier(node) && ctx.legacyGlass.has(node.text)) {
      add(node, 'legacy-name', `4.x name ${node.text} is banned in showcases (use the 5.0 name)`);
    } else if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf);
      const init = node.initializer;
      if (name === 'style' && init) {
        const expr = ts.isJsxExpression(init) ? init.expression : null;
        if (!expr || !ts.isObjectLiteralExpression(expr)) add(node, 'style', 'style must be an inline object literal (it cannot be checked otherwise)');
        else {
          for (const p of expr.properties) {
            const key = ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p) ? propName(ts, p.name) : null;
            if (key === null) { add(p, 'style', 'style object may contain only literal keys'); continue; }
            if (BANNED_STYLE.test(key)) add(p, 'style', `style sets ${key}; showcases never style material (background*, backdrop*, filter, box-shadow, border*, color, opacity, mix-blend-mode)`);
          }
        }
      }
      if (COLOUR_ATTRS.has(name) && init) {
        const v = ts.isStringLiteral(init) ? init.text : ts.isJsxExpression(init) && init.expression && literalText(init.expression);
        if (typeof v === 'string' && !/^(?:none|currentColor|inherit|transparent|var\(--ag-[\w-]+\))$/.test(v.trim())) {
          add(node, 'colour', `${name}="${v}" is a colour literal`);
        }
      }
    }
    const lit = literalText(node);
    if (lit !== null) {
      if (IMPORTANT.test(lit)) add(node, 'important', '`!important` in a showcase');
      if (COLOUR_FN.test(lit) || (HEX.test(lit) && !isFragmentRef(ts, node))) add(node, 'colour', `colour literal in ${JSON.stringify(lit.slice(0, 60))}`);
      if (PART_SELECTOR.test(lit)) add(node, 'part-selector', 'selector targeting [data-ag-part] in a showcase');
      const isSpecifier = node.parent && (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)
        || (ts.isCallExpression(node.parent) && (node.parent.expression.kind === ts.SyntaxKind.ImportKeyword
          || (ts.isIdentifier(node.parent.expression) && node.parent.expression.text === 'require'))));
      if (!isSpecifier) {
        for (const [label, re] of META_COPY) if (re.test(lit)) add(node, 'copy', `meta copy (${label}) in ${JSON.stringify(lit.slice(0, 60))}; showcase copy is product copy`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** Static checks on one showcase CSS module (stylelint.showcase.config.mjs is the property allowlist; these are the
    hygiene rules that must hold even if the stylelint row is mis-registered). */
export function checkCss(file, text, ctx) {
  const rel = posix(relative(ctx.root, file));
  const out = [];
  const body = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  body.split('\n').forEach((line, i) => {
    if (IMPORTANT.test(line)) out.push({ file: rel, line: i + 1, rule: 'important', message: '`!important` in showcase CSS' });
    if (PART_SELECTOR.test(line)) out.push({ file: rel, line: i + 1, rule: 'part-selector', message: 'selector targeting [data-ag-part]' });
    if (COLOUR_FN.test(line) || HEX.test(line)) out.push({ file: rel, line: i + 1, rule: 'colour', message: `colour literal: ${line.trim()}` });
  });
  return out;
}

function avifBrand(bytes) {
  return bytes.length >= 12 && bytes.subarray(4, 8).toString('latin1') === 'ftyp' && /^avi[fs]$/.test(bytes.subarray(8, 12).toString('latin1'));
}

/** Asset rules for one showcase folder. */
export function checkAssets(dir, ctx) {
  const rel = posix(relative(ctx.root, dir));
  const out = [];
  const add = (file, rule, message) => out.push({ file, line: 1, rule, message });
  const assetsDir = join(dir, 'assets');
  for (const f of walk(dir)) {
    const ext = extname(f).toLowerCase();
    if (IMAGE_EXT.has(ext) && !posix(f).startsWith(`${posix(assetsDir)}/`)) add(posix(relative(ctx.root, f)), 'asset', 'image outside assets/');
  }
  if (!existsSync(assetsDir)) return out;
  const files = walk(assetsDir).filter((f) => !f.endsWith('ASSETS.json'));
  if (files.length > MAX_ASSETS) add(`${rel}/assets`, 'asset', `${files.length} assets (max ${MAX_ASSETS})`);
  let manifest = null;
  const mfile = join(assetsDir, 'ASSETS.json');
  if (files.length && !existsSync(mfile)) add(`${rel}/assets/ASSETS.json`, 'asset', 'missing ASSETS.json (licence record)');
  else if (existsSync(mfile)) {
    try { manifest = JSON.parse(readFileSync(mfile, 'utf8')); } catch (e) { add(`${rel}/assets/ASSETS.json`, 'asset', `invalid JSON: ${e.message}`); }
  }
  const listed = new Map((manifest?.files ?? []).map((e) => [e.file, e]));
  if (manifest && !(typeof manifest.licence === 'string' && manifest.licence.trim())) add(`${rel}/assets/ASSETS.json`, 'asset', 'no licence recorded');
  for (const f of files) {
    const name = posix(relative(assetsDir, f));
    const frel = posix(relative(ctx.root, f));
    const bytes = readFileSync(f);
    if (extname(f).toLowerCase() !== '.avif' || !avifBrand(bytes)) add(frel, 'asset', 'assets must be AVIF (ftyp avif/avis)');
    if (bytes.length > MAX_ASSET_BYTES) add(frel, 'asset', `${bytes.length} bytes (max ${MAX_ASSET_BYTES})`);
    if (manifest && !listed.has(name)) add(frel, 'asset', 'not listed in ASSETS.json (licence unknown)');
    const entry = listed.get(name);
    if (entry && entry.licence !== undefined && !(typeof entry.licence === 'string' && entry.licence.trim())) add(frel, 'asset', 'empty per-file licence');
  }
  for (const name of listed.keys()) {
    if (!existsSync(join(assetsDir, name))) add(`${rel}/assets/${name}`, 'asset', 'listed in ASSETS.json but missing');
  }
  return out;
}

export function makeContext(root) {
  return { root, ts: loadTs(), entries: allowedEntries(root), legacyGlass: legacyGlassNames(root) };
}

/** Runs every static rule over showcase/** of `root`. */
export function checkShowcases(root = REPO) {
  const ctx = makeContext(root);
  const base = join(root, 'showcase');
  const files = walk(base);
  const violations = [];
  for (const f of files) {
    const ext = extname(f);
    if (SOURCE_EXT.has(ext)) violations.push(...checkSource(f, readFileSync(f, 'utf8'), ctx));
    else if (ext === '.css') violations.push(...checkCss(f, readFileSync(f, 'utf8'), ctx));
  }
  const dirs = existsSync(base) ? readdirSync(base, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => join(base, e.name)).sort() : [];
  for (const d of dirs) violations.push(...checkAssets(d, ctx));
  const showcases = files.filter((f) => f.endsWith('.showcase.tsx')).map((f) => posix(relative(root, f)));
  return { showcases, files: files.length, violations };
}

/* ------------------------------------------------------------------ build mode (remote) */

function sh(cmd, args, cwd) {
  return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
}

/** Vite build of every showcase against the packed tarball installed in a temp project. */
export async function buildAgainstTarball(root, tarball, { keep = false } = {}) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const versions = { ...(pkg.peerDependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const work = mkdtempSync(join(tmpdir(), 'ag-showcase-imports-'));
  const errors = [];
  const outside = [];
  try {
    const deps = { [pkg.name]: pathToFileURL(resolve(tarball)).href, react: versions.react, 'react-dom': versions['react-dom'] };
    writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'ag-showcase-imports', private: true, type: 'module', dependencies: deps }, null, 2));
    sh('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts', '--prefer-offline', '--loglevel=error'], work);
    cpSync(join(root, 'showcase'), join(work, 'showcase'), { recursive: true });
    const { showcases } = checkShowcases(root);
    const blocks = new Set();
    for (const f of walk(join(root, 'showcase')).filter((p) => SOURCE_EXT.has(extname(p)))) {
      for (const m of readFileSync(f, 'utf8').matchAll(/registry\/blocks\/([a-z0-9-]+)\//g)) blocks.add(m[1]);
    }
    for (const b of blocks) cpSync(join(root, 'registry/blocks', b), join(work, 'registry/blocks', b), { recursive: true });
    const { build } = await import(pathToFileURL(require.resolve('vite')).href);
    const input = Object.fromEntries(showcases.map((s) => [s.replace(/^showcase\//, '').replace(/\.showcase\.tsx$/, '').replace(/\//g, '__'), join(work, s)]));
    const realWork = existsSync(work) ? (await import('node:fs')).realpathSync(work) : work;
    const guard = {
      name: 'ag-showcase-import-guard',
      enforce: 'post',
      async resolveId(source, importer, opts) {
        if (source.startsWith('\0') || !importer) return null;
        const r = await this.resolve(source, importer, { ...opts, skipSelf: true });
        if (!r) { errors.push(`${posix(relative(realWork, importer))}: unresolved import ${source}`); return null; }
        if (!r.external && !r.id.startsWith('\0')) {
          const id = r.id.split('?')[0];
          if (!id.startsWith(realWork) && !id.startsWith(work)) outside.push(`${posix(relative(realWork, importer))}: ${source} -> ${id}`);
        }
        return r;
      },
    };
    try {
      await build({
        root: work,
        configFile: false,
        logLevel: 'warn',
        plugins: [guard],
        esbuild: { jsx: 'automatic' },
        resolve: { preserveSymlinks: false },
        build: { outDir: join(work, 'dist'), emptyOutDir: true, minify: false, write: true, rollupOptions: { input, preserveEntrySignatures: 'exports-only' } },
      });
    } catch (e) {
      errors.push(`vite build failed: ${e.message}`);
    }
    const installed = JSON.parse(readFileSync(join(work, 'node_modules', pkg.name, 'package.json'), 'utf8'));
    return { showcases, tarball, installed: `${installed.name}@${installed.version}`, blocks: [...blocks].sort(), errors, outside };
  } finally {
    if (!keep) rmSync(work, { recursive: true, force: true });
  }
}

/* ------------------------------------------------------------------ CLI */

function reportPath(args, suffix) {
  if (args.json) return resolve(args.json);
  const slug = process.env.CI_JOB_NAME_SLUG;
  return slug ? join(REPO, '.artifacts/qual', slug, `showcase-imports${suffix}.json`) : null;
}

function writeReport(file, data) {
  if (!file) return;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`report: ${posix(relative(REPO, file))}`);
}

function parseArgs(argv) {
  const args = { build: false, root: REPO, json: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--build') args.build = true;
    else if (a === '--root') args.root = resolve(argv[++i] ?? '');
    else if (a === '--json') args.json = argv[++i] ?? null;
    else { console.error(`verify-showcase-imports: unknown argument ${a}`); process.exit(64); }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.build) {
    const r = checkShowcases(args.root);
    writeReport(reportPath(args, ''), { mode: 'static', ...r });
    console.log(`verify-showcase-imports: ${r.showcases.length} showcase(s), ${r.files} file(s), ${r.violations.length} violation(s)`);
    for (const v of r.violations) console.error(`${v.file}:${v.line}: [${v.rule}] ${v.message}`);
    if (!r.showcases.length) { console.error('verify-showcase-imports: no showcase/**/*.showcase.tsx found'); process.exit(1); }
    process.exit(r.violations.length ? 1 : 0);
  }
  const remote = process.env.CI === 'true' || process.env.AG_REMOTE_RUNNER === '1';
  if (!remote) {
    console.error('verify-showcase-imports --build runs only on GitLab CI or the gated remote runner (machine policy).\n'
      + 'Remote command: node certification/run.mjs --lane L2 --scope pr   (job qual:certify:l2)');
    process.exit(2);
  }
  const tarball = process.env.AURAGLASS_TARBALL;
  if (!tarball || !existsSync(tarball) || !statSync(tarball).isFile()) {
    console.error(`verify-showcase-imports --build: AURAGLASS_TARBALL is unset or missing (${tarball ?? 'unset'}); the lane runner provides it on L2`);
    process.exit(1);
  }
  const r = await buildAgainstTarball(args.root, tarball);
  writeReport(reportPath(args, '-build'), { mode: 'build', ...r });
  console.log(`verify-showcase-imports --build: ${r.showcases.length} showcase(s) against ${r.installed}; blocks: ${r.blocks.join(', ')}`);
  for (const e of r.errors) console.error(e);
  for (const o of r.outside) console.error(`resolved outside the tarball project: ${o}`);
  process.exit(r.errors.length || r.outside.length || !r.showcases.length ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e?.stack ?? String(e)); process.exit(1); });
}
