/* stories/mat/motion/Interactions.stories.tsx — MAT-368 (REQ-MOT-93, S-40..43).
   Motion Lab interactions page: one story row per contract §4.6 interaction,
   rendered over the 8 static SC-28 scene panels with the full / calm / none
   motion policies side by side. Live motion is a pending input (seeded
   runtime); the grid, policy panes and scene strip are real. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../../src/material/index';
import { PendingCallout, globUrls } from '../_shared';

const SCENE_IDS = ['photo', 'flat-white', 'flat-black', 'dense-text', 'video', 'map', 'data-viz', 'edge-bleed'];
const POLICIES = ['full', 'calm', 'none'] as const;
const INTERACTIONS = [
  { id: 'press-feedback', label: 'press feedback (scale/sheen)' },
  { id: 'hover-lift', label: 'hover lift' },
  { id: 'focus-ring', label: 'focus ring sweep' },
  { id: 'state-morph', label: 'loading morph' },
  { id: 'scroll-edge', label: 'scroll edge reveal' },
] as const;

const sceneImages = globUrls('/certification/scenes/*.{png,jpg,jpeg,webp,avif}');

function ScenePane({ scene, policy, interaction }: { scene: string; policy: (typeof POLICIES)[number]; interaction: string }) {
  const img = sceneImages[SCENE_IDS.indexOf(scene)] ?? sceneImages[0];
  return (
    <div
      data-ag-motion-cell={`${interaction}:${scene}:${policy}`}
      style={{
        position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0',
        minHeight: 90, background: img ? undefined : '#f1f5f9',
      }}
    >
      {img ? <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      <div style={{ position: 'relative', padding: 10 }}>
        <Surface interactive thickness="thin" className={`ag-mi-${interaction}`}>
          <span style={{ display: 'inline-block', padding: '8px 12px', fontSize: 12 }}>
            {interaction}
          </span>
        </Surface>
        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 6 }}>
          {scene} · motion: <code data-ag-policy={policy}>{policy}</code>
        </div>
      </div>
    </div>
  );
}

function InteractionGrid() {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {sceneImages.length === 0 ? (
        <PendingCallout what="certification/scenes static assets (SC-28, owner QUAL)" />
      ) : null}
      {INTERACTIONS.map(({ id, label }) => (
        <section key={id}>
          <h4 style={{ margin: '0 0 8px' }}>{label}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${POLICIES.length}, 1fr)`, gap: 10 }}>
            {POLICIES.map((policy) =>
              SCENE_IDS.slice(0, 3).map((scene) => (
                <ScenePane key={`${scene}-${policy}`} scene={scene} policy={policy} interaction={id} />
              )),
            )}
          </div>
        </section>
      ))}
      <PendingCallout what="live motion playback — seeded runtime (src/motion/public.ts throws); panes render static layout now" />
    </div>
  );
}

const meta: Meta = { title: 'MAT/Motion/Interactions', parameters: { layout: 'padded' } };
export default meta;

type Story = StoryObj<typeof meta>;

export const PoliciesSideBySide: Story = {
  name: '§4.6 rows x full/calm/none on static scenes',
  render: () => <InteractionGrid />,
  play: async ({ canvasElement }) => {
    for (const { id } of INTERACTIONS) {
      for (const policy of POLICIES) {
        if (!canvasElement.querySelector(`[data-ag-motion-cell^="${id}:"][data-ag-motion-cell$=":${policy}"]`)) {
          throw new Error(`Motion/Interactions: missing pane for ${id}/${policy}`);
        }
      }
    }
  },
};
