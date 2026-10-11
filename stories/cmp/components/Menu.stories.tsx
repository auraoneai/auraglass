/* CMP-281 (REQ-CMP-01/22): Menu scenes — Playground, ItemSemantics (checkbox
   mixed + radio group + shortcut), Submenu, plus the ContextMenu scene
   (Menubar lives in Menubar.stories.tsx). ids overlays-menu--*. */
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Menu, ContextMenu } from '../../../src/components/menu';
import { MenuArrow } from '../../../src/components/menu/Menu.client';
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
    <AuraGlassProvider><OverlayStage>
      <Menu.Root defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content><Items /></Menu.Content>
      </Menu.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};

export const Submenu: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--submenu' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <Menu.Root defaultOpen>
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Content>
          <MenuArrow />
          <Menu.Item>New</Menu.Item>
          <Menu.Submenu defaultOpen>
            <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
            <Menu.Content>
              <Menu.Item>Email</Menu.Item>
              <Menu.Item>Link</Menu.Item>
            </Menu.Content>
          </Menu.Submenu>
        </Menu.Content>
      </Menu.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};

export const ContextMenuScene: Story = {
  name: 'ContextMenu',
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--context-menu' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div style={{ padding: 24, border: '1px dashed #888' }}>Right-click or Shift+F10 here</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Inspect</ContextMenu.Item>
          <ContextMenu.Item>Rename</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </OverlayStage></AuraGlassProvider>
  ),
};



/* REQ-CMP-103: closed-by-default menu-button scene for the APG keyboard
   script — items include 'Banana' for typeahead and a closed Submenu. */
export const MenuButton: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--menu-button' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <div style={{ display: 'flex', gap: 16 }}>
        <Menu.Root>
          <Menu.Trigger>Fruits</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Apple</Menu.Item>
            <Menu.Item>Apricot</Menu.Item>
            <Menu.Item>Banana</Menu.Item>
            <Menu.Submenu>
              <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
              <Menu.Content>
                <Menu.Item>Email</Menu.Item>
                <Menu.Item>Link</Menu.Item>
              </Menu.Content>
            </Menu.Submenu>
          </Menu.Content>
        </Menu.Root>
        <button type="button">Next tabbable</button>
      </div>
    </OverlayStage></AuraGlassProvider>
  ),
};
