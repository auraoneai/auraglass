/* CMP-241 (REQ-CMP-95): RightPanel, LeftPanelRTL, BottomDetents,
   ActionPreset, NonModalInspector, FullHeight — open by default, ids
   overlays-sheet--*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Sheet } from '../../../src/components/sheet';
import { SheetAction } from '../../../src/components/sheet/Sheet.client';
import { AuraGlassProvider } from '../../../src/theme';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Overlays/Sheet',
  component: Sheet.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Sheet', kind: 'component' } },
} satisfies Meta<typeof Sheet.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const Demo = ({ root = {}, children }: { root?: Record<string, unknown>; children?: React.ReactNode }) => (
  <AuraGlassProvider>
    <Sheet.Root defaultOpen {...root}>
      <Sheet.Content>
        <Sheet.Handle />
        <Sheet.Header><Sheet.Title>Sheet</Sheet.Title></Sheet.Header>
        <Sheet.Body>{children ?? 'Sheet content'}</Sheet.Body>
        <Sheet.Footer><Sheet.Close>Close</Sheet.Close></Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  </AuraGlassProvider>
);

export const RightPanel: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--right-panel' } },
  render: () => <Demo root={{ side: 'end' }}>Right-edge panel sheet.</Demo>,
};
export const LeftPanelRTL: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--left-panel-rtl' } },
  render: () => <Demo root={{ side: 'start' }}>Start side (flips under RTL).</Demo>,
};
export const BottomDetents: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--bottom-detents' } },
  render: () => <Demo root={{ side: 'bottom', detents: [0.5, 'full'] }}>Drag the handle: half → full.</Demo>,
};
export const ActionPreset: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--action-preset' } },
  render: () => (
    <AuraGlassProvider>
      <Sheet.Root defaultOpen preset="action">
        <Sheet.Content>
          <Sheet.Handle />
          <Sheet.Body>
            <SheetAction>Save to Photos</SheetAction>
            <SheetAction>Share…</SheetAction>
          </Sheet.Body>
          <Sheet.Close>Cancel</Sheet.Close>
        </Sheet.Content>
      </Sheet.Root>
    </AuraGlassProvider>
  ),
};
export const NonModalInspector: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--non-modal-inspector' } },
  render: () => (
    <AuraGlassProvider>
      <input placeholder="page input stays interactive" />
      <Sheet.Root defaultOpen side="end" modal={false}>
        <Sheet.Content size="sm" backdrop={false}>
          <Sheet.Header><Sheet.Title>Inspector</Sheet.Title></Sheet.Header>
          <Sheet.Body>Non-modal: page remains interactive; Tab can leave.</Sheet.Body>
          <Sheet.Close>Close</Sheet.Close>
        </Sheet.Content>
      </Sheet.Root>
    </AuraGlassProvider>
  ),
};
export const FullHeight: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--full-height' } },
  render: () => <Demo root={{ side: 'bottom', detents: ['full'] }}>At the full detent: data-ag-appearance="full-height".</Demo>,
};

/* Every Sheet part: Trigger and Description alongside the default layout. */
export const Anatomy: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Sheet', id: 'overlays-sheet--anatomy' } },
  render: () => (
    <AuraGlassProvider>
      <Sheet.Root defaultOpen>
        <Sheet.Trigger>Open filters</Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Handle />
          <Sheet.Header>
            <Sheet.Title>Filters</Sheet.Title>
            <Sheet.Description>Narrow the list by status and owner.</Sheet.Description>
          </Sheet.Header>
          <Sheet.Body>Filter controls</Sheet.Body>
          <Sheet.Footer><Sheet.Close>Done</Sheet.Close></Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
    </AuraGlassProvider>
  ),
};
