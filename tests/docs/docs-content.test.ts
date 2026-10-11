/* @jest-environment node */
/* tests/docs/docs-content.test.ts — PLAT-381 (REQ-PLAT-101, FIN-162).
   The PLAT guides under apps/docs/content/guides/ must agree with the code
   they describe:
   - every guide page exists and renders through the docs app's markdown
     renderer (no block-level MDX import/export/JSX/HTML outside fences);
   - rsc.md is exactly what scripts/docs/gen-rsc-guide.mjs renders from
     build/server-safe-exports.json (REQ-PLAT-69) and the exports manifest;
   - the MCP snippets for Claude Code, Cursor and VS Code are valid JSON in
     each client's config shape and launch the real @auraglass/mcp bin;
   - the registry URL, shadcn interchange variables, layer statements,
     Tailwind utilities/variants, partial sheets and the Jest
     transformIgnorePatterns are the ones the build actually produces. */
import { describe, expect, it, jest } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ts from 'typescript';
import { LAYER_ORDER_STATEMENT, PUBLIC_CSS_VARS, TAILWIND_BRIDGE_ORDER } from '../../src/contracts/tokens';
import { manifest as tokenManifest } from '../../src/tokens/generated/manifest';
import { MANIFEST_PATH, RECORD_PATH, RSC_GUIDE_PATH, manifestJsSubpaths, renderRscGuide } from '../../scripts/docs/gen-rsc-guide.mjs';
import { generateBaseTheme } from '../../scripts/registry/build.mjs';

const ROOT = join(__dirname, '..', '..');
const GUIDES_DIR = 'apps/docs/content/guides';
const GUIDES = ['tailwind', 'plain-css', 'shadcn', 'nextjs', 'vite', 'react-router', 'testing', 'ai-agents'] as const;
/** REQ-PLAT-101 "all 11 files": 8 guides + generated rsc + the two quickstarts. */
const ALL_FILES = [...GUIDES.map((g) => `${GUIDES_DIR}/${g}.mdx`), RSC_GUIDE_PATH, 'docs/quickstart/next.md', 'docs/quickstart/vite.md'];

const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');
const guide = (name: (typeof GUIDES)[number]) => read(`${GUIDES_DIR}/${name}.mdx`);
const pkg = JSON.parse(read('package.json')) as { exports: Record<string, unknown> };

