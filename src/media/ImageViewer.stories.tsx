// ImageViewer.stories.tsx — states (SURF-478).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ImageViewer } from './ImageViewer/ImageViewer';

const ITEMS = [
  { id: 'im-1', src: 'https://picsum.photos/seed/ag-iv1/800/500', alt: 'Atrium with glass ceiling', caption: 'Atrium — specular study 01' },
  { id: 'im-2', src: 'https://picsum.photos/seed/ag-iv2/800/500', alt: 'Curved glass stair' },
  { id: 'im-3', src: 'https://picsum.photos/seed/ag-iv3/800/500', alt: 'Frosted panel wall' },
];

const meta = {
  title: 'Media/ImageViewer',
  parameters: { ag: { subject: 'ImageViewer', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  render: () => (
    <ImageViewer.Root items={ITEMS}>
      <div style={{ display: 'flex', gap: 8 }}>
        {ITEMS.map((it) => (
          <ImageViewer.Trigger key={it.id} id={it.id}><img src={it.src} alt={it.alt} width={140} /></ImageViewer.Trigger>
        ))}
      </div>
      <ImageViewer.Popup />
    </ImageViewer.Root>
  ),
};
export const Open: Story = { render: () => <ImageViewer.Root items={ITEMS} defaultOpen><ImageViewer.Popup /></ImageViewer.Root> };
export const Loop: Story = { render: () => <ImageViewer.Root items={ITEMS} loop defaultOpen><ImageViewer.Popup /></ImageViewer.Root> };
export const WithInspector: Story = {
  render: () => (
    <ImageViewer.Root items={ITEMS} defaultOpen>
      <ImageViewer.Popup>
        <ImageViewer.Toolbar />
        <ImageViewer.Caption />
        <ImageViewer.Prev /><ImageViewer.Next /><ImageViewer.Counter />
        <ImageViewer.Inspector><dl><dt>Size</dt><dd>800×500</dd></dl></ImageViewer.Inspector>
        <ImageViewer.Close />
      </ImageViewer.Popup>
    </ImageViewer.Root>
  ),
};
export const Single: Story = { render: () => <ImageViewer.Root items={[ITEMS[0]!]} defaultOpen><ImageViewer.Popup /></ImageViewer.Root> };
