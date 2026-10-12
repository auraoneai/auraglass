/* CMP-281: Menubar scene (flat component; its root is data-ag-part="root"). Menubar is part of the Menu family
   (no ComponentMeta of its own), so the scene is a Menu story under the Menu flagship title, kept in its own file so
   Menu.stories.tsx renders only Menu parts (S-33). id flagships-overlays-menu--menubar-scene. */
import { OverlayStage } from '../overlays/OverlayStage';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Menu, Menubar } from '../../../src/components/menu';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Menu',
  component: Menubar,
  tags: ['certified', 'flagship'],
  parameters: { layout: 'fullscreen', ag: { tier: 'standard', subject: 'Menu', kind: 'component' } satisfies StoryAgParameters },
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
