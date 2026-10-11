/** @jest-environment node */
// tests/capability/registry/blocks-lint.test.ts — REQ-SURF-170 (REQ-FIN-88, AC-FIN-88).
// Drives the SURF registry lint (scripts/surf/verify-registry.mjs) over every
// source file of every S-46 SURF block/item directory: verbatim shadcn v4
// registry-item schema, S-46 ownership meta, complete files[], exact
// registryDependencies (aura-glass imports → registry id `auraglass`, sibling
// imports → `@/registry/<kind>/<id>` ids), public aura-glass entries and value
// names only (src/contracts/entries.ts), no relative import leaving the item
// dir, no #hex / !important / blur( / rgb(a)( / oklch( outside fixtures,
// deterministic fixtures.ts, and the required stories (Loading for async items).
// Each negative case mutates a temp copy of the tree and must exit 1 naming
// the rule. It never imports PLAT's scripts/registry/lint.mjs.
import { describe, expect, it, afterEach } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = join(__dirname, '../../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-registry.mjs');
const SCHEMA = JSON.parse(
  readFileSync(join(ROOT, 'tests/capability/registry/__fixtures__/registry-item.schema.json'), 'utf8'),
);

type Violation = { id: string; rule: string; file: string | null; line: number | null; msg: string };
type Report = { violations: Violation[]; counts: Array<{ id: string; kind: string; sources: number; listed: number }> };

const temps: string[] = [];
afterEach(() => {
  while (temps.length) rmSync(temps.pop()!, { recursive: true, force: true });
});

function run(root: string) {
  const dir = mkdtempSync(join(tmpdir(), 'ag-surf-registry-out-'));
  temps.push(dir);
  const out = join(dir, 'report.json');
  const r = spawnSync(process.execPath, [SCRIPT, '--root', root, '--json', out, '--count'], { encoding: 'utf8', cwd: ROOT });
  const report = existsSync(out) ? (JSON.parse(readFileSync(out, 'utf8')) as Report) : { violations: [], counts: [] };
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, report };
}

/** A temp copy of registry/ (the lint reads schema + entries from the repo). */
function tempTree() {
  const root = mkdtempSync(join(tmpdir(), 'ag-surf-registry-'));
  temps.push(root);
  cpSync(join(ROOT, 'registry'), join(root, 'registry'), {
    recursive: true,
    filter: (src) => !/registry[\\/]registry(?:-report)?\.json$/.test(src),
  });
  return root;
}

const edit = (root: string, rel: string, fn: (s: string) => string) => {
  const p = join(root, rel);
  writeFileSync(p, fn(readFileSync(p, 'utf8')));
};
const editJson = (root: string, rel: string, fn: (j: any) => void) =>
  edit(root, rel, (s) => {
    const j = JSON.parse(s);
    fn(j);
    return JSON.stringify(j, null, 2);
  });

function expectRule(r: ReturnType<typeof run>, id: string, rule: string, msg?: RegExp) {
  expect(r.status).toBe(1);
  const hit = r.report.violations.filter((v) => v.id === id && v.rule === rule && (!msg || msg.test(v.msg)));
  expect(hit.length).toBeGreaterThan(0);
}

