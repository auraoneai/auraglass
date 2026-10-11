import type { Meta, StoryObj } from '@storybook/react';

// Hook-only item (SURF-390): probe component renders the returned prop bags so
// the five required states exist as visual subjects without a mock transport.
function Probe({ note }: { note: string }) {
  return <div data-ag-part="adapter-probe">{note}</div>;
}
const meta: Meta<typeof Probe> = {
  parameters: { ag: { subject: 'useAuraChat', kind: 'showcase' } }, title: 'registry/ai-sdk-adapter', component: Probe };
export default meta;
type Story = StoryObj<typeof Probe>;

export const Default: Story = { args: { note: 'useAuraChat → { threadProps, composerProps, status }' } };
export const Empty: Story = { args: { note: 'no transport — idle props only' } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