interface Fence { lang: string; code: string; line: number; section: string }
/** Fenced blocks with the nearest preceding heading. */
function fences(src: string): Fence[] {
  const out: Fence[] = [];
  const lines = src.split('\n');
  let section = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const h = /^#{1,6}\s+(.*)$/.exec(line);
    if (h) { section = (h[1] ?? '').trim(); continue; }
    const open = /^```(\S*)\s*$/.exec(line);
    if (!open) continue;
    const start = i;
    const body: string[] = [];
    for (i++; i < lines.length && !/^```\s*$/.test(lines[i] ?? ''); i++) body.push(lines[i] ?? '');
    if (i >= lines.length) throw new Error(`unterminated fence at line ${start + 1}`);
    out.push({ lang: open[1] ?? '', code: body.join('\n'), line: start + 1, section });
  }
  return out;
}
/** Prose lines (outside fences). */
function proseLines(src: string): Array<{ text: string; line: number }> {
  const out: Array<{ text: string; line: number }> = [];
  let inFence = false;
  src.split('\n').forEach((text, i) => {
    if (/^```/.test(text)) { inFence = !inFence; return; }
    if (!inFence) out.push({ text, line: i + 1 });
  });
  return out;
}

describe('PLAT guides exist (REQ-PLAT-101)', () => {
  it.each(ALL_FILES)('%s exists and starts with a title', (rel) => {
    expect(existsSync(join(ROOT, rel))).toBe(true);
    expect(read(rel).split('\n')[0]).toMatch(/^# \S/);
  });

  it('each guide route has exactly one source under apps/docs/content/guides', () => {
    // apps/docs/content wins over docs/guides in the docs app route table, so
    // the 4.x-era docs/guides/rsc.md placeholder is not what /guides/rsc shows.
    for (const g of [...GUIDES, 'rsc']) {
      const others = [`${GUIDES_DIR}/${g}.md`, `${GUIDES_DIR}/${g}.mdx`].filter((p) => existsSync(join(ROOT, p)));
      expect(others).toHaveLength(1);
    }
  });

  it.each([...GUIDES.map((g) => `${GUIDES_DIR}/${g}.mdx`), RSC_GUIDE_PATH])('%s is renderer-safe markdown (no MDX ESM, JSX or raw HTML blocks)', (rel) => {
    const bad = proseLines(read(rel)).filter(({ text }) => /^\s{0,3}(import|export)\s/.test(text) || /^\s{0,3}<[A-Za-z!/]/.test(text));
    expect(bad).toEqual([]);
  });

  it.each([...GUIDES.map((g) => `${GUIDES_DIR}/${g}.mdx`)])('%s: every ts/tsx/js fence parses', (rel) => {
    const problems: string[] = [];
    for (const f of fences(read(rel)).filter((x) => ['ts', 'tsx', 'js'].includes(x.lang))) {
      const res = ts.transpileModule(f.code, {
        reportDiagnostics: true,
        fileName: `snippet.${f.lang === 'js' ? 'js' : f.lang}`,
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, allowJs: true },
      });
      for (const d of res.diagnostics ?? []) problems.push(`${rel}:${f.line} ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
    }
    expect(problems).toEqual([]);
  });

  it('guides import only published aura-glass entry points', () => {
    const subpath = (s: string) => (s === 'aura-glass' ? '.' : `./${s.slice('aura-glass/'.length)}`);
    const specs = GUIDES.flatMap((g) =>
      [...guide(g).matchAll(/(?:from\s+|import\s+|@import\s+)["'](aura-glass(?:\/[^"']+)?)["']/g)].map((m) => ({ g, spec: m[1] ?? '' })));
    // nextjs, vite, react-router, tailwind, plain-css, testing, shadcn all show imports.
    expect(new Set(specs.map((s) => s.g)).size).toBeGreaterThanOrEqual(7);
    expect(specs.filter((s) => !Object.prototype.hasOwnProperty.call(pkg.exports, subpath(s.spec)))).toEqual([]);
  });
});

describe('rsc.md is generated from the server-safe record', () => {
  it(`${RECORD_PATH} exists (written by scripts/build/server-safe.mjs, REQ-PLAT-69)`, () => {
    expect(existsSync(join(ROOT, RECORD_PATH))).toBe(true);
  });

  it('the committed page equals the generator output for the committed record and manifest', () => {
    const page = renderRscGuide(read(RECORD_PATH), JSON.parse(read(MANIFEST_PATH)));
    expect(read(RSC_GUIDE_PATH)).toBe(page);
  });

  it('the entry table lists every JS entry of the manifest with the record verdict', () => {
    const record = JSON.parse(read(RECORD_PATH)) as { entries: Array<{ subpath: string; safe: boolean }> };
    const page = read(RSC_GUIDE_PATH);
    for (const subpath of manifestJsSubpaths(JSON.parse(read(MANIFEST_PATH)))) {
      const spec = subpath === '.' ? 'aura-glass' : `aura-glass/${subpath.slice(2)}`;
      const verdict = record.entries.find((e) => e.subpath === subpath)!.safe ? 'yes' : 'no';
      expect(page).toContain(`| \`${spec}\` | ${verdict} |`);
    }
  });

  it('the generator rejects a record that disagrees with the manifest', () => {
    const record = JSON.parse(read(RECORD_PATH)) as { entries: unknown[] };
    const broken = JSON.stringify({ ...record, entries: record.entries.slice(1) });
    expect(() => renderRscGuide(broken, JSON.parse(read(MANIFEST_PATH)))).toThrow(/missing from the record/);
  });

  it('--check exits 1 when the page drifts', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-rsc-'));
    const out = join(dir, 'rsc.md');
    writeFileSync(out, `${read(RSC_GUIDE_PATH)}\nedited by hand\n`);
    let status = 0;
    try { execFileSync('node', ['scripts/docs/gen-rsc-guide.mjs', '--check', '--out', out], { cwd: ROOT, stdio: 'pipe' }); } catch (e) { status = (e as { status: number }).status; }
    expect(status).toBe(1);
  });
});

