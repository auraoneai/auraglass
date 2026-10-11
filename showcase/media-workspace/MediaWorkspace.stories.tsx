/* media-workspace stories (REQ-QUAL-58): kind/tag `showcase`, one full-page story
   (layout fullscreen) and two fragments. */
import type { Meta, StoryObj } from '@storybook/react';
import { MediaWorkspace, MediaWorkspaceClearControls, MediaWorkspaceInspectorSheet } from './MediaWorkspace.showcase';

const meta = {
  title: 'Showcases/Media Workspace',
  component: MediaWorkspace,
  tags: ['showcase'],
  /* Dark appearance: a colour-review tool over a video frame. Glass and content
     fills follow the scheme, and the media backdrop resolves light glyphs. */
  globals: { scene: 'video-frame', scheme: 'dark' },
  parameters: { layout: 'fullscreen', ag: { subject: 'media-workspace', kind: 'showcase' } },
} satisfies Meta<typeof MediaWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const ClearOverMedia: Story = {
  name: 'Clear-over-media controls',
  parameters: { layout: 'padded' },
  render: () => <MediaWorkspaceClearControls />,
};

export const InspectorSheet: Story = {
  name: 'Inspector sheet',
  parameters: { layout: 'padded' },
  render: () => <MediaWorkspaceInspectorSheet />,
};
