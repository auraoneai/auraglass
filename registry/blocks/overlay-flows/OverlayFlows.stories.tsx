// OverlayFlows.stories.tsx — REQ-CMP-140: the GA overlay-flows block (SC-32)
// rendered with its fixtures so QUAL L11 renders it like every other registry
// block. The block itself wires every flow (AlertDialog, Dialog, Sheet,
// Popover, Tooltip, Menu/ContextMenu/Menubar, Toast with undo) to its own
// triggers; the stories only vary the environment globals.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { OverlayFlows } from './index';

const meta = {
  title: 'registry/overlay-flows',
  parameters: { ag: { subject: 'overlay-flows', kind: 'block' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderBlock = () => <OverlayFlows />;
export const Default: Story = { render: renderBlock };
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderBlock };
export const ReducedTransparency: Story = { globals: { transparency: 'reduced' }, render: renderBlock };
export const ForcedColors: Story = { globals: { forcedColors: 'active' }, render: renderBlock };
