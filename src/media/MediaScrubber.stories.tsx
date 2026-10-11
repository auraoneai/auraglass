// MediaScrubber.stories.tsx — states (SURF-463); DragProbe counts seeks and
// commits for tests/e2e/surf/media/scrubber-drag.spec.ts (REQ-SURF-136).
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

/** Counts onValueChange (seeks) and onValueCommit (commits) into data attributes. */
function DragProbeDemo() {
  const [value, setValue] = React.useState(0);
  const [seeks, setSeeks] = React.useState(0);
  const [commits, setCommits] = React.useState(0);
  return (
    <div style={{ inlineSize: 360 }} data-testid="probe" data-seeks={seeks} data-commits={commits}>
      <MediaScrubber
        value={value}
        max={300}
        onValueChange={(v) => { setSeeks((n) => n + 1); setValue(v); }}
        onValueCommit={(v) => { setCommits((n) => n + 1); setValue(v); }}
      />
    </div>
  );
}
export const DragProbe: Story = { render: () => <DragProbeDemo /> };
