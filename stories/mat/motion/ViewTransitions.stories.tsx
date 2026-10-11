/* stories/mat/motion/ViewTransitions.stories.tsx — MAT-368 (REQ-MOT-91/-93).
   Motion Lab view-transitions page with an optics debug toggle: toggling draws
   the transition bounds/layer outlines the certification reviewer needs. The
   toggle and overlay are real; document.startViewTransition wiring is pending
   the seeded runtime. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../../src/material/index';
import { PendingCallout } from '../_shared';

function TransitionsLab() {
  const [debug, setDebug] = React.useState(false);
  const [swapped, setSwapped] = React.useState(false);
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
        <input
          type="checkbox"
          data-ag-optics-debug
          checked={debug}
          onChange={(e) => setDebug(e.target.checked)}
        />
        optics debug (draw transition bounds + layer ids)
      </label>
      <div
        data-ag-vt-stage
        data-ag-optics-debug-state={debug ? 'on' : 'off'}
        style={{
          position: 'relative', minHeight: 160, border: '1px solid #e2e8f0', borderRadius: 10, padding: 14,
          outline: debug ? '2px dashed #0ea5e9' : undefined, outlineOffset: 4,
        }}
      >
        {debug ? (
          <span style={{ position: 'absolute', top: 4, right: 8, fontSize: 10, color: '#0ea5e9' }}>
            ::view-transition-old/new bounds
          </span>
        ) : null}
        <Surface variant="regular" thickness="thin">
          <div
            data-ag-vt-node
            style={{
              padding: '14px 18px',
              marginLeft: swapped ? 160 : 0,
              transition: 'none',
              outline: debug ? '1px solid #f97316' : undefined,
            }}
          >
            shared element node {swapped ? '(after)' : '(before)'}
          </div>
        </Surface>
      </div>
      <button
        type="button"
        data-ag-vt-trigger
        onClick={() => setSwapped((s) => !s)}
        style={{ width: 'fit-content', padding: '6px 14px', borderRadius: 6, border: '1px solid #64748b' }}
      >
        swap (runs startViewTransition when runtime lands)
      </button>
      <PendingCallout what="document.startViewTransition orchestration — seeded motion runtime pending" />
    </div>
  );
}

const meta: Meta = {
  parameters: { ag: { subject: 'ViewTransitions', kind: 'showcase' } }, title: 'MAT/Motion/View Transitions', parameters: { layout: 'padded' } };
export default meta;

type Story = StoryObj<typeof meta>;

export const OpticsDebugToggle: Story = {
  render: () => <TransitionsLab />,
  play: async ({ canvasElement }) => {
    const toggle = canvasElement.querySelector('[data-ag-optics-debug]');
    const stage = canvasElement.querySelector('[data-ag-vt-stage]');
    if (!(toggle instanceof HTMLInputElement) || !stage) throw new Error('ViewTransitions: toggle/stage missing');
    if (stage.getAttribute('data-ag-optics-debug-state') !== 'off') throw new Error('ViewTransitions: debug should start off');
    toggle.click();
    await new Promise((r) => setTimeout(r, 30));
    if (stage.getAttribute('data-ag-optics-debug-state') !== 'on') {
      throw new Error('ViewTransitions: optics debug toggle did not flip stage state');
    }
  },
};
