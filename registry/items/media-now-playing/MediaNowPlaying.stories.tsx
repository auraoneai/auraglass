import type { Meta, StoryObj } from '@storybook/react';
import { MediaNowPlaying } from './index';
import { NOW_PLAYING_EMPTY_PROPS, NOW_PLAYING_PROPS } from './fixtures';

const meta: Meta<typeof MediaNowPlaying> = {
  parameters: { ag: { subject: 'MediaNowPlaying', kind: 'showcase' } }, title: 'registry/media-now-playing', component: MediaNowPlaying };
export default meta;
type Story = StoryObj<typeof MediaNowPlaying>;

const base = NOW_PLAYING_PROPS;
export const Default: Story = { args: base };
export const Playing: Story = { args: base };
export const Empty: Story = { args: NOW_PLAYING_EMPTY_PROPS };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
