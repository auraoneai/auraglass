/* QUAL (S-51; REQ-QUAL-51; REQ-FIN-106; FIN-450): `parameters.docs.page`. For a CSF file whose
   `parameters.ag.subject` resolves to a ComponentMeta it renders the title plus the six generated sections
   (DocsSections); any other docs entry keeps Storybook's default page. The Keyboard section reads the owner's APG
   script from the build's `apg-index.json` (scripts/storybook/write-apg-index.mjs), never by importing a spec.
   The meta inventory (a Vite glob, ./metas) loads on first docs render, so the preview module stays light. */
import * as React from 'react';
import { Canvas, DocsPage, Title, useOf } from '@storybook/addon-docs/blocks';
import type { ComponentMeta } from '../../src/contracts/components';
import type { StoryAgParameters } from '../../src/contracts/testing';
import { DocsSections, type ApgIndex } from './DocsSections';

let apgIndexRequest: Promise<ApgIndex | null> | null = null;
/** `apg-index.json` sits next to `index.json` at the Storybook root. A build without it resolves to null. */
function loadApgIndex(): Promise<ApgIndex | null> {
  apgIndexRequest ??= fetch(new URL('apg-index.json', document.baseURI).href)
    .then((r) => (r.ok ? (r.json() as Promise<ApgIndex>) : null))
    .catch(() => null);
  return apgIndexRequest;
}

let metasRequest: Promise<ReadonlyMap<string, ComponentMeta>> | null = null;
const loadMetas = () => (metasRequest ??= import('./metas').then((m) => m.META_BY_NAME));

/** Resolves an async source once per mount; `undefined` while pending. */
function useLoaded<T>(load: () => Promise<T>): T | undefined {
  const [value, setValue] = React.useState<T | undefined>(undefined);
  React.useEffect(() => {
    let live = true;
    void load().then((v) => { if (live) setValue(v); });
    return () => { live = false; };
  }, [load]);
  return value;
}

interface CsfStoryLike { id: string; name: string; moduleExport: unknown }

export function AgDocsPage(): React.ReactElement {
  const resolved = useOf('meta', ['meta']);
  const ag = resolved.preparedMeta.parameters?.ag as Partial<StoryAgParameters> | undefined;
  const metas = useLoaded(loadMetas);
  const apg = useLoaded(loadApgIndex);
  if (ag?.subject && !metas) return <p>Loading component metadata…</p>;
  const meta = ag?.subject ? metas?.get(ag.subject) : undefined;
  if (!meta) return <DocsPage />;
  const stories = Object.values(resolved.csfFile.stories) as CsfStoryLike[];
  const byExport = (exportId: string) => stories.find((s) => s.id.endsWith(`--${exportId}`));
  const playground = byExport('playground');
  const keyboard = byExport('keyboard');
  return (
    <>
      <Title />
      <DocsSections
        meta={meta}
        usage={playground ? <Canvas of={playground.moduleExport as never} /> : null}
        keyboardStoryId={keyboard?.id ?? null}
        apg={apg}
      />
    </>
  );
}
