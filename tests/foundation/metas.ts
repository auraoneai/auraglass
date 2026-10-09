/* Shared discovery for the CMP foundation harnesses (CMP-015/016/017):
   loads every src/components/<dir>/*.meta.ts and src/primitives/*.meta.ts via the
   filesystem (no require.context in jest) and maps each meta to its story files
   under stories/cmp/** and src/**. */
import * as React from 'react';
import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ComponentMeta } from '../../src/contracts/components';

export const REPO_ROOT = join(__dirname, '..', '..');

export interface MetaRecord {
  name: string;
  meta: ComponentMeta;
  file: string;
}

const META_RE = /\.meta\.ts$/;
const STORY_RE = /\.stories\.tsx$/;

function walk(dir: string, match: RegExp, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, match, out);
    else if (match.test(entry.name)) out.push(p);
  }
  return out;
}

export function discoverCmpMetas(): MetaRecord[] {
  const files = [
    ...walk(join(REPO_ROOT, 'src', 'primitives'), META_RE),
    ...walk(join(REPO_ROOT, 'src', 'components'), META_RE),
    ...walk(join(REPO_ROOT, 'src', 'icons'), META_RE),
    ...walk(join(REPO_ROOT, 'src', 'forms'), META_RE),
  ];
  const records: MetaRecord[] = [];
  for (const file of files) {
    const mod = require(file) as Record<string, unknown>;
    for (const value of Object.values(mod)) {
      const m = value as Partial<ComponentMeta> | undefined;
      if (m && typeof m === 'object' && typeof m.name === 'string' && Array.isArray(m.parts)) {
        records.push({ name: m.name, meta: m as ComponentMeta, file: relative(REPO_ROOT, file) });
      }
    }
  }
  return records;
}

export function storyFilesFor(name: string): string[] {
  const roots = [join(REPO_ROOT, 'stories'), join(REPO_ROOT, 'src')];
  const files = roots.flatMap((r) => walk(r, STORY_RE));
  // exact basename match: 'Field.stories.tsx' must not pick up 'TextField.stories.tsx'
  return files.filter((f) => f.split(/[\\/]/).pop() === `${name}.stories.tsx`);
}

export interface LoadedStory { file: string; exports: Record<string, unknown> }

export function loadStories(name: string): LoadedStory[] {
  return storyFilesFor(name).map((file) => ({
    file: relative(REPO_ROOT, file),
    exports: require(file) as Record<string, unknown>,
  }));
}

/** Renders a story export: honours a custom `render` fn, else mounts `component`
    with the story's args. */
export function storyElement(storyModule: LoadedStory, storyName: string, opts?: { asComponent?: boolean }): { element: React.ReactElement | null; reason?: string } {
  const story = storyModule.exports[storyName] as
    | { render?: (args: Record<string, unknown>) => React.ReactElement; args?: Record<string, unknown> }
    | undefined;
  if (!story || typeof story !== 'object') return { element: null, reason: `no export ${storyName}` };
  const args = story.args ?? {};
  if (typeof story.render === 'function') {
    const RenderFn = story.render;
    /* Storybook render fns may be components (useState etc.) — callers that
       only need the rendered tree pass asComponent so hooks run inside
       React. Ref-forwarding callers mount the element directly so the ref
       reaches the real root. */
    if (opts?.asComponent) return { element: React.createElement(() => RenderFn(args)) };
    return { element: RenderFn(args) };
  }
  const component = (storyModule.exports.default as { component?: React.ComponentType<Record<string, unknown>> } | undefined)?.component;
  if (component) return { element: React.createElement(component as React.ComponentType<Record<string, unknown>>, args) };
  return { element: null, reason: 'story has neither render nor component' };
}
