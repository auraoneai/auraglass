/* Dialog composition scenes (CMP-378, CMP-394, CMP-399, CMP-404): a Dialog
   hosting other overlays and controls, for the overlay-stack e2e lanes. Kept
   apart from Dialog.stories.tsx, whose stories render only Dialog parts (S-31). */
import { DialogPortal, DialogPopup, DialogBackdrop } from '../../../src/components/dialog/Dialog.client';
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { TextField } from '../../../src/components/text-field';
import { Select } from '../../../src/components/select';
import { Popover } from '../../../src/components/popover';
import { Menu } from '../../../src/components/menu';
import { Toast, useToast } from '../../../src/components/toast';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Dialog Scenes',
  component: Dialog.Root,
  tags: ['flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Dialog', kind: 'scene' } },
} satisfies Meta<typeof Dialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Shell = ({ children }: { children: React.ReactNode }) => (
  <AuraGlassProvider><OverlayStage>{children}</OverlayStage></AuraGlassProvider>
);

export const Form: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--form' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Content render={<form onSubmit={(e) => e.preventDefault()} />}>
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
        </Dialog.Content>
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
        <Dialog.Content aria-label="composite dialog">
          <Dialog.Header><Dialog.Title>Composite</Dialog.Title></Dialog.Header>
          <Dialog.Body>
            <p data-testid="dialog-outside-target">Press here — inside the dialog, outside the popover.</p>
            <Popover.Root defaultOpen>
              <Popover.Trigger>Details</Popover.Trigger>
              <Popover.Content aria-label="composite popover">
                <Popover.Description>Anchored popover mounted inside the dialog.</Popover.Description>
              </Popover.Content>
            </Popover.Root>
          </Dialog.Body>
          <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
        </Dialog.Content>
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
        <Dialog.Content aria-label="stack dialog">
          <Dialog.Header><Dialog.Title>Stacked overlays</Dialog.Title></Dialog.Header>
          <Dialog.Body>
            <Popover.Root defaultOpen>
              <Popover.Trigger>Row details</Popover.Trigger>
              <Popover.Content aria-label="stack popover">
                <Popover.Description>Row actions live in the menu.</Popover.Description>
                <Menu.Root defaultOpen>
                  <Menu.Trigger>Actions</Menu.Trigger>
                  <Menu.Content aria-label="stack menu">
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Duplicate</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item>Delete</Menu.Item>
                  </Menu.Content>
                </Menu.Root>
              </Popover.Content>
            </Popover.Root>
          </Dialog.Body>
          <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Shell>
  ),
};

/* CMP-404: toast viewport mounted alongside a modal dialog so the e2e
   overlay-stack lane can assert it never sits under an inert ancestor. */
export const WithToastViewport: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--with-toast-viewport' } },
  render: () => (
    <Shell>
      <Toast.Provider>
        <Toast.Viewport />
      </Toast.Provider>
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Header><Dialog.Title>Dialog over the toast region</Dialog.Title></Dialog.Header>
          <Dialog.Body>The toast viewport stays outside the inert set.</Dialog.Body>
          <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Shell>
  ),
};

/* CMP-404 / REQ-CMP-80 (T-OVL-STACK-03): a live toast is mounted on load
   (timeout 0 = persistent) alongside a modal Dialog, so the e2e lane always
   has a toast to assert against: never under an inert ancestor, F6 reaches
   the viewport. */
function StackToast() {
  const t = useToast();
  const added = React.useRef(false);
  React.useEffect(() => {
    if (added.current) return;
    added.current = true;
    t.info({ title: 'Upload finished', description: 'Toasts stay reachable over a modal.', timeout: 0 });
  }, [t]);
  return (
    <Toast.Viewport>
      {t.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.Close>×</Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

export const WithToast: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--with-toast' } },
  render: () => (
    <Shell>
      <Toast.Provider>
        <StackToast />
        <Dialog.Root defaultOpen>
          <DialogPortal>
            <DialogBackdrop />
            <DialogPopup aria-label="toast dialog">
              <Dialog.Header><Dialog.Title>Modal with a toast</Dialog.Title></Dialog.Header>
              <Dialog.Body><Dialog.Description>The toast layer root is exempt from modal inert.</Dialog.Description></Dialog.Body>
              <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
            </DialogPopup>
          </DialogPortal>
        </Dialog.Root>
      </Toast.Provider>
    </Shell>
  ),
};
