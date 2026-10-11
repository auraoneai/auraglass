/* REQ-QUAL-10 (REQ-FIN-106, FIN-449) + the REQ-FIN-05 cert-mode CSS transfer: preview configuration.
   Frozen globals (S-20/S-42), exactly one decorator rendering AuraGlassProvider → Environment → StoryRoot,
   no backgrounds/extra toolbars/test-runner imports, no StorySurface, and in cert mode exactly one
   stylesheet: the built dist/styles.css. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, render } from '@testing-library/react';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import * as React from 'react';
import type { Decorator } from '@storybook/react-vite';
import { SCENES, SCENE_BACKDROP } from '../../src/contracts/testing';

const mockBuiltLoad = jest.fn(async () => ({}));
const mockSourceLoadA = jest.fn(async () => ({}));
const mockSourceLoadB = jest.fn(async () => ({}));
jest.mock('../../.storybook/contract/sheets', () => ({
  BUILT_SHEETS: { '../../dist/styles.css': () => mockBuiltLoad() },
  SOURCE_SHEETS: { '../../src/b.css': () => mockSourceLoadB(), '../../src/a.css': () => mockSourceLoadA() },
}));

import preview from '../../.storybook/preview';
import { BUILT_SHEET, CERT_STYLE_ATTR, isCertMode, selectSheets } from '../../.storybook/contract/styles';

const ROOT = join(__dirname, '..', '..');
const SB = join(ROOT, '.storybook');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const sbFiles = walk(SB);
const sbSource = sbFiles.filter((f) => /\.(m?[jt]sx?|mdx)$/.test(f));

/** The frozen global set (contract §4.11 seed; S-20 preference keys, S-42 scene ids). */
const FROZEN = {
  scheme: { defaultValue: 'light', toolbar: { items: ['light', 'dark'], dynamicTitle: true } },
  contrast: { defaultValue: 'standard', toolbar: { items: ['standard', 'more'], dynamicTitle: true } },
  transparency: { defaultValue: 'glass', toolbar: { items: ['glass', 'tinted', 'solid'], dynamicTitle: true } },
  motion: { defaultValue: 'full', toolbar: { items: ['full', 'calm', 'none'], dynamicTitle: true } },
  density: { defaultValue: 'regular', toolbar: { items: ['compact', 'regular', 'spacious'], dynamicTitle: true } },
  tier: { defaultValue: 'standard', toolbar: { items: ['lightweight', 'standard', 'enhanced'], dynamicTitle: true } },
  scene: { defaultValue: 'photo', toolbar: { items: [...SCENES], dynamicTitle: true } },
};
const DEFAULT_GLOBALS = Object.fromEntries(Object.entries(FROZEN).map(([k, v]) => [k, v.defaultValue]));

function renderDecorated(globals: Record<string, unknown> = {}, ag: Record<string, unknown> | undefined = { subject: 'Button', kind: 'component' }, id = 'cmp-button--default') {
  const decorator = (preview.decorators as Decorator[])[0]!;
  const ctx = { id, globals: { ...DEFAULT_GLOBALS, ...globals }, parameters: ag ? { ag } : {} };
  const Story = () => React.createElement('button', { type: 'button' }, 'Story');
  return render(decorator(Story as never, ctx as never) as React.ReactElement);
}

afterEach(() => {
  cleanup();
  document.body.removeAttribute('style');
});

