// Backdrop.stories.tsx — preset × scheme states (SURF-440).
import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop } from './Backdrop';
import { AuraGlassProvider } from '../theme';

const meta = {
  title: 'Backdrops/Backdrop',
  parameters: { ag: { subject: 'Backdrop', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Content = () => <div style={{ padding: '4rem 2rem', textAlign: 'center' }}><h1>Backdrop</h1></div>;

export const AuroraLight: Story = { render: () => <Backdrop preset="aurora" scheme="light"><Content /></Backdrop> };
export const AuroraDark: Story = { render: () => <Backdrop preset="aurora" scheme="dark"><Content /></Backdrop> };
export const Mesh: Story = { render: () => <Backdrop preset="mesh" scheme="auto"><Content /></Backdrop> };
export const Grain: Story = { render: () => <Backdrop preset="grain"><Content /></Backdrop> };
export const Photo: Story = { render: () => <Backdrop preset="photo" src="/scenes/photo.jpg" mediaTone="light"><Content /></Backdrop> };
/* Media comes from the certification scenes served at /scenes (REQ-SURF-160:
   presets ship no media assets). */
const VIDEO = { src: '/scenes/video-frame.webm', poster: '/scenes/video-frame.jpg' } as const;
/* Room below the backdrop so a test can scroll it out of view (REQ-SURF-157/159). */
const ScrollRoom = () => <div aria-hidden="true" style={{ blockSize: '250vh' }} />;
export const Video: Story = { render: () => <Backdrop preset="video" {...VIDEO} mediaTone="dark"><Content /></Backdrop> };
/** Continuous gate open: the video may play while visible (REQ-SURF-157). */
export const VideoContinuous: Story = {
  render: () => (
    <AuraGlassProvider allowContinuous motion="full">
      <Backdrop preset="video" {...VIDEO} mediaTone="dark"><Content /></Backdrop>
      <ScrollRoom />
    </AuraGlassProvider>
  ),
};
export const Drift: Story = { render: () => <Backdrop preset="aurora" scheme="dark" motion="drift"><Content /></Backdrop> };
/** Continuous gate open + motion="drift": the one ag-backdrop-drift keyframe runs (REQ-SURF-159). */
export const DriftContinuous: Story = {
  render: () => (
    <AuraGlassProvider allowContinuous motion="full">
      <Backdrop preset="aurora" scheme="dark" motion="drift"><Content /></Backdrop>
      <ScrollRoom />
    </AuraGlassProvider>
  ),
};
/** Continuous gate open, motion static: the gate alone animates nothing. */
export const AuroraContinuousStatic: Story = {
  render: () => (
    <AuraGlassProvider allowContinuous motion="full">
      <Backdrop preset="aurora" scheme="auto"><Content /></Backdrop>
    </AuraGlassProvider>
  ),
};
export const Mono: Story = { render: () => <Backdrop preset="mesh" palette="mono"><Content /></Backdrop> };
