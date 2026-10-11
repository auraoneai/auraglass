/* QUAL (REQ-QUAL-52; REQ-FIN-106; FIN-450): the Start Here page body. Every number and link is computed at build
   time from the Storybook index (`index.json`, served at the Storybook root), the ComponentMeta inventory and the
   package version; the page holds no count, id or version literal. */
import * as React from 'react';
import { version } from '../../package.json';
import { computeStartHere, type IndexLike, type StartHereData } from '../../scripts/storybook/lib/start-here.mjs';

const metaModules = import.meta.glob<Record<string, unknown>>('../../src/**/*.meta.ts', { eager: true });
const METAS = Object.values(metaModules).flatMap((m) => Object.values(m))
  .filter((v): v is { name: string; flagship?: number; parts: unknown[] } =>
    !!v && typeof v === 'object' && typeof (v as { name?: unknown }).name === 'string' && Array.isArray((v as { parts?: unknown }).parts));

export function StartHereView({ data }: { data: StartHereData }): React.ReactElement {
  const { counts } = data;
  return (
    <div data-ag-start-here="">
      <p>AuraGlass {data.version}: {counts.flagships} flagship components, {counts.core} core components, {counts.stories} stories and {counts.flows} interaction flows.</p>
      <ul aria-label="Sections">
        {data.groups.filter((g) => g.path).map((g) => (
          <li key={g.name}><a href={`?path=${g.path}`} target="_top">{g.name}</a> ({g.count} {g.count === 1 ? 'story' : 'stories'})</li>
        ))}
      </ul>
    </div>
  );
}

export function StartHere(): React.ReactElement {
  const [state, setState] = React.useState<{ data: StartHereData } | { error: string } | null>(null);
  React.useEffect(() => {
    let live = true;
    fetch(new URL('index.json', document.baseURI).href)
      .then((r) => (r.ok ? (r.json() as Promise<IndexLike>) : Promise.reject(new Error(`index.json: HTTP ${r.status}`))))
      .then((index) => { if (live) setState({ data: computeStartHere({ index, metas: METAS, version }) }); })
      .catch((e: unknown) => { if (live) setState({ error: e instanceof Error ? e.message : String(e) }); });
    return () => { live = false; };
  }, []);
  if (!state) return <p>Loading the story index…</p>;
  if ('error' in state) return <p role="alert">The story index could not be read ({state.error}).</p>;
  return <StartHereView data={state.data} />;
}
