import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Menu, Menubar } from '../../../src/components/menu';
import { AuraGlassProvider } from '../../../src/theme';

const meta = {
  title: 'Flagships/Overlays/Menubar',
  component: Menubar,
  parameters: { ag: { tier: 'standard', subject: 'Menubar', kind: 'component' } },
} satisfies Meta<typeof Menubar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MenubarScene: Story = {
  name: 'Menubar',
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--menubar' } },
  render: () => (
    <AuraGlassProvider>
      <Menubar>
        {['File', 'Edit', 'View'].map((m) => (
          <Menu.Root key={m}>
            <Menu.Trigger openOnHover>{m}</Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup><Menu.Item>{m} action</Menu.Item></Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        ))}
      </Menubar>
    </AuraGlassProvider>
  ),
};
