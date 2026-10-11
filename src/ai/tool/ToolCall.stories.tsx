// ToolCall.stories.tsx — AI/ToolCall: one per display state + approval with
// reason + large output (SURF-348), plus play functions (SURF-349).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { ToolCall } from './ToolCall';
import type { AgToolPart } from '../types';

const meta = {
  title: 'AI/ToolCall',
  parameters: { ag: { subject: 'ToolCall', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const part = (state: string, over: Record<string, unknown> = {}): AgToolPart =>
  ({ type: 'tool-lookup', toolCallId: `tc-${state}`, state, input: { q: 'incident-482' }, ...over } as AgToolPart);

export const Queued: Story = { render: () => <ToolCall part={part('input-streaming')} /> };
export const Running: Story = { render: () => <ToolCall part={part('input-available')} /> };
export const NeedsApproval: Story = {
  render: () => <ToolCall part={part('approval-requested', { approval: { id: 'ap-1' } })} onApprovalResponse={() => undefined} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const approve = canvas.queryByRole('button', { name: /approve/i });
    if (approve) await userEvent.click(approve);
  },
};
export const ApprovalWithReason: Story = {
  render: () => (
    <ToolCall
      part={part('approval-requested', { approval: { id: 'ap-2' } })}
      onApprovalResponse={() => undefined}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const deny = canvas.queryByRole('button', { name: /deny|reject/i });
    if (deny) await userEvent.click(deny);
  },
};
export const Succeeded: Story = { render: () => <ToolCall part={part('output-available', { output: 'incident-482: resolved' })} /> };
export const Failed: Story = { render: () => <ToolCall part={part('output-error', { errorText: 'timeout' })} /> };
export const Denied: Story = { render: () => <ToolCall part={part('output-denied')} /> };
export const LargeOutput: Story = {
  render: () => <ToolCall part={part('output-available', { output: 'row\n'.repeat(400) })} defaultOpen maxPreviewChars={200} />,
};
/* No onApprovalResponse: the call shows the waiting notice instead of buttons. */
export const AwaitingApproval: Story = {
  render: () => <ToolCall part={part('approval-requested', { approval: { id: 'ap-3' } })} />,
};
/* Deny pressed: the optional reason form is open. */
function DenyReasonOpen() {
  const host = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    host.current?.querySelector<HTMLButtonElement>('[data-ag-part="deny"]')?.click();
  }, []);
  return (
    <div ref={host}>
      <ToolCall part={part('approval-requested', { approval: { id: 'ap-4' } })} onApprovalResponse={() => undefined} />
    </div>
  );
}
export const DenyReason: Story = { render: () => <DenyReasonOpen /> };
