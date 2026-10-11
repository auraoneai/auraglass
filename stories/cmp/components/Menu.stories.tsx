/* CMP-281 (REQ-CMP-01/22): Menu scenes — Playground, ItemSemantics (checkbox
   mixed + radio group + shortcut), Submenu, plus the ContextMenu scene
   (Menubar lives in Menubar.stories.tsx). ids overlays-menu--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Menu, ContextMenu } from '../../../src/components/menu';
import { Button } from '../../../src/components/button';
import { Surface } from '../../../src/root/mat';
import { AuraGlassProvider } from '../../../src/theme';
import { OverlayStage } from '../overlays/OverlayStage';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Menu',
  component: Menu.Root,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Menu', kind: 'component' } },
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
        <OverlayStage title="Release notes" subtitle="v5.0 · draft">
          <Menu.Trigger render={<Button />}>Actions</Menu.Trigger>
        </OverlayStage>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup><Items /></Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </AuraGlassProvider>
  ),
};

export const Submenu: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--submenu' } },
  render: () => (
    <AuraGlassProvider>
      <Menu.Root defaultOpen>
        <OverlayStage title="Release notes" subtitle="v5.0 · draft">
          <Menu.Trigger render={<Button />}>File</Menu.Trigger>
        </OverlayStage>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Arrow />
              <Menu.Item>New</Menu.Item>
              <Menu.Submenu defaultOpen>
                <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup>
                      <Menu.Item>Email</Menu.Item>
                      <Menu.Item>Link</Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Submenu>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
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
        {/* the whole stage is the right-click region; the hint sits in a
            sunken content well (content layer, no glass) — the menu it opens
            is the only glass */}
        <ContextMenu.Trigger>
          <OverlayStage
            title="Assets"
            subtitle="Right-click to see actions"
            content={(
              <Surface
                layer="content"
                content="content-sunken"
                style={{
                  padding: 'var(--ag-space-8)', borderRadius: 'var(--ag-radius-lg)', textAlign: 'center',
                  color: 'var(--ag-on-surface-muted, var(--ag-color-on-surface-muted))',
                  fontSize: 'var(--ag-type-callout-size)',
                }}
              >
                Right-click or Shift+F10 here
              </Surface>
            )}
          />
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Item>Inspect</ContextMenu.Item>
              <ContextMenu.Item>Rename</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item>Delete</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </AuraGlassProvider>
  ),
};



/* REQ-CMP-103: closed-by-default menu-button scene for the APG keyboard
   script — items include 'Banana' for typeahead and a closed Submenu. */
export const MenuButton: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--menu-button' } },
  render: () => (
    <AuraGlassProvider>
      <OverlayStage title="Grocery list" subtitle="Pick a fruit">
        <Menu.Root>
          <Menu.Trigger render={<Button />}>Fruits</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item>Apple</Menu.Item>
                <Menu.Item>Apricot</Menu.Item>
                <Menu.Item>Banana</Menu.Item>
                <Menu.Submenu>
                  <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup>
                        <Menu.Item>Email</Menu.Item>
                        <Menu.Item>Link</Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Submenu>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <Button>Next tabbable</Button>
      </OverlayStage>
    </AuraGlassProvider>
  ),
};
