// Example.tsx — REQ-PLAT-99 / PLAT-375. Live example frame: the demo renders
// inside an aura-glass <Environment> with a declared backdrop, a scene
// switcher over the 8 contractual SCENES (S-42, data from
// scripts/docs/prepare-docs-app.mjs) and a 390 px preview toggle. It never
// forces reader preferences: no data-ag-* preference attribute is written to
// <html>/<body>, and the scene only changes the example's own backdrop.
'use client';
import { useId, useState } from 'react';
import { Environment } from 'aura-glass';
import type { SceneRow } from '../nav.config';

export interface ExampleProps {
  name: string;
  scenes: SceneRow[];
  /** basePath of the static export, prefixed to /scenes/<file>. */
  basePath?: string;
  children?: React.ReactNode;
}

type Backdrop = 'light' | 'dark' | 'media' | 'auto';

export function Example({ name, scenes, basePath = '', children }: ExampleProps) {
  const [sceneId, setSceneId] = useState(scenes[0]?.id ?? null);
  const [narrow, setNarrow] = useState(false);
  const labelId = useId();
  const scene = scenes.find((s) => s.id === sceneId) ?? null;
  const image = scene?.file ? `${basePath}/scenes/${scene.file}` : undefined;
  return (
    <figure data-ag-part="example" data-ag-scene={scene?.id} aria-labelledby={labelId}>
      <div className="docs-example-controls">
        <div role="group" aria-label="Scene">
          {scenes.map((s) => (
            <button key={s.id} type="button" aria-pressed={s.id === sceneId} onClick={() => setSceneId(s.id)}>{s.id}</button>
          ))}
        </div>
        <button type="button" aria-pressed={narrow} onClick={() => setNarrow((v) => !v)}>390 px preview</button>
      </div>
      <div data-ag-part="preview" className="docs-example-preview" style={narrow ? { inlineSize: '390px', maxInlineSize: '100%' } : undefined}>
        <Environment backdrop={(scene?.backdrop ?? 'auto') as Backdrop} {...(image ? { image } : {})}>
          {children}
        </Environment>
      </div>
      <figcaption id={labelId}>
        {name}
        {scene && !scene.file ? <span data-ag-state="pending"> · scene asset {scene.id} pending</span> : null}
      </figcaption>
    </figure>
  );
}
