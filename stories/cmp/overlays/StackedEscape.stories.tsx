/* REQ-CMP-27 (REQ-FIN-71, FIN-E.3 E3.2): three stacked overlays — Dialog →
   Popover → Menu — each opened from its own trigger inside the layer below,
   so the APG lane can assert that every Escape press closes exactly the top
   layer and focus returns to that layer's trigger. Story id
   overlays-stacked-escape--dialog-popover-menu (meta id overlays-stacked-escape).
   Triggers take plain text children: each Trigger already renders a <button>,
   so nesting a <Button> would produce nested interactive content. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog/index';
import { Popover } from '../../../src/components/popover/index';
import { Menu } from '../../../src/components/menu/index';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/StackedEscape',
  id: 'overlays-stacked-escape',
  parameters: { ag: { tier: 'standard', subject: 'StackedEscape', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const DialogPopoverMenu: Story = {
  parameters: { ag: { tier: 'standard', subject: 'StackedEscape', id: 'overlays-stacked-escape--dialog-popover-menu' } },
  render: () => (
    <AuraGlassProvider>
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup aria-label="Stacked dialog">
            <Dialog.Title>Stacked dialog</Dialog.Title>
            <Dialog.Body>
              <Popover.Root>
                <Popover.Trigger>Open popover</Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner>
                    <Popover.Popup aria-label="Stacked popover">
                      <Popover.Title>Stacked popover</Popover.Title>
                      <Menu.Root>
                        <Menu.Trigger>Open menu</Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Positioner>
                            <Menu.Popup aria-label="Stacked menu">
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
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </AuraGlassProvider>
  ),
};
