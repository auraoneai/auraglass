/* stories/qual/perf/PerfFixtures.stories.tsx — REQ-QUAL-35 perf fixtures (QUAL, L10).
   Stable story ids (a renamed id is a schema bump of tests/perf/harness/perf-results.schema.json):
     perf-harness-blank--default, perf-nesting--nest-4, perf-budget--budget-7, perf-lens--lens-3,
     perf-webgl--webgl-3, perf-mount-cycle--default
   Composed only from the S-06 Surface / SurfaceGroup (the './material' entry, src/material/index.ts) and plain DOM.
   The ids are pinned with parameters.__id (the Storybook CSF indexer reads it statically) because one CSF file has one
   title. Tagged no-cert: these are measurement fixtures for tests/perf/harness/run-perf.mjs, not certification subjects
   for L6/L7. Every fixture renders over the `photo` scene. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface, SurfaceGroup } from '../../../src/material/index';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Material Lab/Perf Fixtures',
  tags: ['lab', 'no-cert'],
  globals: { scene: 'photo' },
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const page: React.CSSProperties = { minHeight: '100vh', boxSizing: 'border-box', padding: 48 };
const panel: React.CSSProperties = { padding: 24, minInlineSize: 200, minBlockSize: 120 };

/** Empty Lab page over `photo`: the per-profile blank baseline every result is reported against (delta vs blank). */
export const Default: Story = {
  name: 'Harness blank',
  parameters: { __id: 'perf-harness-blank--default', ag: { subject: 'perf-harness-blank', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
  render: () => <div data-ag-perf-fixture="perf-harness-blank" style={page} />,
};

/** Four nested surfaces (effective nesting 3 for the innermost; budget is ≤1). */
export const Nest4: Story = {
  name: 'Nesting 4',
  parameters: { __id: 'perf-nesting--nest-4', ag: { subject: 'perf-nesting', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
  render: () => (
    <div data-ag-perf-fixture="perf-nesting" style={page}>
      <Surface layer="chrome" thickness="regular" style={{ padding: 32 }}>
        <Surface layer="chrome" thickness="regular" allowNested style={{ padding: 32 }}>
          <Surface layer="chrome" thickness="regular" allowNested style={{ padding: 32 }}>
            <Surface layer="chrome" thickness="regular" allowNested style={panel}>Nesting level 4</Surface>
          </Surface>
        </Surface>
      </Surface>
    </div>
  ),
};

/** Seven visible blurred surfaces (fine-pointer budget is ≤6). */
export const Budget7: Story = {
  name: 'Budget 7',
  parameters: { __id: 'perf-budget--budget-7', ag: { subject: 'perf-budget', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
  render: () => (
    <div data-ag-perf-fixture="perf-budget" style={{ ...page, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24 }}>
      {Array.from({ length: 7 }, (_, i) => (
        <Surface key={i} layer="chrome" thickness="regular" style={panel}>Surface {i + 1}</Surface>
      ))}
    </div>
  ),
};

/** Three refraction-eligible chrome surfaces under the enhanced tier (budget ≤2 enhanced lenses fine / ≤1 coarse). */
export const Lens3: Story = {
  name: 'Lens 3',
  globals: { tier: 'enhanced' },
  parameters: { __id: 'perf-lens--lens-3', ag: { subject: 'perf-lens', kind: 'lab', scenes: ['photo'], tier: 'enhanced', refraction: true } satisfies StoryAgParameters },
  render: () => (
    <div data-ag-perf-fixture="perf-lens" style={{ ...page, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {Array.from({ length: 3 }, (_, i) => (
        <Surface key={i} layer="chrome" shape="capsule" refraction interactive style={{ padding: '12px 24px' }}>Lens {i + 1}</Surface>
      ))}
    </div>
  ),
};

/** Paints one frame into a WebGL context and keeps the context alive (no render loop, so settled idle stays clean). */
function GlCanvas({ index }: { index: number }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!gl) throw new Error('perf-webgl fixture: WebGL is unavailable in this browser');
    gl.clearColor(0.1 * (index + 1), 0.3, 0.6, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return () => { gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, [index]);
  return <canvas ref={ref} width={320} height={180} data-ag-perf-webgl={index} style={{ display: 'block', inlineSize: 320, blockSize: 180 }} />;
}

/** Three surfaces each hosting a live WebGL context (budget ≤1 context). './three' exports nothing at 5.0 (OI-01),
    so the contexts are plain canvases inside the public Surface. */
export const Webgl3: Story = {
  name: 'WebGL 3',
  parameters: { __id: 'perf-webgl--webgl-3', ag: { subject: 'perf-webgl', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
  render: () => (
    <div data-ag-perf-fixture="perf-webgl" style={{ ...page, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {Array.from({ length: 3 }, (_, i) => (
        <Surface key={i} layer="content" content="content-raised" style={{ padding: 12 }}><GlCanvas index={i} /></Surface>
      ))}
    </div>
  ),
};

function MountCycle() {
  const [mounted, setMounted] = React.useState(true);
  return (
    <div data-ag-perf-fixture="perf-mount-cycle" style={page}>
      <button type="button" data-ag-part="toggle" aria-pressed={mounted} onClick={() => setMounted((m) => !m)}>
        {mounted ? 'Unmount surfaces' : 'Mount surfaces'}
      </button>
      {mounted ? (
        <SurfaceGroup>
          <div style={{ display: 'flex', gap: 24, marginBlockStart: 24 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <Surface key={i} layer="chrome" thickness="regular" style={panel}>Cycled surface {i + 1}</Surface>
            ))}
          </div>
        </SurfaceGroup>
      ) : null}
    </div>
  );
}

/** A surface group that the scripted interaction mounts and unmounts through the `toggle` part. */
export const MountCycleDefault: Story = {
  name: 'Mount cycle',
  parameters: {
    __id: 'perf-mount-cycle--default',
    ag: { subject: 'perf-mount-cycle', kind: 'lab', scenes: ['photo'], states: [{ name: 'toggled', drive: [{ action: 'press', target: 'toggle' }] }] } satisfies StoryAgParameters,
  },
  render: () => <MountCycle />,
};
