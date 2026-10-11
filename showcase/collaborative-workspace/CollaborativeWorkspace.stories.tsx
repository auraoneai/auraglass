/* collaborative-workspace stories (REQ-QUAL-58): kind/tag `showcase`, one full-page
   story (layout fullscreen) and two fragments. */
import type { Meta, StoryObj } from '@storybook/react';
import {
  CollaborativeDocumentComments,
  CollaborativeShare,
  CollaborativeWorkspace,
} from './CollaborativeWorkspace.showcase';

const meta = {
  title: 'Showcases/Collaborative Workspace',
  component: CollaborativeWorkspace,
  tags: ['showcase'],
  globals: { scene: 'saturated-abstract' },
  parameters: { layout: 'fullscreen', ag: { subject: 'collaborative-workspace', kind: 'showcase' } },
} satisfies Meta<typeof CollaborativeWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const DocumentComments: Story = {
  name: 'Document + comments',
  parameters: { layout: 'padded' },
  render: () => <CollaborativeDocumentComments />,
};

export const SharePopover: Story = {
  name: 'Share popover',
  parameters: { layout: 'padded' },
  render: () => <CollaborativeShare defaultOpen />,
};
