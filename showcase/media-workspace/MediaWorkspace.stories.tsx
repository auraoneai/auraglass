/* media-workspace stories (REQ-QUAL-58): kind/tag `showcase`, one full-page story
   (layout fullscreen) and two fragments. */
import type { Meta, StoryObj } from '@storybook/react';
import { MediaWorkspace, MediaWorkspaceClearControls, MediaWorkspaceInspectorSheet } from './MediaWorkspace.showcase';

const meta = {
  title: 'Showcases/Media Workspace',
  component: MediaWorkspace,
  tags: ['showcase'],
  globals: { scene: 'video-frame' },
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