describe('SURF registry lint (REQ-SURF-170)', () => {
  it('passes on the tree with every source file listed in files[]', () => {
    const r = run(ROOT);
    expect(r.report.violations).toEqual([]);
    expect(r.status).toBe(0);
    // 12 S-46 SURF blocks + 20 SURF items, each with ≥2 shipped sources.
    expect(r.report.counts).toHaveLength(32);
    for (const c of r.report.counts) {
      expect(c.sources).toBeGreaterThanOrEqual(2);
      expect(c.listed).toBe(c.sources);
    }
    expect(r.stdout).toMatch(/total: (\d+)\/\1 source files listed across 32 SURF ids/);
  });

  it('vendors the verbatim shadcn v4 registry-item schema (draft-07, conditional files[].target)', () => {
    expect(SCHEMA.$schema).toBe('https://json-schema.org/draft-07/schema#');
    expect(SCHEMA.required).toEqual(['name', 'type']);
    expect(SCHEMA.properties.files.items.if.properties.type.enum).toEqual(['registry:file', 'registry:page']);
    expect(SCHEMA.properties.files.items.then.required).toEqual(['path', 'type', 'target']);
    expect(SCHEMA.properties.type.enum).toEqual(expect.arrayContaining(['registry:block', 'registry:item', 'registry:base', 'registry:font']));
    expect(SCHEMA.definitions.cssValue.oneOf).toHaveLength(2);
  });

  it('fails on a #fff literal outside fixtures', () => {
    const root = tempTree();
    appendFileSync(join(root, 'registry/blocks/data-workspace/index.tsx'), "\nexport const ACCENT = '#fff';\n");
    expectRule(run(root), 'data-workspace', 'literal', /#fff/);
  });

  it('fails on !important, blur( and oklch( outside fixtures, and allows them in fixtures', () => {
    const root = tempTree();
    appendFileSync(join(root, 'registry/items/tree-select/index.tsx'), "\nexport const S = { filter: 'blur(4px)' };\n");
    appendFileSync(join(root, 'registry/items/query-builder/index.tsx'), "\nexport const C = 'oklch(0.7 0.1 200) !important';\n");
    appendFileSync(join(root, 'registry/items/schema-viewer/fixtures.ts'), "\nexport const SWATCH = '#0a84ff';\n");
    const r = run(root);
    expectRule(r, 'tree-select', 'literal', /blur\(/);
    expectRule(r, 'query-builder', 'literal', /oklch\(|!important/);
    expect(r.report.violations.filter((v) => v.id === 'schema-viewer')).toEqual([]);
  });

  it('fails on a ../../items relative import leaving the item dir', () => {
    const root = tempTree();
    edit(root, 'registry/blocks/support-inbox/index.tsx', (s) => `import '../../items/ai-markdown/index';\n${s}`);
    expectRule(run(root), 'support-inbox', 'relative-escape', /\.\.\/\.\.\/items\/ai-markdown/);
  });

  it('fails when a sibling registry import is missing from registryDependencies', () => {
    const root = tempTree();
    editJson(root, 'registry/blocks/ai-workspace/registry-item.json', (j) => {
      j.registryDependencies = j.registryDependencies.filter((d: string) => d !== 'ai-sdk-adapter');
    });
    expectRule(run(root), 'ai-workspace', 'registry-deps', /lacks 'ai-sdk-adapter'/);
  });

  it('fails when aura-glass is imported but registryDependencies lacks auraglass', () => {
    const root = tempTree();
    editJson(root, 'registry/items/media-gallery/registry-item.json', (j) => {
      j.registryDependencies = [];
    });
    expectRule(run(root), 'media-gallery', 'registry-deps', /lacks 'auraglass'/);
  });

  it('fails on a registryDependencies id that does not exist in this registry', () => {
    const root = tempTree();
    editJson(root, 'registry/blocks/commerce-cart/registry-item.json', (j) => {
      j.registryDependencies.push('card');
    });
    expectRule(run(root), 'commerce-cart', 'registry-deps', /'card' is not a registry id/);
  });

  it('fails when a source file is missing from files[]', () => {
    const root = tempTree();
    editJson(root, 'registry/blocks/commerce-cart/registry-item.json', (j) => {
      j.files = j.files.filter((f: { path: string }) => f.path !== 'LineItem.tsx');
    });
    expectRule(run(root), 'commerce-cart', 'files-complete', /LineItem\.tsx/);
  });

  it('fails on a registry:page file without target (verbatim schema conditional)', () => {
    const root = tempTree();
    editJson(root, 'registry/blocks/ai-workspace/registry-item.json', (j) => {
      for (const f of j.files) if (f.type === 'registry:page') delete f.target;
    });
    expectRule(run(root), 'ai-workspace', 'schema', /missing target/);
  });

  it('fails on aura-glass/compat, a deep path, and a value name the entry does not export', () => {
    const root = tempTree();
    edit(root, 'registry/items/faceted-search/index.tsx', (s) => `import { Thing } from 'aura-glass/compat';\n${s}`);
    edit(root, 'registry/items/tree-select/index.tsx', (s) => `import { TreeView as T2 } from 'aura-glass/data/TreeView';\n${s}`);
    edit(root, 'registry/blocks/app-frame/index.tsx', (s) => `import { AppShellSidebarToggle } from 'aura-glass/app-shell';\n${s}`);
    const r = run(root);
    expectRule(r, 'faceted-search', 'public-import', /aura-glass\/compat/);
    expectRule(r, 'tree-select', 'public-import', /aura-glass\/data\/TreeView/);
    expectRule(r, 'app-frame', 'public-import', /AppShellSidebarToggle/);
  });

  it('fails on an undeclared npm import and on meta.auraglass drift', () => {
    const root = tempTree();
    edit(root, 'registry/items/schema-viewer/index.tsx', (s) => `import dayjs from 'dayjs';\nvoid dayjs;\n${s}`);
    editJson(root, 'registry/items/presence-stack/registry-item.json', (j) => {
      j.meta.auraglass.owner = 'PLAT';
      j.meta.auraglass.components = ['Avatar'];
    });
    const r = run(root);
    expectRule(r, 'schema-viewer', 'npm-deps', /dayjs/);
    expectRule(r, 'presence-stack', 's46', /owner "PLAT"/);
    expectRule(r, 'presence-stack', 'meta-components', /VisuallyHidden/);
  });

  it('fails on non-deterministic fixtures and on a missing fixtures.ts', () => {
    const root = tempTree();
    appendFileSync(join(root, 'registry/items/media-transcript/fixtures.ts'), '\nexport const SEED = Math.random();\n');
    rmSync(join(root, 'registry/items/media-gallery/fixtures.ts'));
    edit(root, 'registry/items/media-gallery/MediaGallery.stories.tsx', (s) => s.replace("import { GALLERY_ITEMS } from './fixtures';\n", 'const GALLERY_ITEMS: never[] = [];\n'));
    const r = run(root);
    expectRule(r, 'media-transcript', 'fixtures', /Math\.random/);
    expectRule(r, 'media-gallery', 'fixtures', /fixtures\.ts missing/);
  });

  it('requires a Loading story for async items and the five state stories for every item', () => {
    const root = tempTree();
    edit(root, 'registry/items/ai-model-picker/ModelPicker.stories.tsx', (s) => s.replace(/^export const Loading[^\n]*\n/m, ''));
    edit(root, 'registry/blocks/pricing/Pricing.stories.tsx', (s) => s.replace(/export const ForcedColors\b/, 'export const ForcedColours'));
    const r = run(root);
    expectRule(r, 'ai-model-picker', 'stories', /Loading missing \(item is async\)/);
    expectRule(r, 'pricing', 'stories', /ForcedColors missing/);
  });

  it('fails when an S-46 SURF id has no descriptor', () => {
    const root = tempTree();
    rmSync(join(root, 'registry/items/ai-trace-tree/registry-item.json'));
    expectRule(run(root), 'ai-trace-tree', 's46', /has no registry\/items\/ai-trace-tree\/registry-item\.json/);
  });

  it('rejects unknown arguments with exit 2', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--bogus'], { encoding: 'utf8', cwd: ROOT });
    expect(r.status).toBe(2);
  });
});
