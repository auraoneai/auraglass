// MediaScrubber.stories.tsx — states (SURF-463).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MediaScrubber } from './MediaScrubber/MediaScrubber';

const meta = {
  title: 'Media/MediaScrubber',
  parameters: { ag: { subject: 'MediaScrubber', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { render: () => <MediaScrubber value={0} max={300} /> };
export const Buffered: Story = { render: () => <MediaScrubber value={80} max={300} buffered={[[0, 140], [180, 300]]} /> };
export const Chapters: Story = { render: () => <MediaScrubber value={150} max={600} chapters={[{ start: 0, title: 'Intro' }, { start: 200, title: 'Main' }, { start: 480, title: 'Outro' }]} /> };
export const Live: Story = { render: () => <MediaScrubber value={0} max={NaN} /> };
export const Disabled: Story = { render: () => <MediaScrubber value={40} max={300} disabled /> };
/* Pointer over the track: the time tooltip is shown. */
function Hovered() {
  const host = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const track = host.current?.querySelector('[data-ag-part="media-scrubber"]');
    track?.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 10 }));
  }, []);
  return <div ref={host}><MediaScrubber value={30} max={300} /></div>;
}
export const HoverTooltip: Story = { render: () => <Hovered /> };
