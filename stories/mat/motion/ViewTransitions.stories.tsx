/* stories/mat/motion/ViewTransitions.stories.tsx — MAT-368 (REQ-MOT-91/-93).
   Motion Lab view-transitions page with an optics debug toggle: toggling draws
   the transition bounds/layer outlines the certification reviewer needs.
   REQ-MAT-48: the swap runs through startMorph. The Surface is a morph
   participant (useMorphName name + data-ag-vt-participant, so it carries
   view-transition-class ag-morph); calm/none come from the story's
   data-ag-motion global. This is the MAT subject of
   tests/motion/view-transition-optics.spec.ts. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { flushSync } from 'react-dom';
import { Surface } from '../../../src/material/index';
import { startMorph, useMorphName } from '../../../src/motion/index';

function TransitionsLab() {
  const [debug, setDebug] = React.useState(false);
  const [swapped, setSwapped] = React.useState(false);
  const morphName = useMorphName('vt-lab');
  const surfaceRef = React.useRef<HTMLElement>(null);
  const swap = () => {
    const el = surfaceRef.current;
    void startMorph(() => flushSync(() => setSwapped((s) => !s)), { surfaces: el ? [el] : [] });
  };
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
        <Surface
          variant="regular"
          thickness="thin"
          ref={surfaceRef}
          data-ag-vt-participant=""
          style={{ viewTransitionName: morphName, width: 'fit-content', marginLeft: swapped ? 160 : 0 }}
        >
          <div
            data-ag-vt-node
            style={{
              padding: '14px 18px',
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
        onClick={swap}
        style={{ width: 'fit-content', padding: '6px 14px', borderRadius: 6, border: '1px solid #64748b' }}
      >
        swap (startMorph)
      </button>
    </div>
  );
}

const meta: Meta = { title: 'MAT/Motion/View Transitions', parameters: { layout: 'padded' } };
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
