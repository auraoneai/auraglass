/** @jest-environment node */
/* REQ-QUAL-58 (FIN-G G-26, FIN-455): showcase registry and directory contract.
 * Static checks over showcase/showcases.json and every showcase/<id>/ folder:
 *   - exactly the ten REQ-QUAL-58 ids with their tier and default scene;
 *   - <Name>.showcase.tsx, <Name>.stories.tsx, <name>.module.css, copy.ts and assets/;
 *   - assets: AVIF only, <=12 per showcase, <=300 KB each, ASSETS.json with a licence;
 *   - stories: title under Showcases/, tag + kind `showcase`, subject = id,
 *     layout fullscreen, scene global = default scene, one FullPage story + 2-4 fragments,
 *     and the manifest storyId equals the id Storybook derives from title + export;
 *   - composition (contract §3.3): the named registry block is imported through its
 *     index.tsx and every `mustContain` name is an imported binding of the showcase.
 * Rendering, determinism, a11y and tarball import checks are REQ-QUAL-59 (G-27). */
import { describe, expect, it } from '@jest/globals';
import * as fs from 'node:fs';
import * as path from 'node:path';
import ts from 'typescript';
import { SCENES } from '../../src/contracts/testing';

const ROOT = path.resolve(__dirname, '..', '..');
const SHOWCASE_DIR = path.join(ROOT, 'showcase');

interface ShowcaseEntry {
  id: string;
  name: string;
  tier: 'S1' | 'S2';
  defaultScene: string;
  viewport: { width: number; height: number };
  composes: 'public-entries' | { block: string; producer: string };
  dir: string;
  component: string;
  storyId: string;
  fragments: string[];
  mustContain: string[];
}

const manifest = JSON.parse(fs.readFileSync(path.join(SHOWCASE_DIR, 'showcases.json'), 'utf8')) as {
  version: number;
  showcases: ShowcaseEntry[];
};

/** REQ-QUAL-58 table: id → [tier, default scene, composes]. */
const REQUIRED: Record<string, [ShowcaseEntry['tier'], string, string]> = {
  'ai-command-center': ['S1', 'dark-media', 'ai-workspace'],
  'financial-dashboard': ['S1', 'flat-white', 'data-workspace'],
  'ops-console': ['S1', 'flat-black', 'app-frame'],
  'media-workspace': ['S1', 'video-frame', 'media-viewer'],
  'collaborative-workspace': ['S1', 'saturated-abstract', 'public-entries'],
  'mobile-productivity': ['S1', 'photo', 'public-entries'],
  'music-player': ['S2', 'photo', 'media-viewer'],
  'spatial-control-center': ['S2', 'hf-pattern', 'public-entries'],
  ecommerce: ['S2', 'photo', 'public-entries'],
  analytics: ['S2', 'dense-text', 'analytics-dashboard'],
};

