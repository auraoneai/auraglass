/* stories/mat/ModesMatrix.stories.tsx — MAT-334 (S-40..S-43).
   One MAT Surface per variant x thickness over the 8 SC-28 certification
   scenes. Scene assets are QUAL's pending input — the story reports pending
   (never blocks) until they merge. Play toggles data-ag-theme and asserts the
   computed --ag-on-surface differs between light and dark when the token is
   emitted by the (pending) styles layer; plain assertions until
   @storybook/test lands (package.json scripts are PLAT-frozen). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../src/material/index';
import type { MaterialVariant, Thickness } from '../../src/contracts/material';
import { PendingCallout, globUrls } from './_shared';

const SCENE_IDS = [
  'photo', 'flat-white', 'flat-black', 'dense-text',
  'video', 'map', 'data-viz', 'edge-bleed',
];
const sceneImages = globUrls(
  import.meta.glob('/certification/scenes/*.{png,jpg,jpeg,webp,avif}', { eager: true, query: '?url', import: 'default' }),
);
const VARIANTS: MaterialVariant[] = ['regular', 'clear', 'identity'];
const THICKNESSES: Thickness[] = ['thin', 'regular', 'thick'];

function SceneStrip() {
  if (sceneImages.length === 0) {
    return <PendingCallout what="certification/scenes assets (SC-28, owner QUAL) — ids frozen, captures pending" />;
  }
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {sceneImages.map((src) => (
        <img key={src} src={src} alt="" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6 }} />
      ))}
    </div>
  );
}

function Matrix() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SceneStrip />
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <code style={{ width: 72 }}>{variant}</code>
          {THICKNESSES.map((thickness) => (
            <Surface
              key={thickness}
              variant={variant}
              thickness={thickness}
              className={`modes-${variant}-${thickness}`}
            >
              <span style={{ padding: 16, display: 'block' }}>{variant}/{thickness}</span>
            </Surface>
          ))}
        </div>
      ))}
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Scene ids (frozen S-42): {SCENE_IDS.join(', ')} — remote captures run per
        scheme x transparency x contrast on photo, flat-white, flat-black and dense-text.
      </p>
    </div>
  );
}

const meta: Meta = {
  title: 'MAT/Modes Matrix',
  // The preview decorator (AuraGlassProvider -> Environment -> StoryRoot) paints the scene.
  parameters: { layout: 'padded', ag: { subject: 'ModesMatrix', kind: 'showcase' } },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const LightScheme: Story = {
  name: 'variant x thickness — light',
  render: () => (
    <div data-ag-theme="light">
      <Matrix />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-ag-theme]');
    if (!(root instanceof HTMLElement)) throw new Error('ModesMatrix: [data-ag-theme] root missing');
    const read = (scheme: 'light' | 'dark') => {
      root.setAttribute('data-ag-theme', scheme);
      return getComputedStyle(root).getPropertyValue('--ag-on-surface').trim();
    };
    const light = read('light');
    const dark = read('dark');
    if (light === '' && dark === '') {
      console.info('pending: --ag-on-surface not emitted (styles layer MAT-341 blocked) — scheme toggle asserted when tokens land');
      return;
    }
    if (light === dark) {
      throw new Error(`ModesMatrix: computed --ag-on-surface identical across schemes (${JSON.stringify(light)})`);
    }
  },
};

export const DarkScheme: Story = {
  name: 'variant x thickness — dark',
  render: () => (
    <div data-ag-theme="dark">
      <Matrix />
    </div>
  ),
};