describe('preview configuration (REQ-QUAL-10)', () => {
  it('globalTypes deep-equal the frozen contract globals', () => {
    expect(preview.globalTypes).toEqual(FROZEN);
  });

  it('has exactly one decorator, one loader, no backgrounds and no extra toolbars', () => {
    expect(preview.decorators).toHaveLength(1);
    expect(preview.loaders).toHaveLength(1);
    expect(Object.keys(preview).sort()).toEqual(['decorators', 'globalTypes', 'loaders']);
    expect((preview as { parameters?: { backgrounds?: unknown } }).parameters?.backgrounds).toBeUndefined();
    expect(Object.keys(preview.globalTypes ?? {}).sort()).toEqual(Object.keys(FROZEN).sort());
  });

  it('no .storybook file imports @storybook/jest, @storybook/testing-library or @storybook/test', () => {
    const banned = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"]@storybook\/(?:jest|testing-library|test)(?:\/[^'"]*)?['"]/;
    const offenders = sbSource.filter((f) => banned.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
    expect(banned.test("import { expect } from '@storybook/test';")).toBe(true); // the scan itself detects a planted import
  });

  it('StorySurface is gone from .storybook', () => {
    expect(existsSync(join(SB, 'StorySurface.tsx'))).toBe(false);
    const offenders = sbFiles.filter((f) => readFileSync(f, 'utf8').includes('StorySurface')).map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it('renders AuraGlassProvider → Environment → StoryRoot for a media scene', () => {
    const { container } = renderDecorated();
    expect(document.documentElement.hasAttribute('data-ag-root')).toBe(true);           // outermost provider
    expect(document.querySelectorAll('[data-ag-portal-root]')).toHaveLength(1);         // provider-rendered portal root
    const env = container.querySelector<HTMLElement>('[data-ag-backdrop]');
    expect(env).not.toBeNull();
    expect(env!.getAttribute('data-ag-backdrop')).toBe(SCENE_BACKDROP.photo);
    expect(env!.querySelector('[data-ag-part="backdrop-media"]')!.getAttribute('src')).toBe('/scenes/photo.jpg');
    const root = env!.querySelector<HTMLElement>(':scope > [data-ag-story-content]');
    expect(root).not.toBeNull();
    expect(root!.getAttribute('data-ag-story-kind')).toBe('component');
    expect(root!.textContent).toBe('Story');
    expect(document.body.style.backgroundImage).toBe('none');
  });

  it('never writes data-ag-motion (or any preference attribute) on decorator elements', () => {
    const { container } = renderDecorated({ motion: 'none', scheme: 'dark' });
    const written = Array.from(container.querySelectorAll('*')).filter((el) =>
      ['data-ag-motion', 'data-ag-scheme', 'data-ag-contrast', 'data-ag-transparency', 'data-ag-density', 'data-ag-tier']
        .some((a) => el.hasAttribute(a)));
    expect(written).toEqual([]);
  });

  it('paints non-media scenes and scene stories through the body background, cover/center', () => {
    renderDecorated({ scene: 'flat-black' });
    const env = document.querySelector('[data-ag-backdrop]')!;
    expect(env.getAttribute('data-ag-backdrop')).toBe('dark');
    expect(env.querySelector('[data-ag-part="backdrop-media"]')).toBeNull();
    expect(document.body.style.backgroundImage).toBe('url("/scenes/flat-black.jpg")');
    expect(document.body.style.backgroundSize).toBe('cover');
    expect(document.body.style.backgroundPosition).toBe('center');
    cleanup();
    expect(document.body.style.backgroundImage).toBe('');
    renderDecorated({ scene: 'photo' }, { subject: 'scene:photo', kind: 'scene' }, 'scenes--photo');
    expect(document.querySelector('[data-ag-part="backdrop-media"]')).toBeNull();
    expect(document.body.style.backgroundImage).toBe('url("/scenes/photo.jpg")');
    expect(document.querySelector('[data-ag-story-content]')!.getAttribute('data-ag-story-kind')).toBe('scene');
  });

  it('rejects an unknown scene global or story kind instead of guessing', () => {
    const original = console.error; console.error = () => {};
    try {
      expect(() => renderDecorated({ scene: 'beach' })).toThrow(/unknown scene/);
      expect(() => renderDecorated({}, { subject: 'X', kind: 'page' })).toThrow(/not a StoryKind/);
    } finally { console.error = original; }
  });
});

describe('cert-mode stylesheet (REQ-FIN-05 transfer, REQ-QUAL-09)', () => {
  it('reads ag-cert=1 from the iframe URL', () => {
    expect(isCertMode('?id=x&ag-cert=1')).toBe(true);
    expect(isCertMode('?id=x&ag-cert=0')).toBe(false);
    expect(isCertMode('?id=x')).toBe(false);
  });

  it('cert mode selects exactly one sheet, dist/styles.css; never a source sheet', () => {
    const built = { [BUILT_SHEET]: async () => ({}) };
    const source = { '../../src/a.css': async () => ({}) };
    const picked = selectSheets(true, built, source);
    expect(picked.map(([k]) => k)).toEqual(['../../dist/styles.css']);
    expect(() => selectSheets(true, {}, source)).toThrow(/dist\/styles\.css/);
    expect(selectSheets(false, built, source).map(([k]) => k)).toEqual(['../../src/a.css']);
  });

  it('the cert-mode loader imports only the built sheet and installs the ancestor rules', async () => {
    await jest.isolateModulesAsync(async () => {
      const { loadStoryStyles } = await import('../../.storybook/contract/styles');
      await loadStoryStyles(true);
    });
    expect(mockBuiltLoad).toHaveBeenCalledTimes(1);
    expect(mockSourceLoadA).not.toHaveBeenCalled();
    expect(mockSourceLoadB).not.toHaveBeenCalled();
    const style = document.head.querySelector(`style[${CERT_STYLE_ATTR}]`)!;
    expect(style.textContent).toMatch(/#storybook-root, \[data-ag-backdrop\]:has\(> \[data-ag-story-content\]\)/);
    for (const rule of ['background-color: transparent', 'background-image: none', 'backdrop-filter: none', 'filter: none', 'opacity: 1']) {
      expect(style.textContent).toContain(rule);
    }
  });

  it('outside cert mode the loader imports the source sheets and not dist', async () => {
    mockBuiltLoad.mockClear();
    await jest.isolateModulesAsync(async () => {
      const { loadStoryStyles } = await import('../../.storybook/contract/styles');
      await loadStoryStyles(false);
    });
    expect(mockBuiltLoad).not.toHaveBeenCalled();
    expect(mockSourceLoadA).toHaveBeenCalledTimes(1);
    expect(mockSourceLoadB).toHaveBeenCalledTimes(1);
  });

  it('no .storybook module imports CSS eagerly; the only globs are the two lazy sheet sets', () => {
    const cssImport = /^\s*import\s+(?:[^'"]+from\s+)?['"][^'"]+\.css['"]/m;
    expect(sbSource.filter((f) => cssImport.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f))).toEqual([]);
    const globbing = sbSource.filter((f) => /import\.meta\.glob\(/.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f));
    expect(globbing).toEqual([join('.storybook', 'contract', 'sheets.ts')]);
    const sheets = readFileSync(join(SB, 'contract', 'sheets.ts'), 'utf8');
    expect(sheets).not.toMatch(/eager\s*:/);
    expect(sheets).toContain("import.meta.glob('../../dist/styles.css')");
  });
});

/* REQ-QUAL-57 (FIN-452): no 5.0 file imports the deprecated Storybook test packages; Storybook-side interaction
   flows are Playwright specs (tests/e2e/qual/storybook), never Vitest. REQ-QUAL-56: main.ts wiring. */
const BANNED_TEST_IMPORT = /(?:from\s+|import\s*\(\s*|require\s*\(\s*|^\s*import\s+)['"]@storybook\/(?:jest|testing-library|test)(?:\/[^'"]*)?['"]/m;
const SCAN_ROOTS = ['src', 'stories', 'registry', 'showcase', 'certification', '.storybook', 'tests', 'packages', 'scripts', 'fragments', 'lint', 'apps', 'canaries'];
const SCAN_SKIP = new Set(['node_modules', 'dist', 'storybook-static', '.next', 'out', '.git', 'coverage']);
const SCAN_FILE = /\.(?:[cm]?[jt]sx?|mdx)$/;
const SELF = __filename;
function scanTestImports(roots: string[]): string[] {
  const visit = (dir: string): string[] => {
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
      const p = join(dir, d.name);
      if (d.isDirectory()) return SCAN_SKIP.has(d.name) ? [] : visit(p);
      return d.isFile() && SCAN_FILE.test(d.name) && p !== SELF && BANNED_TEST_IMPORT.test(readFileSync(p, 'utf8')) ? [p] : [];
    });
  };
  return roots.flatMap(visit);
}

describe('test tooling (REQ-QUAL-57)', () => {
  it('no 5.0 file imports @storybook/jest, @storybook/testing-library or @storybook/test', () => {
    expect(scanTestImports(SCAN_ROOTS.map((r) => join(ROOT, r))).map((f) => relative(ROOT, f))).toEqual([]);
  });

  it('the import scan fails on a planted @storybook/test import (and the other two packages)', () => {
    const { mkdtempSync, writeFileSync, rmSync } = jest.requireActual<typeof import('node:fs')>('node:fs');
    const { tmpdir } = jest.requireActual<typeof import('node:os')>('node:os');
    const dir = mkdtempSync(join(tmpdir(), 'ag-sb-import-'));
    try {
      const pkg = (name: string) => ['@storybook', name].join('/');
      writeFileSync(join(dir, 'Planted.stories.tsx'), `import { expect, userEvent } from '${pkg('test')}';\nexport default {};\n`);
      writeFileSync(join(dir, 'b.ts'), `const j = await import("${pkg('jest')}");\n`);
      writeFileSync(join(dir, 'c.mdx'), `import { within } from '${pkg('testing-library')}/dom';\n`);
      writeFileSync(join(dir, 'ok.ts'), `import { a } from 'storybook/test';\nimport x from '${pkg('react-vite')}';\n`);
      expect(scanTestImports([dir]).map((f) => relative(dir, f)).sort()).toEqual(['Planted.stories.tsx', 'b.ts', 'c.mdx']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('package.json carries none of the deprecated test packages, no Vitest addon, no vitest.storybook.config.ts', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as Record<string, Record<string, string> | undefined>;
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies, ...pkg.optionalDependencies });
    expect(deps.filter((d) => /^@storybook\/(?:jest|testing-library|test|addon-vitest)$/.test(d) || d === 'vitest')).toEqual([]);
    expect(existsSync(join(ROOT, 'vitest.storybook.config.ts'))).toBe(false);
  });

  it('ships at least one Playwright flow spec per S1 showcase plus the Lab round-trip, all on the determinism fixture', () => {
    const dir = join(ROOT, 'tests', 'e2e', 'qual', 'storybook');
    const specs = readdirSync(dir).filter((f) => f.endsWith('.spec.ts'));
    const s1 = ['ai-command-center', 'financial-dashboard', 'ops-console', 'media-workspace', 'collaborative-workspace', 'mobile-productivity'];
    for (const id of s1) {
      const text = readFileSync(join(dir, `s1-${id}.spec.ts`), 'utf8');
      expect(text).toContain(`'showcases-${id}--full-page'`);
    }
    expect(specs.filter((f) => f.startsWith('s1-')).length).toBeGreaterThanOrEqual(6);
    expect(specs).toContain('lab-controls.spec.ts');
    for (const f of specs) {
      const text = readFileSync(join(dir, f), 'utf8');
      expect(text).toMatch(/from '\.\/_storybook'/);
      expect(text).not.toMatch(/@playwright\/test'|\.(?:only|skip|fixme)\(/);
    }
    expect(readFileSync(join(dir, '_storybook.ts'), 'utf8')).toContain("from '../../../../certification/lanes/_fixtures/determinism'");
  });
});

describe('main.ts (REQ-QUAL-56/-57)', () => {
  const loadMain = () => jest.requireActual<{ default: import('@storybook/react-vite').StorybookConfig }>('../../.storybook/main').default;

  it('registers @storybook/addon-a11y next to addon-docs', () => {
    expect(loadMain().addons).toEqual(['@storybook/addon-docs', '@storybook/addon-a11y']);
  });

  it('keeps the stories globs verbatim (the build checker walks the same table)', () => {
    const { STORY_GLOBS } = jest.requireActual<{ STORY_GLOBS: string[] }>('../../scripts/storybook/lib/storybook-build.mjs');
    expect(loadMain().stories).toEqual(STORY_GLOBS);
    expect(loadMain().staticDirs).toEqual([{ from: '../certification/scenes', to: '/scenes' }]);
  });

  it('viteFinal: AG_STORYBOOK_DIST=1 installs the exports→dist resolver first and refuses src/@ aliases', async () => {
    const main = loadMain();
    const viteFinal = main.viteFinal as (c: Record<string, unknown>, o: { configDir: string }) => Promise<Record<string, unknown>> | Record<string, unknown>;
    const prev = process.env.AG_STORYBOOK_DIST;
    try {
      process.env.AG_STORYBOOK_DIST = '1';
      const out = await viteFinal({ plugins: [] }, { configDir: SB });
      expect((out.plugins as Array<{ name: string }>)[0]!.name).toBe('aura-glass:resolve');
      expect(out.define).toEqual({ __AG_STORYBOOK_DIST__: 'true' });
      expect(() => viteFinal({ resolve: { alias: { '@': join(ROOT, 'src') } } }, { configDir: SB })).toThrow(/AG_STORYBOOK_DIST=1/);
      delete process.env.AG_STORYBOOK_DIST;
      const dev = await viteFinal({ plugins: [] }, { configDir: SB });
      expect(dev.define).toEqual({ __AG_STORYBOOK_DIST__: 'false' });
    } finally {
      if (prev === undefined) delete process.env.AG_STORYBOOK_DIST; else process.env.AG_STORYBOOK_DIST = prev;
    }
  });
});
