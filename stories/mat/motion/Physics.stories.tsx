/* stories/mat/motion/Physics.stories.tsx — MAT-368 (REQ-MOT-91/-93).
   Motion Lab physics page: Sheet detents with a live velocity read-out (real
   pointer drag math), TabBar momentum, magnetic, and Shared panels. The
   detents drag + velocity numbers run locally; useDragDetents/useMomentum/
   magnetic/Shared substitute when the seeded runtime lands — no animated
   backgrounds (SC-31). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Surface } from '../../../src/material/index';
import { PendingCallout } from '../_shared';

function SheetDetents() {
  const detents = [0.15, 0.5, 0.9];
  const [t, setT] = React.useState(0.5);
  const [velocity, setVelocity] = React.useState(0);
  const drag = React.useRef<{ y: number; time: number; t: number } | null>(null);
  return (
    <section>
      <h4 style={{ margin: '0 0 8px' }}>Sheet — drag between detents</h4>
      <div
        data-ag-sheet
        style={{ position: 'relative', height: 220, width: 260, border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', touchAction: 'none' }}
        onPointerDown={(e) => {
          drag.current = { y: e.clientY, time: performance.now(), t };
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const now = performance.now();
          const dy = drag.current.y - e.clientY;
          const dt = Math.max(1, now - drag.current.time);
          const next = Math.min(1, Math.max(0, drag.current.t + dy / 220));
          setVelocity(Math.abs(dy) / dt);
          setT(next);
        }}
        onPointerUp={() => {
          const nearest = detents.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a));
          setT(nearest);
          drag.current = null;
        }}
      >
        {detents.map((d) => (
          <div key={d} style={{ position: 'absolute', left: 0, right: 0, bottom: `${d * 100}%`, borderTop: '1px dashed #94a3b8' }}>
            <span style={{ fontSize: 10, color: '#64748b' }}>detent {d}</span>
          </div>
        ))}
        <div
          data-ag-sheet-handle
          style={{
            position: 'absolute', left: '20%', right: '20%', bottom: `${t * 100}%`, height: 24,
            background: '#0ea5e9', borderRadius: 8, transform: 'translateY(50%)',
          }}
        />
      </div>
      <div data-ag-velocity style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, marginTop: 6 }}>
        velocity {velocity.toFixed(2)} px/ms · t {t.toFixed(2)}
      </div>
    </section>
  );
}

function Physics() {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <SheetDetents />
      <section>
        <h4 style={{ margin: '0 0 8px' }}>TabBar momentum</h4>
        <Surface interactive className="ag-phys-tabbar">
          <div style={{ display: 'flex', gap: 8, padding: '10px 14px', overflowX: 'auto', maxWidth: 300 }}>
            {['Overview', 'Specs', 'Reviews', 'Docs', 'Support', 'Roadmap'].map((tab) => (
              <span key={tab} style={{ whiteSpace: 'nowrap', fontSize: 13, padding: '2px 8px' }}>{tab}</span>
            ))}
          </div>
        </Surface>
        <PendingCallout what="useMomentum scroll physics (seeded)" />
      </section>
      <section>
        <h4 style={{ margin: '0 0 8px' }}>magnetic</h4>
        <Surface interactive className="ag-phys-magnetic">
          <span style={{ display: 'block', padding: '10px 18px' }}>magnetic target</span>
        </Surface>
        <PendingCallout what="magnetic() attractor (seeded)" />
      </section>
      <section>
        <h4 style={{ margin: '0 0 8px' }}>Shared</h4>
        <div style={{ display: 'flex', gap: 10 }}>
          <Surface variant="clear" className="ag-phys-shared-a"><span style={{ padding: '8px 12px' }}>shared a</span></Surface>
          <Surface variant="clear" className="ag-phys-shared-b"><span style={{ padding: '8px 12px' }}>shared b</span></Surface>
        </div>
        <PendingCallout what="Shared/SharedLayout element continuity (seeded)" />
      </section>
    </div>
  );
}

const meta: Meta = { title: 'MAT/Motion/Physics', parameters: { layout: 'padded' } };
export default meta;

type Story = StoryObj<typeof meta>;

export const Lab: Story = {
  render: () => <Physics />,
  play: async ({ canvasElement }) => {
    for (const sel of ['.ag-phys-tabbar', '.ag-phys-magnetic', '.ag-phys-shared-a', '.ag-phys-shared-b', '[data-ag-sheet]', '[data-ag-velocity]']) {
      if (!canvasElement.querySelector(sel)) throw new Error(`Motion/Physics: ${sel} missing`);
    }
    const vel = canvasElement.querySelector('[data-ag-velocity]');
    if (!/velocity \d+\.\d+ px\/ms/.test(vel?.textContent ?? '')) {
      throw new Error('Motion/Physics: velocity read-out missing');
    }
  },
};
