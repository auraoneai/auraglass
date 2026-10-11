/* stories/mat/ModesMatrix.stories.tsx — MAT-334 (S-40..S-43).
   One MAT Surface per variant x thickness over the 8 SC-28 certification
   scenes. Scene assets are QUAL's pending input — the story reports pending
   (never blocks) until they merge. Scheme is the story's `scheme` global
   (applied by the preview decorator, S-41/S-42); the story supplies no stage,
   optics, ink or private vars and imports nothing from .storybook/**
   (REQ-FIN-59 / REQ-FIN-106, D.3-38). Play probes [data-ag-scheme="light"]
   and [data-ag-scheme="dark"] and asserts the computed --ag-on-surface differs
   when the token is emitted by the (pending) styles layer; plain assertions
   until @storybook/test lands (package.json scripts are PLAT-frozen). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../src/material/index';
import type { MaterialVariant, Thickness } from '../../src/contracts/material';
import type { StoryAgParameters } from '../../src/contracts/testing';
import { PendingCallout, globUrls } from './_shared';

const SCENE_IDS = [
  'photo', 'flat-white', 'flat-black', 'dense-text',
  'video', 'map', 'data-viz', 'edge-bleed',
];
const sceneImages = globUrls('/certification/scenes/*.{png,jpg,jpeg,webp,avif}');
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
  parameters: { ag: { subject: 'ModesMatrix', kind: 'showcase' } },
  title: 'MAT/Modes Matrix',
  parameters: {
    layout: 'padded',
    ag: { subject: 'Surface', kind: 'lab' } satisfies StoryAgParameters,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

/** Reads --ag-on-surface under each scheme on detached probes, so the story
    tree itself is never re-attributed. */
function onSurfaceByScheme(host: HTMLElement): Record<'light' | 'dark', string> {
  const read = (scheme: 'light' | 'dark') => {
    const probe = document.createElement('div');
    probe.setAttribute('data-ag-scheme', scheme);
    host.appendChild(probe);
    const value = getComputedStyle(probe).getPropertyValue('--ag-on-surface').trim();
    probe.remove();
    return value;
  };
  return { light: read('light'), dark: read('dark') };
}

export const LightScheme: Story = {
  name: 'variant x thickness — light',
  globals: { scheme: 'light' },
  render: () => <Matrix />,
  play: async ({ canvasElement }) => {
    const { light, dark } = onSurfaceByScheme(canvasElement);
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
  globals: { scheme: 'dark' },
  render: () => <Matrix />,
};
