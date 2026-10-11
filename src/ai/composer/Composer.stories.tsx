// Composer.stories.tsx — AI/Composer states + play functions (SURF-347/349).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { expect, fireEvent, userEvent, within } from 'storybook/test';
import { Composer } from './Composer';
import { Thread } from '../thread/Thread';
import { MESSAGES } from '../__fixtures__/ui-messages.source';
import { AuraGlassProvider } from '../../theme';

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

/** REQ-SURF-118: drop target for composer-dropzone.spec.ts — accepts .log/.txt
    up to 1 KiB; every rejection is listed (and announced). */
function DropzoneHarness() {
  const [rejects, setRejects] = React.useState<string[]>([]);
  return (
    <AuraGlassProvider>
      <Composer
        accept=".log,.txt"
        maxFileSize={1024}
        onAttachmentReject={({ file, reason }) => setRejects((r) => [...r, `${file.name}: ${reason}`])}
      />
      <ul data-testid="rejections">{rejects.map((r, i) => <li key={i}>{r}</li>)}</ul>
    </AuraGlassProvider>
  );
}
export const Dropzone: Story = { render: () => <DropzoneHarness /> };

/** REQ-SURF-119: secondary actions + counter; below a 480 px container the
    actions collapse into the leading menu and Submit stays. */
function WithActionsHarness() {
  const [sent, setSent] = React.useState<string[]>([]);
  const [inserted, setInserted] = React.useState(0);
  return (
    <AuraGlassProvider>
      <Composer maxLength={200} maxRows={8} onSubmit={({ text }) => setSent((s) => [...s, text])}>
        <Composer.Attachments />
        <Composer.Textarea maxRows={8} />
        <Composer.Counter />
        <Composer.Actions>
          <Composer.Action kind="attach" icon="attach" />
          <Composer.Action aria-label="Insert template" icon="copy" onClick={() => setInserted((n) => n + 1)} />
          <Composer.Submit />
        </Composer.Actions>
      </Composer>
      <output data-testid="sent">{sent.join('|')}</output>
      <output data-testid="inserted">{inserted}</output>
    </AuraGlassProvider>
  );
}
export const WithActions: Story = { render: () => <WithActionsHarness /> };

/** REQ-SURF-119: Thread above a growing Composer; the composer publishes its
    block size on the thread (--_ag-ai-composer-block). */
export const WithThread: Story = {
  render: () => (
    <AuraGlassProvider>
      <div style={{ display: 'flex', flexDirection: 'column', blockSize: '100dvh' }}>
        <div style={{ flex: '1 1 auto', minBlockSize: 0 }}>
          <Thread messages={MESSAGES.slice(0, 6)} />
        </div>
        <Composer onSubmit={() => undefined} />
      </div>
    </AuraGlassProvider>
  ),
};
