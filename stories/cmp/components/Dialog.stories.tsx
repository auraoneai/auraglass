/* CMP-222 (REQ-CMP-01): Dialog scenes — Default, LongContent, Sizes (args),
   Form, Nested, NonModal, PaletteShell. ids overlays-dialog--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { Button } from '../../../src/components/button';
import { TextField } from '../../../src/components/text-field';
import { Select } from '../../../src/components/select';
import { Popover } from '../../../src/components/popover';
import { Menu } from '../../../src/components/menu';
import { Toast } from '../../../src/components/toast';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Dialog',
  component: Dialog.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Dialog', kind: 'component' } },
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
      {/* CMP-404: toast viewport mounted alongside the modal dialog so the e2e
          overlay-stack lane can assert it never sits under an inert ancestor. */}
      <Toast.Provider>
        <Toast.Viewport />
      </Toast.Provider>
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
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog.Root key={size} defaultOpen modal={false}>
          <Dialog.Portal>
            <Dialog.Popup size={size} aria-label={`dialog-${size}`}>
              <Dialog.Header><Dialog.Title>{`size ${size}`}</Dialog.Title></Dialog.Header>
              <Dialog.Body>Sizes cell</Dialog.Body>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
      <Dialog.Root defaultOpen modal={false}>
        <Dialog.Portal>
          <Dialog.Popup appearance="wide" aria-label="dialog-wide">
            <Dialog.Header><Dialog.Title>appearance wide</Dialog.Title></Dialog.Header>
            <Dialog.Body>Appearance cell</Dialog.Body>
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
              {/* CMP-378: Select inside a Dialog — composite scene for the
                  controls overlay-stack lane. */}
              <Select.Root>
                <Select.Trigger placeholder="Role" />
                <Select.Content>
                  <Select.Item value="admin" label="Admin" />
                  <Select.Item value="member" label="Member" />
                  <Select.Item value="viewer" label="Viewer" />
                </Select.Content>
              </Select.Root>
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

/* CMP-399: composite scene — a Popover mounted open inside a Dialog popup, so
   outside-press targeting can be verified (press inside the Dialog, outside the
   Popover → only the Popover closes). */
export const WithPopover: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--with-popover' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="composite dialog">
            <Dialog.Header><Dialog.Title>Composite</Dialog.Title></Dialog.Header>
            <Dialog.Body>
              <p data-ag-testid="dialog-outside-target">Press here — inside the dialog, outside the popover.</p>
              <Popover.Root defaultOpen>
                <Popover.Trigger><Button>Details</Button></Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner>
                    <Popover.Popup aria-label="composite popover">
                      <Popover.Description>Anchored popover mounted inside the dialog.</Popover.Description>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};

/* CMP-394: composite scene — Dialog → Popover → Menu, three layers mounted open
   so the e2e lane can assert exactly one layer closes per Escape. */
export const WithPopoverMenu: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--with-popover-menu' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="stack dialog">
            <Dialog.Header><Dialog.Title>Stacked overlays</Dialog.Title></Dialog.Header>
            <Dialog.Body>
              <Popover.Root defaultOpen>
                <Popover.Trigger><Button>Row details</Button></Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner>
                    <Popover.Popup aria-label="stack popover">
                      <Popover.Description>Row actions live in the menu.</Popover.Description>
                      <Menu.Root defaultOpen>
                        <Menu.Trigger><Button variant="clear" size="sm">Actions</Button></Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Positioner>
                            <Menu.Popup aria-label="stack menu">
                              <Menu.Item>Edit</Menu.Item>
                              <Menu.Item>Duplicate</Menu.Item>
                              <Menu.Separator />
                              <Menu.Item>Delete</Menu.Item>
                            </Menu.Popup>
                          </Menu.Positioner>
                        </Menu.Portal>
                      </Menu.Root>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
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
