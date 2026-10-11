import type { Meta, StoryObj } from '@storybook/react';
import { MediaVideoPlayer } from './index';
import { VIDEO_PLAYER_EMPTY_PROPS, VIDEO_PLAYER_PROPS } from './fixtures';

const meta: Meta<typeof MediaVideoPlayer> = {
  parameters: { ag: { subject: 'MediaVideoPlayer', kind: 'showcase' } }, title: 'registry/media-video-player', component: MediaVideoPlayer };
export default meta;
type Story = StoryObj<typeof MediaVideoPlayer>;

const base = VIDEO_PLAYER_PROPS;
export const Default: Story = { args: base };
export const Playing: Story = { args: base };
export const Empty: Story = { args: VIDEO_PLAYER_EMPTY_PROPS };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