const pascal = (id: string) => id.split('-').map((s) => s[0]!.toUpperCase() + s.slice(1)).join('');
/** Storybook's id sanitiser (storybook/internal/csf `sanitize` + `toId`). */
const sanitize = (s: string) =>
  s.toLowerCase().replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '-').replace(/-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
const storyNameFromExport = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2');

function parse(file: string): ts.SourceFile {
  return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
}

/** Evaluates a literal-only expression (object/array/string/number/boolean). */
function literal(node: ts.Expression): unknown {
  if (ts.isSatisfiesExpression(node) || ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) return literal(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((e) => literal(e as ts.Expression));
  if (ts.isObjectLiteralExpression(node)) {
    const out: Record<string, unknown> = {};
    for (const p of node.properties) {
      if (ts.isPropertyAssignment(p)) {
        const key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : p.name.getText();
        out[key] = literal(p.initializer);
      }
    }
    return out;
  }
  return { $expr: node.getText() };
}

interface StoriesInfo {
  meta: Record<string, unknown>;
  stories: Array<{ exportName: string; value: Record<string, unknown> }>;
}

function readStories(file: string): StoriesInfo {
  const sf = parse(file);
  const consts = new Map<string, ts.Expression>();
  let defaultName: string | undefined;
  const exported: string[] = [];
  sf.forEachChild((n) => {
    if (ts.isVariableStatement(n)) {
      const isExport = n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
      for (const d of n.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer) {
          consts.set(d.name.text, d.initializer);
          if (isExport) exported.push(d.name.text);
        }
      }
    }
    if (ts.isExportAssignment(n) && ts.isIdentifier(n.expression)) defaultName = n.expression.text;
  });
  if (!defaultName || !consts.has(defaultName)) throw new Error(`${file}: no default-exported meta object`);
  return {
    meta: literal(consts.get(defaultName)!) as Record<string, unknown>,
    stories: exported.map((exportName) => ({ exportName, value: literal(consts.get(exportName)!) as Record<string, unknown> })),
  };
}

function importsOf(file: string): Array<{ spec: string; names: string[] }> {
  const sf = parse(file);
  const out: Array<{ spec: string; names: string[] }> = [];
  sf.forEachChild((n) => {
    if (!ts.isImportDeclaration(n) || !ts.isStringLiteral(n.moduleSpecifier)) return;
    const names: string[] = [];
    const clause = n.importClause;
    if (clause?.name) names.push(clause.name.text);
    if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const el of clause.namedBindings.elements) names.push((el.propertyName ?? el.name).text);
    }
    out.push({ spec: n.moduleSpecifier.text, names });
  });
  return out;
}

describe('showcase/showcases.json (REQ-QUAL-58)', () => {
  it('lists exactly the ten showcase ids with their tier, default scene and composition source', () => {
    expect(manifest.version).toBe(1);
    const ids = manifest.showcases.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(Object.keys(REQUIRED).sort());
    for (const s of manifest.showcases) {
      const [tier, scene, composes] = REQUIRED[s.id]!;
      expect({ id: s.id, tier: s.tier, scene: s.defaultScene }).toEqual({ id: s.id, tier, scene });
      expect(SCENES as readonly string[]).toContain(s.defaultScene);
      expect(typeof s.composes === 'string' ? s.composes : s.composes.block).toBe(composes);
      expect(s.dir).toBe(`showcase/${s.id}`);
      expect(s.component).toBe(pascal(s.id));
    }
  });

  it('declares mobile-productivity at 390x844 and every other showcase at 1440x900', () => {
    for (const s of manifest.showcases) {
      expect({ id: s.id, ...s.viewport }).toEqual(
        s.id === 'mobile-productivity' ? { id: s.id, width: 390, height: 844 } : { id: s.id, width: 1440, height: 900 },
      );
    }
  });
});

