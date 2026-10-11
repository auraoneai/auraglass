/* CMP-281 (REQ-CMP-01/22): Menu scenes — Playground, ItemSemantics (checkbox
   mixed + radio group + shortcut), Submenu, plus ContextMenu and Menubar
   scenes. ids overlays-menu--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ContextMenuPortal, ContextMenuPositioner, ContextMenuPopup, MenuPortal, MenuPositioner, MenuPopup, Menu, Menubar, ContextMenu } from '../../../src/components/menu';
import { Button } from '../../../src/components/button';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Menu',
  component: Menu.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Menu', kind: 'component' } },
} satisfies Meta<typeof Menu.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Items = () => (
  <>
    <Menu.Item shortcut="Ctrl+X">Cut</Menu.Item>
    <Menu.Item shortcut="Ctrl+C">Copy</Menu.Item>
    <Menu.Item shortcut="Ctrl+V">Paste</Menu.Item>
    <Menu.Separator />
    <Menu.Group>
      <Menu.GroupLabel>View</Menu.GroupLabel>
      <Menu.CheckboxItem defaultChecked>Wrap</Menu.CheckboxItem>
      <Menu.CheckboxItem checked="indeterminate">Selective</Menu.CheckboxItem>
    </Menu.Group>
    <Menu.Separator />
    <Menu.RadioGroup defaultValue="list">
      <Menu.RadioItem value="list">List</Menu.RadioItem>
      <Menu.RadioItem value="grid">Grid</Menu.RadioItem>
    </Menu.RadioGroup>
  </>
);

export const Playground: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--playground' } },
  render: () => (
    <AuraGlassProvider>
      <Menu.Root defaultOpen>
        <Menu.Trigger><Button>Actions</Button></Menu.Trigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup><Items /></MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </Menu.Root>
    </AuraGlassProvider>
  ),
};

export const Submenu: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--submenu' } },
  render: () => (
    <AuraGlassProvider>
      <Menu.Root defaultOpen>
        <Menu.Trigger><Button>File</Button></Menu.Trigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>
              <Menu.Item>New</Menu.Item>
              <Menu.Submenu defaultOpen>
                <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
                <MenuPortal>
                  <MenuPositioner>
                    <MenuPopup>
                      <Menu.Item>Email</Menu.Item>
                      <Menu.Item>Link</Menu.Item>
                    </MenuPopup>
                  </MenuPositioner>
                </MenuPortal>
              </Menu.Submenu>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </Menu.Root>
    </AuraGlassProvider>
  ),
};

export const ContextMenuScene: Story = {
  name: 'ContextMenu',
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--context-menu' } },
  render: () => (
    <AuraGlassProvider>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div style={{ padding: 24, border: '1px dashed #888' }}>Right-click or Shift+F10 here</div>
        </ContextMenu.Trigger>
        <ContextMenuPortal>
          <ContextMenuPositioner>
            <ContextMenuPopup>
              <ContextMenu.Item>Inspect</ContextMenu.Item>
              <ContextMenu.Item>Rename</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item>Delete</ContextMenu.Item>
            </ContextMenuPopup>
          </ContextMenuPositioner>
        </ContextMenuPortal>
      </ContextMenu.Root>
    </AuraGlassProvider>
  ),
};

export const MenubarScene: Story = {
  name: 'Menubar',
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--menubar' } },
  render: () => (
    <AuraGlassProvider>
      <Menubar.Root>
        {['File', 'Edit', 'View'].map((m) => (
          <Menu.Root key={m}>
            <Menu.Trigger openOnHover>{m}</Menu.Trigger>
            <MenuPortal>
              <MenuPositioner>
                <MenuPopup><Menu.Item>{m} action</Menu.Item></MenuPopup>
              </MenuPositioner>
            </MenuPortal>
          </Menu.Root>
        ))}
      </Menubar.Root>
    </AuraGlassProvider>
  ),
};


/* REQ-CMP-103: closed-by-default menu-button scene for the APG keyboard
   script — items include 'Banana' for typeahead and a closed Submenu. */
export const MenuButton: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--menu-button' } },
  render: () => (
    <AuraGlassProvider>
      <div style={{ display: 'flex', gap: 16 }}>
        <Menu.Root>
          <Menu.Trigger><Button>Fruits</Button></Menu.Trigger>
          <MenuPortal>
            <MenuPositioner>
              <MenuPopup>
                <Menu.Item>Apple</Menu.Item>
                <Menu.Item>Apricot</Menu.Item>
                <Menu.Item>Banana</Menu.Item>
                <Menu.Submenu>
                  <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
                  <MenuPortal>
                    <MenuPositioner>
                      <MenuPopup>
                        <Menu.Item>Email</Menu.Item>
                        <Menu.Item>Link</Menu.Item>
                      </MenuPopup>
                    </MenuPositioner>
                  </MenuPortal>
                </Menu.Submenu>
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </Menu.Root>
        <Button>Next tabbable</Button>
      </div>
    </AuraGlassProvider>
  ),
};
