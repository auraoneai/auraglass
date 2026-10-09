import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ContextMenu } from '../../../src/components/menu';
import { AuraGlassProvider } from '../../../src/theme';

const meta = {
  title: 'Flagships/Overlays/ContextMenu',
  component: ContextMenu.Root,
  parameters: { ag: { tier: 'standard', subject: 'ContextMenu', kind: 'component' } },
} satisfies Meta<typeof ContextMenu.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ContextMenuScene: Story = {
  name: 'ContextMenu',
  parameters: { ag: { tier: 'standard', subject: 'Menu', id: 'overlays-menu--context-menu' } },
  render: () => (
    <AuraGlassProvider>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div style={{ padding: 24, border: '1px dashed #888' }}>Right-click or Shift+F10 here</div>
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