describe.each(manifest.showcases.map((s) => [s.id, s] as const))('showcase/%s', (id, entry) => {
  const dir = path.join(SHOWCASE_DIR, id);
  const Name = pascal(id);
  const files = {
    showcase: path.join(dir, `${Name}.showcase.tsx`),
    stories: path.join(dir, `${Name}.stories.tsx`),
    css: path.join(dir, `${id}.module.css`),
    copy: path.join(dir, 'copy.ts'),
    assets: path.join(dir, 'assets'),
  };

  it('has the four required files and an assets folder', () => {
    for (const [kind, file] of Object.entries(files)) {
      expect({ kind, exists: fs.existsSync(file) }).toEqual({ kind, exists: true });
    }
    expect(fs.statSync(files.assets).isDirectory()).toBe(true);
  });

  it('ships 1-12 licensed AVIF assets, each at most 300 KB', () => {
    const assetFiles = fs.readdirSync(files.assets).filter((f) => f !== 'ASSETS.json');
    expect(assetFiles.length).toBeGreaterThanOrEqual(1);
    expect(assetFiles.length).toBeLessThanOrEqual(12);
    for (const f of assetFiles) {
      expect({ f, ext: path.extname(f) }).toEqual({ f, ext: '.avif' });
      const bytes = fs.readFileSync(path.join(files.assets, f));
      expect(bytes.length).toBeLessThanOrEqual(300 * 1024);
      // ISO-BMFF `ftyp` box with an AVIF brand.
      expect(bytes.subarray(4, 8).toString('latin1')).toBe('ftyp');
      expect(bytes.subarray(8, 12).toString('latin1')).toMatch(/^avi[fs]$/);
    }
    const record = JSON.parse(fs.readFileSync(path.join(files.assets, 'ASSETS.json'), 'utf8')) as {
      licence: string;
      source: string;
      files: Array<{ file: string }>;
    };
    expect(record.licence).toBe('CC0-1.0');
    expect(record.source.length).toBeGreaterThan(0);
    expect(record.files.map((f) => f.file).sort()).toEqual([...assetFiles].sort());
  });

  it('stories: showcase kind/tag, subject id, fullscreen, default scene, one full page + 2-4 fragments', () => {
    const { meta, stories } = readStories(files.stories);
    expect(meta['title']).toBe(`Showcases/${entry.name}`);
    expect(meta['tags']).toEqual(['showcase']);
    const parameters = meta['parameters'] as Record<string, unknown>;
    expect(parameters['layout']).toBe('fullscreen');
    expect(parameters['ag']).toMatchObject({ subject: id, kind: 'showcase' });
    expect((meta['globals'] as Record<string, unknown>)['scene']).toBe(entry.defaultScene);

    const full = stories.filter((s) => s.exportName === 'FullPage');
    expect(full).toHaveLength(1);
    expect(full[0]!.value['render']).toBeUndefined();
    const fragments = stories.filter((s) => s.exportName !== 'FullPage');
    expect(fragments.length).toBeGreaterThanOrEqual(2);
    expect(fragments.length).toBeLessThanOrEqual(4);
    for (const f of fragments) {
      const layout = (f.value['parameters'] as Record<string, unknown> | undefined)?.['layout'];
      expect({ story: f.exportName, fullscreen: layout === 'fullscreen' }).toEqual({ story: f.exportName, fullscreen: false });
    }
    expect(fragments.map((f) => f.value['name'])).toEqual(entry.fragments);

    const derived = `${sanitize(meta['title'] as string)}--${sanitize(storyNameFromExport('FullPage'))}`;
    expect(derived).toBe(entry.storyId);
  });

  it('composes its registry block through index.tsx and imports every mustContain component', () => {
    const imports = importsOf(files.showcase);
    if (entry.composes !== 'public-entries') {
      const block = entry.composes.block;
      expect(fs.existsSync(path.join(ROOT, 'registry', 'blocks', block, 'index.tsx'))).toBe(true);
      expect(imports.map((i) => i.spec)).toContain(`../../registry/blocks/${block}/index`);
    } else {
      expect(imports.filter((i) => i.spec.includes('registry/'))).toEqual([]);
    }
    const imported = new Set(imports.filter((i) => i.spec === 'aura-glass' || i.spec.startsWith('aura-glass/')).flatMap((i) => i.names));
    const blockProvided: Record<string, readonly string[]> = {
      // Parts the composed block renders itself (app-frame owns the shell chrome).
      'ops-console': ['Sidebar', 'TopBar'],
    };
    const missing = entry.mustContain.filter((n) => !imported.has(n) && !(blockProvided[id] ?? []).includes(n));
    expect({ id, missing }).toEqual({ id, missing: [] });
  });

  it('exports the manifest component from the showcase module', () => {
    const sf = parse(files.showcase);
    const names: string[] = [];
    sf.forEachChild((n) => {
      if (ts.isFunctionDeclaration(n) && n.name && n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) names.push(n.name.text);
    });
    expect(names).toContain(entry.component);
  });
});
