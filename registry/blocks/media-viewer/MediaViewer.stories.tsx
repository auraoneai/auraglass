import type { Meta, StoryObj } from '@storybook/react';
import { MediaViewer } from './index';

const meta: Meta<typeof MediaViewer> = { title: 'registry/media-viewer', component: MediaViewer };
export default meta;
type Story = StoryObj<typeof MediaViewer>;

export const Default: Story = {};
export const GalleryOpen: Story = { args: { src: '/media/film.mp4', title: 'Film' } };
export const Empty: Story = { args: { src: '', title: '' } };
export const RTL: Story = { decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { parameters: { agEnvironment: { forcedColors: 'active' } } };