describe('ai-agents.mdx MCP configuration snippets', () => {
  const mcpPkg = JSON.parse(read('packages/mcp/package.json')) as { name: string; bin: Record<string, string> };
  const blocks = fences(guide('ai-agents')).filter((f) => f.lang === 'json');
  type Server = { command?: unknown; args?: unknown; type?: unknown };
  const byClient = (client: string, key: 'mcpServers' | 'servers'): Server => {
    const hit = blocks.filter((b) => b.section === client);
    expect(hit).toHaveLength(1);
    const cfg = JSON.parse(hit[0]?.code ?? 'null') as Record<string, Record<string, Server> | undefined>;
    expect(Object.keys(cfg)).toEqual([key]);
    const server = cfg[key]?.auraglass;
    if (!server) throw new Error(`${client}: ${key}.auraglass missing`);
    return server;
  };
  const expectLaunchesPackage = (server: Server) => {
    expect(server.command).toBe('npx');
    expect(server.args).toEqual(['-y', mcpPkg.name]);
  };

  it('every json block parses', () => {
    expect(blocks.length).toBe(3);
    for (const b of blocks) expect(() => JSON.parse(b.code)).not.toThrow();
  });
  it('Claude Code: .mcp.json mcpServers shape', () => {
    expectLaunchesPackage(byClient('Claude Code', 'mcpServers'));
    expect(guide('ai-agents')).toContain(`claude mcp add auraglass -- npx -y ${mcpPkg.name}`);
  });
  it('Cursor: .cursor/mcp.json mcpServers shape', () => {
    expectLaunchesPackage(byClient('Cursor', 'mcpServers'));
  });
  it('VS Code: .vscode/mcp.json servers shape with type stdio', () => {
    const server = byClient('VS Code', 'servers');
    expect(server.type).toBe('stdio');
    expectLaunchesPackage(server);
  });
  it('npx can resolve the package bin (exactly one bin entry)', () => {
    expect(Object.keys(mcpPkg.bin)).toHaveLength(1);
    expect(existsSync(join(ROOT, 'packages/mcp/src/server.ts'))).toBe(true);
  });
});

