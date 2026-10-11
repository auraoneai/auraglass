// NowPlayingBar.stories.tsx — states (SURF-463).
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
export const WithActions: Story = { render: () => <NowPlayingBar.Root playing={false} onPrevious={() => undefined} onNext={() => undefined} artwork="https://picsum.photos/seed/ag-np/96/96"><NowPlayingBar.Artwork /><NowPlayingBar.Title>Refraction</NowPlayingBar.Title><NowPlayingBar.Subtitle>AuraOne Sounds</NowPlayingBar.Subtitle><NowPlayingBar.Actions onPrevious={() => undefined} onNext={() => undefined} /><NowPlayingBar.Progress /></NowPlayingBar.Root> };
export const Expandable: Story = { render: () => <NowPlayingBar.Root playing={false} expandedId="np-expanded" expanded={false}><NowPlayingBar.Title>Optics</NowPlayingBar.Title><NowPlayingBar.Progress /><NowPlayingBar.Expand expandedId="np-expanded" expanded={false} /></NowPlayingBar.Root> };
export const ClearOverMedia: Story = { render: () => <div style={{ background: 'linear-gradient(120deg,#204060,#80a0c0)', padding: 8 }}><NowPlayingBar.Root playing variant="clear"><NowPlayingBar.Title>Clear variant</NowPlayingBar.Title><NowPlayingBar.Progress /></NowPlayingBar.Root></div> };
