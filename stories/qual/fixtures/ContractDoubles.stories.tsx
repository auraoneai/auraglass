/* QUAL fixture (G-17, REQ-QUAL-19): the CMP contract doubles (tests/contract-doubles/cmp/*, S-30 on @base-ui/react)
   rendered as stories so certification/lanes/behaviour.spec.ts can self-run its axe + APG keyboard checks against them.
   A result on these stories passes only against a double and is recorded `double-pass` (contract §5.2 rule 4), never
   `pass`. Structural Base UI wrappers the doubles do not model (Portal, Positioner) come from @base-ui/react directly.
   Tagged no-cert: never a certification subject. */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog as BaseDialog, Menu as BaseMenu } from '@base-ui/react';
import type { StoryAgParameters } from '../../../src/contracts/testing';
import { Collapsible } from '../../../tests/contract-doubles/cmp/collapsible';
import { Dialog } from '../../../tests/contract-doubles/cmp/dialog';
import { Menu } from '../../../tests/contract-doubles/cmp/menu';
import { Toolbar } from '../../../tests/contract-doubles/cmp/toolbar';

const meta = {
  title: 'QUAL/Fixtures/Contract Doubles',
  tags: ['no-cert'],
  parameters: { ag: { subject: 'fixture:contract-doubles', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const panel = { padding: 16, background: '#ffffff', color: '#111111', border: '1px solid #111111' } as const;

export const CollapsibleDouble: Story = {
  name: 'Collapsible',
  render: () => (
    <Collapsible.Root>
      <Collapsible.Trigger>Show details</Collapsible.Trigger>
      <Collapsible.Content><p>Collapsible details</p></Collapsible.Content>
    </Collapsible.Root>
  ),
};

export const DialogDouble: Story = {
  name: 'Dialog',
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <BaseDialog.Portal>
        <Dialog.Content style={panel}>
          <Dialog.Title>Double dialog</Dialog.Title>
          <Dialog.Description>Rendered from the Dialog contract double.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </BaseDialog.Portal>
    </Dialog.Root>
  ),
};

export const MenuDouble: Story = {
  name: 'Menu',
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner>
          <Menu.Content style={panel}>
            <Menu.Item>Rename</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Archive</Menu.Item>
          </Menu.Content>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </Menu.Root>
  ),
};

export const ToolbarDouble: Story = {
  name: 'Toolbar',
  render: () => (
    <Toolbar.Root aria-label="Formatting">
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Button>Italic</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Underline</Toolbar.Button>
    </Toolbar.Root>
  ),
};
