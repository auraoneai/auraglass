/* stories/mat/motion/Tokens.stories.tsx — MAT-368 (REQ-MOT-91).
   Motion Lab token page: SVG easing curves; a dot that animates ONLY while
   Play is held; spring linear() vs analytic read-out with max-error figure.
   All computed locally — no motion-runtime dependency beyond the seeded API. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { PendingCallout } from '../_shared';

const W = 320, H = 140, PAD = 24;

/** Damped harmonic spring, normalized 0->1. */
function spring(t: number, stiffness = 170, damping = 26): number {
  const w = Math.sqrt(stiffness);
  const z = damping / (2 * w);
  if (z >= 1) return 1 - Math.exp(-w * t);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
}

/** CSS linear() stop list sampled from spring(t). */
function linearStops(samples = 16): number[] {
  return Array.from({ length: samples + 1 }, (_, i) => spring(i / samples));
}

function toPath(ys: number[]): string {
  const x = (i: number) => PAD + (i / (ys.length - 1)) * (W - 2 * PAD);
  const y = (v: number) => H - PAD - v * (H - 2 * PAD);
  return `M ${x(0)} ${y(ys[0] ?? 0)} ` + ys.map((v, i) => `L ${x(i)} ${y(v)}`).join(' ');
}

function maxError(): number {
  const stops = linearStops();
  let worst = 0;
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    const seg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)));
    const a = stops[seg] ?? 0, b = stops[seg + 1] ?? 0;
    const local = t * (stops.length - 1) - seg;
    const approx = a + (b - a) * local;
    worst = Math.max(worst, Math.abs(approx - spring(t)));
  }
  return worst;
}

function HoldToPlayDot({ values }: { values: number[] }) {
  const [playing, setPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const raf = React.useRef(0);
  const start = React.useRef(0);
  React.useEffect(() => {
    if (!playing) return;
    start.current = performance.now() - pos * 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start.current) / 1200);
      setPos(t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps -- pos is read via ref-equivalent timing
  const idx = Math.min(values.length - 1, Math.round(pos * (values.length - 1)));
  const y = values[idx] ?? 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        type="button"
        data-play
        onPointerDown={() => setPlaying(true)}
        onPointerUp={() => setPlaying(false)}
        onPointerLeave={() => setPlaying(false)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setPlaying(true); }}
        onKeyUp={() => setPlaying(false)}
        style={{ padding: '4px 14px', borderRadius: 6, border: '1px solid #64748b' }}
      >
        Hold to play
      </button>
      <svg width={W} height={H} style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <path d={toPath(values)} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        <circle data-dot cx={PAD + pos * (W - 2 * PAD)} cy={H - PAD - y * (H - 2 * PAD)} r={5} fill="#0ea5e9" />
      </svg>
      <code data-pos>{pos.toFixed(2)}</code>
    </div>
  );
}

function Tokens() {
  const stops = linearStops();
  const analytic = Array.from({ length: 65 }, (_, i) => spring(i / 64));
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h3>Spring — analytic vs CSS linear() (16 stops)</h3>
      <svg width={W} height={H} style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
        <path d={toPath(analytic)} fill="none" stroke="#0ea5e9" strokeWidth={2} />
        <path d={toPath(stops)} fill="none" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 3" />
      </svg>
      <div style={{ fontSize: 12 }}>
        <span style={{ color: '#0ea5e9' }}>— analytic spring(170/26)</span>{' '}
        <span style={{ color: '#f97316' }}>-- linear() approximation</span>
      </div>
      <div data-linear-error style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>
        max |linear() - analytic| = {maxError().toFixed(4)} over t in [0,1]
      </div>
      <h3>Dot animates only while Play is held</h3>
      <HoldToPlayDot values={analytic} />
      <PendingCallout what="motion token source --ag-motion-* emission (pending MAT token lanes / SB Lab harness .storybook/lab)" />
    </div>
  );
}

const meta: Meta = {
  parameters: { ag: { subject: 'Tokens', kind: 'showcase' } }, title: 'MAT/Motion/Tokens', parameters: { layout: 'padded' } };
export default meta;

type Story = StoryObj<typeof meta>;

export const CurvesAndHold: Story = {
  render: () => <Tokens />,
  play: async ({ canvasElement }) => {
    const err = canvasElement.querySelector('[data-linear-error]');
    if (!err || !/max \|linear\(\) - analytic\| = \d/.test(err.textContent ?? '')) {
      throw new Error('Motion/Tokens: error read-out missing');
    }
    const dot = canvasElement.querySelector('[data-dot]');
    const pos = canvasElement.querySelector('[data-pos]');
    if (!(dot instanceof SVGCircleElement) || !pos) throw new Error('Motion/Tokens: dot missing');
    if (pos.textContent !== '0.00') {
      throw new Error(`Motion/Tokens: dot moved without Play held (pos=${pos.textContent})`);
    }
  },
};
