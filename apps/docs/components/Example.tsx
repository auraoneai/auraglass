// Example.tsx — live example frame. Environment + backdrop + scene switcher
// (the 8 contractual SCENES); it renders the demo in an isolated host and
// NEVER writes reader preferences (preference changes stay inside the
// example's own scope via a preview container).
'use client';
import { useState } from 'react';

export const SCENES = [
  'canvas-light', 'canvas-dark', 'photo-light', 'photo-dark',
  'backdrop-hero', 'modal-sheet', 'split-pane', 'data-dense',
] as const;
export type Scene = (typeof SCENES)[number];

export function Example({ name, children }: { name: string; children?: React.ReactNode }) {
  const [scene, setScene] = useState<Scene>('canvas-light');
  const dark = scene.endsWith('dark');
  return (
    <figure data-ag-part="example" data-ag-scene={scene}>
      <div role="group" aria-label="Scene">
        {SCENES.map((s) => (
          <button key={s} type="button" aria-pressed={s === scene} onClick={() => setScene(s)}>{s}</button>
        ))}
      </div>
      <div data-ag-part="preview" data-ag-material="glass" data-color-scheme={dark ? 'dark' : 'light'}>
        {children ?? <p aria-label={name}>Example {name}</p>}
      </div>
      <figcaption><a href={`/surfaces/${name}`}>{name}</a></figcaption>
    </figure>
  );
}
