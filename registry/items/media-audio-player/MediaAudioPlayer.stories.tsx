import type { Meta, StoryObj } from '@storybook/react';
import { MediaAudioPlayer } from './index';
import { AUDIO_PLAYER_EMPTY_PROPS, AUDIO_PLAYER_PROPS } from './fixtures';

const meta: Meta<typeof MediaAudioPlayer> = {
  parameters: { ag: { subject: 'MediaAudioPlayer', kind: 'showcase' } }, title: 'registry/media-audio-player', component: MediaAudioPlayer };
export default meta;
type Story = StoryObj<typeof MediaAudioPlayer>;

const base = AUDIO_PLAYER_PROPS;
export const Default: Story = { args: base };
export const Compact: Story = { args: base };
export const Empty: Story = { args: AUDIO_PLAYER_EMPTY_PROPS };
export const RTL: Story = { args: base, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: base, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: base, parameters: { agEnvironment: { forcedColors: 'active' } } };
