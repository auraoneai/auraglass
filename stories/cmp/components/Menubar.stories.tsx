/* CMP-281: Menubar scene (flat component; its root is data-ag-part="root"). id overlays-menu--menubar. */
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Menu, Menubar } from '../../../src/components/menu';
import { AuraGlassProvider } from '../../../src/theme';
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
  parameters: { ag: { tier: 'standard', subject: 'Menu' } },
  render: () => (
    <AuraGlassProvider><OverlayStage>
      <Menubar>
        {['File', 'Edit', 'View'].map((m) => (
          <Menu.Root key={m}>
            <Menu.Trigger openOnHover>{m}</Menu.Trigger>
            <Menu.Content><Menu.Item>{m} action</Menu.Item></Menu.Content>
          </Menu.Root>
        ))}
      </Menubar>
    </OverlayStage></AuraGlassProvider>
  ),
};
