/* MAT-288: A11y/Rungs — one Surface-like block per variant x thickness on every
   scene, with a live read-out of the effective transparency/contrast, floor
   alpha and minRatio imported from the contrast matrix. Pure markup: no
   !important, no opaque stage, no preference-disabling prop. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useResolvedPreferences } from '../../theme/preferences/usePreference';
import type { StoryAgParameters } from '../../contracts/testing';

let floors: Record<string, unknown> | null = null;
try {
  floors = require('../../../tokens/generated/opacity-floors.json').cells ?? null;
} catch {
  floors = null;
}

const VARIANTS = ['regular', 'clear', 'identity', 'raised', 'sunken'] as const;
const THICKNESSES = ['thin', 'regular', 'thick'] as const;

function Cell({ variant, thickness }: { variant: string; thickness: string }) {
  const resolved = useResolvedPreferences();
  const preset = 'aura';
  const scheme = resolved.scheme ?? 'light';
  const contrast = resolved.contrast ?? 'standard';
  const transparency = resolved.transparency ?? 'glass';
  const cell = (floors as any)?.[preset]?.[scheme]?.[contrast]?.[transparency]?.[variant]?.[thickness];
  const border = cell?.border;
  return (
    <div
      data-ag-surface=""
      data-ag-variant={variant}
      data-ag-thickness={thickness}
      style={{ padding: 12, margin: 4, minWidth: 130, fontSize: 11 }}
    >
      <b>{variant}/{thickness}</b>
      <div>tr={transparency} c={contrast}</div>
      <div>
        floor α {border ? Number(border.floorAlpha).toFixed(3) : '—'} · min {border?.minRatio ?? '—'}
      </div>
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
