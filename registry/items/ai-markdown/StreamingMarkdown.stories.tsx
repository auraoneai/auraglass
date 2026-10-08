import type { Meta, StoryObj } from '@storybook/react';
import { StreamingMarkdown } from './StreamingMarkdown';

const meta: Meta<typeof StreamingMarkdown> = { title: 'registry/ai-markdown', component: StreamingMarkdown };
export default meta;
type Story = StoryObj<typeof StreamingMarkdown>;

const body = '# Deploy report\n\nShip window **04:12–04:19** UTC.\n\n- no errors\n- 2 restarts';
export const Default: Story = { args: { text: body } };
export const Streaming: Story = { args: { text: body.slice(0, 40), streaming: true } };
export const Empty: Story = { args: { text: '' } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
