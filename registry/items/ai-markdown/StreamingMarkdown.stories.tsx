import type { Meta, StoryObj } from '@storybook/react';
import { StreamingMarkdown } from './StreamingMarkdown';
import { MARKDOWN_BODY, MARKDOWN_STREAMING_SLICE } from './fixtures';

const meta: Meta<typeof StreamingMarkdown> = { title: 'registry/ai-markdown', component: StreamingMarkdown };
export default meta;
type Story = StoryObj<typeof StreamingMarkdown>;

const body = MARKDOWN_BODY;
export const Default: Story = { args: { text: body } };
export const Streaming: Story = { args: { text: MARKDOWN_STREAMING_SLICE, streaming: true } };
export const Empty: Story = { args: { text: '' } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
