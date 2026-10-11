/* Dialog composition scenes (CMP-378, CMP-394, CMP-399, CMP-404): a Dialog
   hosting other overlays and controls, for the overlay-stack e2e lanes. Kept
   apart from Dialog.stories.tsx, whose stories render only Dialog parts (S-31). */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog';
import { TextField } from '../../../src/components/text-field';
import { Select } from '../../../src/components/select';
import { Popover } from '../../../src/components/popover';
import { Menu } from '../../../src/components/menu';
import { Toast } from '../../../src/components/toast';
import { Button } from '../../../src/components/button';
import { AuraGlassProvider } from '../../../src/theme';
import { OverlayStage } from '../overlays/OverlayStage';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Dialog Scenes',
  component: Dialog.Root,
  tags: ['flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Dialog', kind: 'scene' } },
} satisfies Meta<typeof Dialog.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Shell = ({ children }: { children: React.ReactNode }) => (
  <AuraGlassProvider>
    <OverlayStage title="Team" subtitle="Acme workspace" />
    {children}
  </AuraGlassProvider>
);

export const Form: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Dialog', id: 'overlays-dialog--form' } },
  render: () => (
    <Shell>
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup render={<form onSubmit={(e) => e.preventDefault()} />}>
            <Dialog.Header>
              <Dialog.Title>Invite teammate</Dialog.Title>
              <Dialog.Description>They get an email with a link to join the workspace.</Dialog.Description>
            </Dialog.Header>
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
              <Button type="submit" data-ag-part="action" prominent>Send invite</Button>
            </Dialog.Footer>
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
            <Dialog.Header>
              <Dialog.Title>Share “Q3 roadmap”</Dialog.Title>
              <Dialog.Description>Anyone with the link can view.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <p data-testid="dialog-outside-target">4 people have access. Editors can change sharing settings.</p>
              <Popover.Root defaultOpen>
                <Popover.Trigger render={<Button />}>Link settings</Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner>
                    <Popover.Popup aria-label="composite popover">
                      <Popover.Title>Link access</Popover.Title>
                      <Popover.Description>The link expires in 7 days. Viewers can’t download files.</Popover.Description>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close>Done</Dialog.Close></Dialog.Footer>
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
            <Dialog.Header>
              <Dialog.Title>Members</Dialog.Title>
              <Dialog.Description>12 people in Acme workspace.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <Popover.Root defaultOpen>
                <Popover.Trigger render={<Button />}>Jordan Lee</Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner>
                    <Popover.Popup aria-label="stack popover">
                      <Popover.Title>Jordan Lee</Popover.Title>
                      <Popover.Description>Editor · joined March 2026</Popover.Description>
                      <Menu.Root defaultOpen>
                        <Menu.Trigger render={<Button size="sm" />}>Actions</Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Positioner>
                            <Menu.Popup aria-label="stack menu">
                              <Menu.Item>Change role…</Menu.Item>
                              <Menu.Item>Copy email</Menu.Item>
                              <Menu.Separator />
                              <Menu.Item>Remove from workspace</Menu.Item>
                            </Menu.Popup>
                          </Menu.Positioner>
                        </Menu.Portal>
                      </Menu.Root>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </Dialog.Body>
            <Dialog.Footer><Dialog.Close>Done</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
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
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Header>
              <Dialog.Title>Export workspace</Dialog.Title>
              <Dialog.Description>We’ll email you a download link when the archive is ready.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body><p>Exports include documents, comments and version history. Large workspaces can take a few minutes.</p></Dialog.Body>
            <Dialog.Footer><Dialog.Close>Cancel</Dialog.Close><Dialog.Close>Start export</Dialog.Close></Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Shell>
  ),
};
