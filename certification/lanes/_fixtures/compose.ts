/* FIN-G lane fixture (G-18, REQ-QUAL-21): minimal CSF3 story composition so
   a story can be rendered outside Storybook (react-dom/server in Node, then
   hydrateRoot in the browser) with the same args/render/decorators it has in
   the build under test. Story modules are bundled by esbuild (ssr.ts); this
   file is part of both the server and the client bundle, so it imports only
   React. */
import * as React from 'react';

type Args = Record<string, unknown>;
type Ctx = { args: Args; argTypes: Record<string, unknown>; globals: Record<string, unknown>; parameters: Record<string, unknown>;
  id: string; name: string; title: string; viewMode: 'story'; loaded: Record<string, unknown> };
type Render = (args: Args, ctx: Ctx) => React.ReactNode;
type Decorator = (Story: React.ComponentType, ctx: Ctx) => React.ReactNode;
interface StoryObject { args?: Args; render?: Render; decorators?: Decorator[]; parameters?: Record<string, unknown>; name?: string }
interface MetaObject extends StoryObject { component?: React.ComponentType<Args>; title?: string }

/** Returns a component that renders `exportName` of a CSF module exactly once per render. */
export function composeStory(mod: Record<string, unknown>, exportName: string, globals: Record<string, unknown> = {}): React.ComponentType {
  const meta = (mod.default ?? {}) as MetaObject;
  const raw = mod[exportName];
  if (raw === undefined) throw new Error(`story export ${exportName} not found (exports: ${Object.keys(mod).join(', ')})`);
  const story: StoryObject = typeof raw === 'function' ? { render: raw as Render } : (raw as StoryObject);
  const args: Args = { ...(meta.args ?? {}), ...(story.args ?? {}) };
  const ctx: Ctx = {
    args, argTypes: {}, globals, parameters: { ...(meta.parameters ?? {}), ...(story.parameters ?? {}) },
    id: '', name: story.name ?? exportName, title: meta.title ?? '', viewMode: 'story', loaded: {},
  };
  const render: Render = story.render ?? meta.render ?? ((a) => {
    if (!meta.component) throw new Error(`story ${exportName}: no render and no meta.component`);
    return React.createElement(meta.component, a);
  });
  // story decorators wrap closest to the story, meta decorators outside them (Storybook order)
  let Current: React.ComponentType = function StoryRender() { return React.createElement(React.Fragment, null, render(args, ctx)); };
  for (const d of [...(story.decorators ?? []), ...(meta.decorators ?? [])]) {
    const Inner: React.ComponentType = Current;
    Current = function Decorated(): React.ReactElement { return React.createElement(React.Fragment, null, d(Inner, ctx)); };
  }
  return Current;
}
