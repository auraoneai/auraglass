// NowPlayingBar.stories.tsx — states (SURF-463).
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NowPlayingBar } from './NowPlayingBar/NowPlayingBar';

const meta = {
  title: 'Media/NowPlayingBar',
  parameters: { ag: { subject: 'NowPlayingBar', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Paused: Story = { render: () => <NowPlayingBar.Root playing={false} artwork="https://picsum.photos/seed/ag-np/96/96"><NowPlayingBar.Artwork /><NowPlayingBar.Title>Glass Interlude</NowPlayingBar.Title><NowPlayingBar.Subtitle>AuraOne Sounds</NowPlayingBar.Subtitle><NowPlayingBar.Progress /></NowPlayingBar.Root> };
export const Playing: Story = { render: () => <NowPlayingBar.Root playing artwork="https://picsum.photos/seed/ag-np/96/96"><NowPlayingBar.Artwork /><NowPlayingBar.Title>Specular Drift</NowPlayingBar.Title><NowPlayingBar.Subtitle>AuraOne Sounds</NowPlayingBar.Subtitle><NowPlayingBar.Progress /></NowPlayingBar.Root> };
export const WithActions: Story = { render: () => <NowPlayingBar.Root playing={false} onPrevious={() => undefined} onNext={() => undefined} artwork="https://picsum.photos/seed/ag-np/96/96"><NowPlayingBar.Artwork /><NowPlayingBar.Title>Refraction</NowPlayingBar.Title><NowPlayingBar.Subtitle>AuraOne Sounds</NowPlayingBar.Subtitle><NowPlayingBar.Actions /><NowPlayingBar.Progress /></NowPlayingBar.Root> };

function ExpandableBar() {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div>
      <NowPlayingBar.Root playing={false} expandedId="np-expanded" expanded={expanded} onExpandedChange={setExpanded}>
        <NowPlayingBar.Title>Optics</NowPlayingBar.Title>
        <NowPlayingBar.Progress />
        <NowPlayingBar.Expand expandedId="np-expanded" expanded={expanded} onExpandedChange={setExpanded} />
      </NowPlayingBar.Root>
      <div id="np-expanded" hidden={!expanded}>Queue</div>
    </div>
  );
}
export const Expandable: Story = { render: () => <ExpandableBar /> };

/* REQ-SURF-139 container behaviour: the e2e spec resizes [data-testid="frame"]
   to 320/360/600 px. Every part rendered, with a long title. */
function ResponsiveBar() {
  const [playing, setPlaying] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div data-testid="frame" style={{ inlineSize: 600 }}>
      <NowPlayingBar.Root
        playing={playing}
        onPlayingChange={setPlaying}
        progress={0.4}
        expandedId="np-responsive-sheet"
        expanded={expanded}
        onExpandedChange={setExpanded}
        artwork="https://picsum.photos/seed/ag-np/96/96"
      >
        <NowPlayingBar.Artwork />
        <NowPlayingBar.Title>A very long track title that has to truncate in narrow containers</NowPlayingBar.Title>
        <NowPlayingBar.Subtitle>AuraOne Sounds</NowPlayingBar.Subtitle>
        <NowPlayingBar.Actions onPrevious={() => undefined} onNext={() => undefined} />
        <NowPlayingBar.Progress />
        <NowPlayingBar.Expand expandedId="np-responsive-sheet" expanded={expanded} onExpandedChange={setExpanded} />
      </NowPlayingBar.Root>
      <div id="np-responsive-sheet" hidden={!expanded}>Queue</div>
    </div>
  );
}
export const Responsive: Story = { render: () => <ResponsiveBar /> };

export const ClearOverMedia: Story = { render: () => <div style={{ background: 'linear-gradient(120deg,#204060,#80a0c0)', padding: 8 }}><NowPlayingBar.Root playing variant="clear"><NowPlayingBar.Title>Clear variant</NowPlayingBar.Title><NowPlayingBar.Progress /></NowPlayingBar.Root></div> };
