/* REQ-QUAL-08 (FIN-428): the 8 certification scene stories, ids SCENE_ASSETS.storyId(id) = scenes--<id>.
   Each composes over its scene: the scene image is painted by the preview decorator from the `scene` global
   (S-41/S-42, G-07 StoryRoot + Environment); the story declares the scene through `globals.scene` and roots in
   <Environment backdrop={SCENE_BACKDROP[id]}> so the declared backdrop matches scenes.manifest.json.
   Content: Surface × {regular, clear, identity, content-raised} × {thin, regular, thick} (12 cells) plus a strip of
   CMP flagships at rest (Button, SegmentedControl, Slider, TextField, Switch, Toast) from the public '.' entry.
   Preference axes (scheme, contrast, transparency, motion, density, tier) come only from globals, so lanes force
   every cell by URL; nothing here reads or sets them. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Environment, Surface, Button, SegmentedControl, Slider, TextField, Switch, Toast, useToast,
} from '../../src/index';
import { SCENE_BACKDROP, type SceneId, type StoryAgParameters } from '../../src/contracts/testing';
import type { MaterialVariant, Thickness } from '../../src/contracts/material';
import './Scenes.css';

type CellMaterial = MaterialVariant | 'content-raised';
const CELL_MATERIALS: readonly CellMaterial[] = ['regular', 'clear', 'identity', 'content-raised'];
const CELL_THICKNESSES: readonly Thickness[] = ['thin', 'regular', 'thick'];

const SCENE_LABEL: Record<SceneId, string> = {
  photo: 'Photo', 'saturated-abstract': 'Saturated abstract', 'dense-text': 'Dense text', 'dark-media': 'Dark media',
  'flat-white': 'Flat white', 'flat-black': 'Flat black', 'hf-pattern': 'High-frequency pattern', 'video-frame': 'Video frame',
};

function Cell({ material, thickness }: { material: CellMaterial; thickness: Thickness }) {
  const role = material === 'content-raised'
    ? ({ layer: 'content', content: 'content-raised', thickness } as const)
    : ({ variant: material, thickness } as const);
  return (
    <Surface {...role} className="scene-cell" data-ag-scene-cell={`${material}/${thickness}`}>
      <p className="scene-label"><span>{material}</span><span>{thickness}</span></p>
      <p className="scene-body">Glass reads its backdrop. This paragraph is set at 14 px so contrast is judged on real body text.</p>
    </Surface>
  );
}

/** Keeps one sticky toast open at rest while the story is mounted; closes it on unmount. */
function RestingToast({ scene }: { scene: SceneId }) {
  const t = useToast();
  React.useEffect(() => {
    const id = t.info({ title: 'Saved', description: `Rendered over ${SCENE_LABEL[scene]}.`, timeout: 0 });
    return () => t.close(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- add once per mount
  }, []);
  return (
    <Toast.Viewport>
      {t.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

function FlagshipStrip({ scene }: { scene: SceneId }) {
  return (
    <div className="scene-strip" data-ag-scene-strip="">
      <Button>Save changes</Button>
      <SegmentedControl.Root aria-label="View mode" defaultValue="grid">
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
        <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Slider.Root className="scene-slider" aria-label="Volume" defaultValue={40} min={0} max={100} />
      <TextField label="Project name" defaultValue="auraglass" />
      <Switch aria-label="Notifications" defaultChecked />
      <Toast.Provider>
        <RestingToast scene={scene} />
      </Toast.Provider>
    </div>
  );
}

function SceneComposition({ scene }: { scene: SceneId }) {
  return (
    <Environment backdrop={SCENE_BACKDROP[scene]} className="scene-stage">
      <div className="scene-cells">
        {CELL_MATERIALS.flatMap((m) => CELL_THICKNESSES.map((th) => <Cell key={`${m}-${th}`} material={m} thickness={th} />))}
      </div>
      <FlagshipStrip scene={scene} />
    </Environment>
  );
}

const sbMeta = {
  title: 'Scenes',
  component: SceneComposition,
  tags: ['scene'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SceneComposition>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const scene = (id: SceneId): Story => ({
  name: SCENE_LABEL[id],
  args: { scene: id },
  globals: { scene: id },
  parameters: { ag: { subject: `scene:${id}`, kind: 'scene' } satisfies StoryAgParameters },
});

export const Photo = scene('photo');
export const SaturatedAbstract = scene('saturated-abstract');
export const DenseText = scene('dense-text');
export const DarkMedia = scene('dark-media');
export const FlatWhite = scene('flat-white');
export const FlatBlack = scene('flat-black');
export const HfPattern = scene('hf-pattern');
export const VideoFrame = scene('video-frame');

