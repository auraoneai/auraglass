import type { Meta, StoryObj } from '@storybook/react';
import { MediaGallery } from './index';
import { GALLERY_ITEMS } from './fixtures';

const meta: Meta<typeof MediaGallery> = {
  parameters: { ag: { subject: 'MediaGallery', kind: 'showcase' } }, title: 'registry/media-gallery', component: MediaGallery };
export default meta;
type Story = StoryObj<typeof MediaGallery>;

const ITEMS = GALLERY_ITEMS;
export const Default: Story = { args: { items: ITEMS } };
export const Filtered: Story = { args: { items: ITEMS } };
export const Empty: Story = { args: { items: [] } };
export const RTL: Story = { args: { items: ITEMS }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { items: ITEMS }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { items: ITEMS }, parameters: { agEnvironment: { forcedColors: 'active' } } };
