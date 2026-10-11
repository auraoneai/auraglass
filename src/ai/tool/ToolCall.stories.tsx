// ToolCall.stories.tsx — AI/ToolCall: one per display state + approval with
// reason + large output (SURF-348), a live input-streaming → approval flow
// (REQ-SURF-120/121), plus play functions (SURF-349) that fail when the
// control they drive is missing.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { ToolCall, type ApprovalResponseDetail } from './ToolCall';
import type { AgToolPart } from '../types';

const meta = {
  title: 'AI/ToolCall',
  parameters: { ag: { subject: 'ToolCall', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const part = (state: string, over: Record<string, unknown> = {}): AgToolPart =>
  ({ type: 'tool-lookup', toolCallId: `tc-${state}`, state, input: { q: 'incident-482' }, ...over } as AgToolPart);

/** Records every approval response as text so specs can read it. */
function ResponseLog({ responses }: { responses: readonly ApprovalResponseDetail[] }) {
  return (
    <output data-testid="responses">
      {responses.map((r) => `${r.approvalId}:${r.approved ? 'approved' : 'denied'}${r.reason ? `:${r.reason}` : ''}`).join(',')}
    </output>
  );
}

function WithLog({ initial }: { initial: AgToolPart }) {
  const [responses, setResponses] = React.useState<ApprovalResponseDetail[]>([]);
  return (
    <>
      <ToolCall part={initial} onApprovalResponse={(d) => setResponses((r) => [...r, d])} />
      <ResponseLog responses={responses} />
    </>
  );
}

export const Queued: Story = { render: () => <ToolCall part={part('input-streaming')} /> };
export const Running: Story = { render: () => <ToolCall part={part('input-available')} /> };
export const NeedsApproval: Story = {
  render: () => <WithLog initial={part('approval-requested', { approval: { id: 'ap-1' } })} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Approve' }));
    await expect(canvas.getByTestId('responses')).toHaveTextContent('ap-1:approved');
    await expect(canvas.getByRole('button', { name: 'Approve' })).toBeDisabled();
  },
};
export const ApprovalWithReason: Story = {
  render: () => <WithLog initial={part('approval-requested', { approval: { id: 'ap-2' } })} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Deny' }));
    await expect(canvas.getByLabelText('Reason (optional)')).toBeVisible();
  },
};

/**
 * The live flow: the call streams in collapsed (queued → running) and is then
 * asked for approval; it must open by itself with Approve/Deny visible.
 * "Advance" steps through the SDK states; a second approval round arrives
 * with a new approval id.
 */
const FLOW: AgToolPart[] = [
  part('input-streaming', { toolCallId: 'tc-flow' }),
  part('input-available', { toolCallId: 'tc-flow' }),
  part('approval-requested', { toolCallId: 'tc-flow', approval: { id: 'ap-flow-1' } }),
  part('approval-responded', { toolCallId: 'tc-flow', approval: { id: 'ap-flow-1', approved: true } }),
  part('approval-requested', { toolCallId: 'tc-flow', approval: { id: 'ap-flow-2' } }),
  part('output-error', { toolCallId: 'tc-flow', errorText: 'Upstream timed out' }),
];
function LiveFlow() {
  const [step, setStep] = React.useState(0);
  const [responses, setResponses] = React.useState<ApprovalResponseDetail[]>([]);
  return (
    <>
      <ToolCall part={FLOW[step]!} onApprovalResponse={(d) => setResponses((r) => [...r, d])} />
      <button type="button" data-testid="advance" disabled={step === FLOW.length - 1} onClick={() => setStep((s) => s + 1)}>
        Advance
      </button>
      <ResponseLog responses={responses} />
    </>
  );
}
/** No play function: the remote APG spec drives this story by keyboard. */
export const LiveApprovalFlow: Story = { render: () => <LiveFlow /> };
/** No play function: the remote APG spec drives the approval by keyboard. */
export const NeedsApprovalKeyboard: Story = {
  render: () => <WithLog initial={part('approval-requested', { approval: { id: 'ap-k' } })} />,
};

export const Succeeded: Story = { render: () => <ToolCall part={part('output-available', { output: 'incident-482: resolved' })} /> };
export const Failed: Story = { render: () => <ToolCall part={part('output-error', { errorText: 'timeout' })} /> };
export const Denied: Story = { render: () => <ToolCall part={part('output-denied')} /> };
export const LargeOutput: Story = {
  render: () => <ToolCall part={part('output-available', { output: 'row\n'.repeat(400) })} />,
};
