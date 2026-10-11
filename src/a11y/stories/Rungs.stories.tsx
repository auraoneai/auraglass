/* MAT-288: A11y/Rungs — one real <Surface> per contract variant x thickness
   on every scene, with a live read-out of the effective transparency/contrast,
   floor alpha and minRatio imported from the contrast matrix. The story
   supplies no optics, ink, priority overrides, private vars or stage
   background and no preference-disabling prop: material CSS paints the
   Surfaces and the preview decorator owns the axes (REQ-FIN-59 / D.3-38). */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useResolvedPreferences } from '../../theme/preferences/usePreference';
import type { StoryAgParameters } from '../../contracts/testing';
import type { MaterialVariant, Thickness } from '../../material/types';
import { Surface } from '../../material/Surface';

let floors: Record<string, unknown> | null = null;
try {
  floors = require('../../../tokens/generated/opacity-floors.json').cells ?? null;
} catch {
  floors = null;
}

const VARIANTS: readonly MaterialVariant[] = ['regular', 'clear', 'identity'];
const THICKNESSES: readonly Thickness[] = ['thin', 'regular', 'thick'];

function Cell({ variant, thickness }: { variant: MaterialVariant; thickness: Thickness }) {
  const resolved = useResolvedPreferences();
  const preset = 'aura';
  const scheme = resolved.scheme ?? 'light';
  const contrast = resolved.contrast ?? 'standard';
  const transparency = resolved.transparency ?? 'glass';
  const cell = (floors as any)?.[preset]?.[scheme]?.[contrast]?.[transparency]?.[variant]?.[thickness];
  const border = cell?.border;
  return (
    <div style={{ margin: 4, minWidth: 130 }}>
      <Surface variant={variant} thickness={thickness}>
        <div style={{ padding: 12, fontSize: 11 }}>
          <b>{variant}/{thickness}</b>
          <div>tr={transparency} c={contrast}</div>
          <div>
            floor α {border ? Number(border.floorAlpha).toFixed(3) : '—'} · min {border?.minRatio ?? '—'}
          </div>
        </div>
      </Surface>
    </div>
  );
}

function RungGrid() {
  const resolved = useResolvedPreferences();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {VARIANTS.map((v) =>
        THICKNESSES.map((t) => <Cell key={`${v}-${t}`} variant={v} thickness={t} />),
      )}
      <div style={{ flexBasis: '100%', fontSize: 11, opacity: 0.7, padding: 8 }}>
        floors: transparency={resolved.floors.transparency} motion={resolved.floors.motion}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/Rungs',
  component: RungGrid,
  parameters: {
    layout: 'fullscreen',
    ag: { subject: 'A11yRungs', kind: 'matrix', scenes: 'all' } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj = {};
export const Tinted: StoryObj = { globals: { transparency: 'tinted' } };
export const Solid: StoryObj = { globals: { transparency: 'solid' } };
export const ContrastMore: StoryObj = { globals: { contrast: 'more' } };
