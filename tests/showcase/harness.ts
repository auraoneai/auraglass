/* tests/showcase/harness.ts — shared loader for the REQ-QUAL-59 render tests (FIN-G G-27, FIN-455).
 *
 * Showcases import only public entries (`aura-glass`, `aura-glass/<subpath>`), exactly as a consumer does. Under
 * Jest the package has no built dist/, so `installShowcaseModuleMap` maps every package.json `exports` key to the
 * source module its `default` condition is built from (`./dist/<x>.js` -> `src/<x>`, the same mapping
 * tsconfig.json `paths` uses for type-checking). These are the real modules, never doubles. The tarball build of
 * the same imports is `scripts/storybook/verify-showcase-imports.mjs --build` (L2, remote).
 * AVIF asset imports resolve to their public URL string (what Vite emits), CSS modules to identity-obj-proxy
 * (jest.config.js moduleNameMapper). */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as React from 'react';

export const ROOT = path.resolve(__dirname, '..', '..');
export const SHOWCASE_DIR = path.join(ROOT, 'showcase');

export interface ShowcaseEntry {
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

export const MANIFEST = JSON.parse(fs.readFileSync(path.join(SHOWCASE_DIR, 'showcases.json'), 'utf8')) as {
  version: number;
  showcases: ShowcaseEntry[];
};
export const SHOWCASES = MANIFEST.showcases;

/** `<id>/<Component>.showcase.tsx` of a manifest entry. */
export function showcaseFile(entry: ShowcaseEntry): string {
  return path.join(ROOT, entry.dir, `${entry.component}.showcase.tsx`);
}

/** package.json exports -> source module (`./dist/app-shell/index.js` -> `src/app-shell/index`). */
export function packageEntryMap(): Record<string, string> {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as {
    name: string;
    exports: Record<string, string | { default?: string }>;
  };
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(pkg.exports)) {
    const target = typeof value === 'string' ? value : value.default;
    if (!target || !/^\.\/dist\/.+\.js$/.test(target)) continue;
    const spec = key === '.' ? pkg.name : `${pkg.name}/${key.slice(2)}`;
    out[spec] = path.join(ROOT, 'src', target.slice('./dist/'.length, -'.js'.length));
  }
  return out;
}

type JestLike = { doMock: (name: string, factory: () => unknown, options?: { virtual?: boolean }) => unknown; requireActual: (p: string) => unknown };

/** Registers the public-entry map and the AVIF asset modules on the calling test file's module registry. */
export function installShowcaseModuleMap(j: JestLike): void {
  for (const [spec, file] of Object.entries(packageEntryMap())) {
    j.doMock(spec, () => j.requireActual(file), { virtual: true });
  }
  for (const entry of SHOWCASES) {
    const assets = path.join(ROOT, entry.dir, 'assets');
    if (!fs.existsSync(assets)) continue;
    for (const f of fs.readdirSync(assets).filter((n) => n.endsWith('.avif'))) {
      const url = `/${entry.dir}/assets/${f}`;
      j.doMock(path.join(assets, f), () => ({ __esModule: true, default: url }));
    }
  }
}

export type ShowcaseModule = Record<string, unknown>;

/** Requires a showcase module through the calling file's registry (call installShowcaseModuleMap first). */
export function loadShowcase(entry: ShowcaseEntry, req: (p: string) => unknown): ShowcaseModule {
  return req(showcaseFile(entry)) as ShowcaseModule;
}

type StoryLike = { name?: string; args?: Record<string, unknown>; render?: (args: Record<string, unknown>, ctx: unknown) => unknown };
type MetaLike = { component?: unknown; args?: Record<string, unknown> };

/** Every story of a showcase as a zero-prop component, rendered the way Storybook renders it: `render(args)` when
    the story has one, else `meta.component` with meta + story args. The first entry is the full-page story. */
export function showcaseStories(entry: ShowcaseEntry, req: (p: string) => unknown): Array<[string, () => unknown]> {
  const mod = req(path.join(ROOT, entry.dir, `${entry.component}.stories`)) as Record<string, unknown> & { default: MetaLike };
  const meta = mod.default;
  const out: Array<[string, () => unknown]> = [];
  for (const [key, value] of Object.entries(mod)) {
    if (key === 'default' || key === '__esModule' || !value || typeof value !== 'object') continue;
    const story = value as StoryLike;
    const args = { ...(meta.args ?? {}), ...(story.args ?? {}) };
    const label = `${key}${story.name ? ` (${story.name})` : ''}`;
    const C = story.render
      ? () => story.render!(args, { args, globals: { scene: entry.defaultScene } })
      : () => React.createElement(meta.component as React.FC, args);
    out.push([label, C]);
  }
  return out;
}

/** The fixed epoch each showcase's copy.ts exports (REQ-QUAL-59: time from the fixed epoch via a `now` prop). */
export function showcaseEpoch(entry: ShowcaseEntry, req: (p: string) => unknown): number {
  const copy = req(path.join(ROOT, entry.dir, 'copy')) as { SHOWCASE_EPOCH?: unknown };
  if (typeof copy.SHOWCASE_EPOCH !== 'number') throw new Error(`${entry.dir}/copy.ts must export a numeric SHOWCASE_EPOCH`);
  return copy.SHOWCASE_EPOCH;
}

/** REQ-QUAL-50 banned rendered copy (applies to everything a showcase renders). REQ-QUAL-59's meta-copy ban
    (AuraGlass, glass, certification, Storybook) applies to the showcase's own strings and is checked statically by
    scripts/storybook/verify-showcase-imports.mjs (rule `copy`), because library components render their own
    product labels (e.g. the preferences panel's "Glass" transparency option). */
export const BANNED_COPY: Array<[string, RegExp]> = [
  ['glass morphism', /glass\s*morphism/i],
  ['Lorem', /Lorem/],
  ['Sample ', /Sample /],
  ['This is a', /This is a/],
  ['Click Me', /Click Me/i],
  ['consciousness', /consciousness/i],
  ['quantum', /quantum/i],
  ['predictive', /predictive/i],
  ['eye tracking', /eye[\s-]*tracking/i],
];
