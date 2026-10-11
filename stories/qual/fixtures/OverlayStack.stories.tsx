/* QUAL lane fixture (G-18, REQ-QUAL-21): Dialog -> Menu -> Tooltip stacked
   through the public CMP overlays, for certification/lanes/overlay-stacking.spec.ts.
   The spec opens the three layers in order, checks that each later layer
   paints above the earlier ones (S-25 LayerStack order), then presses Escape
   three times and expects Tooltip, Menu, Dialog to close in that (LIFO)
   order. (registry/blocks/overlay-flows has no story on next; when SURF adds
   one, the lane gains a second subject.) Tagged no-cert: a lane fixture,
   never a certification subject. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from '../../../src/components/dialog';
import { Menu } from '../../../src/components/menu';
import { Tooltip } from '../../../src/components/tooltip';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'QUAL/Fixtures/Overlay Stack',
  tags: ['no-cert'],
  parameters: { ag: { subject: 'fixture:overlay-stack', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;

export const DialogMenuTooltip: StoryObj<typeof meta> = {
  render: () => (
    <AuraGlassProvider>
      <Tooltip.Provider delay={0}>
        <Dialog.Root>
          <Dialog.Trigger data-testid="open-dialog">Edit project</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup data-testid="layer-dialog">
              <Dialog.Header><Dialog.Title>Edit project</Dialog.Title></Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>Rename the project or move it to another workspace.</Dialog.Description>
                <Menu.Root>
                  <Menu.Trigger data-testid="open-menu">More actions</Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner side="bottom" align="start">
                      <Menu.Popup data-testid="layer-menu">
                        <Menu.Item>Duplicate</Menu.Item>
                        <Menu.Item>Move to workspace</Menu.Item>
                        <Tooltip.Root>
                          <Tooltip.Trigger data-testid="open-tooltip">What is archiving?</Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Positioner side="right">
                              <Tooltip.Popup data-testid="layer-tooltip">Archived projects are read-only and hidden from search.</Tooltip.Popup>
                            </Tooltip.Positioner>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                        <Menu.Item>Archive</Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>Cancel</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </Tooltip.Provider>
    </AuraGlassProvider>
  ),
};
