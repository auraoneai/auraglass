/* CMP-281: Menubar scene (flat component; its root is data-ag-part="root"). id overlays-menu--menubar. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Menu, Menubar } from '../../../src/components/menu';
import { AuraGlassProvider } from '../../../src/theme';
import { LightRegion, OverlayStage } from '../overlays/OverlayStage';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Menubar',
  component: Menubar,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Menubar', kind: 'component' } },
} satisfies Meta<typeof Menubar>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const MenubarScene: Story = {
  name: 'Menubar',
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--menubar' } },
  render: () => (
    <AuraGlassProvider>
      <OverlayStage
        title="Untitled document"
        subtitle="Edited just now"
        /* the bar floats on the scene above the window: chrome glass over a
           real backdrop (LightRegion keeps its labels dark on the light glass) */
        above={(
          <LightRegion>
            <Menubar>
              {(['File', 'Edit', 'View'] as const).map((m) => (
                <Menu.Root key={m}>
                  <Menu.Trigger openOnHover>{m}</Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup>
                        <Menu.Item shortcut={m === 'File' ? 'Ctrl+N' : m === 'Edit' ? 'Ctrl+Z' : 'Ctrl+='}>{m === 'File' ? 'New' : m === 'Edit' ? 'Undo' : 'Zoom in'}</Menu.Item>
                        <Menu.Item>{m} action</Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              ))}
            </Menubar>
          </LightRegion>
        )}
      />
    </AuraGlassProvider>
  ),
};
