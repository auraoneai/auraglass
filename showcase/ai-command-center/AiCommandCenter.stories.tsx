/* ai-command-center stories (REQ-QUAL-58): kind/tag `showcase`, one full-page
   story (layout fullscreen) and three fragments. The scene is applied by the
   preview decorators from the `scene` global; the default is in showcases.json. */
import type { Meta, StoryObj } from '@storybook/react';
import {
  AiCommandCenter,
  AiCommandCenterComposer,
  AiCommandCenterThread,
  AiCommandCenterToolCalls,
} from './AiCommandCenter.showcase';

const meta = {
  title: 'Showcases/AI Command Center',
  component: AiCommandCenter,
  tags: ['showcase'],
  globals: { scene: 'dark-media' },
  parameters: { layout: 'fullscreen', ag: { subject: 'ai-command-center', kind: 'showcase' } },
} satisfies Meta<typeof AiCommandCenter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = { name: 'Full page' };

export const ThreadFragment: Story = {
  name: 'Thread',
  parameters: { layout: 'padded' },
  render: () => <AiCommandCenterThread />,
};

export const ComposerFragment: Story = {
  name: 'Composer',
  parameters: { layout: 'padded' },
  render: () => <AiCommandCenterComposer />,
};

export const ToolCallStack: Story = {
  name: 'ToolCall stack',
  parameters: { layout: 'padded' },
  render: () => <AiCommandCenterToolCalls />,
};
