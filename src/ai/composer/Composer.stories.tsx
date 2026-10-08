// Composer.stories.tsx — AI/Composer states + play functions (SURF-347/349).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, fireEvent, userEvent, within } from 'storybook/test';
import { Composer } from './Composer';

const meta = {
  title: 'AI/Composer',
  parameters: { ag: { subject: 'Composer', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  render: () => <Composer onSubmit={() => undefined} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/message/i);
    await userEvent.type(input, 'Draft a summary');
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('');
  },
};
export const WithDraft: Story = { render: () => <Composer defaultValue="Half-written reply" /> };
export const WithAttachments: Story = {
  render: () => <Composer accept=".log,.txt" />,
};
function DraggingHarness() {
  const [dragging, setDragging] = React.useState(false);
  return (
    <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}>
      <Composer data-dragging={dragging || undefined} />
    </div>
  );
}
export const Dragging: Story = { render: () => <DraggingHarness /> };
export const Submitted: Story = {
  render: () => <Composer status="submitted" />,
};
export const StreamingStop: Story = {
  render: () => <Composer status="streaming" onStop={() => undefined} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stop = canvas.queryByLabelText(/stop/i) ?? canvas.queryByRole('button', { name: /stop/i });
    await expect(stop).toBeTruthy();
    if (stop) await userEvent.click(stop);
  },
};
export const ImeComposition: Story = {
  render: () => <Composer onSubmit={() => undefined} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/message/i);
    fireEvent.compositionStart(input);
    await userEvent.type(input, 'konnichiwa');
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
    fireEvent.compositionEnd(input);
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('');
  },
};
export const Error: Story = { render: () => <Composer status="error" /> };
export const NearLimit: Story = { render: () => <Composer defaultValue="xx" maxLength={3} /> };
export const Disabled: Story = { render: () => <Composer disabled /> };
