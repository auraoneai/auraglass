/* stories/qual/fixtures/perf/Webgl.stories.tsx — REQ-QUAL-43 (3) fixtures (QUAL, L10; FIN-446).
   Consumed by tests/perf/qual/webgl-context.spec.ts (runs at deviceScaleFactor 2 so the DPR cap is observable).
     Clean          one context, backing store capped at DPR 1.5, render loop only while visible and on screen
                    (visibilitychange + IntersectionObserver), WEBGL_lose_context on unmount → no violation
     ThreeContexts  three surfaces each holding its own context                               → webgl-context-budget
     Unreleased     one context never lost on unmount (kept in a module cache)                 → webgl-unreleased
     UngatedLoop    a render loop that ignores visibility and intersection                     → webgl-raf-hidden, webgl-raf-offscreen
     FullDpr        backing store sized at the full devicePixelRatio (2)                       → webgl-dpr
   `./three` exports nothing at 5.0 (OI-01), so these are plain canvases inside the public Surface. Tagged no-cert. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../../../../src/material/index';
import type { StoryAgParameters } from '../../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Perf/WebGL',
  tags: ['no-cert'],
  parameters: { layout: 'fullscreen', ag: { subject: 'fixture:perf-webgl-invariants', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const CSS_W = 320;
const CSS_H = 180;

interface GlOptions { maxDpr: number; loop: 'none' | 'gated' | 'ungated'; release: boolean }

const retained: WebGLRenderingContext[] = [];

function useGlCanvas(ref: React.RefObject<HTMLCanvasElement | null>, { maxDpr, loop, release }: GlOptions) {
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = Math.round(CSS_W * dpr);
    canvas.height = Math.round(CSS_H * dpr);
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) throw new Error('webgl fixture: WebGL is unavailable in this browser');
    let frame = 0;
    const draw = () => {
      frame += 1;
      gl.clearColor(0.2, 0.4, 0.6 + 0.2 * Math.sin(frame / 30), 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };
    draw();
    let raf = 0;
    let visible = document.visibilityState === 'visible';
    let onScreen = true;
    const cleanups: Array<() => void> = [];
    if (loop === 'ungated') {
      const tick = () => { draw(); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    } else if (loop === 'gated') {
      const tick = () => {
        if (!visible || !onScreen) { raf = 0; return; }
        draw();
        raf = requestAnimationFrame(tick);
      };
      const kick = () => { if (!raf && visible && onScreen) raf = requestAnimationFrame(tick); };
      const onVisibility = () => { visible = document.visibilityState === 'visible'; kick(); };
      document.addEventListener('visibilitychange', onVisibility);
      const io = new IntersectionObserver((entries) => { onScreen = entries.some((e) => e.isIntersecting); kick(); });
      io.observe(canvas);
      cleanups.push(() => { document.removeEventListener('visibilitychange', onVisibility); io.disconnect(); });
      kick();
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      if (release) gl.getExtension('WEBGL_lose_context')?.loseContext();
      else retained.push(gl);
    };
  }, [ref, maxDpr, loop, release]);
}

function GlCanvas(props: GlOptions & { name: string }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  useGlCanvas(ref, props);
  return <canvas ref={ref} data-ag-fixture={props.name} style={{ display: 'block', inlineSize: CSS_W, blockSize: CSS_H }} />;
}

const page: React.CSSProperties = { minHeight: '100vh', boxSizing: 'border-box', padding: 48, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' };

function Fixture({ name, count = 1, ...opts }: GlOptions & { name: string; count?: number }) {
  return (
    <div data-ag-fixture={`webgl-${name}`} style={page}>
      {Array.from({ length: count }, (_, i) => (
        <Surface key={i} layer="content" content="content-raised" style={{ padding: 12 }}>
          <GlCanvas name={`${name}-${i}`} {...opts} />
        </Surface>
      ))}
    </div>
  );
}

export const Clean: Story = { render: () => <Fixture name="clean" maxDpr={1.5} loop="gated" release /> };
export const ThreeContexts: Story = { render: () => <Fixture name="three-contexts" count={3} maxDpr={1.5} loop="none" release /> };
export const Unreleased: Story = { render: () => <Fixture name="unreleased" maxDpr={1.5} loop="none" release={false} /> };
export const UngatedLoop: Story = { render: () => <Fixture name="ungated-loop" maxDpr={1.5} loop="ungated" release /> };
export const FullDpr: Story = { render: () => <Fixture name="full-dpr" maxDpr={Number.POSITIVE_INFINITY} loop="none" release /> };
