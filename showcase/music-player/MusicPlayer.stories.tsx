/* music-player stories (REQ-QUAL-58): kind/tag `showcase`, one full-page story
   (layout fullscreen) and the now-playing bar fragment. Tier S2. */
import type { Meta, StoryObj } from '@storybook/react';
import { MusicNowPlaying, MusicPlayer } from './MusicPlayer.showcase';

const meta = {
  title: 'Showcases/Music Player',
  component: MusicPlayer,
  tags: ['showcase'],
  globals: { scene: 'photo' },
  parameters: { layout: 'fullscreen', ag: { subject: 'music-player', kind: 'showcase' } },
} satisfies Meta<typeof MusicPlayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const NowPlaying: Story = {
  name: 'Now-playing bar',
  parameters: { layout: 'padded' },
  render: () => <MusicNowPlaying />,
};

export const NowPlayingNarrow: Story = {
  name: 'Now-playing bar (narrow)',
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ maxInlineSize: '24rem' }}>
      <MusicNowPlaying />
    </div>
  ),
};
