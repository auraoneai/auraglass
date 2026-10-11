import type { Meta, StoryObj } from '@storybook/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { MediaGallery } from './index';

const meta: Meta<typeof MediaGallery> = {
  title: 'registry/media-gallery',
  component: MediaGallery,
  parameters: { ag: { subject: 'media-gallery', kind: 'showcase', scenes: 'all' } satisfies StoryAgParameters },
};
export default meta;
type Story = StoryObj<typeof MediaGallery>;

const ITEMS = [
  { id: 'a', src: '/media/a.jpg', alt: 'Atrium', caption: 'Specular study 01' },
  { id: 'b', src: '/media/b.jpg', alt: 'Stair' },
  { id: 'c', src: '/media/c.jpg', alt: 'Panel' },
];
export const Default: Story = { args: { items: ITEMS } };
export const Filtered: Story = { args: { items: ITEMS } };
export const Empty: Story = { args: { items: [] } };
export const RTL: Story = { args: { items: ITEMS }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { items: ITEMS }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { items: ITEMS }, parameters: { agEnvironment: { forcedColors: 'active' } } };
