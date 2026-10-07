// Backdrop.stories.tsx — preset × scheme states (SURF-440).
import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop } from './Backdrop';

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
export const Photo: Story = { render: () => <Backdrop preset="photo" src="https://picsum.photos/seed/ag-bd/1600/900" tone="light"><Content /></Backdrop> };
export const Video: Story = { render: () => <Backdrop preset="video" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" tone="dark"><Content /></Backdrop> };
export const Drift: Story = { render: () => <Backdrop preset="aurora" scheme="dark" motion="drift"><Content /></Backdrop> };
export const Mono: Story = { render: () => <Backdrop preset="mesh" palette="mono"><Content /></Backdrop> };
