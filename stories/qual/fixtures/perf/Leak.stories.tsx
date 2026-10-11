/* stories/qual/fixtures/perf/Leak.stories.tsx — REQ-QUAL-42 negative and clean fixtures (QUAL, L10; FIN-446).
   Consumed by tests/perf/qual/mount-unmount-leak.spec.ts, which mounts/unmounts each one 10× and must report:
     WindowListener    a window 'resize' listener added on mount, never removed          → listener-leak (+10)
     DocumentListener  a document 'pointermove' listener added on mount, never removed   → listener-leak (+10)
     RafLoop           a requestAnimationFrame loop that is never cancelled               → raf-pending, raf-loop
     Interval          a setInterval that is never cleared                                → interval-leak
     Observer          a ResizeObserver kept in module state and never disconnected       → observer-leak
     Clean             all of the above APIs, each released in the effect cleanup         → no violation
   Tagged no-cert: negative controls, never certification subjects. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Surface } from '../../../../src/material/index';
import type { StoryAgParameters } from '../../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Perf/Leak',
  tags: ['no-cert'],
  parameters: { layout: 'fullscreen', ag: { subject: 'fixture:perf-leak', kind: 'lab', scenes: ['photo'] } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Frame({ name, children }: { name: string; children?: React.ReactNode }) {
  return (
    <div data-ag-fixture={name} style={{ minHeight: '100vh', boxSizing: 'border-box', padding: 48 }}>
      <Surface layer="chrome" thickness="regular" style={{ padding: 24, minInlineSize: 240 }}>{children ?? name}</Surface>
    </div>
  );
}

function WindowListenerLeak() {
  React.useEffect(() => {
    const onResize = () => undefined;
    window.addEventListener('resize', onResize);
    // deliberately no cleanup
  }, []);
  return <Frame name="leak-window-listener" />;
}

function DocumentListenerLeak() {
  React.useEffect(() => {
    document.addEventListener('pointermove', () => undefined, { passive: true });
  }, []);
  return <Frame name="leak-document-listener" />;
}

function RafLoopLeak() {
  React.useEffect(() => {
    const tick = () => { requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, []);
  return <Frame name="leak-raf-loop" />;
}

function IntervalLeak() {
  React.useEffect(() => { setInterval(() => undefined, 1000); }, []);
  return <Frame name="leak-interval" />;
}

/* A module-level registry keeps the observers reachable, as a real leaked subscription would. */
const retainedObservers: ResizeObserver[] = [];
function ObserverLeak() {
  React.useEffect(() => {
    const ro = new ResizeObserver(() => undefined);
    ro.observe(document.body);
    retainedObservers.push(ro);
  }, []);
  return <Frame name="leak-observer" />;
}

function CleanComponent() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const onResize = () => undefined;
    const onMove = () => undefined;
    window.addEventListener('resize', onResize);
    document.addEventListener('pointermove', onMove, { passive: true });
    let raf = 0;
    const tick = () => { raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const interval = setInterval(() => undefined, 1000);
    const ro = new ResizeObserver(() => undefined);
    if (ref.current) ro.observe(ref.current);
    const io = new IntersectionObserver(() => undefined);
    if (ref.current) io.observe(ref.current);
    const mo = new MutationObserver(() => undefined);
    mo.observe(document.body, { childList: true });
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      clearInterval(interval);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return <div ref={ref}><Frame name="leak-clean" /></div>;
}

export const WindowListener: Story = { render: () => <WindowListenerLeak /> };
export const DocumentListener: Story = { render: () => <DocumentListenerLeak /> };
export const RafLoop: Story = { render: () => <RafLoopLeak /> };
export const Interval: Story = { render: () => <IntervalLeak /> };
export const Observer: Story = { render: () => <ObserverLeak /> };
export const Clean: Story = { render: () => <CleanComponent /> };