describe('registry URL and shadcn base', () => {
  const docsBase = (): string => {
    const saved = { DOCS_BASE_URL: process.env.DOCS_BASE_URL, CI_PAGES_URL: process.env.CI_PAGES_URL };
    delete process.env.DOCS_BASE_URL; delete process.env.CI_PAGES_URL;
    try {
      let base = '';
      // Fresh module registry so paths.mjs re-reads the (cleared) environment.
      jest.isolateModules(() => { base = (require('../../scripts/docs/paths.mjs') as { DOCS_BASE_URL: string }).DOCS_BASE_URL; });
      return base;
    } finally {
      for (const [k, v] of Object.entries(saved)) if (v !== undefined) process.env[k] = v;
    }
  };

  it('ai-agents.mdx and shadcn.mdx use the published registry location', () => {
    const base = docsBase();
    expect(base).toMatch(/^https:\/\/.+\/$/);
    expect(guide('ai-agents')).toContain(`${base}r/`);
    expect(guide('shadcn')).toContain(`npx shadcn@latest add ${base}r/auraglass.json`);
    expect(existsSync(join(ROOT, 'registry/base/auraglass/registry-item.json'))).toBe(true);
    expect(existsSync(join(ROOT, 'registry/blocks/auth/registry-item.json'))).toBe(true);
  });

  it('shadcn.mdx documents exactly the interchange variables the base item sets', () => {
    const bridge = generateBaseTheme(null).cssVars.light as Record<string, string>;
    expect(Object.keys(bridge).sort()).toEqual([...PUBLIC_CSS_VARS.shadcn].sort());
    const rows = [...guide('shadcn').matchAll(/^\| `(--[a-z-]+)` \| `([^`]+)` \|$/gm)].map((m) => [m[1], m[2]]);
    expect(Object.fromEntries(rows)).toEqual(bridge);
  });
});

describe('CSS guides match the build', () => {
  it('plain-css.mdx quotes the shipped layer statement and the unlayered override the remote spec verifies', () => {
    const src = guide('plain-css');
    expect(src).toContain(LAYER_ORDER_STATEMENT);
    expect(src).toContain('.cta[data-ag-part="root"] {\n  border-radius: 0;\n}');
    expect(src).toContain('<Button className="cta">');
    expect(src).not.toMatch(/!important\s*;/);
  });

  it('plain-css.mdx lists every partial CSS export and nothing else', () => {
    const listed = [...guide('plain-css').matchAll(/^\| `aura-glass\/([^`]+\.css)` \|/gm)].map((m) => `./${m[1]}`).sort();
    const shipped = Object.keys(pkg.exports).filter((k) => k.endsWith('.css') && k !== './styles.css' && k !== './tailwind.css').sort();
    expect(listed).toEqual(shipped);
  });

  it('tailwind.mdx: v4 imports after the bridge layer statement, no @source, no JS config', () => {
    const css = fences(guide('tailwind')).filter((f) => f.lang === 'css');
    const setup = (css[0]?.code ?? '').split('\n');
    expect(setup[0]).toBe(TAILWIND_BRIDGE_ORDER);
    expect(setup).toContain('@import "tailwindcss";');
    expect(setup).toContain('@import "aura-glass/tailwind.css";');
    for (const f of css) expect(f.code).not.toMatch(/@source|@tailwind|@config|@plugin/);
    expect(guide('tailwind')).not.toMatch(/```(js|ts)\n[^`]*tailwind\.config/);
  });

  describe('tailwind.mdx against the generated bridge', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-tw-guide-'));
    const manifestFile = join(dir, 'manifest.json');
    const out = join(dir, 'tailwind.css');
    writeFileSync(manifestFile, JSON.stringify(tokenManifest));
    execFileSync('node', ['scripts/build/gen-tailwind-bridge.mjs', '--manifest', manifestFile, '--out', out], { cwd: ROOT, stdio: 'pipe' });
    const bridge = readFileSync(out, 'utf8');
    const utilities = [...bridge.matchAll(/^@utility ([\w-]+)/gm)].map((m) => m[1]);
    const variants = [...bridge.matchAll(/^@custom-variant ([\w-]+)/gm)].map((m) => m[1]);
    const themeVars = new Set([...bridge.matchAll(/^\s+--([\w-]+):/gm)].map((m) => m[1]));
    const src = guide('tailwind');

    it('documents every utility and variant the bridge emits, and no others', () => {
      expect(utilities.length).toBeGreaterThan(0);
      expect(variants.length).toBeGreaterThan(0);
      const docUtilities = [...src.matchAll(/^\| `((?:glass|content)-[\w-]+)` \|/gm)].map((m) => m[1]).sort();
      const docVariants = [...src.matchAll(/^\| `(ag-[\w-]+):` \|/gm)].map((m) => m[1]).sort();
      expect(docUtilities).toEqual([...utilities].sort());
      expect(docVariants).toEqual([...variants].sort());
    });

    it('every example utility in the theme table resolves to a generated theme variable', () => {
      const examples = [...src.matchAll(/`((?:bg|text|border|rounded|shadow)-[a-z-]+)`/g)].map((m) => m[1] ?? '');
      expect(examples.length).toBeGreaterThan(0);
      const toVar = (u: string) => {
        const [, prefix, rest] = /^(bg|text|border|rounded|shadow)-(.+)$/.exec(u) ?? [];
        return prefix === 'rounded' ? `radius-${rest}` : prefix === 'shadow' ? `shadow-${rest}` : `color-${rest}`;
      };
      const missing = examples.filter((u) => !themeVars.has(toVar(u)));
      expect(missing).toEqual([]);
    });
  });
});

describe('testing.mdx Jest configuration', () => {
  it('quotes the PRD transformIgnorePatterns and the pattern transforms exactly aura-glass and @base-ui', () => {
    const src = guide('testing');
    expect(src).toContain('transformIgnorePatterns: ["node_modules/(?!aura-glass|@base-ui)"]');
    const re = new RegExp('node_modules/(?!aura-glass|@base-ui)');
    // Jest skips transforming a file when an ignore pattern matches it.
    expect(re.test('/app/node_modules/aura-glass/dist/index.js')).toBe(false);
    expect(re.test('/app/node_modules/@base-ui/react/esm/index.js')).toBe(false);
    expect(re.test('/app/node_modules/react/index.js')).toBe(true);
  });
  it('recommends role/name queries', () => {
    expect(guide('testing')).toContain("getByRole('button', { name: 'Save' })");
  });
});
