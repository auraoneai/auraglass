/* QUAL negative fixtures (G-13, REQ-QUAL-13..18, FIN-430). Each story is built to trip exactly one L6 gate; the lane
   specs assert the gate reports it (a certification that passes these is broken). Tagged no-cert: never capture
   subjects of the matrix. Colours here are deliberate fixture inputs, not product styling.
   - OpaqueStage        REQ-QUAL-14 glass-over-nothing: a real regular Surface over an opaque card
   - LowContrastText    REQ-QUAL-13 ocr-contrast: the 4.1 App Shell ink rgba(0,0,0,.9) on rgb(13,31,43)
   - PreferenceNoop     REQ-QUAL-16 preference-noop: fixed colours that ignore data-ag-contrast / data-ag-transparency
   - Throws             REQ-QUAL-17 console: an uncaught error (pageerror) after mount
   - ConsoleWarn        REQ-QUAL-17 console: an unallowlisted console.warn
   - Overflowing        REQ-QUAL-18 containment: 520 px of content in a 390 px viewport
   - SmallTarget        REQ-QUAL-18 target-size: a 20×20 px button
   - LowContrastRing    REQ-QUAL-18 focus-indicator: a #e6e6e6 focus ring on white */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from '../../../src/index';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Pixel Gates',
  tags: ['no-cert'],
  parameters: { ag: { subject: 'fixture:pixel-gates', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const css = `
.qual-pg-stage { inline-size: 480px; padding: 40px; background: rgb(28 32 40); border-radius: 20px; }
.qual-pg-surface { inline-size: 400px; block-size: 200px; padding: 24px; }
.qual-pg-dark { inline-size: 480px; padding: 32px; background: rgb(13 31 43); color: rgb(0 0 0 / 0.9); font: 500 16px/1.5 system-ui, sans-serif; }
.qual-pg-noop { inline-size: 420px; padding: 28px; background: rgb(240 240 240); color: rgb(40 40 40); border: 1px solid rgb(200 200 200); border-radius: 16px; font: 16px/1.5 system-ui, sans-serif; }
.qual-pg-wide { inline-size: 520px; padding: 16px; background: rgb(255 255 255); color: rgb(20 20 20); font: 16px/1.5 system-ui, sans-serif; }
.qual-pg-panel { padding: 32px; background: rgb(255 255 255); color: rgb(20 20 20); font: 16px/1.5 system-ui, sans-serif; display: flex; gap: 24px; align-items: center; }
.qual-pg-small { inline-size: 20px; block-size: 20px; padding: 0; border: 1px solid rgb(60 60 60); background: rgb(250 250 250); border-radius: 4px; font-size: 12px; }
.qual-pg-ring { padding: 12px 20px; border: 1px solid rgb(120 120 120); background: rgb(255 255 255); color: rgb(20 20 20); border-radius: 8px; font: 16px system-ui, sans-serif; }
.qual-pg-ring:focus { outline: none; }
.qual-pg-ring:focus-visible { outline: 2px solid rgb(230 230 230); outline-offset: 2px; }
`;
const Css = () => <style>{css}</style>;

export const OpaqueStage: Story = {
  render: () => (
    <>
      <Css />
      <div className="qual-pg-stage">
        <Surface variant="regular" thickness="regular" className="qual-pg-surface">
          <p>Quarterly summary</p>
        </Surface>
      </div>
    </>
  ),
};

export const LowContrastText: Story = {
  render: () => (
    <>
      <Css />
      <div className="qual-pg-dark" data-ag-part="root">
        <p>Workspace settings</p>
        <p>Billing and members</p>
      </div>
    </>
  ),
};

export const PreferenceNoop: Story = {
  render: () => (
    <>
      <Css />
      <div className="qual-pg-noop" data-ag-part="root">
        <p>Release notes</p>
        <p>This panel paints the same pixels in every preference mode.</p>
      </div>
    </>
  ),
};

function ThrowAfterMount() {
  React.useEffect(() => {
    const id = window.setTimeout(() => { throw new Error('qual fixture: uncaught error after mount'); }, 0);
    return () => window.clearTimeout(id);
  }, []);
  return <p className="qual-pg-wide">Inbox</p>;
}
export const Throws: Story = { render: () => (<><Css /><ThrowAfterMount /></>) };

function WarnOnMount() {
  React.useEffect(() => { console.warn('qual fixture: unallowlisted warning'); }, []);
  return <p className="qual-pg-wide">Calendar</p>;
}
export const ConsoleWarn: Story = { render: () => (<><Css /><WarnOnMount /></>) };

export const Overflowing: Story = {
  render: () => (
    <>
      <Css />
      <div className="qual-pg-wide" data-ag-part="root">A fixed 520 px row that cannot fit a 390 px viewport</div>
    </>
  ),
};

export const SmallTarget: Story = {
  render: () => (
    <>
      <Css />
      <div className="qual-pg-panel" data-ag-part="root">
        <span>Close panel</span>
        <button type="button" className="qual-pg-small" aria-label="Close" data-ag-part="trigger">×</button>
      </div>
    </>
  ),
};

export const LowContrastRing: Story = {
  render: () => (
    <>
      <Css />
      <div className="qual-pg-panel" data-ag-part="root">
        <button type="button" className="qual-pg-ring" data-ag-part="trigger">Save changes</button>
      </div>
    </>
  ),
};
