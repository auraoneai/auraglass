/* CMP-222 (REQ-CMP-01): Dialog scenes — Default, LongContent, Sizes (args),
   Form, Nested, NonModal, PaletteShell. ids overlays-dialog--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { Button } from '../../../src/components/button';
import { TextField } from '../../../src/components/text-field';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Dialog',
  component: Dialog.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Dialog', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Dialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Shell = ({ children }: { children: React.ReactNode }) => (
  <AuraGlassProvider>{children}</AuraGlassProvider>
);

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--default' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Header><Dialog.Title>Dialog title</Dialog.Title></Dialog.Header>
            <Dialog.Body><Dialog.Description>A regular dialog over a blurred scrim.</Dialog.Description></Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>Cancel</Dialog.Close>
              <Dialog.Close render={<Button intent="info" />}>Save</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

export const LongContent: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--long-content' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Header><Dialog.Title>Long content</Dialog.Title></Dialog.Header>
            <Dialog.Body>
              {Array.from({ length: 24 }, (_, i) => <p key={i}>Scrollable row {i + 1}</p>)}
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--sizes' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="md">
            <Dialog.Header><Dialog.Title>Sizes axis: sm / md / lg / xl / full — this cell md</Dialog.Title></Dialog.Header>
            <Dialog.Body>Body</Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

export const Form: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--form' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup render={<form onSubmit={(e) => e.preventDefault()} />}>
            <Dialog.Header><Dialog.Title>Invite teammate</Dialog.Title></Dialog.Header>
            <Dialog.Body>
              <TextField label="Email" placeholder="name@auraone.ai" />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>Cancel</Dialog.Close>
              <button type="submit" data-ag-part="action">Send invite</button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

export const Nested: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--nested' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="outer dialog">
            <Dialog.Header><Dialog.Title>Outer</Dialog.Title></Dialog.Header>
            <Dialog.Body>
              <Dialog.Root defaultOpen>
                <Dialog.Portal>
                  <Dialog.Backdrop />
                  <Dialog.Popup aria-label="inner dialog" size="sm">
                    <Dialog.Header><Dialog.Title>Inner</Dialog.Title></Dialog.Header>
                    <Dialog.Body>Nested dialog content.</Dialog.Body>
                    <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
                  </Dialog.Popup>
                </Dialog.Portal>
              </Dialog.Root>
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close outer</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

export const NonModal: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--non-modal' } },
  render: () => (
    <Shell>
      <input placeholder="page input stays interactive" style={{ marginBottom: 12 }} />
      <Dialog.Root defaultOpen modal={false}>
        <Dialog.Portal>
          <Dialog.Popup size="md">
            <Dialog.Header><Dialog.Title>Non-modal</Dialog.Title></Dialog.Header>
            <Dialog.Body>No scrim; page stays interactive.</Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

export const PaletteShell: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--palette-shell' } },
  render: () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    return (
      <Shell>
        <Dialog.Root defaultOpen>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup placement="top" size="lg" initialFocus={inputRef}>
              <Dialog.Body padding="none">
                <input ref={inputRef} placeholder="Type a command…" style={{ width: '100%', padding: 12, font: 'inherit' }} />
              </Dialog.Body>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </Shell>
    );
  },
};
